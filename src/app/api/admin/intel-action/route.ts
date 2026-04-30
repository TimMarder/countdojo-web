import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side approve/reject for the in-browser /admin/intel review UI.
//
// Why this route exists:
//   - The web admin gates on a hardcoded ADMIN_PASSWORD and never opens
//     a Supabase auth session.
//   - casino_intel UPDATE is gated by an RLS policy that requires the
//     caller to be in casino_intel_admins (matched by auth.uid()).
//   - With the anon key and no auth.uid(), the RLS policy silently denies
//     the UPDATE -- no error, zero rows affected. The page would show the
//     row as "approved" optimistically and then snap back to pending on
//     reload.
//   - So we do the UPDATE with the service-role key on the server.
//
// While we're at it, we also apply the side effects that mobile-admin
// handleApprove does (insert casino_games, insert casinos, bump
// casinos.updated_at, etc.) so a web approval has the same end-state as
// a mobile approval.

const SUPABASE_URL = "https://oxvnbbtqwfqkdphvdhwu.supabase.co";
const ADMIN_PASSWORD = "countdojo-admin-2026";

type Action = "approved" | "rejected";

interface IntelRow {
  id: string;
  casino_id: string | null;
  type: "rule_update" | "intel_note" | "new_casino";
  content: Record<string, unknown> | null;
}

export async function POST(request: Request) {
  let body: { password?: string; intelId?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const intelId = typeof body.intelId === "string" ? body.intelId : null;
  const action: Action | null =
    body.action === "approved" || body.action === "rejected"
      ? body.action
      : null;
  if (!intelId || !action) {
    return NextResponse.json(
      { error: "intelId (string) and action ('approved' | 'rejected') are required" },
      { status: 400 }
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY is not set on the server. Add it to .env.local (locally) and to your Vercel project env vars to enable approve/reject.",
      },
      { status: 500 }
    );
  }

  const admin = createClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Read the intel first so we know what side-effects to apply on approval.
  const { data: intel, error: fetchErr } = await admin
    .from("casino_intel")
    .select("id, casino_id, type, content")
    .eq("id", intelId)
    .maybeSingle<IntelRow>();
  if (fetchErr || !intel) {
    return NextResponse.json(
      { error: fetchErr?.message ?? "Intel not found" },
      { status: 404 }
    );
  }

  const nowIso = new Date().toISOString();

  // 1) Update casino_intel.status. Service role bypasses RLS.
  const { error: statusErr } = await admin
    .from("casino_intel")
    .update({ status: action, reviewed_at: nowIso })
    .eq("id", intelId);
  if (statusErr) {
    return NextResponse.json({ error: statusErr.message }, { status: 500 });
  }

  // 2) Side effects only fire on approval.
  const warnings: string[] = [];
  if (action === "approved") {
    const c = (intel.content ?? {}) as Record<string, unknown>;

    // ── rule_update ───────────────────────────────────────────────
    if (intel.type === "rule_update") {
      const isNewGame = !!c.isNewGame || !c.gameId;

      if (isNewGame) {
        if (!intel.casino_id) {
          warnings.push("rule_update has no casino_id; cannot insert new game");
        } else {
          const { error: insertErr } = await admin
            .from("casino_games")
            .insert({
              casino_id: intel.casino_id,
              num_decks: c.numDecks ?? 6,
              num_tables: 1,
              pays: c.pays ?? "3:2",
              penetration: c.penetration ?? 0,
              rule17: c.rule17 ?? "H17",
              shuffle_type: c.shuffleType ?? "Hand",
              split_aces: c.rsa ?? "nRSA",
              split_pairs: "SP4",
              surrender: c.surrender ?? "No",
              das: c.das ?? "DAS",
              double_rule: "DA2",
              min_bet: c.minBet ?? 0,
              max_bet: c.maxBet ?? 0,
              updated_at: nowIso,
            });
          if (insertErr)
            warnings.push(`new game insert failed: ${insertErr.message}`);
        }
      } else if (typeof c.gameId === "string") {
        // Update existing casino_games row. Only fields actually present
        // in the intel content are written -- mirrors mobile admin so
        // untouched rules stay untouched.
        const updatePayload: Record<string, unknown> = {};
        if (c.numDecks !== undefined) updatePayload.num_decks = c.numDecks;
        if (c.rule17 !== undefined) updatePayload.rule17 = c.rule17;
        if (c.pays !== undefined) updatePayload.pays = c.pays;
        if (c.penetration !== undefined)
          updatePayload.penetration = c.penetration;
        if (c.shuffleType !== undefined)
          updatePayload.shuffle_type = c.shuffleType;
        if (c.das !== undefined) updatePayload.das = c.das;
        if (c.rsa !== undefined) updatePayload.split_aces = c.rsa;
        if (c.surrender !== undefined) updatePayload.surrender = c.surrender;
        if (c.minBet !== undefined) updatePayload.min_bet = c.minBet;
        if (c.maxBet !== undefined) updatePayload.max_bet = c.maxBet;
        updatePayload.updated_at = nowIso;

        if (Object.keys(updatePayload).length > 1) {
          const { error: updErr } = await admin
            .from("casino_games")
            .update(updatePayload)
            .eq("id", c.gameId);
          if (updErr)
            warnings.push(`game update failed: ${updErr.message}`);
        }
      }

      // Bump casinos.updated_at so the mobile delta-sync picks up the
      // change. fetchCasinosDelta filters on casinos.updated_at, not
      // casino_games.updated_at, so without this the user device would
      // not see the new/updated rules until a full re-sync.
      if (intel.casino_id) {
        const { error: bumpErr } = await admin
          .from("casinos")
          .update({ updated_at: nowIso })
          .eq("id", intel.casino_id);
        if (bumpErr)
          warnings.push(`casino timestamp bump failed: ${bumpErr.message}`);
      }
    }

    // ── new_casino ────────────────────────────────────────────────
    if (intel.type === "new_casino") {
      const lat =
        typeof c.lat === "number" && Number.isFinite(c.lat) ? c.lat : 0;
      const lng =
        typeof c.lng === "number" && Number.isFinite(c.lng) ? c.lng : 0;

      const { data: newCasino, error: casinoErr } = await admin
        .from("casinos")
        .insert({
          name: c.name ?? "",
          address: c.address ?? "",
          city: c.city ?? "",
          state: c.state ?? "",
          country: c.country ?? "",
          phone_number: c.phone ?? null,
          website: c.website ?? null,
          lat,
          lng,
          flags: {
            Trespass: false,
            Database: false,
            Tribal: false,
            LicencePlateReaders: false,
            IDAtDoor: false,
          },
          sum_up: "",
          source: "user_submitted",
          updated_at: nowIso,
        })
        .select("id")
        .single<{ id: string }>();

      if (casinoErr || !newCasino) {
        warnings.push(
          `casino insert failed: ${casinoErr?.message ?? "unknown error"}`
        );
      } else {
        const games: Array<Record<string, unknown>> = Array.isArray(c.games)
          ? (c.games as Array<Record<string, unknown>>)
          : c.game
            ? [c.game as Record<string, unknown>]
            : [];

        for (const g of games) {
          const { error: gameErr } = await admin.from("casino_games").insert({
            casino_id: newCasino.id,
            num_decks: g.numDecks ?? 6,
            num_tables: 1,
            pays: g.pays ?? "3:2",
            penetration: g.penetration ?? 0,
            rule17: g.rule17 ?? "H17",
            shuffle_type: g.shuffleType ?? "Hand",
            split_aces: g.rsa ?? "nRSA",
            split_pairs: "SP4",
            surrender: g.surrender ?? "No",
            das: g.das ?? "DAS",
            double_rule: "DA2",
            min_bet: g.minBet ?? 0,
            max_bet: g.maxBet ?? 0,
            updated_at: nowIso,
          });
          if (gameErr)
            warnings.push(`game insert failed: ${gameErr.message}`);
        }

        // Backfill casino_id on the intel row so the casino-detail page
        // can find the source intel later.
        await admin
          .from("casino_intel")
          .update({ casino_id: newCasino.id })
          .eq("id", intelId);
      }
    }
  }

  return NextResponse.json({ ok: true, warnings });
}

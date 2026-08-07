import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side admin API that resolves casino_intel.user_id -> auth.users.email
// for the in-browser /admin/intel review UI.
//
// Why this route exists:
//   - The web admin gates on a hardcoded ADMIN_PASSWORD (no Supabase auth
//     session).
//   - get_intel_submitter_emails RPC is GRANT-restricted to authenticated
//     callers, so an anon-key client can't reach it.
//   - casino_intel.submitter_email is column-level REVOKEd from anon, AND
//     the column is NULL for v1.13+ rows anyway.
//
// So we look up emails server-side using the service_role key. Caller
// supplies the same password the UI's session-storage gate uses; the route
// rejects anything else. The service_role key never leaves the server.

const SUPABASE_URL = "https://oxvnbbtqwfqkdphvdhwu.supabase.co";
const ADMIN_PASSWORD = "countdojo-admin-2026";

export async function POST(request: Request) {
  // Auth: same shared password the UI uses. Sent in body, not headers, so
  // it's symmetric with how the web client already stores it.
  let body: { password?: string; intelIds?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const intelIds = Array.isArray(body.intelIds)
    ? body.intelIds.filter((x): x is string => typeof x === "string")
    : [];
  if (intelIds.length === 0) {
    return NextResponse.json({ emails: {} });
  }
  if (intelIds.length > 500) {
    return NextResponse.json(
      { error: "Too many intel ids (max 500)" },
      { status: 400 }
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY is not set on the server. Add it to .env.local (locally) and to your Vercel project env vars to enable submitter-email lookup.",
      },
      { status: 500 }
    );
  }

  const admin = createClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Fetch user_ids for these intels, then auth.users.email for each.
  type IntelMini = {
    id: string;
    user_id: string | null;
    submitter_email: string | null;
  };
  const { data: intelRows, error: intelErr } = await admin
    .from("casino_intel")
    .select("id, user_id, submitter_email")
    .in("id", intelIds)
    .returns<IntelMini[]>();
  if (intelErr) {
    return NextResponse.json({ error: intelErr.message }, { status: 500 });
  }

  const rows: IntelMini[] = intelRows ?? [];
  const userIds: string[] = Array.from(
    new Set(
      rows
        .map((r) => r.user_id)
        .filter((u): u is string => typeof u === "string" && u.length > 0)
    )
  );

  const userEmails: Record<string, string> = {};
  if (userIds.length > 0) {
    // auth.admin.listUsers paginates; per-id getUserById is N round trips
    // but simpler and fine for admin batches under a couple hundred.
    const lookups = await Promise.all(
      userIds.map((id) => admin.auth.admin.getUserById(id))
    );
    for (let i = 0; i < userIds.length; i++) {
      const email = lookups[i]?.data?.user?.email;
      if (email) userEmails[userIds[i]] = email;
    }
  }

  const emails: Record<string, string> = {};
  for (const r of rows) {
    const fromColumn =
      typeof r.submitter_email === "string" && r.submitter_email.length > 0
        ? r.submitter_email
        : null;
    const fromAuth = r.user_id ? userEmails[r.user_id] : null;
    const final = fromColumn ?? fromAuth ?? null;
    if (final) emails[r.id] = final;
  }

  return NextResponse.json({ emails });
}

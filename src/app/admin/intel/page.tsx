"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type IntelType = "rule_update" | "intel_note" | "new_casino";

type IntelStatus = "pending" | "approved" | "rejected";

type IntelSubmission = {
  id: string;
  casino_id: string | null;
  submitted_by: string | null;
  submitter_email: string | null;
  type: IntelType;
  content: Record<string, unknown> | string;
  upvotes: number;
  downvotes: number;
  status: IntelStatus;
  created_at: string;
  reviewed_at: string | null;
  casinos: { name: string } | null;
};

// Subset of casino_games columns we read for the rule_update diff. Loaded
// in a single batch query keyed by gameId after submissions are fetched.
type CasinoGameRow = {
  id: string;
  num_decks: number | null;
  rule17: string | null;
  pays: string | null;
  penetration: number | null;
  shuffle_type: string | null;
  das: string | null;
  split_aces: string | null;
  surrender: string | null;
  min_bet: number | null;
  max_bet: number | null;
};

// Field definitions shared by the full-listing view (new_casino games) and
// the diff view (rule_update). Each field handles its own format + normalize
// so quirks like das='DAS' vs 'true' vs 'yes' all collapse for equality.
type RuleField = {
  key: string;
  label: string;
  format: (raw: unknown) => string | null;
  normalize: (raw: unknown) => string;
};

const RULE_FIELDS: RuleField[] = [
  {
    key: "numDecks",
    label: "Decks",
    format: (v) => (v === undefined || v === null ? null : `${v}D`),
    normalize: (v) => String(v ?? ""),
  },
  {
    key: "rule17",
    label: "Dealer 17",
    format: (v) => (v ? String(v).toUpperCase() : null),
    normalize: (v) => String(v ?? "").toUpperCase(),
  },
  {
    key: "pays",
    label: "BJ Pays",
    format: (v) => (v ? String(v) : null),
    normalize: (v) => String(v ?? ""),
  },
  {
    key: "penetration",
    label: "Penetration",
    format: (v) =>
      v === undefined || v === null || v === "" ? null : `${v} decks cut`,
    normalize: (v) => String(v ?? ""),
  },
  {
    key: "shuffleType",
    label: "Shuffle",
    format: (v) => (v ? String(v) : null),
    normalize: (v) => String(v ?? "").toLowerCase(),
  },
  {
    key: "das",
    label: "DAS",
    format: (v) => {
      if (v === undefined || v === null) return null;
      const s = String(v).toLowerCase();
      return s === "das" || s === "true" || s === "yes" ? "Yes" : "No";
    },
    normalize: (v) => {
      const s = String(v ?? "").toLowerCase();
      return s === "das" || s === "true" || s === "yes" ? "yes" : "no";
    },
  },
  {
    key: "rsa",
    label: "RSA",
    format: (v) => {
      if (v === undefined || v === null) return null;
      const s = String(v).toLowerCase();
      return s === "rsa" || s === "true" || s === "yes" ? "Yes" : "No";
    },
    normalize: (v) => {
      const s = String(v ?? "").toLowerCase();
      return s === "rsa" || s === "true" || s === "yes" ? "yes" : "no";
    },
  },
  {
    key: "surrender",
    label: "Surrender",
    format: (v) => {
      if (v === undefined || v === null) return null;
      const s = String(v).toLowerCase();
      return s === "yes" || s === "true" ? "Yes" : "No";
    },
    normalize: (v) => {
      const s = String(v ?? "").toLowerCase();
      return s === "yes" || s === "true" ? "yes" : "no";
    },
  },
  {
    key: "minBet",
    label: "Min Bet",
    format: (v) =>
      v === undefined || v === null || v === "" ? null : `$${v}`,
    normalize: (v) => String(v ?? ""),
  },
  {
    key: "maxBet",
    label: "Max Bet",
    format: (v) =>
      v === undefined || v === null || v === "" || Number(v) <= 0
        ? null
        : `$${v}`,
    normalize: (v) => String(v ?? ""),
  },
];

// casino_games rows use snake_case. Intel content uses camelCase. This
// resolves either shape for diff comparisons.
function readField(
  obj: Record<string, unknown> | null | undefined,
  key: string
): unknown {
  if (!obj) return undefined;
  if (obj[key] !== undefined) return obj[key];
  const aliases: Record<string, string[]> = {
    numDecks: ["num_decks"],
    shuffleType: ["shuffle_type"],
    rsa: ["split_aces", "splitAces"],
    minBet: ["min_bet"],
    maxBet: ["max_bet"],
  };
  for (const alt of aliases[key] ?? []) {
    if (obj[alt] !== undefined) return obj[alt];
  }
  return undefined;
}

type StatusCounts = {
  pending: number;
  approved: number;
  rejected: number;
};

const ADMIN_PASSWORD = "countdojo-admin-2026";

const TYPE_CONFIG: Record<
  IntelType,
  { label: string; bg: string; text: string }
> = {
  rule_update: {
    label: "Rule Update",
    bg: "bg-blue-500/20",
    text: "text-blue-400",
  },
  intel_note: {
    label: "Intel Note",
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
  },
  new_casino: {
    label: "New Casino",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Render the full rule grid for a single game. Used by new_casino games,
// where there is no prior state to diff against.
function RuleList({ rules }: { rules: Record<string, unknown> }) {
  const rows: Array<{ label: string; value: string }> = [];
  for (const f of RULE_FIELDS) {
    const v = f.format(readField(rules, f.key));
    if (v !== null) rows.push({ label: f.label, value: v });
  }
  if (rows.length === 0) return null;
  return (
    <div className="space-y-1">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline">
          <span className="text-xs text-slate-500 w-28 shrink-0">{r.label}</span>
          <span className="text-sm text-slate-200 font-medium">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

// Render a before/after diff of proposed rules vs the current casino_games
// row. Changed fields render "old → new" with strike-through + color;
// unchanged fields render in muted text so they're easy to skim past.
function RuleDiff({
  proposed,
  original,
}: {
  proposed: Record<string, unknown>;
  original: CasinoGameRow | null;
}) {
  const rows: Array<{
    label: string;
    before: string | null;
    after: string;
    changed: boolean;
  }> = [];

  for (const f of RULE_FIELDS) {
    const proposedRaw = readField(proposed, f.key);
    const after = f.format(proposedRaw);
    if (after === null) continue;

    const originalRaw = readField(
      original as unknown as Record<string, unknown> | null,
      f.key
    );
    const before = f.format(originalRaw);
    const changed =
      original != null && originalRaw !== undefined
        ? f.normalize(proposedRaw) !== f.normalize(originalRaw)
        : false;
    rows.push({ label: f.label, before, after, changed });
  }

  const changedCount = rows.filter((r) => r.changed).length;

  return (
    <div className="space-y-1">
      {original == null && (
        <p className="text-xs text-slate-500 italic mb-2">
          Original game not found in casino_games — showing proposed values only.
        </p>
      )}
      {original != null && changedCount === 0 && (
        <p className="text-xs text-slate-500 italic mb-2">
          No changes detected vs current rules.
        </p>
      )}
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline">
          <span className="text-xs text-slate-500 w-28 shrink-0">{r.label}</span>
          {r.changed ? (
            <span className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm text-red-400 line-through">
                {r.before ?? "—"}
              </span>
              <span className="text-slate-500">→</span>
              <span className="text-sm text-emerald-400 font-semibold">
                {r.after}
              </span>
            </span>
          ) : (
            <span
              className={`text-sm font-medium ${
                original == null ? "text-slate-200" : "text-slate-500"
              }`}
            >
              {r.after}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Top-level dispatcher. Renders the right view per submission type.
function IntelContent({
  item,
  originalGames,
}: {
  item: IntelSubmission;
  originalGames: Record<string, CasinoGameRow>;
}) {
  if (typeof item.content === "string") {
    return (
      <p className="text-slate-300 whitespace-pre-wrap">{item.content}</p>
    );
  }
  const c = item.content;

  if (item.type === "intel_note") {
    const note =
      typeof c.note === "string"
        ? c.note
        : typeof c.text === "string"
          ? c.text
          : "";
    return (
      <p className="text-slate-300 whitespace-pre-wrap">{note}</p>
    );
  }

  if (item.type === "rule_update") {
    const isNewGame = !!c.isNewGame || !c.gameId;
    const original =
      typeof c.gameId === "string" ? originalGames[c.gameId] ?? null : null;
    return (
      <div className="space-y-3">
        <span className="inline-block text-xs font-bold tracking-wide uppercase px-2 py-1 rounded bg-blue-500/20 text-blue-300">
          {isNewGame ? "New Game" : "Rule Update"}
        </span>
        {isNewGame ? <RuleList rules={c} /> : <RuleDiff proposed={c} original={original} />}
        {typeof c.note === "string" && c.note.trim() && (
          <div className="border-t border-slate-800 pt-3 mt-3">
            <p className="text-xs text-slate-500 mb-1">Note</p>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {c.note}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (item.type === "new_casino") {
    const games: Array<Record<string, unknown>> = Array.isArray(c.games)
      ? (c.games as Array<Record<string, unknown>>)
      : c.game
        ? [c.game as Record<string, unknown>]
        : [];
    const addrPieces = [c.address, c.city, c.state, c.zip].filter(
      (s): s is string => typeof s === "string" && s.trim().length > 0
    );
    const fullAddr = addrPieces.join(", ");
    const country = typeof c.country === "string" ? c.country : "";

    return (
      <div className="space-y-4">
        {/* Address + contact */}
        <div className="space-y-1">
          {fullAddr && (
            <div className="flex items-baseline">
              <span className="text-xs text-slate-500 w-28 shrink-0">
                Address
              </span>
              <span className="text-sm text-slate-200 font-medium">
                {country ? `${fullAddr}, ${country}` : fullAddr}
              </span>
            </div>
          )}
          {typeof c.lat === "number" &&
            typeof c.lng === "number" &&
            (c.lat !== 0 || c.lng !== 0) && (
              <div className="flex items-baseline">
                <span className="text-xs text-slate-500 w-28 shrink-0">
                  Coordinates
                </span>
                <span className="text-sm text-slate-200 font-medium">
                  {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                </span>
              </div>
            )}
          {typeof c.phone === "string" && c.phone && (
            <div className="flex items-baseline">
              <span className="text-xs text-slate-500 w-28 shrink-0">
                Phone
              </span>
              <span className="text-sm text-slate-200 font-medium">
                {c.phone}
              </span>
            </div>
          )}
          {typeof c.website === "string" && c.website && (
            <div className="flex items-baseline">
              <span className="text-xs text-slate-500 w-28 shrink-0">
                Website
              </span>
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-400 hover:text-emerald-300 font-medium truncate"
              >
                {c.website}
              </a>
            </div>
          )}
          {typeof c.geocodedAddress === "string" && c.geocodedAddress && (
            <div className="flex items-baseline">
              <span className="text-xs text-slate-500 w-28 shrink-0">
                Geocoded
              </span>
              <span className="text-xs text-slate-500 truncate">
                {c.geocodedAddress}
              </span>
            </div>
          )}
        </div>

        {/* Games */}
        {games.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            No game rules submitted.
          </p>
        ) : (
          <div className="border-t border-slate-800 pt-3 space-y-3">
            <p className="text-xs text-slate-500">
              {games.length === 1 ? "Game" : `Games (${games.length})`}
            </p>
            {games.map((g, i) => (
              <div
                key={i}
                className={
                  games.length > 1
                    ? "pl-3 border-l-2 border-slate-700"
                    : undefined
                }
              >
                {games.length > 1 && (
                  <p className="text-xs font-bold text-slate-300 mb-1">
                    Game {i + 1}
                  </p>
                )}
                <RuleList rules={g} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback for unknown types
  return (
    <pre className="text-slate-300 text-xs bg-slate-800/50 rounded-lg p-4 overflow-x-auto">
      {JSON.stringify(c, null, 2)}
    </pre>
  );
}

// ---- Toast component ----

function Toast({
  message,
  type,
  onDone,
}: {
  message: string;
  type: "success" | "error";
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
        type === "success"
          ? "bg-emerald-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {message}
    </div>
  );
}

// ---- Main page ----

export default function IntelAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [activeTab, setActiveTab] = useState<IntelStatus>("pending");
  const [submissions, setSubmissions] = useState<IntelSubmission[]>([]);
  const [originalGames, setOriginalGames] = useState<
    Record<string, CasinoGameRow>
  >({});
  // Map of intel.id -> submitter email (resolved server-side via the
  // /api/admin/intel-emails route). Stored separately from submissions so
  // an email-fetch failure doesn't break the whole list.
  const [submitterEmails, setSubmitterEmails] = useState<
    Record<string, string>
  >({});
  const [counts, setCounts] = useState<StatusCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("intel-admin-auth");
      if (stored === "true") {
        setAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = useCallback(() => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
      sessionStorage.setItem("intel-admin-auth", "true");
    } else {
      setPasswordError(true);
    }
  }, [passwordInput]);

  // Fetch counts
  const fetchCounts = useCallback(async () => {
    const statuses: IntelStatus[] = ["pending", "approved", "rejected"];
    const results = await Promise.all(
      statuses.map((s) =>
        supabase
          .from("casino_intel")
          .select("*", { count: "exact", head: true })
          .eq("status", s)
      )
    );
    setCounts({
      pending: results[0].count ?? 0,
      approved: results[1].count ?? 0,
      rejected: results[2].count ?? 0,
    });
  }, []);

  // Fetch submissions for active tab
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("casino_intel")
      .select("*, casinos(name)")
      .eq("status", activeTab)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      setSubmissions([]);
      setOriginalGames({});
      setLoading(false);
      return;
    }

    const rows = (data as IntelSubmission[]) ?? [];
    setSubmissions(rows);

    // Batch-fetch the original casino_games rows referenced by any
    // rule_update intel so the diff view can render before/after pairs.
    const gameIds = Array.from(
      new Set(
        rows
          .filter((r) => r.type === "rule_update")
          .map((r) =>
            typeof r.content === "object" && r.content !== null
              ? (r.content as Record<string, unknown>).gameId
              : null
          )
          .filter((id): id is string => typeof id === "string" && id.length > 0)
      )
    );

    if (gameIds.length === 0) {
      setOriginalGames({});
    } else {
      const { data: games, error: gamesErr } = await supabase
        .from("casino_games")
        .select(
          "id,num_decks,rule17,pays,penetration,shuffle_type,das,split_aces,surrender,min_bet,max_bet"
        )
        .in("id", gameIds);
      if (gamesErr) {
        console.error("Fetch original games error:", gamesErr);
        setOriginalGames({});
      } else {
        const map: Record<string, CasinoGameRow> = {};
        for (const g of (games ?? []) as CasinoGameRow[]) {
          map[g.id] = g;
        }
        setOriginalGames(map);
      }
    }

    // Resolve submitter emails server-side. casino_intel.submitter_email
    // is NULL for v1.13+ rows by design; the API route uses the service-
    // role key to look the email up via auth.users by user_id. Failures
    // here are non-fatal -- we just render "Anonymous" without an email.
    const intelIds = rows.map((r) => r.id);
    if (intelIds.length === 0) {
      setSubmitterEmails({});
    } else {
      try {
        const res = await fetch("/api/admin/intel-emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: ADMIN_PASSWORD, intelIds }),
        });
        if (res.ok) {
          const json = (await res.json()) as { emails?: Record<string, string> };
          setSubmitterEmails(json.emails ?? {});
        } else {
          const json = await res.json().catch(() => ({}));
          console.warn(
            "Submitter-email lookup failed:",
            json?.error ?? res.statusText
          );
          setSubmitterEmails({});
        }
      } catch (err) {
        console.warn("Submitter-email lookup network error:", err);
        setSubmitterEmails({});
      }
    }

    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    if (authenticated) {
      fetchCounts();
      fetchSubmissions();
    }
  }, [authenticated, activeTab, fetchCounts, fetchSubmissions]);

  // Actions
  const handleAction = useCallback(
    async (id: string, newStatus: "approved" | "rejected") => {
      setActionLoading(id);
      const { error } = await supabase
        .from("casino_intel")
        .update({ status: newStatus, reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        setToast({ message: `Failed to ${newStatus}: ${error.message}`, type: "error" });
      } else {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        setCounts((prev) => ({
          ...prev,
          [activeTab]: Math.max(0, prev[activeTab] - 1),
          [newStatus]: prev[newStatus] + 1,
        }));
        setToast({
          message: `Submission ${newStatus === "approved" ? "approved" : "rejected"} successfully.`,
          type: "success",
        });
      }
      setActionLoading(null);
    },
    [activeTab]
  );

  // ---- Password gate ----
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-slate-50 mb-1">
            Casino Intel Admin
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            Enter the admin password to continue.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 mb-3"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-400 text-sm mb-3">
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-4 py-3 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---- Main dashboard ----
  const tabs: { key: IntelStatus; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-50">
              Casino Intel Admin
            </h1>
            <p className="text-sm text-slate-400">
              Review community submissions
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("intel-admin-auth");
              setAuthenticated(false);
              setPasswordInput("");
            }}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">
              {counts.pending}
            </p>
            <p className="text-sm text-slate-400">Pending</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {counts.approved}
            </p>
            <p className="text-sm text-slate-400">Approved</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              {counts.rejected}
            </p>
            <p className="text-sm text-slate-400">Rejected</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-sm font-medium rounded-md px-4 py-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-slate-700 text-slate-50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
              {tab.key === "pending" && counts.pending > 0 && (
                <span className="ml-2 bg-amber-500/20 text-amber-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  {counts.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-6 h-6 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm mt-3">Loading...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">
              {activeTab === "pending" ? "\u2705" : "\u{1F4CB}"}
            </div>
            <p className="text-slate-300 font-medium">
              {activeTab === "pending"
                ? "All caught up! No pending submissions."
                : `No ${activeTab} submissions yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((item) => {
              const typeConf = TYPE_CONFIG[item.type] ?? {
                label: item.type,
                bg: "bg-slate-500/20",
                text: "text-slate-400",
              };

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                >
                  {/* Top row: casino name + type badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-50">
                        {item.casinos?.name ?? "Unknown Casino"}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        by {(() => {
                          const name = (item.submitted_by ?? "").trim();
                          const email =
                            submitterEmails[item.id] ??
                            item.submitter_email ??
                            "";
                          const hasName =
                            name.length > 0 && name.toLowerCase() !== "anonymous";
                          if (hasName && email)
                            return (
                              <>
                                {name}{" "}
                                <span className="text-slate-500">({email})</span>
                              </>
                            );
                          if (hasName) return name;
                          if (email) return email;
                          return "Anonymous";
                        })()}
                        {" "}&middot; {formatDate(item.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${typeConf.bg} ${typeConf.text}`}
                    >
                      {typeConf.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <IntelContent item={item} originalGames={originalGames} />
                  </div>

                  {/* Bottom row: votes + actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-400">
                        <span aria-label="upvotes" className="mr-1">
                          &#9650;
                        </span>
                        {item.upvotes ?? 0}
                      </span>
                      <span className="text-red-400">
                        <span aria-label="downvotes" className="mr-1">
                          &#9660;
                        </span>
                        {item.downvotes ?? 0}
                      </span>
                    </div>

                    {activeTab === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(item.id, "approved")}
                          disabled={actionLoading === item.id}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors cursor-pointer"
                        >
                          {actionLoading === item.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "rejected")}
                          disabled={actionLoading === item.id}
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors cursor-pointer"
                        >
                          {actionLoading === item.id ? "..." : "Reject"}
                        </button>
                      </div>
                    )}

                    {activeTab !== "pending" && item.reviewed_at && (
                      <p className="text-xs text-slate-500">
                        Reviewed {formatDate(item.reviewed_at)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

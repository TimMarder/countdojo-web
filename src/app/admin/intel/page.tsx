"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type IntelType = "rule_update" | "intel_note" | "new_casino";

type IntelStatus = "pending" | "approved" | "rejected";

type IntelSubmission = {
  id: string;
  casino_id: string | null;
  type: IntelType;
  content: Record<string, unknown> | string;
  upvotes: number;
  downvotes: number;
  status: IntelStatus;
  created_at: string;
  reviewed_at: string | null;
  casinos: { name: string } | null;
};

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

function formatContent(
  content: Record<string, unknown> | string
): React.ReactNode {
  if (typeof content === "string") {
    return <p className="text-slate-300 whitespace-pre-wrap">{content}</p>;
  }
  return (
    <pre className="text-slate-300 text-sm bg-slate-800/50 rounded-lg p-4 overflow-x-auto">
      {JSON.stringify(content, null, 2)}
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
    } else {
      setSubmissions((data as IntelSubmission[]) ?? []);
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
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(item.created_at)}
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
                    {formatContent(
                      item.content as Record<string, unknown> | string
                    )}
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

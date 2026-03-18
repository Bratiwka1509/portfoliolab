"use client";

import { useEffect, useMemo, useState } from "react";

type Submission = {
  id: string;
  teamName: string;
  teamNumber: number;
  country?: string | null;
  season?: string | null;
  level?: string | null;
  eventName?: string | null;
  contactEmail?: string | null;
  pdfUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string | null;
  createdAt: string;
  author?: { email: string; name?: string | null };
};

export default function AdminClient() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | Submission["status"]>("ALL");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/submissions");
    if (!res.ok) throw new Error("forbidden");
    const data = (await res.json()) as Submission[];
    return data;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await load();
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Forbidden / not logged in as admin.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((i) => i.status === filter);
  }, [items, filter]);

  async function update(
    id: string,
    patch: Partial<Pick<Submission, "status" | "adminNote">>
  ) {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return false;
    const updated = (await res.json()) as Submission;
    setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    return true;
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin — Submissions</h1>
            <p className="text-sm text-gray-400 mt-1">
              Review, approve, or reject portfolio submissions.
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const data = await load();
                  setItems(data);
                  setError(null);
                } catch {
                  setError("Forbidden / not logged in as admin.");
                } finally {
                  setLoading(false);
                }
              }}
              className="px-4 py-2 rounded-md border border-zinc-700 hover:border-red-600 transition text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="border border-red-900/40 bg-red-950/30 text-red-300 rounded-xl p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400">Loading…</div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-gray-400">No submissions.</div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className="border border-zinc-800 rounded-2xl bg-zinc-950 p-5 space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">
                        #{s.teamNumber} — {s.teamName}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {s.season ?? "—"} {s.level ? `· ${s.level}` : ""}{" "}
                        {s.eventName ? `· ${s.eventName}` : ""}{" "}
                        {s.country ? `· ${s.country}` : ""}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        From: {s.author?.email ?? "—"}{" "}
                        {s.contactEmail ? `· Contact: ${s.contactEmail}` : ""}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span
                        className={
                          s.status === "APPROVED"
                            ? "text-green-400"
                            : s.status === "REJECTED"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }
                      >
                        {s.status}
                      </span>
                      <a
                        href={s.pdfUrl}
                        target="_blank"
                        className="px-3 py-2 rounded-md border border-zinc-700 hover:border-red-600 transition text-sm"
                      >
                        Open PDF
                      </a>
                      <button
                        onClick={() => update(s.id, { status: "APPROVED" })}
                        className="px-3 py-2 rounded-md bg-green-700/30 border border-green-700 hover:bg-green-700/40 transition text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => update(s.id, { status: "REJECTED" })}
                        className="px-3 py-2 rounded-md bg-red-700/30 border border-red-700 hover:bg-red-700/40 transition text-sm"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => update(s.id, { status: "PENDING" })}
                        className="px-3 py-2 rounded-md border border-zinc-700 hover:border-red-600 transition text-sm"
                      >
                        Set pending
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Admin note</label>
                    <textarea
                      defaultValue={s.adminNote ?? ""}
                      onBlur={(e) => update(s.id, { adminNote: e.target.value })}
                      className="w-full min-h-20 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-700"
                      placeholder="Internal note (saved on blur)"
                    />
                    <p className="text-xs text-gray-500">
                      Tip: note saves when you click away from the text area.
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}


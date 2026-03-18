"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/* ================= HELPERS ================= */

function getDrivePreview(pdfUrl: string) {
  const match = pdfUrl.match(/\/d\/([^/]+)/);
  if (!match) return null;
  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="text-red-400">{part}</span>
    ) : (
      part
    )
  );
}

/* ================= FILTER OPTIONS ================= */

const SEASONS = [
  "All Seasons",
  "2025 Decode",
  "2024 Into The Deep",
  "2023 Centerstage",
  "2022 Power Play",
  "2021 Freight Frenzy",
  "2020 Ultimate Goal",
  "2019 Skystone",
  "Not specified",
];

const LEVELS = [
  "All Levels",
  "Regionals",
  "Nationals",
  "Worlds",
  "Premier Event",
  "Not specified",
];

/* ================= PAGE ================= */

type AiEvaluation = {
  summary: string;
  awardsBreakdown: [string, string][];
  criteria: [string, string][];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
};

type PortfolioListItem = {
  id: string;
  teamName: string;
  teamNumber: number;
  country?: string | null;
  season?: string | null;
  level?: string | null;
  eventName?: string | null;
  coverUrl?: string | null;
  pdfUrl: string;
  likesCount: number;
  createdAt: string;
};

type PortfolioDetails = PortfolioListItem & {
  aiEvaluation?: AiEvaluation | null;
};

type CommentItem = {
  id: string;
  text: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
};

type PortfolioResponse = {
  portfolio: PortfolioDetails & { comments: CommentItem[] };
  likedByMe: boolean;
};

type Sort = "newest" | "oldest" | "popular";

export default function SubmitClient() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();

  const [season, setSeason] = useState("All Seasons");
  const [level, setLevel] = useState("All Levels");
  const [sort, setSort] = useState<Sort>("newest");
  const [items, setItems] = useState<PortfolioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPortfolio, setOpenPortfolio] = useState<PortfolioResponse | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentSending, setCommentSending] = useState(false);

  const [showEvaluationInfo, setShowEvaluationInfo] = useState(false);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/portfolios?sort=${sort}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: PortfolioListItem[]) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sort]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (season !== "All Seasons" && (p.season ?? "Not specified") !== season)
        return false;
      if (level !== "All Levels" && (p.level ?? "Not specified") !== level)
        return false;
      if (query) {
        if (
          !p.teamName.toLowerCase().includes(query) &&
          !String(p.teamNumber).includes(query) &&
          !p.country?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [items, season, level, query]);

  return (
    <main className="min-h-screen text-white px-4 sm:px-6 py-20 sm:py-24 bg-gradient-to-b from-[#0b0000] via-[#140404] to-black">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">

        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">Engineering Portfolios</h1>
            <p className="text-gray-400 mt-2 max-w-2xl text-sm sm:text-base">
              FTC engineering portfolios reviewed by PortfolioLab using a strict,
              criteria-based star system.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setShowEvaluationInfo(true)}
              className="px-4 py-2 rounded-md border border-zinc-700 hover:border-red-600 text-sm"
            >
              How portfolios are evaluated
            </button>

            <Link
              href="/submit"
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-sm"
            >
              Submit portfolio
            </Link>

            <button
              onClick={() => setShowSources(true)}
              className="px-4 py-2 rounded-md border border-zinc-700 hover:border-red-600 text-sm"
            >
              Portfolio sources
            </button>
          </div>
        </section>

        {/* FILTERS */}
        <section className="flex flex-wrap items-center gap-2 sm:gap-3">
          <select
            className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
            onChange={(e) => setSeason(e.target.value)}
            value={season}
          >
            {SEASONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <select
            className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
            onChange={(e) => setLevel(e.target.value)}
            value={level}
          >
            {LEVELS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <select
            className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
            onChange={(e) => {
              setLoading(true);
              setSort(e.target.value as Sort);
            }}
            value={sort}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most liked</option>
          </select>
        </section>

        {/* GRID */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {loading && (
            <div className="col-span-full text-sm text-gray-400">
              Loading…
            </div>
          )}
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={async () => {
                const res = await fetch(`/api/portfolios/${p.id}`);
                if (!res.ok) return;
                const details = (await res.json()) as PortfolioResponse;
                setCommentText("");
                setOpenPortfolio(details);
              }}
              className="rounded-xl border border-zinc-800 bg-zinc-950 hover:border-red-600 transition text-left overflow-hidden"
            >
              <div
                className="aspect-[210/297] bg-cover bg-center"
                style={{ backgroundImage: `url(${getDrivePreview(p.pdfUrl)})` }}
              />

              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold">
                  {query ? highlight(p.teamName, query) : p.teamName}
                </h3>

                <p className="text-xs text-gray-400">
                  #{p.teamNumber} · {p.season ?? "Not specified"} ·{" "}
                  {p.level ?? "Not specified"}
                </p>

                <p className="text-xs text-gray-500">{p.country}</p>
                <p className="text-xs text-gray-400">
                  ❤ {p.likesCount}
                </p>
              </div>
            </button>
          ))}
        </section>
      </div>

      {/* ========== EVALUATION INFO MODAL ========== */}
      {showEvaluationInfo && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowEvaluationInfo(false)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-3xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">How portfolios are evaluated</h2>
            <p className="text-gray-300 text-sm mb-4">
              PortfolioLab uses a strict, criteria-based star evaluation system.
              Each portfolio is scored from 0 to 5 on fixed criteria, weighted,
              and converted into a final star rating.
            </p>

            <ul className="text-sm text-gray-300 space-y-1">
              <li>Awards - High weight</li>
              <li>Outreach & Impact - High weight</li>
              <li>Engineering Thinking - High weight</li>
              <li>Technical Depth - High weight</li>
              <li>Evidence & Proof - Medium</li>
              <li>Clarity & Structure - Medium</li>
              <li>Design as Tool - Medium</li>
              <li>Claim Realism - Medium</li>
             

            </ul>

            <p className="text-gray-400 text-sm mb-4 space-y-1">
            ★★★★★ is extremely rare (top ~1%). Automatic caps apply if outreach, engineering thinking, or technical depth are weak. PortfolioLab ratings are independent and not official FIRST scores. Portfolios evaluated using PortAI.
            </p>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEvaluationInfo(false)}
                className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== SOURCES MODAL ========== */}
      {showSources && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowSources(false)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Portfolio sources</h2>

            <p className="text-gray-300 text-sm mb-4">
              Some portfolios showcased on PortfolioLab were taken from open
              sources. We are grateful to the teams and platforms that share
              their work publicly and are happy to highlight these portfolio
              websites:
            </p>

            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://sana-ftc.kz/portfolio"
                  target="_blank"
                  className="text-red-400 hover:underline"
                >
                  sana-ftc.kz/portfolio
                </a>
              </li>
              <li>
                <a
                  href="https://portfolioperch.com/"
                  target="_blank"
                  className="text-red-400 hover:underline"
                >
                  portfolioperch.com
                </a>
              </li>
              <li>
                <a
                  href="https://portfolios.hivemindrobotics.net/"
                  target="_blank"
                  className="text-red-400 hover:underline"
                >
                  portfolios.hivemindrobotics.net
                </a>
              </li>
            </ul>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSources(false)}
                className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {openPortfolio && (
  <div
    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
    onClick={() => setOpenPortfolio(null)}
  >
    <div
      className="
        bg-zinc-950 border border-zinc-800 rounded-2xl
        max-w-5xl w-full
        max-h-[85vh]
        relative
        flex flex-col
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-start justify-between px-8 pt-6 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">
            {openPortfolio.portfolio.teamName} #{openPortfolio.portfolio.teamNumber}
          </h2>

          <p className="text-gray-400 text-sm">
            {openPortfolio.portfolio.country ?? "—"} ·{" "}
            {openPortfolio.portfolio.season ?? "Not specified"} ·{" "}
            {openPortfolio.portfolio.level ?? "Not specified"}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <a
            href={openPortfolio.portfolio.pdfUrl}
            target="_blank"
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-sm"
          >
            Open portfolio
          </a>
          <button
            onClick={async () => {
              const res = await fetch(`/api/portfolios/${openPortfolio.portfolio.id}/like`, { method: "POST" });
              if (!res.ok) return;
              const data = (await res.json()) as { liked: boolean; likesCount: number };
              setOpenPortfolio((prev) =>
                prev
                  ? {
                      ...prev,
                      likedByMe: data.liked,
                      portfolio: { ...prev.portfolio, likesCount: data.likesCount },
                    }
                  : prev
              );
            }}
            className="px-4 py-2 rounded-md border border-zinc-700 hover:border-red-600 transition text-sm"
          >
            {openPortfolio.likedByMe ? "Unlike" : "Like"} · ❤ {openPortfolio.portfolio.likesCount}
          </button>
          <button
            onClick={() => setOpenPortfolio(null)}
            className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className="overflow-y-auto px-8 py-6 space-y-10">

        {/* SUMMARY */}
        {openPortfolio.portfolio.aiEvaluation?.summary && (
          <p className="text-gray-300 leading-relaxed">
            {openPortfolio.portfolio.aiEvaluation.summary}
          </p>
        )}

        {/* ===== AWARDS ===== */}
        {openPortfolio.portfolio.aiEvaluation?.awardsBreakdown && (
          <div>
            <h3 className="font-semibold mb-3">Awards</h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-1 text-sm text-gray-300">
              {openPortfolio.portfolio.aiEvaluation.awardsBreakdown.map(
                ([name, value]: [string, string], i: number) => (
                  <div key={i}>
                    {name} — {value}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ===== CRITERIA ===== */}
        {openPortfolio.portfolio.aiEvaluation?.criteria && (
          <div>
            <h3 className="font-semibold mb-3">Criteria</h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-1 text-sm text-gray-300">
              {openPortfolio.portfolio.aiEvaluation.criteria.map(
                ([name, value]: [string, string], i: number) => (
                  <div key={i}>
                    {name} — {value}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ===== STRENGTHS / WEAKNESSES / IMPROVEMENTS ===== */}
        <div className="grid md:grid-cols-3 gap-8">
          {openPortfolio.portfolio.aiEvaluation?.strengths && (
            <div>
              <h4 className="font-semibold mb-2">Strengths</h4>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                {openPortfolio.portfolio.aiEvaluation.strengths.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {openPortfolio.portfolio.aiEvaluation?.weaknesses && (
            <div>
              <h4 className="font-semibold mb-2">Weaknesses</h4>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                {openPortfolio.portfolio.aiEvaluation.weaknesses.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {openPortfolio.portfolio.aiEvaluation?.improvements && (
            <div>
              <h4 className="font-semibold mb-2">Improvements</h4>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                {openPortfolio.portfolio.aiEvaluation.improvements.map((im: string, i: number) => (
                  <li key={i}>{im}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* COMMENTS */}
        <div className="border-t border-zinc-800 pt-8 space-y-4">
          <h3 className="font-semibold">Comments</h3>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (commentSending) return;
              setCommentSending(true);
              const res = await fetch(
                `/api/portfolios/${openPortfolio.portfolio.id}/comments`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: commentText }),
                }
              );
              setCommentSending(false);
              if (!res.ok) return;
              const created = (await res.json()) as CommentItem;
              setCommentText("");
              setOpenPortfolio((prev) =>
                prev
                  ? {
                      ...prev,
                      portfolio: {
                        ...prev.portfolio,
                        comments: [created, ...prev.portfolio.comments],
                      },
                    }
                  : prev
              );
            }}
            className="space-y-2"
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full min-h-24 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-700"
              placeholder="Write a comment…"
            />
            <div className="flex justify-end">
              <button
                disabled={commentSending || commentText.trim().length < 2}
                className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm disabled:opacity-50"
              >
                {commentSending ? "Sending…" : "Post comment"}
              </button>
            </div>
          </form>

          {openPortfolio.portfolio.comments.length === 0 ? (
            <p className="text-sm text-gray-400">No comments yet.</p>
          ) : (
            <div className="space-y-3">
              {openPortfolio.portfolio.comments.map((c) => (
                <div key={c.id} className="border border-zinc-800 rounded-xl p-4 bg-black/30">
                  <div className="text-xs text-gray-400 mb-1">
                    {c.user.name ?? c.user.email} ·{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-200 whitespace-pre-wrap">{c.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
 

 
    </main>
  );
}

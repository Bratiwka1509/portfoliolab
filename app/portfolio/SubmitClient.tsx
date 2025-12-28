"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import portfolios from "@/data/portfolios";

/* ================= HELPERS ================= */

function getDrivePreview(pdfUrl: string) {
  const match = pdfUrl.match(/\/d\/([^/]+)/);
  if (!match) return null;
  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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

const AWARDS = [
  "All Awards",
  "Inspire",
  "Think",
  "Reach",
  "Sustain",
  "Connect",
  "Design",
  "Innovate",
  "Control",
  "Motivate",
  "Not specified",
];

const STARS = [
  "All Stars",
  "★★★★★",
  "★★★★☆",
  "★★★☆☆",
  "★★☆☆☆",
  "★☆☆☆☆",
];

/* ================= PAGE ================= */

export default function SubmitClient() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();

  const [season, setSeason] = useState("All Seasons");
  const [level, setLevel] = useState("All Levels");
  const [award, setAward] = useState("All Awards");
  const [stars, setStars] = useState("All Stars");

  const [randomized, setRandomized] = useState<typeof portfolios>([]);
  const [openPortfolio, setOpenPortfolio] = useState<any>(null);

  const [showEvaluationInfo, setShowEvaluationInfo] = useState(false);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    setRandomized(shuffleArray(portfolios));
  }, []);

  const filtered = useMemo(() => {
    return randomized.filter((p) => {
      if (season !== "All Seasons" && p.season !== season) return false;
      if (level !== "All Levels" && p.level !== level) return false;
      if (award !== "All Awards" && !p.award.includes(award)) return false;
      if (stars !== "All Stars" && p.stars !== stars) return false;

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
  }, [randomized, season, level, award, stars, query]);

  return (
    <main className="min-h-screen text-white px-6 py-24 bg-gradient-to-b from-[#0b0000] via-[#140404] to-black">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Engineering Portfolios</h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              FTC engineering portfolios reviewed by PortfolioLab using a strict,
              criteria-based star system.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3">
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
        <section className="flex flex-wrap items-center gap-3">
          {[SEASONS, LEVELS, AWARDS, STARS].map((opts, i) => (
            <select
              key={i}
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
              onChange={(e) =>
                [setSeason, setLevel, setAward, setStars][i](e.target.value)
              }
            >
              {opts.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ))}
        </section>

        {/* GRID */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenPortfolio(p)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 hover:border-red-600 transition text-left overflow-hidden"
            >
              <div
                className="aspect-[210/297] bg-cover bg-center"
                style={{ backgroundImage: `url(${getDrivePreview(p.pdf)})` }}
              />

              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold">
                  {query ? highlight(p.teamName, query) : p.teamName}
                </h3>

                <p className="text-xs text-gray-400">
                  #{p.teamNumber} · {p.season} · {p.level}
                </p>

                <p className="text-xs text-gray-500">{p.country}</p>
                <div className="text-red-500 text-sm">{p.stars}</div>
                <p className="text-xs text-yellow-400">🏆 {p.award}</p>
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
            {openPortfolio.teamName} #{openPortfolio.teamNumber}
          </h2>

          <p className="text-gray-400 text-sm">
            {openPortfolio.country} · {openPortfolio.season} · {openPortfolio.level}
          </p>

          {openPortfolio.score && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-red-500 text-lg">
                {openPortfolio.stars}
              </span>
              <span className="text-gray-400 text-sm">
                {openPortfolio.score}
              </span>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <a
            href={openPortfolio.pdf}
            target="_blank"
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-sm"
          >
            Open portfolio
          </a>
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
        {openPortfolio.summary && (
          <p className="text-gray-300 leading-relaxed">
            {openPortfolio.summary}
          </p>
        )}

        {/* ===== AWARDS ===== */}
        {openPortfolio.awardsBreakdown && (
          <div>
            <h3 className="font-semibold mb-3">Awards</h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-1 text-sm text-gray-300">
              {openPortfolio.awardsBreakdown.map(
                ([name, value]: any, i: number) => (
                  <div key={i}>
                    {name} — {value}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ===== CRITERIA ===== */}
        {openPortfolio.criteriaBreakdown && (
          <div>
            <h3 className="font-semibold mb-3">Criteria</h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-1 text-sm text-gray-300">
              {openPortfolio.criteriaBreakdown.map(
                ([name, value]: any, i: number) => (
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
          {openPortfolio.strengths && (
            <div>
              <h4 className="font-semibold mb-2">Strengths</h4>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                {openPortfolio.strengths.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {openPortfolio.weaknesses && (
            <div>
              <h4 className="font-semibold mb-2">Weaknesses</h4>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                {openPortfolio.weaknesses.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {openPortfolio.improvements && (
            <div>
              <h4 className="font-semibold mb-2">Improvements</h4>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                {openPortfolio.improvements.map((im: string, i: number) => (
                  <li key={i}>{im}</li>
                ))}
              </ul>
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

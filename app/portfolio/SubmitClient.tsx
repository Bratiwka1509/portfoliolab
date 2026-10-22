"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { PortfolioBreakdown, PortfolioRecord } from "@/lib/portfolio-types";

/* ================= HELPERS ================= */

function getDrivePreview(pdfUrl: string) {
  const match = pdfUrl.match(/\/d\/([^/]+)/);
  if (!match) return null;
  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
}

function getPdfPreviewUrl(pdfUrl: string) {
  if (!pdfUrl.toLowerCase().includes(".pdf")) {
    return null;
  }

  return `${pdfUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`;
}

function getPreviewStyle(portfolio: PortfolioRecord) {
  const drivePreview = getDrivePreview(portfolio.pdf);

  if (drivePreview) {
    return {
      backgroundImage: `url(${drivePreview})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  if (portfolio.cover) {
    return {
      backgroundImage: `url(${portfolio.cover})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    background:
      "linear-gradient(135deg, rgba(127,29,29,0.9), rgba(10,10,10,0.95))",
  };
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
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="text-red-400">{part}</span>
    ) : (
      part
    )
  );
}

/* ================= FILTER OPTIONS ================= */

const CATEGORIES = [
  "All Categories",
  "FTC",
  "FRC",
];

const FTC_SEASONS = [
  "All Seasons",
  "2026 BioBuzz",
  "2025 Decode",
  "2024 Into The Deep",
  "2023 Centerstage",
  "2022 Power Play",
  "2021 Power Play",
  "2021 Freight Frenzy",
  "2020 Ultimate Goal",
  "2019 Skystone",
  "Not specified",
];

const FRC_SEASONS = [
  "All Seasons",
  "2026 REBUILT",
  "2025 REEFSCAPE",
  "2024 CRESCENDO",
  "2023 CHARGED UP",
  "2022 RAPID REACT",
  "2021 INFINITE RECHARGE at Home",
  "2020 INFINITE RECHARGE",
  "2019 DESTINATION: DEEP",
  "Not specified",
];

const ALL_SEASONS = [...new Set([...FTC_SEASONS, ...FRC_SEASONS])];

const FTC_LEVELS = [
  "All Levels",
  "Regionals",
  "Nationals",
  "Worlds",
  "Premier Event",
  "Not specified",
];

const FRC_LEVELS = [
  "All Levels",
  "Regional",
  "District",
  "District Championship",
  "FIRST Championship",
  "Not specified",
];

const ALL_LEVELS = [...new Set([...FTC_LEVELS, ...FRC_LEVELS])];

const FTC_AWARDS = [
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

const FRC_AWARDS = [
  "All Awards",
  "FIRST Impact Award",
  "Engineering Inspiration Award",
  "Rookie All Star Award",
  "Rookie Inspiration Award",
  "Entrepreneurship Award",
  "Excellence in Engineering Award",
  "Creativity Award",
  "Industrial Design Award",
  "Innovation in Control Award",
  "Quality Award",
  "Safety Award",
  "Sustainability Award",
  "Team Spirit Award",
  "Gracious Professionalism Award",
  "Judges' Choice Award",
  "Imagery Award",
  "Autonomous Award",
  "Highest Rookie Seed Award",
  "Dean's List Award",
  "Woodie Flowers Award",
  "FIRST Leadership Award",
  "Event Winner",
  "Event Finalist",
  "Not specified",
];

const ALL_AWARDS = [...new Set([...FTC_AWARDS, ...FRC_AWARDS])];

const STARS = [
  "All Stars",
  "★★★★★",
  "★★★★☆",
  "★★★☆☆",
  "★★☆☆☆",
  "★☆☆☆☆",
];

/* ================= PAGE ================= */

type Props = {
  portfolios: PortfolioRecord[];
};

function FilterHint({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: (message: string) => void;
}) {
  useEffect(() => {
    if (!message) return;
    const dismissTimer = setTimeout(() => onDismiss(""), 2300);

    return () => clearTimeout(dismissTimer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <p
      key={message}
      className="filter-hint-fade absolute left-0 top-full z-20 mt-2 flex w-max max-w-[min(90vw,24rem)] items-start gap-2.5 rounded-lg border border-amber-400/50 bg-zinc-950/95 px-3.5 py-2.5 text-sm leading-snug text-amber-100 shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_18px_rgba(251,191,36,0.12)] backdrop-blur"
      role="alert"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
      >
        <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 6.5v4M10 13.5h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
      {message}
    </p>
  );
}

export default function SubmitClient({ portfolios }: Props) {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();

  const [category, setCategory] = useState("All Categories");
  const [season, setSeason] = useState("");
  const [seasonMessage, setSeasonMessage] = useState("");
  const [level, setLevel] = useState("");
  const [levelMessage, setLevelMessage] = useState("");
  const [award, setAward] = useState("");
  const [awardMessage, setAwardMessage] = useState("");
  const [stars, setStars] = useState("All Stars");

  const [randomized, setRandomized] = useState<typeof portfolios>([]);
  const [openPortfolio, setOpenPortfolio] = useState<PortfolioRecord | null>(null);

  const [showEvaluationInfo, setShowEvaluationInfo] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const hasSelectedCategory = category !== "All Categories";
  const seasonOptions = hasSelectedCategory
    ? category === "FTC"
      ? FTC_SEASONS
      : FRC_SEASONS
    : ALL_SEASONS;
  const levelOptions = hasSelectedCategory
    ? category === "FTC"
      ? FTC_LEVELS
      : FRC_LEVELS
    : ALL_LEVELS;
  const awardOptions = hasSelectedCategory
    ? category === "FTC"
      ? FTC_AWARDS
      : FRC_AWARDS
    : ALL_AWARDS;

  useEffect(() => {
    setRandomized(shuffleArray(portfolios));
  }, [portfolios]);

  const filtered = useMemo(() => {
    return randomized.filter((p) => {
      const itemCategory = p.program || "FTC";
      if (hasSelectedCategory && itemCategory !== category) return false;
      if (season && season !== "All Seasons" && p.season !== season) return false;
      if (level && level !== "All Levels" && p.level !== level) return false;
      if (award && award !== "All Awards" && !p.award.includes(award)) return false;
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
  }, [randomized, category, hasSelectedCategory, season, level, award, stars, query]);

  return (
    <main className="min-h-screen text-white px-4 sm:px-6 py-20 sm:py-24 bg-gradient-to-b from-[#0b0000] via-[#140404] to-black">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">

        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">Engineering Portfolios</h1>
            <p className="text-gray-400 mt-2 max-w-2xl text-sm sm:text-base">
              Explore rated benchmark portfolios and newly approved community PDF
              submissions in one place.
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

        <a
          href="https://ftc-resources.firstinspires.org/ftc/game/manual"
          target="_blank"
          rel="noreferrer"
          className="group block rounded-xl border border-red-900/50 bg-black/35 p-5 transition hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold sm:text-xl">
                Explore portfolio criteria and awards
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
                Review official FTC award criteria and requirements to see what
                judges look for in an engineering portfolio.
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-red-400 transition group-hover:text-red-300 sm:text-base">
              Explore the criteria →
            </span>
          </div>
        </a>

        {/* FILTERS */}
        <section className="flex flex-wrap items-center gap-1 sm:gap-1">
          {/* Category filter */}
          <select
            aria-label="Category"
            className="w-36 bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
            onChange={(e) => {
              setCategory(e.target.value);
              setSeason("");
              setSeasonMessage("");
              setLevel("");
              setLevelMessage("");
              setAward("");
              setAwardMessage("");
            }}
            value={category}
          >
            {CATEGORIES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <div className="relative">
            <select
              aria-label="Season"
              className="w-36 bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
              value={hasSelectedCategory ? season || "All Seasons" : ""}
              onMouseDown={(event) => {
                if (!hasSelectedCategory) {
                  event.preventDefault();
                  setSeasonMessage("Choose a category first to see its seasons.");
                }
              }}
              onKeyDown={(event) => {
                if (!hasSelectedCategory && event.key !== "Tab") {
                  event.preventDefault();
                  setSeasonMessage("Choose a category first to see its seasons.");
                }
              }}
              onChange={(event) => {
                if (!hasSelectedCategory) {
                  setSeasonMessage("Choose a category first to see its seasons.");
                  return;
                }
                setSeason(event.target.value);
                setSeasonMessage("");
              }}
            >
              {!hasSelectedCategory && <option value="">Season</option>}
              {seasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FilterHint message={seasonMessage} onDismiss={setSeasonMessage} />
          </div>

          <div className="relative">
            <select
              aria-label="Level"
              className="w-32 bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
              value={hasSelectedCategory ? level || "All Levels" : ""}
              onMouseDown={(event) => {
                if (!hasSelectedCategory) {
                  event.preventDefault();
                  setLevelMessage("Choose a category first to see its levels.");
                }
              }}
              onKeyDown={(event) => {
                if (!hasSelectedCategory && event.key !== "Tab") {
                  event.preventDefault();
                  setLevelMessage("Choose a category first to see its levels.");
                }
              }}
              onChange={(event) => {
                if (!hasSelectedCategory) {
                  setLevelMessage("Choose a category first to see its levels.");
                  return;
                }
                setLevel(event.target.value);
                setLevelMessage("");
              }}
            >
              {!hasSelectedCategory && <option value="">Level</option>}
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FilterHint message={levelMessage} onDismiss={setLevelMessage} />
          </div>

          {category !== "FRC" && (
            <div className="relative">
              <select
                aria-label="Award"
                className="w-36 bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
                value={hasSelectedCategory ? award || "All Awards" : ""}
                onMouseDown={(event) => {
                  if (!hasSelectedCategory) {
                    event.preventDefault();
                    setAwardMessage("Choose a category first to see its awards.");
                  }
                }}
                onKeyDown={(event) => {
                  if (!hasSelectedCategory && event.key !== "Tab") {
                    event.preventDefault();
                    setAwardMessage("Choose a category first to see its awards.");
                  }
                }}
                onChange={(event) => {
                  if (!hasSelectedCategory) {
                    setAwardMessage("Choose a category first to see its awards.");
                    return;
                  }
                  setAward(event.target.value);
                  setAwardMessage("");
                }}
              >
                {!hasSelectedCategory && <option value="">Award</option>}
                {awardOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FilterHint message={awardMessage} onDismiss={setAwardMessage} />
            </div>
          )}

          <select
            aria-label="Stars"
            className="w-28 bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
            value={stars}
            onChange={(event) => setStars(event.target.value)}
          >
            {STARS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        {/* GRID */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenPortfolio(p)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 hover:border-red-600 transition text-left overflow-hidden relative flex flex-col"
            >
              <div
                className="relative aspect-[210/297] overflow-hidden bg-cover bg-center w-full"
                style={getPreviewStyle(p)}
              >
                {/* Program Badge */}
                <span className="absolute top-2 left-2 z-10 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {p.program || "FTC"}
                </span>

                {!getDrivePreview(p.pdf) && !p.cover && getPdfPreviewUrl(p.pdf) ? (
                  <>
                    <iframe
                      src={getPdfPreviewUrl(p.pdf) ?? undefined}
                      title={`${p.teamName} cover preview`}
                      className="pointer-events-none h-full w-full scale-[1.02] bg-white"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                  </>
                ) : null}

                {!getDrivePreview(p.pdf) && !p.cover && !getPdfPreviewUrl(p.pdf) && (
                  <div className="flex h-full items-end justify-start bg-black/20 p-3 text-xs font-medium uppercase tracking-[0.24em] text-red-100">
                    PDF
                  </div>
                )}
              </div>

              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold">
                    {query ? highlight(p.teamName, query) : p.teamName}
                  </h3>

                  <p className="text-xs text-gray-400">
                    #{p.teamNumber} · {p.season} · {p.level}
                  </p>

                  <p className="text-xs text-gray-500">{p.country}</p>
                </div>
                <div>
                  <div className="text-red-500 text-sm">{p.stars}</div>
                  <p className="text-xs text-yellow-400">🏆 {p.award}</p>
                </div>
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

            <p className="text-gray-400 text-sm mb-4 space-y-1 mt-4">
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

      {/* ========== PORTFOLIO DETAILS MODAL ========== */}
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
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase">
                    {openPortfolio.program || "FTC"}
                  </span>
                  <h2 className="text-2xl font-bold">
                    {openPortfolio.teamName} #{openPortfolio.teamNumber}
                  </h2>
                </div>

                <p className="text-gray-400 text-sm">
                  {openPortfolio.country} · {openPortfolio.season} · {openPortfolio.level}
                </p>

                {(openPortfolio.stars || openPortfolio.score) && (
                  <div className="flex items-center gap-3 mt-2">
                    {openPortfolio.stars && (
                      <span className="text-red-500 text-lg">
                        {openPortfolio.stars}
                      </span>
                    )}
                    {openPortfolio.score && (
                      <span className="text-gray-400 text-sm">
                        {openPortfolio.score}
                      </span>
                    )}
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
                      ([name, value]: PortfolioBreakdown, i: number) => (
                        <div key={i}>
                          {name} — {value}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* ===== CRITERIA ===== */}
              {(openPortfolio.criteriaBreakdown || openPortfolio.criteria) && (
                <div>
                  <h3 className="font-semibold mb-3">Criteria</h3>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-1 text-sm text-gray-300">
                    {(openPortfolio.criteriaBreakdown || openPortfolio.criteria || []).map(
                      ([name, value]: PortfolioBreakdown, i: number) => (
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
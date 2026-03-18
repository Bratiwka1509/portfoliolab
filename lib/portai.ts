export type AiEvaluation = {
  summary: string;
  awardsBreakdown: [string, string][];
  criteria: [string, string][];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
};

type EvalInput = {
  teamName: string;
  teamNumber: number;
  season?: string | null;
  level?: string | null;
  country?: string | null;
  eventName?: string | null;
  pdfUrl: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreToText(score: number) {
  const s = clamp(Math.round(score * 2) / 2, 0, 5);
  return `${s} / 5`;
}

/**
 * Free / local evaluator.
 * This is intentionally deterministic and conservative; replace with real LLM later.
 */
export function evaluatePortfolio(input: EvalInput): AiEvaluation {
  // Heuristic: more metadata → slightly higher confidence. This is a placeholder.
  const meta =
    Number(Boolean(input.season)) +
    Number(Boolean(input.level)) +
    Number(Boolean(input.country)) +
    Number(Boolean(input.eventName));

  const base = 2.4 + meta * 0.3; // 2.4 .. 3.6
  const eng = base + 0.4;
  const outreach = base - 0.1;
  const evidence = base - 0.2;
  const clarity = base + 0.1;

  const awardsBreakdown: AiEvaluation["awardsBreakdown"] = [
    ["Inspire", `${scoreToText(base)} — Overall balance across criteria`],
    ["Reach", `${scoreToText(outreach)} — Outreach and impact claims`],
    ["Sustain", `${scoreToText(base - 0.2)} — Long-term programs and continuity`],
    ["Connect", `${scoreToText(base)} — Partnerships, industry, community`],
    ["Design", `${scoreToText(eng)} — Mechanical design rationale`],
    ["Innovate", `${scoreToText(base)} — Novelty with justification`],
    ["Control", `${scoreToText(eng - 0.2)} — Software, autonomy, reliability`],
  ];

  const criteria: AiEvaluation["criteria"] = [
    ["Judging Questions Alignment", `${scoreToText(base)} — Clear mapping helps judges`],
    ["Engineering Thinking", `${scoreToText(eng)} — Trade-offs, iteration, testing`],
    ["Technical Depth", `${scoreToText(eng - 0.2)} — Calculations, data, performance metrics`],
    ["Outreach & Impact", `${scoreToText(outreach)} — Quantified and verifiable impact`],
    ["Evidence & Proof", `${scoreToText(evidence)} — Photos, logs, links, metrics`],
    ["Clarity & Structure", `${scoreToText(clarity)} — Judge-friendly layout and density`],
    ["Claim Realism", `${scoreToText(base)} — Honest scope and proof`],
    ["Design as Tool", `${scoreToText(base)} — Strategy-driven engineering decisions`],
  ];

  const summary = `A solid FTC portfolio submission for ${input.teamName} (#${input.teamNumber}) that shows effort and structure, but needs stronger evidence and clearer trade-off reasoning to reach top-tier judging standards.`;

  const strengths = [
    "Clear structure and readable presentation.",
    "Shows engineering intent rather than only results.",
    "Includes enough context for judges to understand the season and event.",
  ];

  const weaknesses = [
    "Evidence is often weaker than the claims (metrics, screenshots, primary artifacts).",
    "Trade-offs and alternative designs are not always explicit.",
    "Testing results and quantified improvements can be expanded.",
  ];

  const improvements = [
    "Add measurable engineering metrics (cycle time, success rate, repeatability) and show before/after iterations.",
    "Map each major activity to award criteria and judging questions using short bullet proof points.",
    "Strengthen proof: include logs, photos, CAD snippets, and concise data tables/graphs.",
  ];

  return { summary, awardsBreakdown, criteria, strengths, weaknesses, improvements };
}


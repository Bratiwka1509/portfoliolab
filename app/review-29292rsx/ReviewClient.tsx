"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AdminInteractiveBackground from "@/components/admin/AdminInteractiveBackground";
import type {
  AdminPortfoliosResponse,
  PortfolioBreakdown,
  PortfolioReviewInput,
  PortfolioRecord,
  SubmissionRecord,
} from "@/lib/portfolio-types";

const ADMIN_PASSWORD = "29292RSX";
const STAR_OPTIONS = ["★★★★★", "★★★★☆", "★★★☆☆", "★★☆☆☆", "★☆☆☆☆"];
const DEFAULT_AWARD_NAMES = [
  "Inspire",
  "Reach",
  "Think",
  "Connect",
  "Design",
  "Innovate",
  "Control",
  "Motivate",
  "Sustain",
];

type BreakdownRow = {
  id: string;
  name: string;
  value: string;
};

type ReviewDraft = {
  teamName: string;
  teamNumber: string;
  country: string;
  season: string;
  level: string;
  eventName: string;
  award: string;
  stars: string;
  score: string;
  summary: string;
  awardsBreakdown: BreakdownRow[];
  strengthsText: string;
  weaknessesText: string;
  improvementsText: string;
};

type EditorTarget =
  | { kind: "pending"; id: string }
  | { kind: "published"; id: string }
  | null;

function createRowId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultBreakdownRows(): BreakdownRow[] {
  return DEFAULT_AWARD_NAMES.map((name) => ({
    id: createRowId(),
    name,
    value: "",
  }));
}

function breakdownToRows(breakdown?: PortfolioBreakdown[]) {
  if (!breakdown || breakdown.length === 0) {
    return createDefaultBreakdownRows();
  }

  return breakdown.map(([name, value]) => ({
    id: createRowId(),
    name,
    value,
  }));
}

function linesToTextarea(values?: string[]) {
  return values?.join("\n") ?? "";
}

function createDraftFromSubmission(submission: SubmissionRecord): ReviewDraft {
  return {
    teamName: submission.teamName,
    teamNumber: String(submission.teamNumber),
    country: submission.country,
    season: submission.season,
    level: submission.level,
    eventName: submission.eventName,
    award: submission.eventName,
    stars: "★★★☆☆",
    score: "",
    summary: `Approved community portfolio submitted for ${submission.eventName}.`,
    awardsBreakdown: createDefaultBreakdownRows(),
    strengthsText: "",
    weaknessesText: "",
    improvementsText: "",
  };
}

function createDraftFromPublished(portfolio: PortfolioRecord): ReviewDraft {
  return {
    teamName: portfolio.teamName,
    teamNumber: String(portfolio.teamNumber),
    country: portfolio.country,
    season: portfolio.season,
    level: portfolio.level,
    eventName: portfolio.eventName ?? "",
    award: portfolio.award,
    stars: portfolio.stars,
    score: portfolio.score ?? "",
    summary: portfolio.summary ?? "",
    awardsBreakdown: breakdownToRows(portfolio.awardsBreakdown),
    strengthsText: linesToTextarea(portfolio.strengths),
    weaknessesText: linesToTextarea(portfolio.weaknesses),
    improvementsText: linesToTextarea(portfolio.improvements),
  };
}

function textareaToLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createPayloadFromDraft(draft: ReviewDraft): PortfolioReviewInput | null {
  const teamNumber = Number(draft.teamNumber);

  if (!Number.isFinite(teamNumber)) {
    return null;
  }

  return {
    teamName: draft.teamName.trim(),
    teamNumber,
    country: draft.country.trim(),
    season: draft.season.trim(),
    level: draft.level.trim(),
    eventName: draft.eventName.trim() || undefined,
    award: draft.award.trim(),
    stars: draft.stars.trim(),
    score: draft.score.trim() || undefined,
    summary: draft.summary.trim() || undefined,
    awardsBreakdown: draft.awardsBreakdown
      .map((row) => [row.name.trim(), row.value.trim()] as PortfolioBreakdown)
      .filter(([name, value]) => Boolean(name && value)),
    strengths: textareaToLines(draft.strengthsText),
    weaknesses: textareaToLines(draft.weaknessesText),
    improvements: textareaToLines(draft.improvementsText),
  };
}

function createDraftForTarget(
  target: EditorTarget,
  pendingSubmissions: SubmissionRecord[],
  publishedPortfolios: PortfolioRecord[]
) {
  if (!target) {
    return null;
  }

  if (target.kind === "pending") {
    const submission = pendingSubmissions.find((item) => item.id === target.id);
    return submission ? createDraftFromSubmission(submission) : null;
  }

  const portfolio = publishedPortfolios.find((item) => item.id === target.id);
  return portfolio ? createDraftFromPublished(portfolio) : null;
}

export default function ReviewClient() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [approvedPortfolios, setApprovedPortfolios] = useState<PortfolioRecord[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<EditorTarget>(null);
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [actionId, setActionId] = useState("");

  const loadAdminData = useCallback(async (adminPassword: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/submissions", {
        headers: {
          "x-admin-password": adminPassword,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Failed to load submissions.");
        setLoading(false);
        return;
      }

      const payload = result as AdminPortfoliosResponse;
      setSubmissions(payload.pendingSubmissions);
      setApprovedPortfolios(payload.approvedPortfolios);
      setSelectedTarget((current) => {
        let nextTarget: EditorTarget = null;

        if (
          current?.kind === "pending" &&
          payload.pendingSubmissions.some((submission) => submission.id === current.id)
        ) {
          nextTarget = current;
        } else if (
          current?.kind === "published" &&
          payload.approvedPortfolios.some((portfolio) => portfolio.id === current.id)
        ) {
          nextTarget = current;
        } else if (payload.pendingSubmissions.length > 0) {
          nextTarget = { kind: "pending", id: payload.pendingSubmissions[0].id };
        } else if (payload.approvedPortfolios.length > 0) {
          nextTarget = { kind: "published", id: payload.approvedPortfolios[0].id };
        }

        setDraft(
          createDraftForTarget(
            nextTarget,
            payload.pendingSubmissions,
            payload.approvedPortfolios
          )
        );
        return nextTarget;
      });
      setLoading(false);
    } catch {
      setError("Failed to load submissions.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isUnlocked || !savedPassword) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadAdminData(savedPassword);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isUnlocked, loadAdminData, savedPassword]);

  const selectedSubmission = useMemo(
    () =>
      selectedTarget?.kind === "pending"
        ? submissions.find((submission) => submission.id === selectedTarget.id) ?? null
        : null,
    [selectedTarget, submissions]
  );

  const selectedPublishedPortfolio = useMemo(
    () =>
      selectedTarget?.kind === "published"
        ? approvedPortfolios.find((portfolio) => portfolio.id === selectedTarget.id) ?? null
        : null,
    [approvedPortfolios, selectedTarget]
  );

  function handleUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== ADMIN_PASSWORD) {
      setError("Wrong password.");
      return;
    }

    setSavedPassword(password);
    setIsUnlocked(true);
    setError("");
    setSuccessMessage("");
    setPassword("");
  }

  function updateDraftValue<Key extends keyof ReviewDraft>(key: Key, value: ReviewDraft[Key]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function updateBreakdownRow(
    rowId: string,
    key: keyof Pick<BreakdownRow, "name" | "value">,
    value: string
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            awardsBreakdown: current.awardsBreakdown.map((row) =>
              row.id === rowId ? { ...row, [key]: value } : row
            ),
          }
        : current
    );
  }

  function addBreakdownRow() {
    setDraft((current) =>
      current
        ? {
            ...current,
            awardsBreakdown: [
              ...current.awardsBreakdown,
              { id: createRowId(), name: "", value: "" },
            ],
          }
        : current
    );
  }

  function removeBreakdownRow(rowId: string) {
    setDraft((current) =>
      current
        ? {
            ...current,
            awardsBreakdown:
              current.awardsBreakdown.length > 1
                ? current.awardsBreakdown.filter((row) => row.id !== rowId)
                : current.awardsBreakdown,
          }
        : current
    );
  }

  function resetDraft() {
    if (selectedSubmission) {
      setDraft(createDraftFromSubmission(selectedSubmission));
      return;
    }

    if (selectedPublishedPortfolio) {
      setDraft(createDraftFromPublished(selectedPublishedPortfolio));
    }
  }

  async function handleReject(submissionId: string) {
    setActionId(`reject:${submissionId}`);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify({ submissionId, action: "reject" }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Action failed.");
        setActionId("");
        return;
      }

      setSubmissions((current) => current.filter((submission) => submission.id !== submissionId));
      const remaining = submissions.filter((submission) => submission.id !== submissionId);
      let nextTarget: EditorTarget = selectedTarget;

      if (selectedTarget?.kind === "pending" && selectedTarget.id === submissionId) {
        if (remaining.length > 0) {
          nextTarget = { kind: "pending", id: remaining[0].id };
        } else if (approvedPortfolios.length > 0) {
          nextTarget = { kind: "published", id: approvedPortfolios[0].id };
        } else {
          nextTarget = null;
        }
      }

      setSelectedTarget(nextTarget);
      setDraft(createDraftForTarget(nextTarget, remaining, approvedPortfolios));
      setSuccessMessage("Submission rejected and removed.");
      setActionId("");
    } catch {
      setError("Action failed.");
      setActionId("");
    }
  }

  async function handleApprove() {
    if (!selectedSubmission || !draft) {
      return;
    }

    const portfolio = createPayloadFromDraft(draft);
    if (!portfolio) {
      setError("Team number must be numeric.");
      return;
    }

    setActionId(`approve:${selectedSubmission.id}`);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify({
          action: "approve",
          submissionId: selectedSubmission.id,
          portfolio,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Approval failed.");
        setActionId("");
        return;
      }

      const approvedPortfolio = result.approvedPortfolio as PortfolioRecord;
      setSubmissions((current) =>
        current.filter((submission) => submission.id !== selectedSubmission.id)
      );
      setApprovedPortfolios((current) => [approvedPortfolio, ...current]);
      setSelectedTarget({ kind: "published", id: approvedPortfolio.id });
      setDraft(createDraftFromPublished(approvedPortfolio));
      setSuccessMessage("Portfolio approved and published.");
      setActionId("");
    } catch {
      setError("Approval failed.");
      setActionId("");
    }
  }

  async function handleUpdatePublished() {
    if (!selectedPublishedPortfolio || !draft) {
      return;
    }

    const portfolio = createPayloadFromDraft(draft);
    if (!portfolio) {
      setError("Team number must be numeric.");
      return;
    }

    setActionId(`save:${selectedPublishedPortfolio.id}`);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify({
          action: "updatePublished",
          portfolioId: selectedPublishedPortfolio.id,
          portfolio,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Save failed.");
        setActionId("");
        return;
      }

      const updatedPortfolio = result.updatedPortfolio as PortfolioRecord;
      setApprovedPortfolios((current) =>
        current.map((portfolioItem) =>
          portfolioItem.id === updatedPortfolio.id ? updatedPortfolio : portfolioItem
        )
      );
      setSelectedTarget({ kind: "published", id: updatedPortfolio.id });
      setDraft(createDraftFromPublished(updatedPortfolio));
      setSuccessMessage("Published portfolio updated.");
      setActionId("");
    } catch {
      setError("Save failed.");
      setActionId("");
    }
  }

  async function handleDeletePublished() {
    if (!selectedPublishedPortfolio) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedPublishedPortfolio.teamName} #${selectedPublishedPortfolio.teamNumber}?`
    );

    if (!confirmed) {
      return;
    }

    setActionId(`delete:${selectedPublishedPortfolio.id}`);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify({
          action: "deletePublished",
          portfolioId: selectedPublishedPortfolio.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Delete failed.");
        setActionId("");
        return;
      }

      const remainingPublished = approvedPortfolios.filter(
        (portfolio) => portfolio.id !== selectedPublishedPortfolio.id
      );
      let nextTarget: EditorTarget = selectedTarget;

      if (
        selectedTarget?.kind === "published" &&
        selectedTarget.id === selectedPublishedPortfolio.id
      ) {
        if (remainingPublished.length > 0) {
          nextTarget = { kind: "published", id: remainingPublished[0].id };
        } else if (submissions.length > 0) {
          nextTarget = { kind: "pending", id: submissions[0].id };
        } else {
          nextTarget = null;
        }
      }

      setApprovedPortfolios(remainingPublished);
      setSelectedTarget(nextTarget);
      setDraft(createDraftForTarget(nextTarget, submissions, remainingPublished));
      setSuccessMessage("Published portfolio deleted.");
      setActionId("");
    } catch {
      setError("Delete failed.");
      setActionId("");
    }
  }

  function handleLogout() {
    setSavedPassword("");
    setIsUnlocked(false);
    setSubmissions([]);
    setApprovedPortfolios([]);
    setSelectedTarget(null);
    setDraft(null);
    setPassword("");
    setError("");
    setSuccessMessage("");
  }

  if (!isUnlocked) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-20 text-white">
        <AdminInteractiveBackground />
        <div className="relative z-10 mx-auto max-w-md rounded-2xl border border-emerald-500/20 bg-black/45 p-6 backdrop-blur-xl sm:p-8">
          <h1 className="mb-3 text-2xl font-semibold">Admin review</h1>
          <p className="mb-6 text-sm leading-relaxed text-gray-400">
            Enter the admin password to review, edit, and publish submitted PDF portfolios.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/20 py-3 text-white transition hover:bg-emerald-500/30"
            >
              Open admin page
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-20 text-white sm:px-6 sm:py-24">
      <AdminInteractiveBackground />
      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-4 rounded-3xl border border-emerald-500/20 bg-black/35 p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Portfolio admin studio</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              Review new submissions, write full evaluation text, and update already
              published community portfolios from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-gray-300">
              Pending: <span className="text-white">{submissions.length}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-gray-300">
              Published: <span className="text-white">{approvedPortfolios.length}</span>
            </div>
            <button
              onClick={() => void loadAdminData(savedPassword)}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-500 hover:text-white"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-500 hover:text-white"
            >
              Log out
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-600/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 text-sm text-gray-400">
            Loading admin data...
          </div>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Pending submissions</h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Click a submission to fill in its evaluation and publish it.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                    {submissions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {submissions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-5 text-sm text-gray-400">
                      No pending submissions right now.
                    </div>
                  ) : (
                    submissions.map((submission) => {
                      const selected =
                        selectedTarget?.kind === "pending" &&
                        selectedTarget.id === submission.id;

                      return (
                        <button
                          key={submission.id}
                          type="button"
                          onClick={() => {
                            const nextTarget = { kind: "pending", id: submission.id } as const;
                            setSelectedTarget(nextTarget);
                            setDraft(createDraftFromSubmission(submission));
                            setSuccessMessage("");
                            setError("");
                          }}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-emerald-400/60 bg-emerald-500/10"
                              : "border-white/10 bg-black/25 hover:border-emerald-500/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold">
                                {submission.teamName} #{submission.teamNumber}
                              </h3>
                              <p className="mt-1 text-sm text-gray-400">
                                {submission.country} · {submission.season} · {submission.level}
                              </p>
                            </div>
                            <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-300">
                              Pending
                            </span>
                          </div>

                          <div className="mt-3 space-y-1 text-sm text-gray-300">
                            <p>{submission.eventName}</p>
                            <p className="text-gray-400">{submission.email}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Published community portfolios</h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Edit only records stored in `approved-portfolios.json`.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                    {approvedPortfolios.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {approvedPortfolios.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-5 text-sm text-gray-400">
                      No published community portfolios yet.
                    </div>
                  ) : (
                    approvedPortfolios.map((portfolio) => {
                      const selected =
                        selectedTarget?.kind === "published" &&
                        selectedTarget.id === portfolio.id;

                      return (
                        <button
                          key={portfolio.id}
                          type="button"
                          onClick={() => {
                            const nextTarget = {
                              kind: "published",
                              id: portfolio.id,
                            } as const;
                            setSelectedTarget(nextTarget);
                            setDraft(createDraftFromPublished(portfolio));
                            setSuccessMessage("");
                            setError("");
                          }}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-violet-400/60 bg-violet-500/10"
                              : "border-white/10 bg-black/25 hover:border-violet-500/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold">
                                {portfolio.teamName} #{portfolio.teamNumber}
                              </h3>
                              <p className="mt-1 text-sm text-gray-400">
                                {portfolio.country} · {portfolio.season} · {portfolio.level}
                              </p>
                            </div>
                            <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-300">
                              Published
                            </span>
                          </div>

                          <div className="mt-3 space-y-1 text-sm text-gray-300">
                            <p>{portfolio.award}</p>
                            <p className="text-red-300">
                              {portfolio.stars}
                              {portfolio.score ? ` · ${portfolio.score}` : ""}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
              {!draft ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-10 text-center text-sm text-gray-400">
                  Choose a pending submission or a published portfolio to start editing.
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                        {selectedSubmission ? "Pending submission editor" : "Published portfolio editor"}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold">
                        {draft.teamName || "Untitled portfolio"}
                        {draft.teamNumber ? ` #${draft.teamNumber}` : ""}
                      </h2>
                      <p className="mt-2 text-sm text-gray-400">
                        {draft.country || "Country"} · {draft.season || "Season"} · {draft.level || "Level"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={selectedSubmission?.pdfUrl ?? selectedPublishedPortfolio?.pdf ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:border-emerald-500/40 hover:text-white"
                      >
                        Open PDF
                      </a>
                      <button
                        type="button"
                        onClick={resetDraft}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:border-white/30 hover:text-white"
                      >
                        Reset form
                      </button>
                      {selectedSubmission ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void handleReject(selectedSubmission.id)}
                            disabled={actionId === `reject:${selectedSubmission.id}`}
                            className="rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {actionId === `reject:${selectedSubmission.id}`
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleApprove()}
                            disabled={actionId === `approve:${selectedSubmission.id}`}
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:opacity-50"
                          >
                            {actionId === `approve:${selectedSubmission.id}`
                              ? "Publishing..."
                              : "Approve and publish"}
                          </button>
                        </>
                      ) : selectedPublishedPortfolio ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void handleDeletePublished()}
                            disabled={actionId === `delete:${selectedPublishedPortfolio.id}`}
                            className="rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {actionId === `delete:${selectedPublishedPortfolio.id}`
                              ? "Deleting..."
                              : "Delete portfolio"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleUpdatePublished()}
                            disabled={actionId === `save:${selectedPublishedPortfolio.id}`}
                            className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-400 disabled:opacity-50"
                          >
                            {actionId === `save:${selectedPublishedPortfolio.id}`
                              ? "Saving..."
                              : "Save changes"}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <div className="space-y-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                      <div>
                        <h3 className="text-lg font-semibold">Core portfolio data</h3>
                        <p className="mt-1 text-sm text-gray-400">
                          Edit the public-facing fields before publication.
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm text-gray-300">
                          Team name
                          <input
                            value={draft.teamName}
                            onChange={(e) => updateDraftValue("teamName", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>

                        <label className="block text-sm text-gray-300">
                          Team number
                          <input
                            value={draft.teamNumber}
                            onChange={(e) => updateDraftValue("teamNumber", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>

                        <label className="block text-sm text-gray-300">
                          Country
                          <input
                            value={draft.country}
                            onChange={(e) => updateDraftValue("country", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>

                        <label className="block text-sm text-gray-300">
                          Season
                          <input
                            value={draft.season}
                            onChange={(e) => updateDraftValue("season", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>

                        <label className="block text-sm text-gray-300">
                          Level
                          <input
                            value={draft.level}
                            onChange={(e) => updateDraftValue("level", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>

                        <label className="block text-sm text-gray-300">
                          Event name
                          <input
                            value={draft.eventName}
                            onChange={(e) => updateDraftValue("eventName", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>

                        <label className="block text-sm text-gray-300 md:col-span-2">
                          Award / result
                          <input
                            value={draft.award}
                            onChange={(e) => updateDraftValue("award", e.target.value)}
                            placeholder="e.g. Inspire Award 2nd Place"
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                      <div>
                        <h3 className="text-lg font-semibold">Top evaluation block</h3>
                        <p className="mt-1 text-sm text-gray-400">
                          This is the top text area shown in the public review modal.
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm text-gray-300">
                          Stars
                          <select
                            value={draft.stars}
                            onChange={(e) => updateDraftValue("stars", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          >
                            {STAR_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block text-sm text-gray-300">
                          Score text
                          <input
                            value={draft.score}
                            onChange={(e) => updateDraftValue("score", e.target.value)}
                            placeholder="e.g. 35 / 55"
                            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>

                        <label className="block text-sm text-gray-300 md:col-span-2">
                          Description / summary
                          <textarea
                            value={draft.summary}
                            onChange={(e) => updateDraftValue("summary", e.target.value)}
                            rows={6}
                            className="mt-2 w-full rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Awards breakdown</h3>
                        <p className="mt-1 text-sm text-gray-400">
                          Fill one row per award with text like `4 / 5` or `4 / 5 - strong evidence`.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addBreakdownRow}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:border-emerald-500 hover:text-white"
                      >
                        Add row
                      </button>
                    </div>

                    <div className="space-y-3">
                      {draft.awardsBreakdown.map((row) => (
                        <div key={row.id} className="grid gap-3 md:grid-cols-[1fr_1.6fr_auto]">
                          <input
                            value={row.name}
                            onChange={(e) => updateBreakdownRow(row.id, "name", e.target.value)}
                            placeholder="Award name"
                            className="rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                          <input
                            value={row.value}
                            onChange={(e) => updateBreakdownRow(row.id, "value", e.target.value)}
                            placeholder="e.g. 4 / 5 - strong documentation"
                            className="rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeBreakdownRow(row.id)}
                            className="rounded-xl border border-red-400/20 px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/10"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-3">
                    <label className="block rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-300">
                      Strengths
                      <span className="mt-1 block text-xs text-gray-500">
                        One bullet per line.
                      </span>
                      <textarea
                        value={draft.strengthsText}
                        onChange={(e) => updateDraftValue("strengthsText", e.target.value)}
                        rows={9}
                        className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </label>

                    <label className="block rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-300">
                      Weaknesses
                      <span className="mt-1 block text-xs text-gray-500">
                        One bullet per line.
                      </span>
                      <textarea
                        value={draft.weaknessesText}
                        onChange={(e) => updateDraftValue("weaknessesText", e.target.value)}
                        rows={9}
                        className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </label>

                    <label className="block rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-300">
                      Improvements
                      <span className="mt-1 block text-xs text-gray-500">
                        One bullet per line.
                      </span>
                      <textarea
                        value={draft.improvementsText}
                        onChange={(e) => updateDraftValue("improvementsText", e.target.value)}
                        rows={9}
                        className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </label>
                  </div>
                </div>
              )}
            </section>
          </section>
        )}
      </div>
    </main>
  );
}

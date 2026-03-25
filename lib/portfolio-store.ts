import "server-only";

import { promises as fs } from "fs";
import path from "path";

import staticPortfolios from "@/data/portfolios";
import type {
  PortfolioBreakdown,
  PortfolioRecord,
  PortfolioReviewInput,
  SubmissionRecord,
} from "@/lib/portfolio-types";

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(process.cwd(), "public", "uploads", "portfolios");
const submissionsFile = path.join(dataDir, "submissions.json");
const approvedPortfoliosFile = path.join(dataDir, "approved-portfolios.json");

export const ADMIN_PASSWORD = "29292RSX";
const MAX_PDF_SIZE_BYTES = 500 * 1024 * 1024;

type SubmissionInput = {
  teamName: string;
  teamNumber: number;
  country: string;
  season: string;
  level: string;
  eventName: string;
  email: string;
  fileName: string;
  fileBuffer: Buffer;
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });

  await Promise.all([
    ensureJsonFile(submissionsFile),
    ensureJsonFile(approvedPortfoliosFile),
  ]);
}

async function ensureJsonFile(filePath: string) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
}

async function readJsonFile<T>(filePath: string): Promise<T[]> {
  await ensureStore();

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(filePath: string, value: T[]) {
  await ensureStore();
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sanitizeName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

function cleanOptionalString(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanBreakdowns(
  breakdowns?: PortfolioBreakdown[]
): PortfolioBreakdown[] | undefined {
  const cleaned =
    breakdowns
      ?.map(([name, value]) => [name.trim(), value.trim()] as PortfolioBreakdown)
      .filter(([name, value]) => Boolean(name && value)) ?? [];

  return cleaned.length > 0 ? cleaned : undefined;
}

function cleanTextList(values?: string[]) {
  const cleaned = values?.map((value) => value.trim()).filter(Boolean) ?? [];
  return cleaned.length > 0 ? cleaned : undefined;
}

function applyReviewInput(
  portfolio: PortfolioRecord,
  review: PortfolioReviewInput
): PortfolioRecord {
  return {
    ...portfolio,
    teamName: review.teamName.trim(),
    teamNumber: review.teamNumber,
    country: review.country.trim(),
    season: review.season.trim(),
    level: review.level.trim(),
    eventName: cleanOptionalString(review.eventName),
    award: review.award.trim(),
    stars: review.stars.trim(),
    score: cleanOptionalString(review.score),
    summary: cleanOptionalString(review.summary),
    awardsBreakdown: cleanBreakdowns(review.awardsBreakdown),
    strengths: cleanTextList(review.strengths),
    weaknesses: cleanTextList(review.weaknesses),
    improvements: cleanTextList(review.improvements),
  };
}

function createPublicPortfolio(
  submission: SubmissionRecord,
  review: PortfolioReviewInput
): PortfolioRecord {
  return applyReviewInput(
    {
      id: submission.id,
      teamName: submission.teamName,
      teamNumber: submission.teamNumber,
      country: submission.country,
      season: submission.season,
      level: submission.level,
      stars: "New submission",
      award: submission.eventName,
      pdf: submission.pdfUrl,
      source: "Community submission",
      eventName: submission.eventName,
      summary: `Approved community portfolio submitted for ${submission.eventName}.`,
    },
    review
  );
}

export function getMaxPdfSizeBytes() {
  return MAX_PDF_SIZE_BYTES;
}

export async function getPendingSubmissions() {
  const submissions = await readJsonFile<SubmissionRecord>(submissionsFile);
  return submissions.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getApprovedPortfolios() {
  const approved = await readJsonFile<PortfolioRecord>(approvedPortfoliosFile);
  return approved;
}

export async function getPublishedPortfolios() {
  const approved = await getApprovedPortfolios();
  return [...approved, ...(staticPortfolios as PortfolioRecord[])];
}

export async function createSubmission(input: SubmissionInput) {
  await ensureStore();

  const id = crypto.randomUUID();
  const safeName = sanitizeName(input.fileName || `${id}.pdf`);
  const finalFileName = `${id}-${safeName.toLowerCase().endsWith(".pdf") ? safeName : `${safeName}.pdf`}`;
  const diskPath = path.join(uploadsDir, finalFileName);

  await fs.writeFile(diskPath, input.fileBuffer);

  const submission: SubmissionRecord = {
    id,
    teamName: input.teamName,
    teamNumber: input.teamNumber,
    country: input.country,
    season: input.season,
    level: input.level,
    eventName: input.eventName,
    email: input.email,
    pdfUrl: `/uploads/portfolios/${finalFileName}`,
    pdfPath: diskPath,
    originalFileName: input.fileName,
    submittedAt: new Date().toISOString(),
  };

  const submissions = await getPendingSubmissions();
  submissions.unshift(submission);
  await writeJsonFile(submissionsFile, submissions);

  return submission;
}

export async function approveSubmission(
  submissionId: string,
  review: PortfolioReviewInput
) {
  const submissions = await getPendingSubmissions();
  const submission = submissions.find((item) => item.id === submissionId);

  if (!submission) {
    throw new Error("Submission not found.");
  }

  const remaining = submissions.filter((item) => item.id !== submissionId);
  const approved = await getApprovedPortfolios();
  const publicPortfolio = createPublicPortfolio(submission, review);

  await writeJsonFile(submissionsFile, remaining);
  await writeJsonFile(approvedPortfoliosFile, [publicPortfolio, ...approved]);

  return publicPortfolio;
}

export async function updateApprovedPortfolio(
  portfolioId: string,
  review: PortfolioReviewInput
) {
  const approved = await getApprovedPortfolios();
  const portfolioIndex = approved.findIndex((item) => item.id === portfolioId);

  if (portfolioIndex === -1) {
    throw new Error("Published portfolio not found.");
  }

  const currentPortfolio = approved[portfolioIndex];
  const updatedPortfolio = applyReviewInput(currentPortfolio, review);
  const nextApproved = [...approved];
  nextApproved[portfolioIndex] = updatedPortfolio;

  await writeJsonFile(approvedPortfoliosFile, nextApproved);

  return updatedPortfolio;
}

export async function deleteApprovedPortfolio(portfolioId: string) {
  const approved = await getApprovedPortfolios();
  const portfolio = approved.find((item) => item.id === portfolioId);

  if (!portfolio) {
    throw new Error("Published portfolio not found.");
  }

  const nextApproved = approved.filter((item) => item.id !== portfolioId);
  await writeJsonFile(approvedPortfoliosFile, nextApproved);

  if (portfolio.pdf.startsWith("/uploads/portfolios/")) {
    const relativePdfPath = portfolio.pdf.replace(/^\//, "");
    const diskPath = path.join(process.cwd(), "public", relativePdfPath);

    try {
      await fs.unlink(diskPath);
    } catch {
      // Ignore missing files during cleanup.
    }
  }

  return portfolio;
}

export async function rejectSubmission(submissionId: string) {
  const submissions = await getPendingSubmissions();
  const submission = submissions.find((item) => item.id === submissionId);

  if (!submission) {
    throw new Error("Submission not found.");
  }

  const remaining = submissions.filter((item) => item.id !== submissionId);
  await writeJsonFile(submissionsFile, remaining);

  try {
    await fs.unlink(submission.pdfPath);
  } catch {
    // Ignore missing files during cleanup.
  }

  return submission;
}

import "server-only";

import { del, get, put } from "@vercel/blob";
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
const blobPrefix = "portfoliolab";
const submissionsBlobPath = `${blobPrefix}/submissions.json`;
const approvedPortfoliosBlobPath = `${blobPrefix}/approved-portfolios.json`;
const uploadsBlobPrefix = `${blobPrefix}/uploads`;

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

function getStorageMode() {
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
}

function assertProductionUploadsConfigured() {
  if (getStorageMode() === "local" && process.env.VERCEL === "1") {
    throw new Error(
      "Uploads are not configured in production yet. Connect a Vercel Blob store to enable portfolio submissions."
    );
  }
}

async function ensureJsonFile(filePath: string) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
}

function isMissingFileError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

function isBlobUrl(value: string) {
  try {
    return new URL(value).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

async function readLocalJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }

    return [];
  }
}

async function readBlobJsonFile<T>(
  blobPath: string,
  fallbackFilePath: string
): Promise<T[]> {
  try {
    const result = await get(blobPath, {
      access: "private",
      useCache: false,
    });

    if (!result || result.statusCode !== 200) {
      return readLocalJsonFile<T>(fallbackFilePath);
    }

    const raw = await new Response(result.stream).text();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return readLocalJsonFile<T>(fallbackFilePath);
  }
}

async function readJsonFile<T>(
  filePath: string,
  blobPath: string
): Promise<T[]> {
  if (getStorageMode() === "blob") {
    return readBlobJsonFile<T>(blobPath, filePath);
  }

  return readLocalJsonFile<T>(filePath);
}

async function writeJsonFile<T>(
  filePath: string,
  blobPath: string,
  value: T[]
) {
  const payload = `${JSON.stringify(value, null, 2)}\n`;

  if (getStorageMode() === "blob") {
    await put(blobPath, payload, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  await ensureStore();
  await fs.writeFile(filePath, payload, "utf8");
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

function createPortfolioPdfUrl(id: string) {
  return `/api/portfolio-files/${id}.pdf`;
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
      pdf: createPortfolioPdfUrl(submission.id),
      pdfStoragePath: submission.pdfPath,
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
  const submissions = await readJsonFile<SubmissionRecord>(
    submissionsFile,
    submissionsBlobPath
  );
  return submissions.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getApprovedPortfolios() {
  const approved = await readJsonFile<PortfolioRecord>(
    approvedPortfoliosFile,
    approvedPortfoliosBlobPath
  );
  return approved;
}

export async function getPublishedPortfolios() {
  const approved = await getApprovedPortfolios();
  return [...approved, ...(staticPortfolios as PortfolioRecord[])];
}

export async function createSubmission(input: SubmissionInput) {
  assertProductionUploadsConfigured();

  const id = crypto.randomUUID();
  const safeName = sanitizeName(input.fileName || `${id}.pdf`);
  const finalFileName = `${id}-${safeName.toLowerCase().endsWith(".pdf") ? safeName : `${safeName}.pdf`}`;
  let pdfUrl = "";
  let pdfPath = "";

  if (getStorageMode() === "blob") {
    const uploadedPdf = await put(`${uploadsBlobPrefix}/${finalFileName}`, input.fileBuffer, {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/pdf",
      multipart: input.fileBuffer.length > 5 * 1024 * 1024,
    });
    pdfUrl = createPortfolioPdfUrl(id);
    pdfPath = uploadedPdf.url;
  } else {
    await ensureStore();
    const diskPath = path.join(uploadsDir, finalFileName);
    await fs.writeFile(diskPath, input.fileBuffer);
    pdfUrl = createPortfolioPdfUrl(id);
    pdfPath = diskPath;
  }

  const submission: SubmissionRecord = {
    id,
    teamName: input.teamName,
    teamNumber: input.teamNumber,
    country: input.country,
    season: input.season,
    level: input.level,
    eventName: input.eventName,
    email: input.email,
    pdfUrl,
    pdfPath,
    originalFileName: input.fileName,
    submittedAt: new Date().toISOString(),
  };

  const submissions = await getPendingSubmissions();
  submissions.unshift(submission);
  await writeJsonFile(submissionsFile, submissionsBlobPath, submissions);

  return submission;
}

export async function approveSubmission(
  submissionId: string,
  review: PortfolioReviewInput
) {
  assertProductionUploadsConfigured();
  const submissions = await getPendingSubmissions();
  const submission = submissions.find((item) => item.id === submissionId);

  if (!submission) {
    throw new Error("Submission not found.");
  }

  const remaining = submissions.filter((item) => item.id !== submissionId);
  const approved = await getApprovedPortfolios();
  const publicPortfolio = createPublicPortfolio(submission, review);

  await writeJsonFile(submissionsFile, submissionsBlobPath, remaining);
  await writeJsonFile(approvedPortfoliosFile, approvedPortfoliosBlobPath, [
    publicPortfolio,
    ...approved,
  ]);

  return publicPortfolio;
}

export async function updateApprovedPortfolio(
  portfolioId: string,
  review: PortfolioReviewInput
) {
  assertProductionUploadsConfigured();
  const approved = await getApprovedPortfolios();
  const portfolioIndex = approved.findIndex((item) => item.id === portfolioId);

  if (portfolioIndex === -1) {
    throw new Error("Published portfolio not found.");
  }

  const currentPortfolio = approved[portfolioIndex];
  const updatedPortfolio = applyReviewInput(currentPortfolio, review);
  const nextApproved = [...approved];
  nextApproved[portfolioIndex] = updatedPortfolio;

  await writeJsonFile(
    approvedPortfoliosFile,
    approvedPortfoliosBlobPath,
    nextApproved
  );

  return updatedPortfolio;
}

export async function deleteApprovedPortfolio(portfolioId: string) {
  assertProductionUploadsConfigured();
  const approved = await getApprovedPortfolios();
  const portfolio = approved.find((item) => item.id === portfolioId);

  if (!portfolio) {
    throw new Error("Published portfolio not found.");
  }

  const nextApproved = approved.filter((item) => item.id !== portfolioId);
  await writeJsonFile(
    approvedPortfoliosFile,
    approvedPortfoliosBlobPath,
    nextApproved
  );

  const storedPdfPath = portfolio.pdfStoragePath ?? portfolio.pdf;

  if (isBlobUrl(storedPdfPath)) {
    try {
      await del(storedPdfPath);
    } catch {
      // Ignore missing files during cleanup.
    }
  } else if (storedPdfPath && !storedPdfPath.startsWith("http")) {
    try {
      await fs.unlink(storedPdfPath);
    } catch {
      // Ignore missing files during cleanup.
    }
  }

  return portfolio;
}

export async function rejectSubmission(submissionId: string) {
  assertProductionUploadsConfigured();
  const submissions = await getPendingSubmissions();
  const submission = submissions.find((item) => item.id === submissionId);

  if (!submission) {
    throw new Error("Submission not found.");
  }

  const remaining = submissions.filter((item) => item.id !== submissionId);
  await writeJsonFile(submissionsFile, submissionsBlobPath, remaining);

  if (isBlobUrl(submission.pdfPath)) {
    try {
      await del(submission.pdfPath);
    } catch {
      // Ignore missing files during cleanup.
    }
  } else {
    try {
      await fs.unlink(submission.pdfPath);
    } catch {
      // Ignore missing files during cleanup.
    }
  }

  return submission;
}

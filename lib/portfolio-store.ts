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

export const ADMIN_PASSWORD = "29292RSX";

type SubmissionInput = {
  program?: string;
  teamName: string;
  teamNumber: number;
  country: string;
  season: string;
  level: string;
  eventName: string;
  email: string;
  portfolioUrl: string;
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
  if (process.env.SUPABASE_URL || process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return "supabase";
  }

  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
}

function assertProductionStoreConfigured() {
  if (getStorageMode() === "local" && process.env.VERCEL === "1") {
    throw new Error(
      "Submissions are not configured in production. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or configure Vercel Blob."
    );
  }
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured."
    );
  }

  return { url: url.replace(/\/+$/, ""), serviceRoleKey };
}

function getSupabaseTableUrl(query: Record<string, string>) {
  const { url } = getSupabaseConfig();
  const tableUrl = new URL(`${url}/rest/v1/portfolio_store`);
  for (const [key, value] of Object.entries(query)) {
    tableUrl.searchParams.set(key, value);
  }
  return tableUrl;
}

function getSupabaseHeaders() {
  const { serviceRoleKey } = getSupabaseConfig();
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
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
  let result;
  try {
    result = await get(blobPath, {
      access: "private",
      useCache: false,
    });
  } catch (error) {
    console.error(
      `Could not read Vercel Blob data at ${blobPath}; using local data instead.`,
      error
    );
    return readLocalJsonFile<T>(fallbackFilePath);
  }

  if (!result || result.statusCode !== 200) {
    return readLocalJsonFile<T>(fallbackFilePath);
  }

  const raw = await new Response(result.stream).text();
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Stored data at ${blobPath} is not a valid list.`);
  }
  return parsed as T[];
}

async function readSupabaseJsonFile<T>(
  blobPath: string,
  fallbackFilePath: string
): Promise<T[]> {
  const response = await fetch(
    getSupabaseTableUrl({
      key: `eq.${blobPath}`,
      select: "value",
      limit: "1",
    }),
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Supabase storage read failed (${response.status}). Check the portfolio_store table and Supabase configuration.`
    );
  }

  const rows = (await response.json()) as Array<{ value: unknown }>;
  if (rows.length > 0) {
    if (!Array.isArray(rows[0].value)) {
      throw new Error(`Supabase data at ${blobPath} is not a valid list.`);
    }
    return rows[0].value as T[];
  }

  let legacyData: T[];
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      legacyData = await readBlobJsonFile<T>(blobPath, fallbackFilePath);
    } catch (error) {
      console.error(
        `Could not import legacy Vercel Blob data at ${blobPath}; initializing Supabase from local data instead.`,
        error
      );
      legacyData = await readLocalJsonFile<T>(fallbackFilePath);
    }
  } else {
    legacyData = await readLocalJsonFile<T>(fallbackFilePath);
  }
  await writeSupabaseJsonFile(blobPath, legacyData);
  return legacyData;
}

async function writeSupabaseJsonFile<T>(blobPath: string, value: T[]) {
  const response = await fetch(
    getSupabaseTableUrl({ on_conflict: "key" }),
    {
      method: "POST",
      headers: {
        ...getSupabaseHeaders(),
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ key: blobPath, value }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Supabase storage write failed (${response.status}). Check the portfolio_store table and Supabase configuration.`
    );
  }
}

async function readJsonFile<T>(
  filePath: string,
  blobPath: string
): Promise<T[]> {
  if (getStorageMode() === "supabase") {
    return readSupabaseJsonFile<T>(blobPath, filePath);
  }

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

  if (getStorageMode() === "supabase") {
    await writeSupabaseJsonFile(blobPath, value);
    return;
  }

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
    program: review.program?.trim() || "FTC",
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
      program: submission.program || "FTC",
      teamName: submission.teamName,
      teamNumber: submission.teamNumber,
      country: submission.country,
      season: submission.season,
      level: submission.level,
      stars: "New submission",
      award: submission.eventName,
      pdf: submission.portfolioUrl || submission.pdfUrl || createPortfolioPdfUrl(submission.id),
      pdfStoragePath: submission.pdfPath,
      source: "Community submission",
      eventName: submission.eventName,
      summary: `Approved community portfolio submitted for ${submission.eventName}.`,
    },
    review
  );
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
  assertProductionStoreConfigured();

  const id = crypto.randomUUID();

  const submission: SubmissionRecord = {
    id,
    program: input.program || "FTC",
    teamName: input.teamName,
    teamNumber: input.teamNumber,
    country: input.country,
    season: input.season,
    level: input.level,
    eventName: input.eventName,
    email: input.email,
    pdfUrl: input.portfolioUrl,
    portfolioUrl: input.portfolioUrl,
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
  assertProductionStoreConfigured();
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
  assertProductionStoreConfigured();
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
  assertProductionStoreConfigured();
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
  assertProductionStoreConfigured();
  const submissions = await getPendingSubmissions();
  const submission = submissions.find((item) => item.id === submissionId);

  if (!submission) {
    throw new Error("Submission not found.");
  }

  const remaining = submissions.filter((item) => item.id !== submissionId);
  await writeJsonFile(submissionsFile, submissionsBlobPath, remaining);

  if (submission.pdfPath && isBlobUrl(submission.pdfPath)) {
    try {
      await del(submission.pdfPath);
    } catch {
      // Ignore missing files during cleanup.
    }
  } else if (submission.pdfPath && !submission.pdfPath.startsWith("http")) {
    try {
      await fs.unlink(submission.pdfPath);
    } catch {
      // Ignore missing files during cleanup.
    }
  }

  return submission;
}
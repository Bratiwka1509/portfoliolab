import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";

import {
  getApprovedPortfolios,
  getPendingSubmissions,
} from "@/lib/portfolio-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeFileId(fileId: string) {
  return fileId.toLowerCase().endsWith(".pdf") ? fileId.slice(0, -4) : fileId;
}

function isBlobUrl(value: string) {
  try {
    return new URL(value).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await context.params;
  const id = normalizeFileId(fileId);

  const [approvedPortfolios, pendingSubmissions] = await Promise.all([
    getApprovedPortfolios(),
    getPendingSubmissions(),
  ]);

  const approvedPortfolio = approvedPortfolios.find((portfolio) => portfolio.id === id);
  const pendingSubmission = pendingSubmissions.find((submission) => submission.id === id);
  const storagePath = approvedPortfolio?.pdfStoragePath ?? pendingSubmission?.pdfPath ?? "";
  const publicUrl = approvedPortfolio?.pdf ?? pendingSubmission?.pdfUrl ?? "";

  if (!storagePath && !publicUrl) {
    return NextResponse.json({ error: "Portfolio file not found." }, { status: 404 });
  }

  if (isBlobUrl(storagePath)) {
    const blobResult = await get(storagePath, {
      access: "private",
      useCache: true,
    });

    if (!blobResult || blobResult.statusCode !== 200) {
      return NextResponse.json({ error: "Portfolio file not found." }, { status: 404 });
    }

    return new Response(blobResult.stream, {
      headers: {
        "Content-Type": blobResult.blob.contentType || "application/pdf",
        "Content-Disposition": 'inline; filename="portfolio.pdf"',
      },
    });
  }

  if (storagePath && !storagePath.startsWith("http")) {
    try {
      const fileBuffer = await fs.readFile(storagePath);
      return new Response(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="portfolio.pdf"',
        },
      });
    } catch {
      return NextResponse.json({ error: "Portfolio file not found." }, { status: 404 });
    }
  }

  if (publicUrl) {
    const redirectUrl = new URL(publicUrl, req.url);
    if (redirectUrl.href !== req.url) {
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.json({ error: "Portfolio file not found." }, { status: 404 });
}

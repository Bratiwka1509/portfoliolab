import { NextResponse } from "next/server";

import {
  ADMIN_PASSWORD,
  approveSubmission,
  deleteApprovedPortfolio,
  getApprovedPortfolios,
  getPendingSubmissions,
  rejectSubmission,
  updateApprovedPortfolio,
} from "@/lib/portfolio-store";
import type {
  AdminPortfoliosResponse,
  PortfolioBreakdown,
  PortfolioReviewInput,
} from "@/lib/portfolio-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: Request) {
  const password = req.headers.get("x-admin-password");
  return password === ADMIN_PASSWORD;
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function getBreakdowns(value: unknown): PortfolioBreakdown[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!Array.isArray(item) || item.length < 2) {
        return null;
      }

      const name = getString(item[0]);
      const description = getString(item[1]);
      if (!name || !description) {
        return null;
      }

      return [name, description] as PortfolioBreakdown;
    })
    .filter((item): item is PortfolioBreakdown => Boolean(item));
}

function parseReviewInput(raw: unknown): PortfolioReviewInput | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const input = raw as Record<string, unknown>;
  const teamName = getString(input.teamName);
  const teamNumber = Number(input.teamNumber);
  const country = getString(input.country);
  const season = getString(input.season);
  const level = getString(input.level);
  const award = getString(input.award);
  const stars = getString(input.stars);

  if (
    !teamName ||
    !Number.isFinite(teamNumber) ||
    !country ||
    !season ||
    !level ||
    !award ||
    !stars
  ) {
    return null;
  }

  return {
    teamName,
    teamNumber,
    country,
    season,
    level,
    eventName: getString(input.eventName) || undefined,
    award,
    stars,
    score: getString(input.score) || undefined,
    summary: getString(input.summary) || undefined,
    awardsBreakdown: getBreakdowns(input.awardsBreakdown),
    strengths: getStringArray(input.strengths),
    weaknesses: getStringArray(input.weaknesses),
    improvements: getStringArray(input.improvements),
  };
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const [pendingSubmissions, approvedPortfolios] = await Promise.all([
    getPendingSubmissions(),
    getApprovedPortfolios(),
  ]);

  const response: AdminPortfoliosResponse = {
    pendingSubmissions,
    approvedPortfolios,
  };

  return NextResponse.json(response);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const submissionId =
      typeof body?.submissionId === "string" ? body.submissionId : "";
    const portfolioId =
      typeof body?.portfolioId === "string" ? body.portfolioId : "";
    const action = typeof body?.action === "string" ? body.action : "";
    const review = parseReviewInput(body?.portfolio);

    if (action === "approve") {
      if (!submissionId || !review) {
        return NextResponse.json(
          { error: "Invalid approval payload." },
          { status: 400 }
        );
      }

      const approvedPortfolio = await approveSubmission(submissionId, review);
      return NextResponse.json({ ok: true, approvedPortfolio });
    }

    if (action === "reject") {
      if (!submissionId) {
        return NextResponse.json(
          { error: "Invalid admin action." },
          { status: 400 }
        );
      }

      const rejectedSubmission = await rejectSubmission(submissionId);
      return NextResponse.json({ ok: true, rejectedSubmission });
    }

    if (action === "updatePublished") {
      if (!portfolioId || !review) {
        return NextResponse.json(
          { error: "Invalid published portfolio payload." },
          { status: 400 }
        );
      }

      const updatedPortfolio = await updateApprovedPortfolio(portfolioId, review);
      return NextResponse.json({ ok: true, updatedPortfolio });
    }

    if (action === "deletePublished") {
      if (!portfolioId) {
        return NextResponse.json(
          { error: "Invalid published portfolio delete payload." },
          { status: 400 }
        );
      }

      const deletedPortfolio = await deleteApprovedPortfolio(portfolioId);
      return NextResponse.json({ ok: true, deletedPortfolio });
    }

    if (!action) {
      return NextResponse.json(
        { error: "Invalid admin action." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unknown admin action." },
      { status: 400 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Admin action failed.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluatePortfolio } from "@/lib/portai";

export const runtime = "nodejs";

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  const body = await _req.json().catch(() => null);

  const status = body?.status ? String(body.status) : null;
  const adminNote = body?.adminNote != null ? String(body.adminNote) : undefined;

  const allowed: SubmissionStatus[] = ["PENDING", "APPROVED", "REJECTED"];
  const parsedStatus = status ? allowed.find((s) => s === status) : null;
  if (status && !parsedStatus) {
    return NextResponse.json({ error: "Bad status" }, { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const submission = await tx.portfolioSubmission.findUnique({ where: { id } });
    if (!submission) throw new Error("not_found");

    const nextSubmission = await tx.portfolioSubmission.update({
      where: { id },
      data: {
        ...(parsedStatus ? { status: parsedStatus } : {}),
        ...(adminNote !== undefined ? { adminNote } : {}),
      },
    });

    if (parsedStatus === "APPROVED") {
      const evaluation = evaluatePortfolio({
        teamName: submission.teamName,
        teamNumber: submission.teamNumber,
        season: submission.season,
        level: submission.level,
        country: submission.country,
        eventName: submission.eventName,
        pdfUrl: submission.pdfUrl,
      });

      const portfolio = submission.publishedPortfolioId
        ? await tx.portfolio.update({
            where: { id: submission.publishedPortfolioId },
            data: {
              teamName: submission.teamName,
              teamNumber: submission.teamNumber,
              country: submission.country,
              season: submission.season,
              level: submission.level,
              eventName: submission.eventName,
              coverUrl: submission.coverUrl,
              pdfUrl: submission.pdfUrl,
              aiEvaluation: evaluation,
            },
          })
        : await tx.portfolio.create({
            data: {
              teamName: submission.teamName,
              teamNumber: submission.teamNumber,
              country: submission.country,
              season: submission.season,
              level: submission.level,
              eventName: submission.eventName,
              coverUrl: submission.coverUrl,
              pdfUrl: submission.pdfUrl,
              aiEvaluation: evaluation,
              submission: { connect: { id: submission.id } },
            },
          });

      if (!submission.publishedPortfolioId) {
        await tx.portfolioSubmission.update({
          where: { id: submission.id },
          data: { publishedPortfolioId: portfolio.id },
        });
      }
    }

    return nextSubmission;
  });

  return NextResponse.json(updated);
}


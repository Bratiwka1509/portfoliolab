import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, bannedAt: true },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.bannedAt) return NextResponse.json({ error: "Banned" }, { status: 403 });

  const submissions = await prisma.portfolioSubmission.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, bannedAt: true },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.bannedAt) return NextResponse.json({ error: "Banned" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const teamName = String(body?.teamName ?? "").trim();
  const teamNumber = Number(body?.teamNumber);
  const country = body?.country ? String(body.country).trim() : null;
  const season = body?.season ? String(body.season).trim() : null;
  const level = body?.level ? String(body.level).trim() : null;
  const eventName = body?.eventName ? String(body.eventName).trim() : null;
  const contactEmail = body?.contactEmail ? String(body.contactEmail).trim() : null;
  const coverUrl = body?.coverUrl ? String(body.coverUrl).trim() : null;
  const pdfUrl = String(body?.pdfUrl ?? "").trim();

  if (!teamName || !Number.isFinite(teamNumber) || teamNumber <= 0 || !pdfUrl) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const created = await prisma.portfolioSubmission.create({
    data: {
      teamName,
      teamNumber,
      country,
      season,
      level,
      eventName,
      contactEmail,
      coverUrl,
      pdfUrl,
      authorId: user.id,
    },
  });

  return NextResponse.json(created, { status: 201 });
}


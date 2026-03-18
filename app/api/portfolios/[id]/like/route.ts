import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, bannedAt: true },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.bannedAt) return NextResponse.json({ error: "Banned" }, { status: 403 });

  const portfolioId = params.id;

  const existing = await prisma.portfolioLike.findUnique({
    where: { userId_portfolioId: { userId: user.id, portfolioId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.portfolioLike.delete({ where: { id: existing.id } }),
      prisma.portfolio.update({
        where: { id: portfolioId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.portfolioLike.create({ data: { userId: user.id, portfolioId } }),
      prisma.portfolio.update({
        where: { id: portfolioId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);
  }

  const likesCount = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
    select: { likesCount: true },
  });

  return NextResponse.json({
    liked: !existing,
    likesCount: likesCount?.likesCount ?? 0,
  });
}


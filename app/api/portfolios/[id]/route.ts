import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ?? null;
  const user = userEmail
    ? await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true, bannedAt: true },
      })
    : null;

  const portfolio = await prisma.portfolio.findUnique({
    where: { id },
    include: {
      comments: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
        take: 100,
      },
    },
  });

  if (!portfolio) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const likedByMe = user?.id
    ? (await prisma.portfolioLike.findUnique({
        where: { userId_portfolioId: { userId: user.id, portfolioId: id } },
        select: { id: true },
      })) != null
    : false;

  return NextResponse.json({ portfolio, likedByMe });
}


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, bannedAt: true, name: true, email: true },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.bannedAt) return NextResponse.json({ error: "Banned" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const text = String(body?.text ?? "").trim();
  if (!text || text.length < 2) {
    return NextResponse.json({ error: "Comment too short." }, { status: 400 });
  }
  if (text.length > 1000) {
    return NextResponse.json({ error: "Comment too long." }, { status: 400 });
  }

  const portfolioId = params.id;

  const created = await prisma.portfolioComment.create({
    data: { userId: user.id, portfolioId, text },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(created, { status: 201 });
}


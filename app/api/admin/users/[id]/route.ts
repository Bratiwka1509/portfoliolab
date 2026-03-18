import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const banned = body?.banned;
  if (typeof banned !== "boolean") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { bannedAt: banned ? new Date() : null },
    select: { id: true, bannedAt: true },
  });

  return NextResponse.json(updated);
}


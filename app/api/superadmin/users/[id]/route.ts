import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Role = "USER" | "ADMIN" | "SUPERADMIN";

const SUPERADMIN_EMAIL = "aidarbahytov200309@gmail.com";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  const email = session?.user?.email ?? "";
  if (role !== "SUPERADMIN" || email.toLowerCase() !== SUPERADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const nextRole = String(body?.role ?? "").toUpperCase() as Role;
  if (nextRole !== "USER" && nextRole !== "ADMIN") {
    return NextResponse.json({ error: "Bad role" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id: params.id },
    select: { email: true, role: true },
  });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (target.email.toLowerCase() === SUPERADMIN_EMAIL) {
    return NextResponse.json({ error: "Cannot change superadmin." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { role: nextRole },
    select: { id: true, role: true },
  });

  return NextResponse.json(updated);
}


import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const SUPERADMIN_EMAIL = "aidarbahytov200309@gmail.com";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").toLowerCase().trim();
  const password = String(body?.password ?? "");
  const name = String(body?.name ?? "").trim() || null;

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Invalid email or password (min 6 chars)." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already used." }, { status: 409 });
  }

  const isSuperadmin = email === SUPERADMIN_EMAIL;
  const shouldBeAdmin = (await prisma.user.count({ where: { role: "ADMIN" } })) === 0;
  const role = isSuperadmin ? "SUPERADMIN" : shouldBeAdmin ? "ADMIN" : "USER";

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role,
    },
  });

  return NextResponse.json({ ok: true });
}


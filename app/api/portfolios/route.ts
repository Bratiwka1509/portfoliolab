import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Sort = "newest" | "oldest" | "popular";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = (searchParams.get("sort") || "newest") as Sort;

  const orderBy =
    sort === "oldest"
      ? [{ createdAt: "asc" as const }]
      : sort === "popular"
      ? [{ likesCount: "desc" as const }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }];

  const items = await prisma.portfolio.findMany({
    orderBy,
    select: {
      id: true,
      teamName: true,
      teamNumber: true,
      country: true,
      season: true,
      level: true,
      eventName: true,
      coverUrl: true,
      pdfUrl: true,
      likesCount: true,
      createdAt: true,
    },
    take: 200,
  });

  return NextResponse.json(items);
}


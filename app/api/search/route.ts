import { NextResponse } from "next/server";
import portfolios from "@/data/portfolios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  const results = portfolios
    .filter((p) => {
      return (
        p.teamName.toLowerCase().includes(q) ||
        String(p.teamNumber).includes(q) ||
        p.country?.toLowerCase().includes(q)
      );
    })
    .slice(0, 11)
    .map((p) => ({
      id: p.id,
      teamName: p.teamName,
      teamNumber: p.teamNumber,
      country: p.country,
    }));

  return NextResponse.json(results);
}

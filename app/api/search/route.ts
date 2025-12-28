import { NextResponse } from "next/server";
import portfolios from "@/data/portfolios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  if (!q) {
    return NextResponse.json([]);
  }

  const results = portfolios
    .filter((p) => {
      const teamName = p.teamName.toLowerCase();
      const teamNumber = String(p.teamNumber);
      const country = p.country?.toLowerCase() ?? "";

      return (
        teamName.includes(q) ||
        teamNumber.includes(q) ||
        country.includes(q)
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

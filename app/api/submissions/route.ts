import { NextResponse } from "next/server";

import { createSubmission, getMaxPdfSizeBytes } from "@/lib/portfolio-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const teamName = getRequiredString(formData, "team_name");
    const teamNumberRaw = getRequiredString(formData, "team_number");
    const country = getRequiredString(formData, "country");
    const season = getRequiredString(formData, "season");
    const level = getRequiredString(formData, "level");
    const otherLevel = getRequiredString(formData, "other_level");
    const eventName = getRequiredString(formData, "event_name");
    const email = getRequiredString(formData, "email");
    const portfolioFile = formData.get("portfolio_file");

    if (
      !teamName ||
      !teamNumberRaw ||
      !country ||
      !season ||
      !level ||
      !eventName ||
      !email ||
      !(portfolioFile instanceof File)
    ) {
      return NextResponse.json(
        { error: "Please fill out all fields and upload a PDF." },
        { status: 400 }
      );
    }

    if (!isPdf(portfolioFile)) {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    if (portfolioFile.size > getMaxPdfSizeBytes()) {
      return NextResponse.json(
        { error: "PDF is too large. Maximum size is 500 MB." },
        { status: 400 }
      );
    }

    const teamNumber = Number(teamNumberRaw);
    if (!Number.isFinite(teamNumber)) {
      return NextResponse.json(
        { error: "Team number must be numeric." },
        { status: 400 }
      );
    }

    const arrayBuffer = await portfolioFile.arrayBuffer();
    await createSubmission({
      teamName,
      teamNumber,
      country,
      season,
      level: level === "Other" ? otherLevel || "Other" : level,
      eventName,
      email,
      fileName: portfolioFile.name,
      fileBuffer: Buffer.from(arrayBuffer),
    });

    return NextResponse.json({
      ok: true,
      message: "Portfolio uploaded successfully and is waiting for admin approval.",
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

import { createSubmission } from "@/lib/portfolio-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidPortfolioUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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
    const portfolioUrl = getRequiredString(formData, "portfolio_url");

    if (
      !teamName ||
      !teamNumberRaw ||
      !country ||
      !season ||
      !level ||
      !eventName ||
      !email ||
      !portfolioUrl
    ) {
      return NextResponse.json(
        { error: "Please fill out all fields and add a portfolio link." },
        { status: 400 }
      );
    }

    if (!isValidPortfolioUrl(portfolioUrl)) {
      return NextResponse.json(
        { error: "Please enter a valid link starting with http:// or https://." },
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

    await createSubmission({
      teamName,
      teamNumber,
      country,
      season,
      level: level === "Other" ? otherLevel || "Other" : level,
      eventName,
      email,
      portfolioUrl,
    });

    return NextResponse.json({
      ok: true,
      message: "Portfolio submitted successfully and is waiting for admin approval.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Upload failed. Please try again.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

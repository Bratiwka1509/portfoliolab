import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | Admin Mode Redirect",
  description: "Redirects legacy admin review route to admin mode.",
};

export const dynamic = "force-dynamic";

export default function ReviewPage() {
  redirect("/adminmode");
}

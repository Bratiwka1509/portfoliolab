import type { Metadata } from "next";

import ReviewClient from "../review-29292rsx/ReviewClient";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | Admin Mode",
  description: "Private admin page for submitted portfolios.",
};

export const dynamic = "force-dynamic";

export default function AdminModePage() {
  return <ReviewClient />;
}

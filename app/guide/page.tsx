import type { Metadata } from "next";
import SubmitClient from "./SubmitClient";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | Guide & Reviews",
  description: "Learn how to create a strong FTC engineering portfolio with clear structure, examples, and official judging guidance.",
};

export default function SubmitPage() {
  return <SubmitClient />;
}

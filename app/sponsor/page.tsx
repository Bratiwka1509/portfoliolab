import type { Metadata } from "next";
import SubmitClient from "./SubmitClient";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | Sponsorship",
  description: "Support FTC teams and the PortfolioLab project by becoming a sponsor and contributing to STEM education.",
};

export default function SubmitPage() {
  return <SubmitClient />;
}

import type { Metadata } from "next";
import SubmitClient from "./SubmitClient";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | PortAI",
  description: "PortAI provides AI-based analysis and feedback for FTC engineering portfolios using official evaluation criteria.",
};

export default function SubmitPage() {
  return <SubmitClient />;
}

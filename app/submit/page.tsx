import type { Metadata } from "next";
import SubmitClient from "./SubmitClient";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | Submit",
  description: "Submit your FTC engineering portfolio for expert and AI review.",
};

export default function SubmitPage() {
  return <SubmitClient />;
}

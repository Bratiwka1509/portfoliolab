import type { Metadata } from "next";
import SubmitClient from "./SubmitClient";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | Portfolios",
  description: "Explore real FTC engineering portfolios from teams around the world, reviewed and rated by PortfolioLab."
,
};

export default function SubmitPage() {
  return <SubmitClient />;
}

import type { Metadata } from "next";
import SubmitClient from "./SubmitClient";
import { getPublishedPortfolios } from "@/lib/portfolio-store";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | Portfolios",
  description:
    "Explore real FTC engineering portfolios from teams around the world, reviewed and rated by PortfolioLab.",
};

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const portfolios = await getPublishedPortfolios();
  return <SubmitClient portfolios={portfolios} />;
}

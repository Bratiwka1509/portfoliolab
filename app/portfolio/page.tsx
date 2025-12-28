import type { Metadata } from "next";
import { Suspense } from "react";
import SubmitClient from "./SubmitClient";

export const metadata: Metadata = {
  title: "FTCPortfolioLab | Portfolios",
  description:
    "Explore real FTC engineering portfolios from teams around the world, reviewed and rated by PortfolioLab.",
};

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm sm:text-base text-zinc-400">
          Loading portfolios…
        </div>
      }
    >
      <SubmitClient />
    </Suspense>
  );
}

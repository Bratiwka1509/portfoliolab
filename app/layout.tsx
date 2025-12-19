import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "../components/Navbar";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* ================= METADATA ================= */

export const metadata: Metadata = {
  title: "FTCPortfolioLab",
  description: "FTC engineering portfolios, reviews, and submissions",
  icons: {
    icon: "/pl.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${montserrat.className}
          min-h-screen
          bg-black
          text-white
        `}
      >
        <Navbar />

        <main>{children}</main>

        <footer className="border-t border-red-900/30 mt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-3 text-xs text-gray-500">
            <div className="flex gap-4">
              <a href="/sponsor" className="hover:text-red-500 transition">
                Become a sponsor
              </a>
              <a
                href="https://www.instagram.com/ftc.portfoliolab/"
                target="_blank"
                className="hover:text-red-500 transition"
              >
                Instagram
              </a>
            </div>
            <span>© {new Date().getFullYear()} FTCPortfolioLab</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

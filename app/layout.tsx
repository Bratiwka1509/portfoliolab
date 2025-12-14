import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PortfolioLab",
  description: "Engineering portfolios for FTC teams",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} bg-black text-white`}>
        {/* GLOBAL TECH BACKGROUND */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-violet-500/20 blur-[180px]" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-violet-600/10 blur-[180px]" />
        </div>

        {/* NAVBAR */}
        <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-black/70">
          <div className="w-full h-14 sm:h-16 flex items-center justify-between px-3 sm:px-8 md:px-12">
            
            {/* LEFT */}
            <Link href="/" className="flex items-center gap-2">
              {/* LOGO — DESKTOP ONLY */}
              <Image
                src="/logo.png"
                alt="PortfolioLab logo"
                width={32}
                height={32}
                priority
                className="hidden sm:block"
              />

              {/* TEXT — DESKTOP ONLY */}
              <span className="hidden sm:inline font-semibold tracking-wide text-lg">
                Portfolio<span className="text-violet-400">Lab</span>
              </span>
            </Link>

            {/* RIGHT */}
            <nav className="flex items-center gap-3 sm:gap-6 text-[11px] sm:text-sm">
              <Link
                href="/"
                className="text-white/70 hover:text-violet-400 transition"
              >
                Home
              </Link>
              <Link
                href="/portfolio"
                className="text-white/70 hover:text-violet-400 transition"
              >
                Portfolio
              </Link>
              <Link
                href="/guide"
                className="px-2.5 sm:px-3 py-1.5 rounded border border-violet-500/40 hover:bg-violet-500/10 transition"
              >
                Guide
              </Link>
            </nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="pt-14 sm:pt-16">{children}</main>

        {/* FOOTER */}
        <footer className="mt-24 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between gap-4 text-xs sm:text-sm text-white/40">
            <span>© {new Date().getFullYear()} PortfolioLab</span>

            <div className="flex gap-6">
              <a
                href="https://www.instagram.com/ftc.portfoliolab/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-400 transition"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-400 transition"
              >
                YouTube
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

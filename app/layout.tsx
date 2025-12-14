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
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-500/20 blur-[180px]" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-red-600/10 blur-[180px]" />
        </div>

        {/* NAVBAR */}
        <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10">
          <div className="w-full px-12 h-16 flex items-center justify-between">
            {/* LEFT */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="PortfolioLab logo"
                width={34}
                height={34}
                priority
              />
              <span className="tracking-wide text-lg">
                Portfolio<span className="text-red-400">Lab</span>
              </span>
            </Link>

            {/* RIGHT */}
            <nav className="flex items-center gap-8 text-sm font-normal">
              <Link
                href="/"
                className="text-white/70 hover:text-red-400 transition"
              >
                Home
              </Link>
              <Link
                href="/portfolio"
                className="text-white/70 hover:text-red-400 transition"
              >
                Portfolio
              </Link>
              <Link
                href="/guide"
                className="px-4 py-1.5 rounded border border-red-500/40
                           bg-gradient-to-br from-red-600/25 to-red-500/5
                           hover:from-red-600/35 hover:to-red-500/15
                           text-white transition"
              >
                Guide & Reviews
              </Link>
            </nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main>{children}</main>

        {/* FOOTER */}
        <footer className="mt-32 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-6 text-sm">
            <span className="text-white/40">
              © {new Date().getFullYear()} PortfolioLab
            </span>

            <div className="flex gap-6">
              <a
                href="https://instagram.com"
                target="_blank"
                className="text-white/40 hover:text-red-400 transition"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                className="text-white/40 hover:text-red-400 transition"
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

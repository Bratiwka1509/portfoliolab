"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <body
        className={`
          ${montserrat.className}
          min-h-screen
          text-white
          bg-black
        `}
      >
        {/* ================= NAVBAR ================= */}
        <header className="sticky top-0 z-50 border-b border-red-900/40 bg-black">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="PortfolioLab" width={28} height={28} />
              <span className="font-semibold tracking-wide">
                Portfolio<span className="text-red-500">Lab</span>
              </span>
            </Link>

            {/* DESKTOP NAV — НЕ ТРОГАЕМ */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-red-400 transition">
                Home
              </Link>
              <Link href="/portfolio" className="hover:text-red-400 transition">
                Portfolio
              </Link>
              <Link href="/guide" className="hover:text-red-400 transition">
                Guide
              </Link>
              <Link
                href="/portai"
                className="px-4 py-2 rounded-md border border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition"
              >
                PortAI
              </Link>
              <Link
                href="/submit"
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition"
              >
                Submit
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-2xl px-2"
              aria-label="Open menu"
            >
              ⋮
            </button>
          </nav>
        </header>

        {/* ================= MOBILE MENU ================= */}
        {open && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-72 bg-black border-l border-red-900/40 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <nav className="flex flex-col gap-4 text-base">
                <Link href="/" onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link href="/portfolio" onClick={() => setOpen(false)}>
                  Portfolio
                </Link>
                <Link href="/guide" onClick={() => setOpen(false)}>
                  Guide
                </Link>
                <Link
                  href="/portai"
                  onClick={() => setOpen(false)}
                  className="mt-2 px-4 py-2 rounded-md border border-red-600 text-red-500 text-center"
                >
                  PortAI
                </Link>
                <Link
                  href="/submit"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-md bg-red-600 text-center font-semibold"
                >
                  Submit
                </Link>
              </nav>
            </div>
          </div>
        )}

        {/* ================= PAGE CONTENT ================= */}
        <main>{children}</main>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-red-900/30 mt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-3 text-xs text-gray-500">

            <div className="flex gap-4">
              <Link
                href="/sponsor"
                className="hover:text-red-500 transition"
              >
                Become a sponsor
              </Link>

              <Link
                href="https://www.instagram.com/ftc.portfoliolab/"
                target="_blank"
                className="hover:text-red-500 transition"
              >
                Instagram
              </Link>
            </div>

            <span>
              © {new Date().getFullYear()} PortfolioLab
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

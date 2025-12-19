"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-red-900/40 bg-black">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="FTCPortfolioLab" width={28} height={28} />
            <span className="font-semibold tracking-wide">
              FTC<span className="text-red-500">PortfolioLab</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-red-400">Home</Link>
            <Link href="/portfolio" className="hover:text-red-400">Portfolio</Link>
            <Link href="/guide" className="hover:text-red-400">Guide</Link>
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

          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-2xl px-2"
          >
            ⋮
          </button>
        </nav>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 bg-black border-l border-red-900/40 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-4 text-base">
              <Link href="/" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/portfolio" onClick={() => setOpen(false)}>Portfolio</Link>
              <Link href="/guide" onClick={() => setOpen(false)}>Guide</Link>
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
    </>
  );
}

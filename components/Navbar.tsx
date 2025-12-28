"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Suggestion = {
  id: string;
  teamName: string;
  teamNumber: number;
  country?: string;
};

export default function Navbar() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  /* ===== CLOSE DROPDOWN ON OUTSIDE CLICK ===== */
  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ===== FETCH AUTOCOMPLETE ===== */
  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setResults)
      .catch(() => {});

    return () => controller.abort();
  }, [query]);

  function goSearch(value?: string) {
    const q = (value ?? query).trim();
    if (!q) return;
    router.push(`/portfolio?q=${encodeURIComponent(q)}`);
    setQuery("");
    setShow(false);
    setOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-red-900/40 bg-black">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-6">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo.png" alt="FTCPortfolioLab" width={28} height={28} />
            <span className="font-semibold tracking-wide">
              FTC<span className="text-red-500">PortfolioLab</span>
            </span>
          </Link>

          {/* SEARCH */}
          <div
            ref={ref}
            className="hidden md:flex flex-1 justify-center relative"
          >
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShow(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && goSearch()}
              placeholder="Search team, number or country…"
              className="
                w-full max-w-md
                bg-zinc-900
                border border-zinc-700
                rounded-md
                px-4 py-2
                text-sm
                placeholder-gray-400
                focus:outline-none
                focus:border-red-500
              "
            />

            {show && results.length > 0 && (
              <div className="absolute top-full mt-1 w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-md overflow-hidden shadow-xl">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => goSearch(r.teamName)}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 flex justify-between"
                  >
                    <span>
                      <span className="text-gray-400">#{r.teamNumber}</span>{" "}
                      <span className="font-medium">{r.teamName}</span>
                    </span>
                    <span className="text-gray-400 italic">
                      {r.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LINKS */}
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

          {/* MOBILE MENU */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-2xl px-2"
          >
            ⋮
          </button>
        </nav>
      </header>
    </>
  );
}

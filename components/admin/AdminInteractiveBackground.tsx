"use client";

import { useState } from "react";

type ThemeMode = "snake" | "energy";

const SURFACE_BACKGROUNDS: Record<ThemeMode, string> = {
  snake:
    "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.16), transparent 24%), radial-gradient(circle at 80% 10%, rgba(74, 222, 128, 0.12), transparent 22%), linear-gradient(135deg, #041a11 0%, #05150f 38%, #020807 100%)",
  energy:
    "radial-gradient(circle at 18% 18%, rgba(192, 132, 252, 0.28), transparent 30%), radial-gradient(circle at 78% 14%, rgba(96, 165, 250, 0.18), transparent 24%), linear-gradient(135deg, #140826 0%, #0f0a23 42%, #04010a 100%)",
};

const GLOW_BACKGROUNDS: Record<ThemeMode, string> = {
  snake:
    "radial-gradient(circle at 24% 28%, rgba(34, 197, 94, 0.22), transparent 20%), radial-gradient(circle at 76% 34%, rgba(16, 185, 129, 0.18), transparent 18%), linear-gradient(115deg, rgba(3, 25, 18, 0.12), rgba(0, 0, 0, 0))",
  energy:
    "radial-gradient(circle at 26% 26%, rgba(168, 85, 247, 0.3), transparent 22%), radial-gradient(circle at 72% 30%, rgba(59, 130, 246, 0.22), transparent 18%), linear-gradient(115deg, rgba(35, 12, 71, 0.2), rgba(0, 0, 0, 0))",
};

export default function AdminInteractiveBackground() {
  const [theme, setTheme] = useState<ThemeMode>("snake");

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          theme === "snake" ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: SURFACE_BACKGROUNDS.snake }}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          theme === "snake" ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: SURFACE_BACKGROUNDS.energy }}
      />
      <div
        className={`admin-wave-shift absolute inset-0 transition-opacity duration-700 ${
          theme === "snake" ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: GLOW_BACKGROUNDS.snake }}
      />
      <div
        className={`admin-wave-shift absolute inset-0 transition-opacity duration-700 ${
          theme === "snake" ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: GLOW_BACKGROUNDS.energy }}
      />
      <div
        className={`admin-orb-drift absolute -left-28 top-24 h-80 w-80 rounded-full blur-3xl ${
          theme === "snake" ? "bg-emerald-500/20" : "bg-violet-500/20"
        }`}
      />
      <div
        className={`admin-orb-drift absolute bottom-12 right-[-6rem] h-96 w-96 rounded-full blur-3xl ${
          theme === "snake" ? "bg-lime-400/15" : "bg-fuchsia-500/15"
        }`}
        style={{ animationDelay: "-6s" }}
      />

      <div className="pointer-events-auto absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/70 backdrop-blur-md">
        {theme === "snake" ? "Green snake mode" : "Purple energy mode"}
      </div>

      <button
        type="button"
        onClick={() => setTheme((current) => (current === "snake" ? "energy" : "snake"))}
        className={`pointer-events-auto absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center gap-3 rounded-full border px-4 py-3 text-sm text-white/80 backdrop-blur-md transition hover:scale-[1.02] focus:outline-none ${
          theme === "snake"
            ? "border-emerald-300/40 bg-emerald-400/10 shadow-[0_0_40px_rgba(34,197,94,0.16)]"
            : "border-violet-300/40 bg-violet-400/10 shadow-[0_0_40px_rgba(168,85,247,0.18)]"
        }`}
        aria-label={
          theme === "snake"
            ? "Switch to purple energy admin background"
            : "Switch to green snake admin background"
        }
      >
        <span
          className={`block h-3 w-3 rounded-full ${
            theme === "snake" ? "bg-emerald-300" : "bg-violet-300"
          }`}
        />
        <span>{theme === "snake" ? "Switch to energy mode" : "Switch to snake mode"}</span>
      </button>

      <div
        className={`absolute right-[8%] top-24 z-10 flex h-36 w-36 items-center justify-center rounded-full border transition duration-500 ${
          theme === "snake"
            ? "admin-snake-float border-emerald-300/40 bg-emerald-400/10 shadow-[0_0_60px_rgba(34,197,94,0.25)]"
            : "admin-energy-float border-violet-300/40 bg-violet-400/10 shadow-[0_0_60px_rgba(168,85,247,0.25)]"
        }`}
      >
        {theme === "snake" ? (
          <svg viewBox="0 0 200 200" className="h-28 w-28">
            <defs>
              <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bbf7d0" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <path
              d="M41 134C63 161 116 154 132 132C150 108 122 88 95 96C69 104 54 83 70 65C88 45 130 48 149 70"
              fill="none"
              stroke="url(#snakeGradient)"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <circle cx="151" cy="70" r="11" fill="#dcfce7" />
            <circle cx="154" cy="67" r="2.4" fill="#052e16" />
            <path d="M163 73L175 76L163 79" fill="none" stroke="#fca5a5" strokeWidth="4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 200 200" className="h-28 w-28">
            <defs>
              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="38" fill="url(#energyGradient)" opacity="0.28" />
            <circle cx="100" cy="100" r="22" fill="#ddd6fe" opacity="0.8" />
            <path
              d="M96 46L71 97H95L83 153L130 89H105L121 46Z"
              fill="none"
              stroke="url(#energyGradient)"
              strokeLinejoin="round"
              strokeWidth="12"
            />
            <path
              d="M39 92C51 78 59 74 74 72"
              fill="none"
              stroke="#a78bfa"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M126 128C143 126 155 120 167 106"
              fill="none"
              stroke="#93c5fd"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

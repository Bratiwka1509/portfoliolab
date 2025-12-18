"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PortAIPage() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function askPortAI() {
    if (!input.trim()) return;

    setLoading(true);
    setAnswer(null);

    setTimeout(() => {
      setAnswer(
        "PortAI AI is currently under active development.\n\n" +
          "The project is looking for sponsors and partners to accelerate development, improve AI judging quality, and make PortAI available for FTC teams worldwide.\n\n" +
          "If you would like to support the project, become a sponsor and help shape the future of FTC portfolio evaluation."
      );
      setLoading(false);
    }, 800);
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-20 sm:py-24 text-white bg-gradient-to-br from-black via-[#120606] to-[#3b0a0a]">
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">

        {/* HEADER */}
        <section className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-red-600">Port</span>AI
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl">
            PortAI helps FTC teams improve engineering portfolios with
            judge-oriented feedback.
          </p>
        </section>

        {/* CHAT */}
        <section className="rounded-xl border border-red-900/40 bg-black/40 backdrop-blur p-4 sm:p-6 space-y-5 sm:space-y-6">

          {/* AI ANSWER */}
          {answer && (
            <div className="space-y-4">
              <div className="text-xs sm:text-sm text-zinc-400">PortAI</div>

              <div className="rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-4 text-sm whitespace-pre-wrap">
                {answer}
              </div>

              <button
                onClick={() => router.push("/sponsor")}
                className="
                  w-full sm:w-auto
                  inline-flex items-center justify-center
                  px-6 py-2.5
                  rounded-md
                  bg-red-700 hover:bg-red-600
                  transition
                  text-white font-medium
                "
              >
                Become a sponsor
              </button>
            </div>
          )}

          {/* INPUT */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask PortAI about your portfolio..."
            className="
              w-full min-h-[110px] sm:min-h-[120px]
              rounded-lg
              border border-red-900/40
              bg-black/60
              px-4 py-3
              text-sm
              text-white
              placeholder-zinc-500
              focus:outline-none
              focus:ring-2
              focus:ring-red-600/40
            "
          />

          <div className="flex justify-end">
            <button
              onClick={askPortAI}
              disabled={loading}
              className="
                w-full sm:w-auto
                px-6 py-2.5
                rounded-md
                bg-red-700 text-white
                hover:bg-red-600
                disabled:opacity-60
              "
            >
              {loading ? "Thinking..." : "Ask PortAI"}
            </button>
          </div>
        </section>

        {/* SUGGESTIONS */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-semibold">
            What you can ask PortAI
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            {[
              "Review my portfolio structure for FTC judges",
              "How can I improve my Awards section?",
              "Is my portfolio competition-ready?",
              "What judges expect in the Engineering section?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="
                  border border-red-900/40
                  rounded-lg
                  p-4
                  text-left
                  bg-black/30
                  hover:border-red-600
                  transition
                "
              >
                “{q}”
              </button>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

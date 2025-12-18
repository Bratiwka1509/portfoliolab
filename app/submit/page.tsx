"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [level, setLevel] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const response = await fetch("https://formspree.io/f/xzdppqjj", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    setLoading(false);

    if (response.ok) {
      setSubmitted(true);
      e.currentTarget.reset();
      setLevel("");
      setTeamNumber("");
    } else {
      alert("Submission failed. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#160606] to-[#2a0b0b] text-white px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-3xl mx-auto">

        {/* TITLE */}
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <h1 className="text-2xl sm:text-4xl font-semibold">
            Submit Your FTC Portfolio
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl mx-auto">
            Portfolios are reviewed by FTC experts and AI systems using official
            judging criteria. Selected submissions may be featured on
            PortfolioLab with public ratings and detailed feedback.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 sm:space-y-6 bg-black/40 border border-red-900/40 rounded-2xl p-5 sm:p-8"
        >
          {/* TEAM NUMBER */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Team Number
            </label>
            <div className="flex">
              <span className="px-3 py-2 border border-zinc-800 border-r-0 rounded-l bg-black text-gray-400 select-none">
                #
              </span>
              <input
                name="team_number"
                value={teamNumber}
                onChange={(e) =>
                  setTeamNumber(e.target.value.replace(/\D/g, ""))
                }
                required
                inputMode="numeric"
                placeholder="12345"
                className="w-full bg-black border border-zinc-800 rounded-r px-4 py-2 text-white focus:outline-none focus:border-red-700"
              />
            </div>
          </div>

          {/* TEAM NAME */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Team Name
            </label>
            <input
              name="team_name"
              required
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Country
            </label>
            <input
              name="country"
              list="countries"
              required
              placeholder="Start typing country name"
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
            />
            <datalist id="countries">
              {[
                "Afghanistan","Albania","Algeria","Argentina","Armenia","Australia","Austria",
                "Azerbaijan","Bangladesh","Belgium","Brazil","Bulgaria","Canada","Chile","China",
                "Colombia","Croatia","Czech Republic","Denmark","Egypt","Estonia","Finland",
                "France","Georgia","Germany","Greece","Hungary","India","Indonesia","Ireland",
                "Israel","Italy","Japan","Kazakhstan","Kyrgyzstan","Latvia","Lithuania","Malaysia",
                "Mexico","Moldova","Netherlands","New Zealand","Norway","Pakistan","Philippines",
                "Poland","Portugal","Romania","Saudi Arabia","Serbia","Singapore","Slovakia",
                "Slovenia","South Africa","South Korea","Spain","Sweden","Switzerland","Thailand",
                "Turkey","Ukraine","United Arab Emirates","United Kingdom","United States",
                "Uzbekistan","Vietnam"
              ].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* SEASON */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              FTC Season
            </label>
            <select
              name="season"
              required
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
            >
              <option value="">Select season</option>
              <option value="2025 Decode">2025 Decode</option>
              <option value="2024 Into The Deep">2024 Into The Deep</option>
              <option value="2023 Centerstage">2023 Centerstage</option>
              <option value="2022 Power Play">2022 Power Play</option>
              <option value="2021 Freight Frenzy">2021 Freight Frenzy</option>
              <option value="2020 Ultimate Goal">2020 Ultimate Goal</option>
              <option value="2019 Skystone">2019 Skystone</option>
            </select>
          </div>

          {/* LEVEL */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Competition Level
            </label>
            <select
              name="level"
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
            >
              <option value="">Select level</option>
              <option value="Worlds">Worlds</option>
              <option value="Nationals">Nationals</option>
              <option value="Regionals">Regionals</option>
              <option value="Premier Event">Premier Event</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {level === "Other" && (
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Specify competition / event
              </label>
              <input
                name="other_level"
                required
                className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
              />
            </div>
          )}

          {/* EVENT */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Event Name
            </label>
            <input
              name="event_name"
              required
              placeholder="e.g. FTC National Championship Kazakhstan"
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
            />
          </div>

          {/* PORTFOLIO LINK */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Portfolio link
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                name="portfolio_link"
                required
                placeholder="https://..."
                className="flex-1 bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
              />
              <button
                type="button"
                onClick={() => setShowInfo(true)}
                className="px-3 border border-zinc-700 rounded text-gray-400 hover:text-white hover:border-red-700 transition"
              >
                ⓘ
              </button>
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-red-900/40 border border-red-800 py-3 rounded-xl text-white hover:bg-red-900/60 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit Portfolio"}
          </button>
        </form>
      </div>

      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md bg-black border border-red-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-red-500">
              Portfolio upload
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Upload your portfolio PDF to any platform (Google Drive, Canva,
              Dropbox, etc.) and make the link public.
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-2 border border-red-700 rounded hover:bg-red-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md bg-black border border-red-800 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-green-400 mb-4">
              Request sent
            </h2>
            <p className="text-gray-300 mb-6">
              Thank you! We will contact you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full py-2 border border-red-700 rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

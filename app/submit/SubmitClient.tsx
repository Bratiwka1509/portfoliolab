"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [level, setLevel] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setSubmitted(true);
        e.currentTarget.reset();
        setLevel("");
        setTeamNumber("");
        return;
      }

      setError(result?.error || "Submission failed. Please try again.");
    } catch {
      setLoading(false);
      setError("Submission failed. Please try again.");
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
            Upload your portfolio PDF directly to PortfolioLab. New submissions
            go to the admin review page first, and approved portfolios are
            published automatically on the public portfolio page.
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

          {/* PDF UPLOAD */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Portfolio PDF
            </label>
            <input
              type="file"
              name="portfolio_file"
              accept="application/pdf,.pdf"
              required
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white file:mr-4 file:border-0 file:bg-red-900/40 file:px-4 file:py-2 file:text-white file:cursor-pointer focus:outline-none focus:border-red-700"
            />
            <p className="mt-2 text-xs text-gray-500">
              PDF only, up to 500 MB.
            </p>
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

          {error && (
            <div className="rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

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

      {/* SUCCESS MODAL */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md bg-black border border-red-800 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-green-400 mb-4">
              Portfolio submitted
            </h2>
            <p className="text-gray-300 mb-6">
              Your PDF has been uploaded successfully. It is now waiting for
              admin approval before appearing on the site.
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

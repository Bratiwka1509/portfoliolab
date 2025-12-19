"use client";

import { useState } from "react";

export default function SponsorPage() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const response = await fetch("https://formspree.io/f/xzdppqjj", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });

    setLoading(false);

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      alert("Something went wrong. Please try again later.");
    }
  }

  return (
    <main
      className="
        min-h-screen
        px-4 sm:px-6
        py-20 sm:py-28
        text-white
        bg-gradient-to-br
        from-black
        via-[#120606]
        to-[#3b0a0a]
      "
    >
      <div className="max-w-6xl mx-auto space-y-20 sm:space-y-32">

        {/* ================= HERO ================= */}
        <section className="space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide">
            Become a <span className="text-red-500">Sponsor</span>
          </h1>

          <p className="max-w-3xl text-base sm:text-lg text-gray-300 leading-relaxed">
            PortfolioLab is an independent platform for FIRST Tech Challenge teams.
            We help teams improve engineering portfolios, understand judging criteria,
            and grow from Regional level up to Worlds.
          </p>
        </section>

        {/* ================= WHY ================= */}
        <section className="space-y-8 sm:space-y-10">
          <h2 className="text-xl sm:text-2xl font-bold">Why it matters</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Support STEM Education",
                text:
                  "You directly support STEM education and the development of engineering thinking among students worldwide.",
              },
              {
                title: "Real Impact",
                text:
                  "Your contribution helps teams better understand Inspire, Think, Connect, and other FTC award criteria.",
              },
              {
                title: "Global Reach",
                text:
                  "PortfolioLab is used by teams from different countries, seasons, and competition levels.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  border border-red-900/40
                  rounded-xl
                  p-5 sm:p-6
                  bg-black/40
                  transition
                  hover:border-red-600
                  hover:ring-1
                  hover:ring-red-600/60
                  hover:shadow-[0_0_25px_rgba(220,38,38,0.25)]
                "
              >
                <h3 className="font-semibold text-lg mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= BENEFITS ================= */}
        <section className="space-y-8 sm:space-y-10">
          <h2 className="text-xl sm:text-2xl font-bold">
            What sponsors receive
          </h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[
              "Logo and name placement on the platform",
              "Mentions in educational and partner materials",
              "Support of the international FTC community",
              "Association with engineering, innovation, and education",
            ].map((text) => (
              <div
                key={text}
                className="
                  border border-red-900/40
                  rounded-xl
                  p-4 sm:p-5
                  bg-black/40
                  transition
                  hover:border-red-600
                  hover:ring-1
                  hover:ring-red-600/60
                  hover:shadow-[0_0_25px_rgba(220,38,38,0.25)]
                "
              >
                ✔ {text}
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="border border-red-900/40 rounded-2xl p-6 sm:p-10 bg-black/50 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold">
            Interested in partnering with us?
          </h2>

          <p className="max-w-2xl text-sm sm:text-base text-gray-300">
            We are open to collaboration with companies, organizations,
            educational centers, and individual partners.
            Sponsorship formats are discussed individually.
          </p>

          <button
            onClick={() => {
              setOpen(true);
              setSubmitted(false);
            }}
            className="
              w-full sm:w-auto
              px-6 py-3
              rounded-lg
              bg-red-600
              hover:bg-red-700
              transition
              font-semibold
            "
          >
            Become a sponsor
          </button>
        </section>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed inset-0 z-50
            bg-black/70
            backdrop-blur
            flex items-center justify-center
            px-4
          "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full max-w-lg
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              border border-red-900/40
              bg-black
              p-6 sm:p-8
              space-y-6
            "
          >
            {!submitted ? (
              <>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Sponsor request
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    required
                    name="company"
                    placeholder="Company / Organization name"
                    className="w-full rounded-lg bg-black border border-red-900/40 px-4 py-3"
                  />

                  <input
                    required
                    name="contact"
                    placeholder="Contact person"
                    className="w-full rounded-lg bg-black border border-red-900/40 px-4 py-3"
                  />

                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full rounded-lg bg-black border border-red-900/40 px-4 py-3"
                  />

                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Briefly describe your sponsorship interest"
                    className="w-full rounded-lg bg-black border border-red-900/40 px-4 py-3"
                  />

                  <input type="hidden" name="type" value="Sponsor request" />
                  <input type="hidden" name="source" value="PortfolioLab" />

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      rounded-lg
                      bg-red-600
                      py-3
                      font-semibold
                      hover:bg-red-700
                      disabled:opacity-50
                    "
                  >
                    {loading ? "Sending..." : "Send request"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-green-400">
                  Request sent
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Thank you for your interest in supporting PortfolioLab.
                  We will contact you shortly.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="
                    w-full sm:w-auto
                    px-6 py-3
                    rounded-lg
                    border border-red-900/50
                    hover:bg-red-900/20
                  "
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

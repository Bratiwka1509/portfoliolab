import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative px-4 sm:px-6 overflow-hidden">
      {/* TECH / CYBER BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-500/20 blur-[160px]" />
      </div>

      <div className="relative max-w-6xl mx-auto py-20 sm:py-28 space-y-16 sm:space-y-24">
        {/* HEADER */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/logo.png"
            alt="PortfolioLab logo"
            width={40}
            height={40}
            className="sm:w-[50px] sm:h-[70px]"
            priority
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide">
            Portfolio<span className="text-red-400">Lab</span>
          </h1>
        </div>

        {/* WHAT IS PORTFOLIOLAB */}
        <div className="max-w-3xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            What is PortfolioLab?
          </h2>

          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            PortfolioLab is an educational platform for FIRST Tech Challenge
            teams. We help students understand how to create clear, structured,
            and competition-ready engineering portfolios based on real judging
            experience.
          </p>

          <Link
            href="/guide"
            className="inline-block mt-4 text-sm text-red-400 hover:underline"
          >
            Learn how to write a portfolio using our guidebook →
          </Link>
        </div>

        {/* ENGINEERING PORTFOLIO */}
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* TEXT */}
          <div className="space-y-4 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
              What is an{" "}
              <span className="text-red-400">Engineering Portfolio</span>?
              <Image
                src="/ftcftc.png"
                alt="FTC logo"
                width={90}
                height={90}
                className="opacity-80"
              />
            </h2>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              An engineering portfolio is a structured document that shows how
              your FTC team designs, builds, programs, manages, and communicates
              its engineering process to judges.
            </p>
          </div>

          {/* CLICKABLE PORTFOLIOS */}
          <div className="relative h-[300px] sm:h-[440px] flex items-center justify-center">
            {/* LEFT — Raventech */}
            <a
              href="https://drive.google.com/file/d/1ksv2owVOhEm-_NBWZF68qLLZOPyM7yW4/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -translate-x-20 sm:-translate-x-40 rotate-[-8deg] sm:rotate-[-18deg] z-10
                         transition-all duration-300
                         hover:scale-105 hover:z-40
                         hover:shadow-[0_0_40px_rgba(239,68,68,0.35)]"
            >
              <Image
                src="/portfolio/page-1.png"
                alt="Raventech Engineering Portfolio"
                width={160}
                height={225}
                className="sm:w-[210px] sm:h-[297px] border border-white/15"
              />
            </a>

            {/* CENTER — Team Without a Cool Acronym */}
            <a
              href="https://drive.google.com/file/d/1qcJd5SlYUYxByHYqiFOVVqzkViauBZHz/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-30
                         transition-all duration-300
                         hover:scale-110 hover:z-50
                         hover:shadow-[0_0_60px_rgba(239,68,68,0.45)]"
            >
              <Image
                src="/portfolio/page-2.png"
                alt="Team Without a Cool Acronym Portfolio"
                width={180}
                height={255}
                className="sm:w-[230px] sm:h-[325px] border border-red-400/50"
              />
            </a>

            {/* RIGHT — Rebel Robotics 18139 */}
            <a
              href="https://drive.google.com/file/d/1O0p5yHKNlYPYIZaGxYFj1FMmMe3jOlcz/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute translate-x-20 sm:translate-x-40 rotate-[8deg] sm:rotate-[18deg] z-20
                         transition-all duration-300
                         hover:scale-105 hover:z-40
                         hover:shadow-[0_0_40px_rgba(239,68,68,0.35)]"
            >
              <Image
                src="/portfolio/page-3.png"
                alt="Rebel Robotics 18139 Portfolio"
                width={160}
                height={225}
                className="sm:w-[210px] sm:h-[297px] border border-white/20"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

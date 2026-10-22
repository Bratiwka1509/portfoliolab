import Image from "next/image";
import Link from "next/link";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import { getPublishedPortfolios } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

function shuffle<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export default async function HomePage() {
  const portfolios = await getPublishedPortfolios();
  const showcasePortfolios = shuffle(
    portfolios.map(({ id, teamName, teamNumber, cover, pdf }) => ({
      id,
      teamName,
      teamNumber,
      cover,
      pdf,
    }))
  );

  return (
    <main
      className="
        min-h-screen
        px-4
        sm:px-6
        py-20
        sm:py-24
        text-white
        bg-gradient-to-br
        from-black
        via-[#1a0006]
        to-[#3a000c]
      "
    >
      <div className="max-w-7xl mx-auto space-y-24 sm:space-y-32">

        {/* TOP — TITLE */}
        <section className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="PortfolioLab logo"
            width={44}
            height={44}
            priority
          />
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-wide">
            <span className="text-white">Portfolio</span>
            <span className="text-red-500 drop-shadow-[0_0_14px_rgba(220,38,38,0.65)]">
              Lab
            </span>
          </h1>
        </section>

        {/* WHAT IS PORTFOLIOLAB */}
        <section className="max-w-3xl space-y-5">
          <h2 className="text-xl sm:text-2xl font-semibold">
            What is PortfolioLab?
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            PortfolioLab is an educational platform for FIRST Tech Challenge teams.
            We help students create clear, structured, and competition-ready
            engineering portfolios based on real judging experience.
          </p>

          <Link
            href="/guide"
            className="inline-block text-base sm:text-lg text-red-500 hover:text-red-400 transition"
          >
            Learn how to write a portfolio using our guidebook →
          </Link>
        </section>

        {/* ENGINEERING PORTFOLIO + COVERS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-2xl space-y-5">
            <h2 className="text-xl sm:text-2xl font-semibold">
              What is an{" "}
              <span className="text-red-500">Engineering Portfolio</span>?
            </h2>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              An engineering portfolio is a structured document that shows how your
              FTC team designs, builds, programs, manages, and communicates its
              engineering process to judges.
            </p>
          </div>

          <div className="hidden justify-center lg:flex">
            <PortfolioShowcase portfolios={showcasePortfolios.slice(0, 3)} />
          </div>
        </section>

        <a
          href="https://ftc-resources.firstinspires.org/ftc/game/manual"
          target="_blank"
          rel="noreferrer"
          className="group block rounded-xl border border-red-900/50 bg-black/35 p-6 transition hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] sm:p-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold sm:text-2xl">
                Explore portfolio criteria and awards
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
                Review official FTC award criteria and requirements to see what
                judges look for in an engineering portfolio.
              </p>
            </div>
            <span className="shrink-0 font-semibold text-red-400 transition group-hover:text-red-300">
              Explore the criteria →
            </span>
          </div>
        </a>

        {/* PUBLISH YOUR PORTFOLIO */}
        <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Publish your{" "}
              <span className="text-red-500">portfolio</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Share your FTC engineering portfolio with the global FIRST community.
              Get structured feedback, inspire other teams, and contribute to the
              growth of FIRST around the world.
            </p>

            <ul className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-red-500">✔</span>
                Receive clear, criteria-based feedback on your portfolio
              </li>
              <li className="flex gap-3">
                <span className="text-red-500">✔</span>
                Understand your real competition level (Regional → Worlds)
              </li>
              <li className="flex gap-3">
                <span className="text-red-500">✔</span>
                Learn how judges actually evaluate engineering portfolios
              </li>
              <li className="flex gap-3">
                <span className="text-red-500">✔</span>
                Help other teams learn and improve through shared examples
              </li>
              <li className="flex gap-3">
                <span className="text-red-500">✔</span>
                Support the development of FIRST globally
              </li>
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Link
              href="/submit"
              className="
                w-full
                sm:w-auto
                px-8
                sm:px-10
                py-4
                text-base
                sm:text-lg
                font-semibold
                rounded-md
                bg-red-600
                hover:bg-red-500
                active:bg-red-700
                transition
                shadow-[0_0_35px_rgba(220,38,38,0.45)]
                text-center
              "
            >
              Submit your portfolio →
            </Link>
          </div>
        </section>

        {/* SPONSOR CTA */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Become our{" "}
            <span className="text-red-500">sponsor</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Support PortfolioLab and help FTC teams around the world create stronger,
            clearer, and more competitive engineering portfolios. Your contribution
            directly supports education, accessibility, and growth within the FIRST
            community.
          </p>

          <div className="flex justify-center">
            <Link
              href="/sponsor"
              className="
                w-full
                sm:w-auto
                px-10
                py-4
                text-base
                sm:text-lg
                font-semibold
                rounded-md
                border
                border-red-600
                text-red-500
                hover:bg-red-600
                hover:text-white
                active:bg-red-700
                transition
                text-center
              "
            >
              Become a sponsor →
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

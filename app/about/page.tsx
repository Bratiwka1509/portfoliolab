import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About PortfolioLab",
  description:
    "Learn about PortfolioLab's mission to help FTC and FRC teams create clear, competition-ready engineering portfolios.",
};

const missionPoints = [
  {
    title: "Level up for Inspire & Impact",
    description:
      "Get actionable guides, criteria-based breakdowns, and structural tips to help your team meet the highest judging standards.",
  },
  {
    title: "Democratize knowledge",
    description:
      "Give teams from every region and background access to high-quality educational resources.",
  },
  {
    title: "Build a culture of sharing",
    description:
      "Inspire collaboration and continuous improvement across the global robotics community.",
  },
];

const partners = [
  {
    name: "RassLexx",
    team: "FTC 27772",
    description:
      "A valued FTC partner contributing practical insights and community-driven support.",
  },
  {
    name: "Celestial",
    team: "FTC 32728",
    description:
      "An FTC partner helping shape our educational resources and team perspectives.",
  },
  {
    name: "Palantyr",
    team: "FRC",
    description:
      "Our main FRC partner, bringing high-level FTC-to-FRC transitional mentorship and engineering expertise.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0006] to-[#3a000c] text-white">
      <div className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:space-y-32 sm:px-6 sm:py-24">
        <header className="max-w-4xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
            Our story, mission & community
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
            About <span className="text-red-500">PortfolioLab</span>
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-gray-300 sm:text-xl">
            Built to help FTC and FRC teams worldwide master engineering
            portfolios, elevate their documentation, and compete for top awards
            like Inspire and Impact.
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
              Who we are
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              The Story Behind PortfolioLab
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-gray-300 sm:text-lg">
            <p>
              Every robotics season, thousands of teams pour countless hours
              into designing, building, and programming advanced robots. Yet,
              condensing that entire season of hard work into a structured
              engineering portfolio remains one of the toughest challenges in
              competitive robotics.
            </p>
            <p>
              PortfolioLab was created to solve this exact problem. Founded by{" "}
              <strong className="font-semibold text-white">Aidar B.</strong>{" "}
              -
              an FLL/FTC alumnus and current member of the FRC team{" "}
              <strong className="font-semibold text-white">Palantyr</strong>,
              Inspire Award winner, and Winning Alliance Captain in Central
              Asia - the project was born out of real-world competitive
              experience. Having walked the path from regional events to the
              highest levels of competition, we understand firsthand what
              judges are looking for and how difficult it can be to find clear,
              winning examples.
            </p>
            <p>
              Our goal isn&apos;t to be just another robotics team.{" "}
              <strong className="font-semibold text-white">
                PortfolioLab is an independent educational platform and
                ecosystem
              </strong>
              , built to provide teams around the world with the tools,
              insights, and structural frameworks they need to showcase their
              engineering journey with clarity.
            </p>
          </div>
        </section>

        <section className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
              Our mission
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Raising the Global Standard of Engineering Documentation
            </h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We believe that great engineering deserves to be communicated
              brilliantly. Our mission is to help teams across the globe:
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {missionPoints.map((point, index) => (
              <article
                key={point.title}
                className="rounded-xl border border-red-900/40 bg-black/35 p-6 transition hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] sm:p-7"
              >
                <span className="text-sm font-bold tracking-widest text-red-500">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{point.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-400">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
              Key partners & ecosystem
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Collaborating with the Best
            </h2>
            <p className="text-lg leading-relaxed text-gray-300">
              PortfolioLab thrives on strong community connections and
              collaborations with robotics teams who share our passion for STEM
              education and competitive excellence.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {partners.map((partner) => (
              <article
                key={partner.name}
                className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 transition hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] sm:p-7"
              >
                <p className="text-sm font-medium text-red-400">
                  {partner.team}
                </p>
                <h3 className="mt-2 text-2xl font-bold">{partner.name}</h3>
                <p className="mt-4 leading-relaxed text-gray-400">
                  {partner.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-red-900/50 bg-gradient-to-br from-red-950/50 to-black/60 px-6 py-10 transition hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] sm:px-10 sm:py-14 sm:hover:shadow-[0_0_35px_rgba(220,38,38,0.3)]">
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
              Join us & shape the future
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Get Involved with PortfolioLab
            </h2>
            <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
              Whether you are an FTC team aiming for the Inspire Award, a
              mentor looking for structured resources, or a community leader
              ready to collaborate, PortfolioLab is here to support your
              journey.
            </p>
            <div className="flex flex-col justify-center gap-3 pt-3 sm:flex-row">
              <Link
                href="/guide"
                className="rounded-md bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
              >
                Explore the Guidebook
              </Link>
              <Link
                href="/submit"
                className="rounded-md border border-red-500 px-6 py-3 font-semibold text-red-300 transition hover:bg-red-600 hover:text-white"
              >
                Submit Your Portfolio
              </Link>
              <a
                href="https://www.instagram.com/ftc.portfoliolab/"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-zinc-700 px-6 py-3 font-semibold transition hover:border-zinc-500 hover:bg-zinc-900"
              >
                Connect With Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

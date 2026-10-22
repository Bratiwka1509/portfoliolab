import Link from "next/link";

type ShowcasePortfolio = {
  id: string;
  teamName: string;
  teamNumber: number;
  cover?: string;
  pdf: string;
};

function getCoverUrl(portfolio: ShowcasePortfolio) {
  const driveFileId = portfolio.pdf.match(/\/d\/([^/]+)/)?.[1];
  if (driveFileId) {
    return `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1000`;
  }

  const coverDriveFileId = portfolio.cover?.match(/\/d\/([^/]+)/)?.[1];
  if (coverDriveFileId) {
    return `https://drive.google.com/thumbnail?id=${coverDriveFileId}&sz=w1000`;
  }

  return portfolio.cover || null;
}

export default function PortfolioShowcase({
  portfolios,
}: {
  portfolios: ShowcasePortfolio[];
}) {
  if (portfolios.length === 0) return null;

  const cards = [
    {
      className: "left-0 top-12 h-[290px] w-[200px] rotate-[-12deg]",
    },
    {
      className: "left-36 top-0 z-10 h-[320px] w-[220px]",
    },
    {
      className: "left-[320px] top-16 h-[290px] w-[200px] rotate-[12deg]",
    },
  ];

  return (
    <div
      aria-label="Featured engineering portfolios"
      className="relative h-[360px] w-[520px] max-w-full"
    >
      {cards.slice(0, portfolios.length).map((card, slot) => {
        const portfolio = portfolios[slot];
        const coverUrl = getCoverUrl(portfolio);

        if (!coverUrl) return null;

        return (
          <Link
            key={`${portfolio.id}-${slot}`}
            href="/portfolio"
            aria-label={`View portfolio examples, including team ${portfolio.teamNumber} ${portfolio.teamName}`}
            className={`portfolio-cover-enter group absolute block overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-[0_12px_36px_rgba(0,0,0,0.55)] transition duration-500 hover:z-20 hover:scale-[1.03] hover:border-red-500/60 hover:shadow-[0_0_38px_rgba(220,38,38,0.45)] ${card.className}`}
            style={{ animationDelay: `${slot * 90}ms` }}
          >
            <div
              className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.78), transparent 42%), url("${coverUrl}")`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-3 text-left">
              <p className="text-xs font-semibold text-white drop-shadow">
                #{portfolio.teamNumber} {portfolio.teamName}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

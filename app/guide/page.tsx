export default function GuidePage() {
  return (
    <section className="px-4 sm:px-6">
      <div className="max-w-4xl mx-auto py-20 sm:py-28 space-y-12 sm:space-y-16">
        {/* HEADER */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            Portfolio Guide & Reviews
          </h1>

          <p className="text-white/60 text-sm sm:text-base max-w-2xl leading-relaxed">
            Everything you need to understand, write, and improve your FTC
            engineering portfolio — from theory to real examples.
          </p>
        </div>

        {/* GUIDEBOOK */}
        <div className="border border-white/10 p-4 sm:p-8 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            Guidebook
          </h2>

          <p className="text-white/60 text-sm leading-relaxed">
            We are currently working on a detailed step-by-step guidebook that
            explains how to structure and write a clear, competition-ready FTC
            engineering portfolio based on real judging experience.
          </p>

          <p className="text-red-400 text-sm">
            Guidebook coming soon.
          </p>
        </div>

        {/* REVIEWS */}
        <div className="border border-white/10 p-4 sm:p-8 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            Video Portfolio Reviews
          </h2>

          <p className="text-white/60 text-sm leading-relaxed">
            We are preparing video reviews of real FTC engineering portfolios.
            In these videos, we will explain judging decisions, highlight
            strengths and weaknesses, and share practical improvement tips.
          </p>

          <p className="text-red-400 text-sm">
            Video reviews coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}

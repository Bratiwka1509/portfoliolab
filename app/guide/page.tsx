export default function GuidePage() {
  return (
    <section className="min-h-screen px-4 sm:px-6 text-white bg-gradient-to-br from-black via-[#120606] to-[#3b0a0a]">
      <div className="max-w-4xl mx-auto py-16 sm:py-28 space-y-10 sm:space-y-16">

        {/* HEADER */}
        <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            Portfolio Guide & Reviews
          </h1>

          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0 leading-relaxed">
            Everything you need to understand, write, and improve your FTC
            engineering portfolio — from theory to real examples.
          </p>
        </div>

        {/* GUIDEBOOK */}
        <div className="border border-red-900/40 bg-black/40 backdrop-blur p-4 sm:p-8 space-y-3 sm:space-y-4 rounded-xl">
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
        <div className="border border-red-900/40 bg-black/40 backdrop-blur p-4 sm:p-8 space-y-3 sm:space-y-4 rounded-xl">
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

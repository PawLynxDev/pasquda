import { getGradeColor } from "@/lib/utils";

interface RecentRoast {
  domain: string;
  score: number;
  grade: string;
}

export function RecentRoasts({ roasts }: { roasts: RecentRoast[] }) {
  if (roasts.length === 0) return null;

  // Double the items for seamless loop
  const items = [...roasts, ...roasts];

  return (
    <section className="overflow-hidden py-8 sm:py-10">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-pasquda-gray/30 sm:mb-6 sm:text-sm">
        Recently Roasted
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-pasquda-black to-transparent sm:w-24" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-pasquda-black to-transparent sm:w-24" />

        <div className="flex animate-ticker gap-4 sm:gap-6">
          {items.map((roast, i) => (
            <div
              key={i}
              className="flex flex-shrink-0 items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 sm:gap-3 sm:px-4 sm:py-2"
            >
              <span className="text-xs text-pasquda-gray/60 sm:text-sm">{roast.domain}</span>
              <span className="font-mono text-xs font-bold text-pasquda-pink sm:text-sm">
                {roast.score}
              </span>
              <span
                className="font-mono text-xs font-bold sm:text-sm"
                style={{ color: getGradeColor(roast.grade) }}
              >
                {roast.grade}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

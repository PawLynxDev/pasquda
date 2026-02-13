import Image from "next/image";
import { getGradeColor } from "@/lib/utils";
import type { RoastResult } from "@/lib/utils";

interface ReportCardProps {
  roast: RoastResult;
}

export function ReportCard({ roast }: ReportCardProps) {
  const gradeColor = getGradeColor(roast.grade);

  return (
    <div className="card-glow mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-pasquda-darker/50 animate-fade-in-up">
      {/* Header bar */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:px-6 sm:py-4">
        <Image
          src="/pasquda_logo_dark.png"
          alt="Pasquda"
          width={32}
          height={32}
          className="h-7 w-7 sm:h-8 sm:w-8"
        />
        <span className="font-heading text-xs font-bold tracking-widest text-pasquda-pink text-glow-pink sm:text-sm">
          PASQUDA AUDIT
        </span>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {/* Top: Screenshot + Score */}
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
          {/* Screenshot */}
          {roast.screenshot_url && (
            <div className="flex-shrink-0 overflow-hidden rounded-xl border border-white/[0.08] shadow-lg shadow-black/20">
              <Image
                src={roast.screenshot_url}
                alt={`Screenshot of ${roast.domain}`}
                width={320}
                height={200}
                className="h-auto w-full object-cover sm:w-[280px]"
              />
            </div>
          )}

          {/* Score section */}
          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-widest text-pasquda-gray/60">
              Site
            </p>
            <p className="text-lg font-bold sm:text-xl break-all">{roast.domain}</p>

            <div className="mt-4 flex items-end gap-6 sm:mt-5 sm:gap-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-pasquda-gray/60">
                  Score
                </p>
                <p className="font-mono text-4xl font-bold text-pasquda-pink text-glow-pink sm:text-5xl">
                  {roast.score}
                  <span className="text-xl text-pasquda-gray/50 sm:text-2xl">/100</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-pasquda-gray/60">
                  Grade
                </p>
                <p
                  className="grade-stamp font-mono text-4xl font-bold sm:text-5xl"
                  style={{
                    color: gradeColor,
                    textShadow: `0 0 20px ${gradeColor}40`,
                  }}
                >
                  {roast.grade}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 sm:mt-8 sm:p-5">
          <p className="text-base leading-relaxed text-white/90 sm:text-lg">
            <span className="mr-2">💀</span>
            &ldquo;{roast.summary}&rdquo;
          </p>
        </div>

        {/* Roast bullets */}
        <div className="mt-5 space-y-3">
          {roast.roast_bullets.map((bullet, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.02]"
            >
              <span className="mt-0.5 flex-shrink-0">🔥</span>
              <p className="text-white/75 leading-relaxed">{bullet}</p>
            </div>
          ))}
        </div>

        {/* Backhanded compliment */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-pasquda-green/15 bg-pasquda-green/[0.04] p-4 sm:p-5">
          <span className="mt-0.5 flex-shrink-0">🏆</span>
          <p className="text-sm text-pasquda-green/90 leading-relaxed sm:text-base">
            &ldquo;{roast.backhanded_compliment}&rdquo;
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.04] px-4 py-3 sm:px-6">
        <span className="text-xs text-pasquda-gray/30">pasquda.com</span>
        <span className="text-xs text-pasquda-gray/20">
          For entertainment purposes only
        </span>
      </div>
    </div>
  );
}

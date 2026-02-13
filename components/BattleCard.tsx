import Image from "next/image";
import { Crown, Skull } from "lucide-react";
import { getGradeColor } from "@/lib/utils";
import type { RoastResult, BattleResult } from "@/lib/utils";

interface BattleCardProps {
  battle: BattleResult;
  roastA: RoastResult;
  roastB: RoastResult;
}

function SitePanel({
  roast,
  isWinner,
  label,
}: {
  roast: RoastResult;
  isWinner: boolean;
  label: string;
}) {
  const gradeColor = getGradeColor(roast.grade);

  return (
    <div
      className={`flex flex-1 flex-col rounded-xl border p-4 sm:p-5 ${
        isWinner
          ? "border-pasquda-pink/40 bg-pasquda-pink/[0.04] shadow-[0_0_30px_rgba(255,20,147,0.08)]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      {/* Winner crown */}
      {isWinner && (
        <div className="mb-2 flex items-center gap-1.5">
          <Crown className="h-4 w-4 text-yellow-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Winner
          </span>
        </div>
      )}

      <p className="text-[10px] font-bold uppercase tracking-widest text-pasquda-gray/50">
        {label}
      </p>

      {/* Screenshot */}
      {roast.screenshot_url && (
        <div className="mt-2 overflow-hidden rounded-lg border border-white/[0.06]">
          <Image
            src={roast.screenshot_url}
            alt={roast.domain}
            width={400}
            height={250}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <p className="mt-3 text-sm font-bold break-all sm:text-base">{roast.domain}</p>

      <div className="mt-3 flex items-end gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-pasquda-gray/50">
            Score
          </p>
          <p className="font-mono text-2xl font-bold text-pasquda-pink sm:text-3xl">
            {roast.score}
            <span className="text-sm text-pasquda-gray/40">/100</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-pasquda-gray/50">
            Grade
          </p>
          <p
            className="font-mono text-2xl font-bold sm:text-3xl"
            style={{ color: gradeColor, textShadow: `0 0 16px ${gradeColor}40` }}
          >
            {roast.grade}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-white/60 leading-relaxed sm:text-sm">
        &ldquo;{roast.summary}&rdquo;
      </p>
    </div>
  );
}

export function BattleCard({ battle, roastA, roastB }: BattleCardProps) {
  const isAWinner = battle.winner_id === roastA.id;
  const isBWinner = battle.winner_id === roastB.id;

  return (
    <div className="card-glow mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-pasquda-darker/50 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:px-6 sm:py-4">
        <Image
          src="/pasquda_logo_dark.png"
          alt="Pasquda"
          width={32}
          height={32}
          className="h-7 w-7 sm:h-8 sm:w-8"
        />
        <span className="font-heading text-xs font-bold tracking-widest text-pasquda-pink text-glow-pink sm:text-sm">
          PASQUDA BATTLE
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {/* Side-by-side panels */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
          <SitePanel roast={roastA} isWinner={isAWinner} label="Site A" />

          {/* VS divider */}
          <div className="flex items-center justify-center sm:flex-col">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pasquda-pink/30 to-transparent sm:h-auto sm:w-px sm:bg-gradient-to-b" />
            <div className="mx-3 flex h-10 w-10 items-center justify-center rounded-full border border-pasquda-pink/30 bg-pasquda-pink/10 sm:mx-0 sm:my-3">
              <span className="font-heading text-xs font-bold text-pasquda-pink">VS</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pasquda-pink/30 to-transparent sm:h-auto sm:w-px sm:bg-gradient-to-b" />
          </div>

          <SitePanel roast={roastB} isWinner={isBWinner} label="Site B" />
        </div>

        {/* Verdict */}
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 sm:p-5">
          <p className="flex items-start gap-2 text-base leading-relaxed text-white/90 sm:text-lg">
            <Skull className="mt-0.5 h-5 w-5 flex-shrink-0 text-pasquda-pink" />
            <span>&ldquo;{battle.verdict}&rdquo;</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.04] px-4 py-3 sm:px-6">
        <span className="text-xs text-pasquda-gray/30">pasquda.com</span>
        <span className="text-xs text-pasquda-gray/20">For entertainment purposes only</span>
      </div>
    </div>
  );
}

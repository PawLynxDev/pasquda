"use client";

import { useState, useEffect } from "react";
import type { RoastResult } from "@/lib/utils";
import { getGradeColor } from "@/lib/utils";

interface ChallengeResultProps {
  currentRoast: RoastResult;
}

export function ChallengeResult({ currentRoast }: ChallengeResultProps) {
  const [challenger, setChallenger] = useState<RoastResult | null>(null);

  useEffect(() => {
    if (!currentRoast.challenge_from) return;

    fetch(`/api/roast/${currentRoast.challenge_from}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.status === "completed") setChallenger(data);
      })
      .catch(() => {});
  }, [currentRoast.challenge_from]);

  if (!challenger) return null;

  const currentWins = currentRoast.score < challenger.score;
  const tie = currentRoast.score === challenger.score;

  return (
    <div className="mx-auto mt-6 max-w-2xl animate-fade-in-up rounded-2xl border border-pasquda-pink/20 bg-gradient-to-br from-pasquda-pink/[0.04] to-transparent p-5 sm:mt-8 sm:p-6">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-pasquda-pink sm:text-sm">
        Challenge Result
      </p>

      <div className="flex items-center justify-between gap-4">
        {/* Challenger */}
        <div className="flex-1 text-center">
          <p className="truncate text-xs text-pasquda-gray/60 sm:text-sm">{challenger.domain}</p>
          <p className="mt-1 font-mono text-3xl font-bold text-white sm:text-4xl">
            {challenger.score}
          </p>
          <p
            className="mt-1 font-mono text-lg font-bold sm:text-xl"
            style={{ color: getGradeColor(challenger.grade) }}
          >
            {challenger.grade}
          </p>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-extrabold text-pasquda-gray/30 sm:text-3xl">VS</span>
        </div>

        {/* Current */}
        <div className="flex-1 text-center">
          <p className="truncate text-xs text-pasquda-gray/60 sm:text-sm">{currentRoast.domain}</p>
          <p className="mt-1 font-mono text-3xl font-bold text-white sm:text-4xl">
            {currentRoast.score}
          </p>
          <p
            className="mt-1 font-mono text-lg font-bold sm:text-xl"
            style={{ color: getGradeColor(currentRoast.grade) }}
          >
            {currentRoast.grade}
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-pasquda-gray/70 sm:text-base">
        {tie
          ? "It's a tie! Both sites are equally... interesting."
          : currentWins
            ? `${currentRoast.domain} wins! Lower score = less cringe.`
            : `${challenger.domain} wins! ${currentRoast.domain} needs more work.`}
      </p>
    </div>
  );
}

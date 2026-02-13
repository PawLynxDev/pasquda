"use client";

import { useState } from "react";
import { Download, Link, Check, Swords } from "lucide-react";
import type { RoastResult, BattleResult } from "@/lib/utils";

interface BattleShareButtonsProps {
  battle: BattleResult;
  roastA: RoastResult;
  roastB: RoastResult;
}

export function BattleShareButtons({
  battle,
  roastA,
  roastB,
}: BattleShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pasquda.com";
  const shareUrl = `${appUrl}/battle/${battle.id}`;

  const winnerDomain =
    battle.winner_id === roastA.id
      ? roastA.domain
      : battle.winner_id === roastB.id
        ? roastB.domain
        : null;

  function shareToX() {
    const text = winnerDomain
      ? `${roastA.domain} vs ${roastB.domain} — Pasquda declares ${winnerDomain} the winner!\n\n"${battle.verdict}"\n\nStart your own battle → pasquda.com/battle\n\n#PasqudaBattle`
      : `${roastA.domain} vs ${roastB.domain} — It's a tie! Both sites are equally questionable.\n\n"${battle.verdict}"\n\nStart your own battle → pasquda.com/battle\n\n#PasqudaBattle`;
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  function shareToLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  async function downloadReportCard() {
    setDownloading(true);
    try {
      const response = await fetch(`/api/battle/report-card/${battle.id}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pasquda-battle-${roastA.domain}-vs-${roastB.domain}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const btnBase =
    "flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition-all duration-200 active:scale-95 sm:px-4 sm:py-3.5 sm:text-sm";

  return (
    <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-4 sm:gap-3 animate-slide-up">
      <button
        onClick={downloadReportCard}
        disabled={downloading}
        className={`${btnBase} shimmer-bg animate-shimmer text-white hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,20,147,0.3)] disabled:opacity-50`}
      >
        {downloading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Saving...
          </span>
        ) : (
          <>
            <Download className="h-4 w-4" /> Download
          </>
        )}
      </button>

      <button
        onClick={shareToX}
        className={`${btnBase} border border-white/[0.08] bg-white/[0.03] text-white hover:border-white/15 hover:bg-white/[0.06]`}
      >
        𝕏 Share on X
      </button>

      <button
        onClick={shareToLinkedIn}
        className={`${btnBase} border border-white/[0.08] bg-white/[0.03] text-white hover:border-white/15 hover:bg-white/[0.06]`}
      >
        in LinkedIn
      </button>

      <button
        onClick={copyLink}
        className={`${btnBase} border border-white/[0.08] bg-white/[0.03] text-white hover:border-white/15 hover:bg-white/[0.06]`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" /> Copied!
          </>
        ) : (
          <>
            <Link className="h-4 w-4" /> Copy Link
          </>
        )}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Download, Link, Check, Swords } from "lucide-react";
import type { RoastResult } from "@/lib/utils";

interface ShareButtonsProps {
  roast: RoastResult;
}

export function ShareButtons({ roast }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pasquda.com";
  const shareUrl = `${appUrl}/roast/${roast.id}`;

  function shareToX() {
    const text = `Pasquda just roasted my website 💀

Score: ${roast.score}/100
Grade: ${roast.grade}

"${roast.summary}"

Think your site is better? Try yours → pasquda.com

#PasqudaAudit`;
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
      const response = await fetch(`/api/report-card/${roast.id}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pasquda-${roast.domain}-report-card.png`;
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

  function challengeFriend() {
    const text = `Pasquda gave my website a ${roast.score}/100. Think yours can beat that?
Take the challenge → ${shareUrl}`;
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  const btnBase =
    "flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition-all duration-200 active:scale-95 sm:px-4 sm:py-3.5 sm:text-sm";

  return (
    <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3 animate-slide-up">
      {/* Download — primary */}
      <button
        onClick={downloadReportCard}
        disabled={downloading}
        className={`${btnBase} shimmer-bg animate-shimmer text-white hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,20,147,0.3)] disabled:opacity-50 sm:col-span-1`}
      >
        {downloading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Saving...
          </span>
        ) : (
          <><Download className="h-4 w-4" /> Download</>
        )}
      </button>

      {/* Share X */}
      <button
        onClick={shareToX}
        className={`${btnBase} border border-white/[0.08] bg-white/[0.03] text-white hover:border-white/15 hover:bg-white/[0.06]`}
      >
        𝕏 Share on X
      </button>

      {/* Share LinkedIn */}
      <button
        onClick={shareToLinkedIn}
        className={`${btnBase} border border-white/[0.08] bg-white/[0.03] text-white hover:border-white/15 hover:bg-white/[0.06]`}
      >
        in LinkedIn
      </button>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        className={`${btnBase} border border-white/[0.08] bg-white/[0.03] text-white hover:border-white/15 hover:bg-white/[0.06]`}
      >
        {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Link className="h-4 w-4" /> Copy Link</>}
      </button>

      {/* Challenge */}
      <button
        onClick={challengeFriend}
        className={`${btnBase} col-span-2 border border-pasquda-pink/30 text-pasquda-pink hover:bg-pasquda-pink/10 hover:border-pasquda-pink/50 hover:shadow-[0_0_20px_rgba(255,20,147,0.1)] sm:col-span-2`}
      >
        <Swords className="h-4 w-4" /> Challenge a Friend
      </button>
    </div>
  );
}

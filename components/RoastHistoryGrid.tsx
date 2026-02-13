"use client";

import Link from "next/link";
import { getGradeColor } from "@/lib/utils";
import { RoastTypeBadge } from "./RoastTypeBadge";
import type { RoastResult } from "@/lib/utils";

interface RoastHistoryGridProps {
  roasts: RoastResult[];
}

export function RoastHistoryGrid({ roasts }: RoastHistoryGridProps) {
  if (roasts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-pasquda-gray/50">No roasts found.</p>
        <p className="mt-1 text-sm text-pasquda-gray/30">
          Start roasting to build your history.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {roasts.map((roast) => {
        const gradeColor = getGradeColor(roast.grade);
        const date = new Date(roast.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <Link
            key={roast.id}
            href={`/roast/${roast.id}`}
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-pasquda-pink/20 hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between">
              <RoastTypeBadge type={roast.roast_type} />
              <span className="text-xs text-pasquda-gray/30">{date}</span>
            </div>

            <p className="mt-3 text-sm font-bold text-white break-all">
              {roast.domain}
            </p>

            <div className="mt-3 flex items-end gap-4">
              <div>
                <p className="font-mono text-2xl font-bold text-pasquda-pink">
                  {roast.score}
                  <span className="text-xs text-pasquda-gray/40">/100</span>
                </p>
              </div>
              <p
                className="font-mono text-2xl font-bold"
                style={{ color: gradeColor }}
              >
                {roast.grade}
              </p>
            </div>

            <p className="mt-2 text-xs text-white/40 leading-relaxed line-clamp-2">
              &ldquo;{roast.summary}&rdquo;
            </p>
          </Link>
        );
      })}
    </div>
  );
}

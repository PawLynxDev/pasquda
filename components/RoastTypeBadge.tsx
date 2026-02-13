import { Globe, UserRound, FileText, Swords } from "lucide-react";
import type { RoastType } from "@/lib/utils";

interface RoastTypeBadgeProps {
  type: RoastType | "battle";
}

const config = {
  website: { label: "Website", icon: Globe, color: "text-pasquda-pink" },
  linkedin: { label: "LinkedIn", icon: UserRound, color: "text-[#0077B5]" },
  resume: { label: "Resume", icon: FileText, color: "text-pasquda-green" },
  battle: { label: "Battle", icon: Swords, color: "text-yellow-400" },
};

export function RoastTypeBadge({ type }: RoastTypeBadgeProps) {
  const { label, icon: Icon, color } = config[type] || config.website;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${color}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

"use client";

import type { ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
            activeTab === tab.key
              ? "bg-pasquda-pink/15 text-pasquda-pink shadow-[0_0_12px_rgba(255,20,147,0.1)]"
              : "text-pasquda-gray/60 hover:text-white/80 hover:bg-white/[0.03]"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

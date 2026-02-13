"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { BattleCard } from "./BattleCard";
import { BattleShareButtons } from "./BattleShareButtons";
import { BattleInput } from "./BattleInput";
import { Skull } from "lucide-react";
import type { RoastResult, BattleResult } from "@/lib/utils";

interface BattlePollerProps {
  initialData: {
    battle: BattleResult;
    roast_a: RoastResult | null;
    roast_b: RoastResult | null;
  };
}

export function BattlePoller({ initialData }: BattlePollerProps) {
  const [battle, setBattle] = useState(initialData.battle);
  const [roastA, setRoastA] = useState(initialData.roast_a);
  const [roastB, setRoastB] = useState(initialData.roast_b);
  const [error, setError] = useState("");

  const pollForResult = useCallback(async () => {
    try {
      const res = await fetch(`/api/battle/${battle.id}`);
      if (!res.ok) {
        setError("Failed to load battle results. Try refreshing.");
        return;
      }
      const data = await res.json();
      setBattle(data.battle);
      setRoastA(data.roast_a);
      setRoastB(data.roast_b);

      if (data.battle.status === "failed") {
        setError(data.battle.verdict || "Battle processing failed.");
      }
    } catch {
      setError("Failed to load battle results. Try refreshing.");
    }
  }, [battle.id]);

  useEffect(() => {
    if (battle.status !== "processing") return;

    const interval = setInterval(pollForResult, 2000);
    return () => clearInterval(interval);
  }, [battle.status, pollForResult]);

  if (battle.status === "processing") {
    return <LoadingScreen />;
  }

  if (battle.status === "failed" || error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Skull className="h-16 w-16 text-grade-d" />
        <p className="mt-4 text-xl font-bold text-grade-d">
          {error || "Battle failed"}
        </p>
        <p className="mt-2 text-pasquda-gray">
          Both sites were too powerful. Try another matchup.
        </p>
        <div className="mt-8 w-full max-w-2xl">
          <BattleInput />
        </div>
      </div>
    );
  }

  if (!roastA || !roastB) return null;

  return (
    <>
      <section className="mx-auto max-w-5xl px-3 py-8 sm:px-4 sm:py-12">
        <BattleCard battle={battle} roastA={roastA} roastB={roastB} />
        <BattleShareButtons battle={battle} roastA={roastA} roastB={roastB} />
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 text-center sm:py-12">
        <h2 className="font-heading text-xl font-bold text-pasquda-pink sm:text-2xl">
          Start another battle
        </h2>
        <div className="mt-4 sm:mt-6">
          <BattleInput />
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { ReportCard } from "./ReportCard";
import { ShareButtons } from "./ShareButtons";
import { UrlInput } from "./UrlInput";
import type { RoastResult } from "@/lib/utils";

interface RoastPollerProps {
  initialRoast: RoastResult;
}

export function RoastPoller({ initialRoast }: RoastPollerProps) {
  const [roast, setRoast] = useState<RoastResult>(initialRoast);
  const [error, setError] = useState("");

  const pollForResult = useCallback(async () => {
    try {
      const res = await fetch(`/api/roast/${roast.id}`);
      if (!res.ok) {
        setError("Failed to load your roast. Try refreshing the page.");
        return;
      }
      const data: RoastResult = await res.json();
      setRoast(data);

      if (data.status === "failed") {
        setError(
          data.summary || "Something went wrong. Even Pasquda has bad days."
        );
      }
    } catch {
      setError("Failed to load your roast. Try refreshing the page.");
    }
  }, [roast.id]);

  useEffect(() => {
    if (roast.status !== "processing") return;

    const interval = setInterval(pollForResult, 2000);
    return () => clearInterval(interval);
  }, [roast.status, pollForResult]);

  // Processing state
  if (roast.status === "processing") {
    return <LoadingScreen />;
  }

  // Failed state
  if (roast.status === "failed" || error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl">💀</p>
        <p className="mt-4 text-xl font-bold text-grade-d">
          {error || "Something went wrong"}
        </p>
        <p className="mt-2 text-pasquda-gray">
          Even Pasquda has bad days. Try another URL.
        </p>
        <div className="mt-8 w-full max-w-md">
          <UrlInput />
        </div>
      </div>
    );
  }

  // Completed state
  return (
    <>
      <section className="mx-auto max-w-4xl px-3 py-8 sm:px-4 sm:py-12">
        <ReportCard roast={roast} />
        <ShareButtons roast={roast} />
      </section>

      <section className="mx-auto max-w-xl px-4 py-8 text-center sm:py-12">
        <h2 className="font-heading text-xl font-bold text-pasquda-pink sm:text-2xl">
          Think your site is better? Prove it.
        </h2>
        <div className="mt-4 sm:mt-6">
          <UrlInput challengeFrom={roast.id} compact />
        </div>
      </section>
    </>
  );
}

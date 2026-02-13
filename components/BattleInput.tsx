"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Swords } from "lucide-react";

export function BattleInput() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim() || loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url_a: urlA, url_b: urlB }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push(`/battle/${data.id}`);
    } catch {
      setError("Something went wrong. Even Pasquda has bad days.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-3">
        {/* Site A input */}
        <div className="w-full flex-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-pasquda-gray/50">
            Site A
          </label>
          <div className="rounded-xl border border-white/[0.08] bg-pasquda-black p-[1px] transition-all focus-within:border-pasquda-pink/40 focus-within:shadow-[0_0_20px_rgba(255,20,147,0.1)]">
            <input
              type="text"
              value={urlA}
              onChange={(e) => setUrlA(e.target.value)}
              placeholder="https://site-a.com"
              disabled={loading}
              className="w-full rounded-xl bg-transparent px-4 py-3 text-white placeholder-pasquda-gray/40 outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* VS badge */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-pasquda-pink/30 bg-pasquda-pink/10 sm:mt-6">
          <span className="font-heading text-xs font-bold text-pasquda-pink">VS</span>
        </div>

        {/* Site B input */}
        <div className="w-full flex-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-pasquda-gray/50">
            Site B
          </label>
          <div className="rounded-xl border border-white/[0.08] bg-pasquda-black p-[1px] transition-all focus-within:border-pasquda-pink/40 focus-within:shadow-[0_0_20px_rgba(255,20,147,0.1)]">
            <input
              type="text"
              value={urlB}
              onChange={(e) => setUrlB(e.target.value)}
              placeholder="https://site-b.com"
              disabled={loading}
              className="w-full rounded-xl bg-transparent px-4 py-3 text-white placeholder-pasquda-gray/40 outline-none disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !urlA.trim() || !urlB.trim()}
        className="mt-6 w-full shimmer-bg animate-shimmer rounded-xl px-8 py-4 font-heading text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(255,20,147,0.4)] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Starting Battle...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Swords className="h-5 w-5" /> START BATTLE
          </span>
        )}
      </button>

      {error && (
        <p className="mt-3 text-center text-sm text-grade-d animate-slide-up">{error}</p>
      )}
    </form>
  );
}

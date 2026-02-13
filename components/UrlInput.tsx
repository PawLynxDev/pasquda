"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";

interface UrlInputProps {
  challengeFrom?: string;
  compact?: boolean;
}

export function UrlInput({ challengeFrom, compact = false }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, challenge_from: challengeFrom }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error || "Something went wrong. Even Pasquda has bad days."
        );
        setLoading(false);
        return;
      }

      router.push(`/roast/${data.id}`);
    } catch {
      setError("Something went wrong. Even Pasquda has bad days.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Glow wrapper */}
      <div
        className={`rounded-2xl p-[1px] transition-all duration-300 ${
          focused
            ? "bg-gradient-to-r from-pasquda-pink/60 via-pasquda-pink-light/40 to-pasquda-pink/60 shadow-[0_0_30px_rgba(255,20,147,0.15)]"
            : "bg-white/[0.06]"
        }`}
      >
        <div
          className={`flex gap-3 rounded-2xl bg-pasquda-black ${
            compact ? "flex-col p-2 sm:flex-row" : "flex-col p-2 sm:flex-row"
          }`}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Paste a website URL..."
            disabled={loading}
            className={`flex-1 rounded-xl border-0 bg-transparent px-5 text-white placeholder-pasquda-gray/40 outline-none disabled:opacity-50 ${
              compact ? "py-3 text-base" : "py-4 text-lg"
            }`}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className={`shimmer-bg animate-shimmer whitespace-nowrap rounded-xl font-heading font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(255,20,147,0.4)] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none ${
              compact ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Flame className="h-5 w-5" /> ROAST IT</span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-grade-d animate-slide-up">{error}</p>
      )}
    </form>
  );
}

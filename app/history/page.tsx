"use client";

import { useState, useEffect } from "react";
import { History, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { RoastHistoryGrid } from "@/components/RoastHistoryGrid";
import { Footer } from "@/components/Footer";
import type { RoastResult, RoastType } from "@/lib/utils";

export default function HistoryPage() {
  const [email, setEmail] = useState("");
  const [roasts, setRoasts] = useState<RoastResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<RoastType | "all">("all");

  // Auto-load from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("pasquda_email");
    const savedToken = localStorage.getItem("pasquda_token");
    if (savedEmail && savedToken) {
      setEmail(savedEmail);
      fetchHistory(savedEmail, savedToken);
    }
  }, []);

  async function fetchHistory(e: string, t: string) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/history?email=${encodeURIComponent(e)}&token=${encodeURIComponent(t)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not load history.");
        setLoading(false);
        return;
      }

      setRoasts(data.roasts);
      setLoaded(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    // Check if we have a token for this email in localStorage
    const savedEmail = localStorage.getItem("pasquda_email");
    const savedToken = localStorage.getItem("pasquda_token");

    if (savedEmail === email.trim() && savedToken) {
      await fetchHistory(email.trim(), savedToken);
    } else {
      setError(
        "No history found for this email. Save a roast first by entering your email on a roast result page."
      );
    }
  }

  const filteredRoasts =
    filter === "all" ? roasts : roasts.filter((r) => r.roast_type === filter);

  return (
    <main className="min-h-screen bg-pasquda-black">
      <Header />

      <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-8 sm:pt-24 sm:pb-12 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-pasquda-pink/5 blur-[120px]" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-pasquda-pink/30 bg-pasquda-pink/10 animate-fade-in-up">
          <History className="h-8 w-8 text-pasquda-pink" />
        </div>

        <h1 className="relative mt-6 text-center font-heading text-3xl font-extrabold sm:text-4xl md:text-5xl animate-fade-in-up">
          Your Roast{" "}
          <span className="gradient-text">History</span>
        </h1>

        <p className="relative mt-4 max-w-md text-center text-base text-pasquda-gray/80 animate-fade-in-up">
          See all the times Pasquda destroyed your online presence.
        </p>

        {!loaded && (
          <form
            onSubmit={handleSubmit}
            className="relative mt-8 flex w-full max-w-md gap-2 animate-fade-in-up"
          >
            <div className="flex-1 rounded-xl border border-white/[0.08] bg-pasquda-black p-[1px] transition-all focus-within:border-pasquda-pink/40">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl bg-transparent px-4 py-3 text-white placeholder-pasquda-gray/40 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex items-center gap-2 rounded-xl bg-pasquda-pink/20 px-5 py-3 font-bold text-pasquda-pink transition-all hover:bg-pasquda-pink/30 active:scale-95 disabled:opacity-40"
            >
              <Search className="h-4 w-4" />
              {loading ? "Loading..." : "Find"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-sm text-grade-d animate-slide-up">{error}</p>
        )}
      </section>

      {loaded && (
        <section className="mx-auto max-w-4xl px-4 pb-12">
          {/* Filter tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto">
            {(["all", "website", "linkedin", "resume"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  filter === t
                    ? "bg-pasquda-pink/15 text-pasquda-pink"
                    : "text-pasquda-gray/50 hover:text-white/70 hover:bg-white/[0.03]"
                }`}
              >
                {t === "all"
                  ? `All (${roasts.length})`
                  : `${t.charAt(0).toUpperCase() + t.slice(1)} (${roasts.filter((r) => r.roast_type === t).length})`}
              </button>
            ))}
          </div>

          <RoastHistoryGrid roasts={filteredRoasts} />
        </section>
      )}

      <Footer />
    </main>
  );
}

"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

interface EmailCaptureProps {
  roastId: string;
  onSuccess?: () => void;
}

export function EmailCapture({ roastId, onSuccess }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/email/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roast_id: roastId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      // Store token in localStorage for history access
      if (data.token) {
        localStorage.setItem("pasquda_email", email);
        localStorage.setItem("pasquda_token", data.token);
      }

      setSuccess(true);
      onSuccess?.();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto mt-6 max-w-2xl animate-fade-in rounded-xl border border-pasquda-green/20 bg-pasquda-green/[0.04] p-4 text-center sm:mt-8 sm:p-5">
        <div className="flex items-center justify-center gap-2 text-pasquda-green">
          <Check className="h-5 w-5" />
          <span className="font-bold">Saved! Your roast is now in your history.</span>
        </div>
        <p className="mt-1 text-sm text-pasquda-gray/50">
          Visit <a href="/history" className="text-pasquda-pink hover:underline">/history</a> anytime to see your past roasts.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-2xl animate-fade-in rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:mt-8 sm:p-5">
      <div className="flex items-center gap-2 text-sm text-white/80">
        <Mail className="h-4 w-4 text-pasquda-pink" />
        <span className="font-bold">Save this roast to your history</span>
      </div>
      <p className="mt-1 text-xs text-pasquda-gray/50">
        Enter your email to keep track of all your roasts. No spam, just roasts.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={loading}
          className="flex-1 rounded-lg border border-white/[0.08] bg-pasquda-black px-4 py-2.5 text-sm text-white placeholder-pasquda-gray/40 outline-none transition-all focus:border-pasquda-pink/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="rounded-lg bg-pasquda-pink/20 px-5 py-2.5 text-sm font-bold text-pasquda-pink transition-all hover:bg-pasquda-pink/30 active:scale-95 disabled:opacity-40"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-grade-d">{error}</p>
      )}
    </div>
  );
}

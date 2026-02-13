"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, Flame } from "lucide-react";
import { TabSwitcher } from "./TabSwitcher";

export function LinkedInInput() {
  const [activeTab, setActiveTab] = useState("paste");
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image too large. Max 2MB.");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      // Extract raw base64 (strip data URL prefix)
      setImageBase64(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (activeTab === "paste" && !text.trim()) {
      setError("Paste your LinkedIn About section or profile text.");
      return;
    }
    if (activeTab === "upload" && !imageBase64) {
      setError("Upload a screenshot of your LinkedIn profile.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const body: Record<string, string> = {};
      if (activeTab === "paste") {
        body.text = text;
      } else {
        body.image_base64 = imageBase64!;
      }

      const res = await fetch("/api/roast/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
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
      <div className="flex justify-center">
        <TabSwitcher
          tabs={[
            { key: "paste", label: "Paste Text", icon: <FileText className="h-4 w-4" /> },
            { key: "upload", label: "Upload Screenshot", icon: <Upload className="h-4 w-4" /> },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="mt-6">
        {activeTab === "paste" ? (
          <div className="rounded-xl border border-white/[0.08] bg-pasquda-black p-[1px] transition-all focus-within:border-pasquda-pink/40 focus-within:shadow-[0_0_20px_rgba(255,20,147,0.1)]">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={'Paste your LinkedIn "About" section or any profile text here...'}
              disabled={loading}
              maxLength={5000}
              rows={6}
              className="w-full resize-none rounded-xl bg-transparent px-5 py-4 text-white placeholder-pasquda-gray/40 outline-none disabled:opacity-50"
            />
            <div className="flex justify-end px-4 pb-2">
              <span className="text-xs text-pasquda-gray/30">
                {text.length}/5000
              </span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center transition-all hover:border-pasquda-pink/30 hover:bg-pasquda-pink/[0.02]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded-lg border border-white/[0.06]"
                />
                <p className="text-sm text-pasquda-gray/60">Click to change</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-10 w-10 text-pasquda-gray/30 transition-colors group-hover:text-pasquda-pink/50" />
                <p className="mt-3 text-base text-pasquda-gray/60">
                  Click to upload a LinkedIn screenshot
                </p>
                <p className="mt-1 text-xs text-pasquda-gray/30">
                  PNG or JPG, max 2MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || (activeTab === "paste" ? !text.trim() : !imageBase64)}
        className="mt-6 w-full shimmer-bg animate-shimmer rounded-xl px-8 py-4 font-heading text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(255,20,147,0.4)] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Roasting...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Flame className="h-5 w-5" /> ROAST MY LINKEDIN
          </span>
        )}
      </button>

      {error && (
        <p className="mt-3 text-center text-sm text-grade-d animate-slide-up">{error}</p>
      )}
    </form>
  );
}

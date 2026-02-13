"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Flame, X } from "lucide-react";

export function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFile(f: File) {
    if (f.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.");
      return;
    }
    setError("");
    setFile(f);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || loading) return;

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/roast/resume", {
        method: "POST",
        body: formData,
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
      <div
        onClick={() => !file && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`group cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? "border-pasquda-pink/50 bg-pasquda-pink/[0.04]"
            : file
              ? "border-pasquda-green/30 bg-pasquda-green/[0.02]"
              : "border-white/[0.08] bg-white/[0.02] hover:border-pasquda-pink/30 hover:bg-pasquda-pink/[0.02]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-10 w-10 text-pasquda-green" />
            <p className="text-base font-bold text-white">{file.name}</p>
            <p className="text-xs text-pasquda-gray/50">
              {(file.size / 1024).toFixed(0)} KB
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="flex items-center gap-1 text-xs text-pasquda-gray/50 transition-colors hover:text-grade-d"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-10 w-10 text-pasquda-gray/30 transition-colors group-hover:text-pasquda-pink/50" />
            <p className="mt-3 text-base text-pasquda-gray/60">
              Drop your resume here or click to browse
            </p>
            <p className="mt-1 text-xs text-pasquda-gray/30">
              PDF only, max 5MB
            </p>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !file}
        className="mt-6 w-full shimmer-bg animate-shimmer rounded-xl px-8 py-4 font-heading text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(255,20,147,0.4)] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Reading your career regrets...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Flame className="h-5 w-5" /> ROAST MY RESUME
          </span>
        )}
      </button>

      {error && (
        <p className="mt-3 text-center text-sm text-grade-d animate-slide-up">{error}</p>
      )}
    </form>
  );
}

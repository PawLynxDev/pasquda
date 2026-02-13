import Image from "next/image";
import { Header } from "@/components/Header";
import { UrlInput } from "@/components/UrlInput";
import { HowItWorks } from "@/components/HowItWorks";
import { ExampleRoast } from "@/components/ExampleRoast";
import { Footer } from "@/components/Footer";
import { getTotalRoasts } from "@/lib/supabase";

export const revalidate = 60;

export default async function HomePage() {
  let totalRoasts = 0;
  try {
    totalRoasts = await getTotalRoasts();
  } catch {
    // Supabase not yet configured — show 0
  }

  return (
    <main className="min-h-screen bg-pasquda-black">
      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-14 sm:pt-24 sm:pb-20 overflow-hidden">
        {/* Background glow effect */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-pasquda-pink/5 blur-[120px]" />

        <div className="relative animate-fade-in-up">
          <Image
            src="/pasquda_logo_dark_text.png"
            alt="Pasquda"
            width={240}
            height={120}
            className="mb-8 h-auto w-40 sm:mb-10 sm:w-56 animate-float"
            priority
          />
        </div>

        <h1 className="relative max-w-3xl text-center font-heading text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl lg:text-7xl animate-fade-in-up">
          Your website is ugly.{" "}
          <span className="gradient-text">Let&apos;s prove it.</span>
        </h1>

        <p className="relative mt-4 max-w-xl text-center text-base text-pasquda-gray/80 animate-fade-in-up sm:mt-6 sm:text-lg md:text-xl">
          Paste any URL. Our AI will roast it, score it, and generate a Report
          Card you&apos;ll be too embarrassed not to share.
        </p>

        <div className="relative mt-8 w-full max-w-xl animate-fade-in-up sm:mt-10">
          <UrlInput />
        </div>

        {totalRoasts > 0 && (
          <p className="relative mt-5 text-sm text-pasquda-gray/50 animate-fade-in">
            🔥 {totalRoasts.toLocaleString()} websites roasted so far
          </p>
        )}
      </section>

      {/* Divider */}
      <div className="mx-auto h-px max-w-md bg-gradient-to-r from-transparent via-pasquda-pink/20 to-transparent" />

      <HowItWorks />

      {/* Divider */}
      <div className="mx-auto h-px max-w-md bg-gradient-to-r from-transparent via-pasquda-pink/20 to-transparent" />

      <ExampleRoast />
      <Footer />
    </main>
  );
}

import { FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { ResumeUpload } from "@/components/ResumeUpload";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Resume Roast — Pasquda",
  description:
    "Upload your resume PDF. Pasquda will roast your career choices, skills, and formatting decisions.",
};

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-pasquda-black">
      <Header />

      <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-14 sm:pt-24 sm:pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-pasquda-pink/5 blur-[120px]" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-pasquda-pink/30 bg-pasquda-pink/10 animate-fade-in-up">
          <FileText className="h-8 w-8 text-pasquda-pink" />
        </div>

        <h1 className="relative mt-6 max-w-3xl text-center font-heading text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl animate-fade-in-up">
          Your resume is getting{" "}
          <span className="gradient-text">rejected.</span>
        </h1>

        <p className="relative mt-4 max-w-xl text-center text-base text-pasquda-gray/80 animate-fade-in-up sm:mt-6 sm:text-lg">
          Upload your resume PDF. Pasquda will roast your career choices, skill
          claims, and that "proficient in Microsoft Office" line you still have.
        </p>

        <div className="relative mt-8 w-full max-w-xl animate-fade-in-up sm:mt-10">
          <ResumeUpload />
        </div>
      </section>

      <Footer />
    </main>
  );
}

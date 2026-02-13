import { Header } from "@/components/Header";
import { UrlInput } from "@/components/UrlInput";
import { Footer } from "@/components/Footer";

export default function RoastNotFound() {
  return (
    <main className="min-h-screen bg-pasquda-black">
      <Header />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-7xl">🔍</p>
        <h1 className="mt-4 font-heading text-3xl font-bold">
          Roast Not Found
        </h1>
        <p className="mt-2 max-w-md text-pasquda-gray">
          This roast doesn&apos;t exist. Maybe the website was so bad we deleted
          the evidence.
        </p>
        <div className="mt-8 w-full max-w-md">
          <UrlInput />
        </div>
      </div>
      <Footer />
    </main>
  );
}

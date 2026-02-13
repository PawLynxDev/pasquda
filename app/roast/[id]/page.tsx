import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoast } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { RoastPoller } from "@/components/RoastPoller";
import { Footer } from "@/components/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  let roast;
  try {
    roast = await getRoast(id);
  } catch {
    return {};
  }
  if (!roast || roast.status !== "completed") return {};

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pasquda.com";

  return {
    title: `Pasquda roasted ${roast.domain} — Score: ${roast.score}/100 💀`,
    description: roast.summary,
    openGraph: {
      title: `Pasquda roasted ${roast.domain} — Score: ${roast.score}/100 💀`,
      description: `"${roast.summary}" — Think your site is better?`,
      images: [`${appUrl}/api/og/${roast.id}`],
      url: `${appUrl}/roast/${roast.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Pasquda roasted ${roast.domain} — ${roast.grade} grade 💀`,
      description: roast.summary,
      images: [`${appUrl}/api/og/${roast.id}`],
    },
  };
}

export default async function RoastPage({ params }: PageProps) {
  const { id } = await params;
  let roast;
  try {
    roast = await getRoast(id);
  } catch {
    notFound();
  }
  if (!roast) notFound();

  return (
    <main className="min-h-screen bg-pasquda-black">
      <Header />
      <RoastPoller initialRoast={roast} />
      <Footer />
    </main>
  );
}

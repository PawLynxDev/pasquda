import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBattle, getRoast } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { BattlePoller } from "@/components/BattlePoller";
import { Footer } from "@/components/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  let battle;
  try {
    battle = await getBattle(id);
  } catch {
    return {};
  }
  if (!battle || battle.status !== "completed") return {};

  const [roastA, roastB] = await Promise.all([
    getRoast(battle.roast_a),
    getRoast(battle.roast_b),
  ]);

  if (!roastA || !roastB) return {};

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pasquda.com";

  return {
    title: `${roastA.domain} vs ${roastB.domain} — Pasquda Battle`,
    description: battle.verdict,
    openGraph: {
      title: `${roastA.domain} vs ${roastB.domain} — Pasquda Battle`,
      description: battle.verdict,
      images: [`${appUrl}/api/battle/og/${battle.id}`],
      url: `${appUrl}/battle/${battle.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${roastA.domain} vs ${roastB.domain} — Pasquda Battle`,
      description: battle.verdict,
      images: [`${appUrl}/api/battle/og/${battle.id}`],
    },
  };
}

export default async function BattleResultPage({ params }: PageProps) {
  const { id } = await params;

  let battle;
  try {
    battle = await getBattle(id);
  } catch {
    notFound();
  }
  if (!battle) notFound();

  const [roastA, roastB] = await Promise.all([
    getRoast(battle.roast_a),
    getRoast(battle.roast_b),
  ]);

  return (
    <main className="min-h-screen bg-pasquda-black">
      <Header />
      <BattlePoller
        initialData={{ battle, roast_a: roastA, roast_b: roastB }}
      />
      <Footer />
    </main>
  );
}

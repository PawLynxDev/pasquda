import { ReportCard } from "./ReportCard";
import type { RoastResult } from "@/lib/utils";

const exampleRoast: RoastResult = {
  id: "example",
  url: "https://example.com",
  domain: "example.com",
  screenshot_url: null,
  score: 73,
  grade: "D",
  roast_bullets: [
    "Your hero image is so pixelated, I thought my glasses were dirty.",
    "That color combination hasn't been acceptable since GeoCities closed.",
    "Your CTA button says 'Learn More' but the real lesson is in web design.",
  ],
  summary:
    "This website looks like it was designed by someone Googling 'how to design' while building it.",
  backhanded_compliment:
    "At least your site loads fast — probably because there's nothing worth loading.",
  report_card_url: null,
  status: "completed",
  created_at: new Date().toISOString(),
  share_count: 0,
  challenge_from: null,
  roast_type: "website",
  content_text: null,
  content_file_url: null,
  email: null,
};

export function ExampleRoast() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <h2 className="mb-2 text-center font-heading text-2xl font-bold sm:text-3xl">
        Example Roast
      </h2>
      <p className="mb-8 text-center text-sm text-pasquda-gray/50 sm:mb-10 sm:text-base">
        This is what your Report Card will look like
      </p>
      <ReportCard roast={exampleRoast} />
    </section>
  );
}

import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Pasquda — Your website is ugly. Let's prove it.",
  description:
    "AI-powered website roasting tool. Paste any URL, get a savage Report Card you'll be too embarrassed not to share.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://pasquda.com"
  ),
  openGraph: {
    title: "Pasquda — AI Website Roast",
    description: "Pasquda sees everything. And it's not impressed.",
    images: ["/pasquda_logo_dark_text.png"],
    siteName: "Pasquda",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pasquda — AI Website Roast",
    description: "Pasquda sees everything. And it's not impressed.",
  },
  icons: {
    icon: "/pasquda_logo_dark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

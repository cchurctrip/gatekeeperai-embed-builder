import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Embed Builder — Free Visual Editor with AI | GatekeeperAI",
  description: "Free Discord embed builder with real-time preview, AI generation, templates, and one-click webhook sending. Create stunning embeds visually — no code required.",
  keywords: [
    "discord embed builder",
    "discord embed generator",
    "discord embed maker",
    "discord embed creator",
    "discord embed editor",
    "discord webhook sender",
    "embed builder free",
    "discord embed tool",
    "gatekeeper ai",
  ],
  authors: [{ name: "Gatekeeper AI", url: "https://gatekeeperai.app" }],
  creator: "Gatekeeper AI",
  publisher: "Gatekeeper AI",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://embed.gatekeeperai.app",
    siteName: "Discord Embed Builder",
    title: "Discord Embed Builder — Free Visual Editor with AI",
    description: "Create stunning Discord embeds visually with AI generation, templates, and one-click webhook sending. Completely free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Discord Embed Builder by GatekeeperAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Embed Builder — Free Visual Editor with AI",
    description: "Create stunning Discord embeds visually with AI generation, templates, and one-click webhook sending.",
    images: ["/og-image.png"],
    creator: "@GatekeeperAI",
  },
  alternates: { canonical: "https://embed.gatekeeperai.app" },
  category: "Technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Discord Embed Builder",
  description: "Free visual Discord embed builder with AI generation, templates, and webhook sending.",
  url: "https://embed.gatekeeperai.app",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: { "@type": "Organization", name: "Gatekeeper AI", url: "https://gatekeeperai.app" },
  featureList: [
    "Visual embed builder with real-time preview",
    "AI-powered embed generation",
    "10 pre-built templates",
    "One-click webhook sending",
    "JSON & cURL export",
    "Shareable links",
    "Free to use",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

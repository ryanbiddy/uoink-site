import type { Metadata, Viewport } from "next";
import { Bungee, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { VercelAnalytics } from "./components/VercelAnalytics";
import { CANONICAL_URL } from "./content/pages";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-inter", display: "swap" });
const bungee = Bungee({ subsets: ["latin"], weight: "400", variable: "--font-bungee", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: { default: "Uoink - local corpus for creators and AI developers", template: "%s | Uoink" },
  description:
    "Uoink keeps videos, podcasts, and articles on your disk, then hands them to your AI as a cited corpus you can write from.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Uoink",
    title: "Uoink - local corpus for creators and AI developers",
    description: "Save videos, podcasts, and articles as a cited local corpus for Claude, ChatGPT, Cursor, and MCP agents.",
    url: CANONICAL_URL,
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "The Uoink dashboard: a populated local corpus of saved videos ready to hand to your AI." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uoink - local corpus for creators and AI developers",
    description: "Save videos, podcasts, and articles as a cited local corpus for Claude, ChatGPT, Cursor, and MCP agents.",
    images: ["/og-cover.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: "#C2410C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bungee.variable} ${mono.variable}`}>
      <head>
        <link href="/assets/favicon.svg" rel="mask-icon" color="#C2410C" />
        <link rel="alternate" type="application/json" title="Uoink MCP manifest" href="/mcp/manifest.json" />
      </head>
      <body>
        {children}
        <VercelAnalytics />
        <Script src="/nav.js" strategy="afterInteractive" />
        <Script src="/uoink-mark.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

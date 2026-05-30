import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Bungee, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-inter", display: "swap" });
const bungee = Bungee({ subsets: ["latin"], weight: "400", variable: "--font-bungee", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://uoink.video"),
  title: { default: "Uoink - local video corpus for any AI", template: "%s | Uoink" },
  description:
    "Uoink turns videos and podcasts into private local corpora for Claude, ChatGPT, Cursor, and MCP-capable agents.",
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
    title: "Uoink - local video corpus for any AI",
    description: "One click turns video and podcasts into local corpora for Claude, ChatGPT, Cursor, and MCP agents.",
    url: "https://uoink.video",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Uoink local video corpus site preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uoink - local video corpus for any AI",
    description: "One click turns video and podcasts into local corpora for Claude, ChatGPT, Cursor, and MCP agents.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: "#C2410C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="/assets/favicon.svg" rel="mask-icon" color="#C2410C" />
        <link rel="alternate" type="application/json" title="Uoink MCP manifest" href="/mcp/manifest.json" />
      </head>
      <body className={`${inter.variable} ${bungee.variable} ${mono.variable}`}>
        {children}
        <Analytics />
        <Script src="/nav.js" strategy="afterInteractive" />
        <Script src="/uoink-mark.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

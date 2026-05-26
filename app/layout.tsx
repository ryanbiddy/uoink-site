import type { Metadata, Viewport } from "next";
import { Bungee, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-inter", display: "swap" });
const bungee = Bungee({ subsets: ["latin"], weight: "400", variable: "--font-bungee", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://uoink.video"),
  title: { default: "Uoink — the YouTube layer for any AI", template: "%s | Uoink" },
  description: "Uoink turns any YouTube video into structured input for Claude, ChatGPT, or your MCP agent. Local-first, open source, no cloud.",
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
    title: "Uoink — the YouTube layer for any AI",
    description: "One click on any YouTube video into Claude, ChatGPT, or your MCP agent. Local-first. Open source.",
    url: "https://uoink.video",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Uoink — Uoink any video. Read it like a doc." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uoink — the YouTube layer for any AI",
    description: "One click on any YouTube video into Claude, ChatGPT, or your MCP agent. Local-first. Open source.",
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
      </head>
      <body className={`${inter.variable} ${bungee.variable} ${mono.variable}`}>
        {children}
        <script src="/nav.js" defer></script>
        <script src="/config-generator.js" defer></script>
        <script src="/uoink-mark.js" defer></script>
      </body>
    </html>
  );
}

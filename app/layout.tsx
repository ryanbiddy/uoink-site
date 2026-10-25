import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { VercelAnalytics } from "./components/VercelAnalytics";
import { CANONICAL_URL } from "./content/pages";
import "./globals.css";
import "./family-kit.css";

const inter = localFont({ src: [
  { path: "./fonts/inter.woff", weight: "100 900", style: "normal" },
  { path: "./fonts/inter-italic.woff", weight: "100 900", style: "italic" },
], variable: "--font-inter", display: "swap" });
const bungee = localFont({ src: "./fonts/bungee.woff", weight: "400", variable: "--font-bungee", display: "swap" });
const mono = localFont({ src: "./fonts/jetbrains-mono.woff", weight: "100 800", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: { default: "Uoink | Save YouTube and podcast transcripts for your AI", template: "%s | Uoink" },
  description:
    "Save YouTube videos, podcasts and articles to your own disk. Your AI searches the library and cites the timestamp. Free and open source, for Windows.",
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
    title: "Uoink | Save YouTube and podcast transcripts for your AI",
    description: "Save YouTube videos, podcasts and articles to your own disk. Your AI searches the library and cites the timestamp. Free and open source, for Windows.",
    url: CANONICAL_URL,
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "Uoink: Save what you watch. Your AI writes from it, with receipts." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uoink | Save YouTube and podcast transcripts for your AI",
    description: "Save YouTube videos, podcasts and articles to your own disk. Your AI searches the library and cites the timestamp. Free and open source, for Windows.",
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "Uoink: Save what you watch. Your AI writes from it, with receipts." }],
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
        {/*
          Google Search Console site verification (HTML-tag method).
          HOW TO USE:
            1. Go to https://search.google.com/search-console and add a URL-prefix
               property for https://uoink.app.
            2. Choose the "HTML tag" verification method. Google shows you a tag like
               <meta name="google-site-verification" content="AbC123..." />.
            3. Paste that content token below, delete the surrounding comment markers
               on the next line so the <meta> renders, then redeploy and click Verify.
          TODO: paste your token, then uncomment the line below.
        */}
        {/* <meta name="google-site-verification" content="PASTE_YOUR_GOOGLE_TOKEN_HERE" /> */}
        <link href="/assets/favicon.svg" rel="mask-icon" color="#C2410C" />
        <link rel="alternate" type="application/json" title="Uoink MCP manifest" href="/mcp/manifest.json" />
      </head>
      <body>
        {children}
        <VercelAnalytics />
        <Script src="/uoink-mark.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

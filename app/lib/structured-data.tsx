import { CANONICAL_URL, DOWNLOAD_URL, GITHUB_URL, VERSION_NUMBER, X_URL } from "../content/pages";
import { MAC_DMG_URL, PRODUCT_STATUS } from "../content/product-status";

// One source for the JSON-LD and social-card values that every page shares.
// Keep these to facts the pages state in visible text: no ratings, no reviews.

// Public listings of Uoink itself. Each URL is a page about this product.
export const LISTINGS = [
  { name: "GitHub", url: GITHUB_URL },
  { name: "Homebrew tap (Mac preview)", url: "https://github.com/ryanbiddy/homebrew-uoink" },
  { name: "Glama", url: "https://glama.ai/mcp/servers/ryanbiddy/uoink" },
  { name: "MCP Market", url: "https://mcpmarket.com/server/uoink" },
  { name: "mcpservers.org", url: "https://mcpservers.org/servers/ryanbiddy/uoink" },
];

export const MCP_REGISTRY_URL = "https://registry.modelcontextprotocol.io/v0/servers?search=io.github.ryanbiddy/uoink";

// Pages that set their own openGraph/twitter metadata replace the layout's, so
// they pass these to keep the share image.
export const OG_IMAGE = { url: "/og-cover.png", width: 1200, height: 630, alt: "Uoink: Save what you watch. Your AI writes from it, with receipts." };
export const socialImages = {
  openGraph: { siteName: "Uoink", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image" as const, images: [OG_IMAGE] },
};

export const UOINK_SUMMARY =
  "Uoink is a free, open-source, local-first research library for Windows, with a Mac preview. It saves YouTube videos, podcasts, X posts, Reddit threads and web articles with their transcripts as Markdown and JSON on your own disk, and lets Claude, Cursor, Codex and other MCP clients search the library and cite the source and timestamp.";

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${CANONICAL_URL}/#organization`,
  name: "Uoink",
  url: CANONICAL_URL,
  logo: `${CANONICAL_URL}/icon-512.png`,
  email: "hi@uoink.app",
  sameAs: [GITHUB_URL, X_URL],
};

export function softwareApplication(featureList?: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${CANONICAL_URL}/#software`,
    name: "Uoink",
    description: UOINK_SUMMARY,
    applicationCategory: "UtilityApplication",
    applicationSubCategory: "Research library and MCP server",
    operatingSystem: PRODUCT_STATUS.mac.operatingSystem,
    softwareVersion: VERSION_NUMBER,
    downloadUrl: [DOWNLOAD_URL, MAC_DMG_URL],
    installUrl: `${CANONICAL_URL}/install`,
    releaseNotes: `${CANONICAL_URL}/changelog`,
    url: CANONICAL_URL,
    license: `${GITHUB_URL}/blob/main/LICENSE`,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    screenshot: [`${CANONICAL_URL}/product/hero-library.webp`, `${CANONICAL_URL}/product/library-search.webp`],
    image: `${CANONICAL_URL}/og-cover.png`,
    publisher: { "@type": "Organization", "@id": `${CANONICAL_URL}/#organization`, name: "Uoink", url: CANONICAL_URL },
    author: { "@type": "Person", name: "Ryan Biddy", url: "https://x.com/replayryan" },
    sameAs: LISTINGS.map(listing => listing.url),
    featureList: featureList ?? [
      "Save YouTube videos with timestamped transcripts, frames and comments",
      "Save podcasts, X posts and videos, Reddit threads and web articles",
      "Local Whisper transcription for videos without captions",
      "Markdown and JSON files on your disk, with a local search index",
      "Model Context Protocol (MCP) server for Claude, Cursor, Codex and other clients",
      "Evidence cards that cite the source and timestamp",
      "Writing Studio drafts from saved sources, with citations",
    ],
  };
}

export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${CANONICAL_URL}/#website`,
  name: "Uoink",
  url: CANONICAL_URL,
  description: UOINK_SUMMARY,
  publisher: { "@type": "Organization", "@id": `${CANONICAL_URL}/#organization`, name: "Uoink", url: CANONICAL_URL },
};

// Breadcrumbs for deep pages. Pass [name, route] pairs after Home.
export function breadcrumbs(trail: [string, string][]) {
  const items: [string, string][] = [["Uoink", "/"], ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, route], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${CANONICAL_URL}${route === "/" ? "" : route}`,
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { CANONICAL_URL, pages } from "../content/pages";
import { MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT } from "../content/mcp-tools";

const page = pages.mcp;

export const metadata: Metadata = {
  title: page.title,
  description: `${MCP_TOOL_COUNT} MCP tools in the registry, ${MCP_STDIO_TOOL_COUNT} curated over stdio. Available instantly.`,
  keywords: page.keywords,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "The Uoink dashboard: a populated local corpus of saved videos ready to hand to your AI." }] },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
  other: {
    "mcp-manifest": `${CANONICAL_URL}/mcp/manifest.json`,
  },
};

export default function Page() {
  return <PageShell page={page} />;
}

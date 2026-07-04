import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { CANONICAL_URL, pages } from "../content/pages";

const page = pages.mcp;

export const metadata: Metadata = {
  title: page.title,
  description: "64 MCP tools in the registry, 14 curated over stdio. Available instantly.",
  keywords: page.keywords,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route },
  twitter: { title: page.title, description: page.description },
  other: {
    "mcp-manifest": `${CANONICAL_URL}/mcp/manifest.json`,
  },
};

export default function Page() {
  return <PageShell page={page} />;
}

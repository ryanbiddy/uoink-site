import Link from "next/link";
import type { Metadata } from "next";
import { SeoArticle } from "../components/SeoArticle";
import { facts, factsTitle, factsOpening, factsDescription } from "../content/seo-pages";
import { breadcrumbs, JsonLd, LISTINGS, MCP_REGISTRY_URL, socialImages, softwareApplication } from "../lib/structured-data";

export const metadata: Metadata = {
  title: factsTitle,
  description: factsDescription,
  alternates: { canonical: "/facts" },
  openGraph: { ...socialImages.openGraph, title: factsTitle, description: factsDescription, url: "/facts" },
  twitter: { ...socialImages.twitter, title: factsTitle, description: factsDescription },
};

const comparisons = [
  ["Uoink vs NotebookLM", "/compare/notebooklm"],
  ["Uoink vs Readwise Reader", "/compare/readwise-reader"],
  ["Uoink vs Obsidian Web Clipper", "/compare/obsidian-web-clipper"],
  ["Uoink vs Recall", "/compare/recall"],
  ["Uoink vs Snipd", "/compare/snipd"],
  ["Uoink as a Pocket alternative", "/compare/pocket"],
  ["Uoink vs YouTube transcript MCP servers", "/compare/youtube-transcript-mcp"],
];

export default function FactsPage() {
  const rows = [
    ["What it is", facts.summary],
    ["Version", facts.version],
    ["Platform", facts.platform],
    ["Price", facts.price],
    ["License", facts.license],
    ["Where data lives", facts.storage],
    ["MCP registry ID", facts.registry],
    ["Supported sources", facts.supported.join(" ")],
    ["Chat apps without MCP", facts.chatApps],
    ["Mac support", facts.mac],
    ["Data and network access", facts.privacy],
  ];
  return (
    <SeoArticle route="/facts">
      <p className="meta"><Link href="/">Uoink home</Link></p>
      <h1>Uoink facts</h1>
      <p className="standfirst">{factsOpening}</p>
      <dl>{rows.map(([label, value]) => <div key={label}><dt><strong>{label}</strong></dt><dd style={{ margin: "6px 0 24px", overflowWrap: "anywhere" }}>{value}</dd></div>)}</dl>
      <h2>How it compares</h2>
      <ul>{comparisons.map(([name, href]) => <li key={href}><Link href={href}>{name}</Link></li>)}</ul>
      <h2>Where Uoink is listed</h2>
      <ul>
        <li><a href={MCP_REGISTRY_URL}>Official MCP registry</a>: {facts.registry}</li>
        {LISTINGS.map(listing => <li key={listing.url}><a href={listing.url}>{listing.name}</a></li>)}
      </ul>
      <p>Source: <a href="/llms.txt">Uoink llms.txt</a>. Read the <Link href="/privacy">privacy disclosures</Link> and <Link href="/changelog">release notes</Link>.</p>
      <div className="ctas"><Link className="btn primary" href="/install">Get Uoink</Link><Link className="btn ghost" href="/">Uoink home</Link></div>
      <JsonLd data={[softwareApplication(), breadcrumbs([["Facts", "/facts"]])]} />
    </SeoArticle>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { SeoArticle } from "../components/SeoArticle";
import { facts, factsTitle, factsOpening, factsDescription } from "../content/seo-pages";

export const metadata: Metadata = {
  title: factsTitle,
  description: factsDescription,
  alternates: { canonical: "/facts" },
  openGraph: { title: factsTitle, description: factsDescription, url: "/facts" },
  twitter: { title: factsTitle, description: factsDescription },
};

export default function FactsPage() {
  const rows = [
    ["Version", facts.version],
    ["Platform", facts.platform],
    ["Price", facts.price],
    ["License", facts.license],
    ["Where data lives", facts.storage],
    ["MCP registry ID", facts.registry],
    ["Supported sources", facts.supported.join(" ")],
    ["Mac support", facts.unsupported],
    ["Data and network access", facts.privacy],
  ];
  return (
    <SeoArticle route="/facts">
      <p className="meta"><Link href="/">Uoink home</Link></p>
      <h1>Uoink facts</h1>
      <p className="standfirst">{factsOpening}</p>
      <dl>{rows.map(([label, value]) => <div key={label}><dt><strong>{label}</strong></dt><dd style={{ margin: "6px 0 24px", overflowWrap: "anywhere" }}>{value}</dd></div>)}</dl>
      <p>Source: <a href="/llms.txt">Uoink llms.txt</a>. Read the <Link href="/privacy">privacy disclosures</Link> and <Link href="/changelog">release notes</Link>.</p>
      <div className="ctas"><Link className="btn primary" href="/install">Get Uoink</Link><Link className="btn ghost" href="/">Uoink home</Link></div>
    </SeoArticle>
  );
}

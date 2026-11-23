import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import type { SitePage } from "../content/pages";
import { comparisonSlugs, getComparison } from "./comparison-data";
import "./compare.css";

const page: SitePage = {
  id: "features", route: "/compare", mode: "mode-light",
  title: "Uoink vs Recall, Snipd, Reader and NotebookLM",
  description: "Compare Uoink with Readwise Reader, Obsidian Web Clipper, NotebookLM, Recall, Snipd, Pocket and YouTube transcript MCP servers. See what each saves.",
  keywords: [], html: "",
};
export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: page.route } };

export default function Page() {
  return <PageShell page={page}>
    <section className="hero"><div className="container"><div className="doc">
      <span className="eyebrow">compare</span><h1 className="display-xl">Compare Uoink.</h1>
      <p className="lede">Choose a tool for what you save, where you read and how your AI reaches your sources.</p>
    </div></div></section>
    <section className="section flush"><div className="container"><div className="doc comparison-prose">
      {comparisonSlugs.map(slug => { const article = getComparison(slug); return <section key={slug}>
        <h2><Link href={`/compare/${slug}`}>{article.heading}</Link></h2><p>{article.description}</p>
      </section>; })}
      <section><h2><Link href="/compare/notebooklm">Uoink vs NotebookLM</Link></h2></section>
    </div></div></section>
  </PageShell>;
}

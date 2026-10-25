import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../components/PageShell";
import type { SitePage } from "../../content/pages";
import { comparisonSlugs, getComparison } from "../comparison-data";
import "../compare.css";

export const dynamicParams = false;
export function generateStaticParams() { return comparisonSlugs.map(slug => ({ slug })); }

async function readPage(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const known = comparisonSlugs.find(value => value === slug);
  if (!known) notFound();
  return getComparison(known);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await readPage(params);
  const url = `/compare/${article.slug}`;
  return {
    title: article.title, description: article.description, alternates: { canonical: url },
    openGraph: { title: article.title, description: article.description, url },
    twitter: { title: article.title, description: article.description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const article = await readPage(params);
  const page: SitePage = { id: "features", route: `/compare/${article.slug}`, mode: "mode-light", title: article.title, description: article.description, keywords: [], html: "" };
  return <PageShell page={page}>
    <article className="comparison-page">
      <section className="hero"><div className="container"><div className="doc">
        <Link className="eyebrow" href="/compare">All comparisons</Link>
        <h1 className="display-xl">{article.heading}</h1>
        <p className="lede">{article.opening}</p>
        <div className="ctas"><Link className="btn primary large" href="/install">Get Uoink</Link></div>
      </div></div></section>
      <section className="section flush"><div className="container"><div className="doc comparison-prose" dangerouslySetInnerHTML={{ __html: article.html }} /></div></section>
      <div className="container"><div className="doc"><Link className="btn ghost" href="/compare">All comparisons</Link></div></div>
    </article>
  </PageShell>;
}

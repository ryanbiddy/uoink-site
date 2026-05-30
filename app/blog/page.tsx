import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { CANONICAL_URL, RELEASE_URL, SitePage } from "../content/pages";
import { BlogIndexClient } from "./BlogIndexClient";
import { blogArticles, blogTags } from "./blog-data";

const page: SitePage = {
  id: "blog",
  route: "/blog",
  mode: "mode-light",
  title: "Uoink Field Notes: YouTube Research, Agents, Local Corpus Workflows",
  description:
    "Launch essays and how-to guides on YouTube hook types, local-first research, MCP agents, Writing Studio, and universal page capture.",
  keywords: [
    "youtube hook types",
    "youtube research workflow",
    "local-first AI tools",
    "MCP YouTube agent",
    "creator research blog",
  ],
  html: `
<section class="hero blog-hero" data-screen-label="blog / hero">
  <div class="container blog-hero-grid">
    <div class="section-head">
      <span class="eyebrow">field notes</span>
      <h1 class="display-xl">The working notes behind Uoink.</h1>
      <p class="lede">Hooks, corpus workflows, agent memory, local-first tradeoffs, and the product decisions underneath the launch.</p>
      <div class="ctas"><a class="btn primary large" href="${RELEASE_URL}">Install Uoink</a><a class="btn ghost large" href="/blog/rss.xml">RSS feed</a></div>
    </div>
    <div class="blog-hero-note" aria-label="Blog publishing model">
      <span class="eyebrow">agent-readable</span>
      <p>Every article ships with canonical metadata, schema, RSS, and clean text for crawlers. Humans get the readable version. Agents get the same facts without guessing.</p>
      <a class="arr-link" href="${CANONICAL_URL}/llms.txt">Read llms.txt -&gt;</a>
    </div>
  </div>
</section>`,
};

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Uoink field notes" }],
  },
  twitter: { title: page.title, description: page.description, images: ["/og-image.png"] },
};

export default function BlogPage() {
  return (
    <PageShell page={page}>
      <BlogIndexClient articles={blogArticles} tags={blogTags} />
      <section className="section tight blog-agent-strip" data-screen-label="blog / agent ingest">
        <div className="container blog-agent-grid">
          <div>
            <span className="eyebrow">crawl this first</span>
            <h2 className="display-m">Canonical paths for people and agents.</h2>
          </div>
          <div className="blog-agent-links">
            <Link href="/features">Feature index</Link>
            <Link href="/mcp">MCP manifest</Link>
            <a href="/llms-full.txt">llms-full.txt</a>
            <a href="/blog/rss.xml">RSS</a>
          </div>
        </div>
      </section>
      <BlogIndexJsonLd />
    </PageShell>
  );
}

function BlogIndexJsonLd() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Uoink Field Notes",
      description: page.description,
      url: `${CANONICAL_URL}/blog`,
      blogPost: blogArticles.map((article) => ({
        "@type": "BlogPosting",
        headline: article.title,
        description: article.dek,
        datePublished: article.publishedAt,
        url: `${CANONICAL_URL}/blog/${article.slug}`,
        keywords: article.tags.join(", "),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Uoink launch article cluster",
      numberOfItems: blogArticles.length,
      itemListElement: blogArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: `${CANONICAL_URL}/blog/${article.slug}`,
      })),
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

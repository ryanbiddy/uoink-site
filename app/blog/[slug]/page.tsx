import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../components/PageShell";
import { CANONICAL_URL, RELEASE_URL, SitePage } from "../../content/pages";
import { BlogArticle, blogArticles, getAdjacentArticles, getArticleBySlug, getArticleUrl } from "../blog-data";
import { markdownToHtml } from "../markdown";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.dek,
    keywords: article.tags,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.dek,
      url: `/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      tags: article.tags,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${article.title} by Uoink` }],
    },
    twitter: { title: article.title, description: article.dek, images: ["/og-image.png"] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const page: SitePage = {
    id: "blog",
    route: `/blog/${article.slug}`,
    mode: "mode-light",
    title: article.title,
    description: article.dek,
    keywords: article.tags,
    html: "",
  };
  const adjacent = getAdjacentArticles(article.slug);

  return (
    <PageShell page={page}>
      <article className="blog-article" data-screen-label={`blog / ${article.slug}`}>
        <section className="blog-article-hero">
          <div className="container blog-article-hero-grid">
            <div>
              <p className="crumb">
                <Link href="/blog">Field notes</Link> / {article.tags[0]}
              </p>
              <div className="article-kicker">
                <span>{formatDate(article.publishedAt)}</span>
                <span>{article.readingMinutes} min read</span>
              </div>
              <h1 className="display-xl">{article.title}</h1>
              <p className="lede">{article.dek}</p>
              <div className="article-tags">
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${tag}`}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            <ArticlePoster article={article} />
          </div>
        </section>

        <section className="section blog-article-section">
          <div className="container blog-article-layout">
            <aside className="article-rail" aria-label="Article tools">
              <div className="rail-card">
                <span className="eyebrow">source trail</span>
                <a href="/llms-full.txt">llms-full.txt</a>
                <a href="/api/features-manifest">feature manifest</a>
                <a href="/blog/rss.xml">RSS feed</a>
              </div>
              <div className="rail-card">
                <span className="eyebrow">try it</span>
                <a href={RELEASE_URL}>Install Uoink</a>
                <Link href="/features">Feature index</Link>
              </div>
            </aside>
            <div className="article article-body" dangerouslySetInnerHTML={{ __html: markdownToHtml(article.body) }} />
          </div>
        </section>

        <section className="section tight next-articles" data-screen-label={`blog / ${article.slug} / next`}>
          <div className="container next-article-grid">
            {adjacent.previous ? (
              <Link href={`/blog/${adjacent.previous.slug}`} className="next-article-card">
                <span className="eyebrow">previous</span>
                <h2>{adjacent.previous.title}</h2>
                <p>{adjacent.previous.dek}</p>
              </Link>
            ) : (
              <Link href="/blog" className="next-article-card">
                <span className="eyebrow">index</span>
                <h2>Back to field notes</h2>
                <p>Read the rest of the launch cluster.</p>
              </Link>
            )}
            {adjacent.next ? (
              <Link href={`/blog/${adjacent.next.slug}`} className="next-article-card accent">
                <span className="eyebrow">next</span>
                <h2>{adjacent.next.title}</h2>
                <p>{adjacent.next.dek}</p>
              </Link>
            ) : (
              <Link href="/install" className="next-article-card accent">
                <span className="eyebrow">ship it</span>
                <h2>Install Uoink</h2>
                <p>Turn the next useful video into a local corpus.</p>
              </Link>
            )}
          </div>
        </section>
      </article>
      <ArticleJsonLd article={article} />
    </PageShell>
  );
}

function ArticlePoster({ article }: { article: BlogArticle }) {
  return (
    <div className={`blog-poster large ${article.heroTone}`} aria-label={`${article.title} visual marker`}>
      <span className="poster-grid-line one" />
      <span className="poster-grid-line two" />
      <span className="poster-stamp">FIELD NOTES</span>
      <span className="poster-node a" />
      <span className="poster-node b" />
      <span className="poster-node c" />
      <span className="poster-path" />
      <div className="poster-caption">
        <span>{article.tags[0]}</span>
        <strong>{article.readingMinutes} min</strong>
      </div>
    </div>
  );
}

function ArticleJsonLd({ article }: { article: BlogArticle }) {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: article.title,
      description: article.dek,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      url: getArticleUrl(article.slug),
      mainEntityOfPage: getArticleUrl(article.slug),
      image: `${CANONICAL_URL}/og-image.png`,
      author: { "@type": "Person", name: "Ryan Biddy", url: "https://ryanbiddy.com" },
      publisher: { "@type": "Organization", name: "Uoink", url: CANONICAL_URL },
      keywords: article.tags.join(", "),
      about: ["Uoink", "local corpus", "Model Context Protocol", ...article.tags],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Uoink", item: CANONICAL_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${CANONICAL_URL}/blog` },
        { "@type": "ListItem", position: 3, name: article.title, item: getArticleUrl(article.slug) },
      ],
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

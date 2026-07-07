import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { getFeatureLogoKeys, PlatformLogoStrip } from "../components/PlatformLogoStrip";
import { CANONICAL_URL, RELEASE_URL, SitePage, pages } from "../content/pages";
import { featureCategories, features, featuresByCategory } from "./feature-data";

const page: SitePage = {
  ...pages.features,
  route: "/features",
  mode: "mode-light",
  title: "Uoink Features: Capture, Library, Workspace, Verification, MCP, Identity",
  description:
    "Every Uoink feature, grouped by capture, library, workspace, verification, distribution, and identity surfaces.",
  keywords: [
    "youtube transcript tool features",
    "local video corpus database",
    "mcp youtube server",
    "youtube hook classification",
  ],
  html: `
<section class="hero" data-screen-label="features / hero">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">feature inventory</span>
      <h1 class="display-xl">Everything Uoink does.</h1>
      <p class="lede">Capture the source, build the library, assemble workspaces, verify claims, then hand the evidence to Claude, ChatGPT, Cursor, or an MCP agent.</p>
      <div class="ctas"><a class="btn primary large" href="${RELEASE_URL}">Install Uoink</a><a class="btn ghost large" href="/api/features-manifest">Manifest JSON</a></div>
    </div>
    <figure class="feature-visual product-figure wide">
      <div class="feature-visual-top"><span>topics</span><span>auto-organized</span></div>
      <div class="feature-visual-body">
        <div class="feature-visual-shot">
          <img src="/product/topics-overview.webp" width="1440" height="900" loading="lazy" decoding="async" alt="Uoink topics view: the local library grouped into topic chips with live counts such as AI and ML, Social Media Research, and Job Hunt, each filtering the captured sources." />
          <figcaption>Captures route themselves into topics with live counts, so the library stays browsable as it grows.</figcaption>
        </div>
      </div>
    </figure>
  </div>
</section>`,
};

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: "/features" },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/features",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Uoink feature inventory" }],
  },
  twitter: { title: page.title, description: page.description, images: ["/og-image.png"] },
};

export default function Page() {
  return (
    <PageShell page={page}>
      <section className="section feature-index" data-screen-label="features / grouped index">
        <div className="container">
          <div className="feature-index-bar" aria-label="Feature category links">
            {featureCategories.map((category) => (
              <a key={category.name} href={`#${category.name.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}>
                {category.name}
              </a>
            ))}
          </div>
          {featureCategories.map((category) => {
            const categoryFeatures = featuresByCategory(category.name);
            const id = category.name.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and");

            return (
              <section key={category.name} id={id} className="feature-category" data-screen-label={`features / ${id}`}>
                <div className="feature-category-head">
                  <span className="eyebrow">{category.name}</span>
                  <h2 className="display-l">{category.name}</h2>
                  <p>{category.deck}</p>
                </div>
                <div className="feature-card-grid">
                  {categoryFeatures.map((feature) => (
                    <Link key={feature.slug} href={`/features/${feature.slug}`} className="feature-card">
                      <div className="feature-card-head">
                        <PlatformLogoStrip logos={getFeatureLogoKeys(feature)} compact />
                        <span className={`feature-status ${feature.status.replaceAll(" ", "-")}`}>{feature.status}</span>
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.summary}</p>
                      <span className="arr-link">Open feature -&gt;</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
      <FeatureIndexJsonLd />
    </PageShell>
  );
}

function FeatureIndexJsonLd() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Uoink feature inventory",
      url: `${CANONICAL_URL}/features`,
      numberOfItems: features.length,
      itemListElement: features.map((feature, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: feature.title,
        url: `${CANONICAL_URL}/features/${feature.slug}`,
      })),
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

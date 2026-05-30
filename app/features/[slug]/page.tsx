import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../components/PageShell";
import { CANONICAL_URL, GITHUB_URL, RELEASE_URL, SitePage } from "../../content/pages";
import { Feature, featureBySlug, features, getRelatedFeatures } from "../feature-data";
import { EmbedMode } from "./EmbedMode";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return features.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = featureBySlug.get(slug);
  if (!feature) return {};

  const title = `${feature.title}: Uoink feature`;
  const description = feature.summary;

  return {
    title,
    description,
    keywords: feature.keywords,
    alternates: { canonical: `/features/${feature.slug}` },
    openGraph: {
      title,
      description,
      url: `/features/${feature.slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${feature.title} in Uoink` }],
    },
    twitter: { title, description, images: ["/og-image.png"] },
  };
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params;
  const feature = featureBySlug.get(slug);
  if (!feature) notFound();

  const page: SitePage = {
    id: "features",
    route: `/features/${feature.slug}`,
    mode: "mode-light",
    title: `${feature.title}: Uoink feature`,
    description: feature.summary,
    keywords: feature.keywords,
    html: "",
  };

  return (
    <PageShell page={page}>
      <EmbedMode />
      <article className="feature-page" data-screen-label={`feature / ${feature.slug}`}>
        <section className="feature-hero">
          <div className="container feature-hero-grid">
            <div>
              <p className="crumb">
                <Link href="/features">Features</Link> / {feature.category}
              </p>
              <span className="eyebrow">{feature.status}</span>
              <h1 className="display-xl">{feature.title}</h1>
              <p className="lede">{feature.summary}</p>
              <div className="ctas">
                <a className="btn primary large" href={RELEASE_URL}>
                  Install Uoink
                </a>
                <Link className="btn ghost large" href="/features">
                  Back to features
                </Link>
              </div>
            </div>
            <FeatureVisual feature={feature} />
          </div>
        </section>

        <section className="section">
          <div className="container feature-detail-grid">
            <div className="feature-copy">
              <section id="what-it-does" data-screen-label={`feature / ${feature.slug} / what it does`}>
                <span className="eyebrow">what it does</span>
                <h2 className="display-m">The user-facing part.</h2>
                <p>{feature.whatItDoes}</p>
              </section>

              <section id="getting-started" data-screen-label={`feature / ${feature.slug} / getting started`}>
                <span className="eyebrow">getting started</span>
                <h2 className="display-m">Run the loop.</h2>
                <ol className="feature-steps">
                  {feature.gettingStarted.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>

              <section id="behind-scenes" data-screen-label={`feature / ${feature.slug} / behind scenes`}>
                <span className="eyebrow">behind the scenes</span>
                <h2 className="display-m">How Uoink handles it.</h2>
                <p>{feature.behindScenes}</p>
              </section>

              <section id="mcp-reference" data-screen-label={`feature / ${feature.slug} / mcp`}>
                <span className="eyebrow">mcp reference</span>
                <h2 className="display-m">Agent-readable surface.</h2>
                {feature.mcpTools.length ? (
                  <div className="feature-tool-list">
                    {feature.mcpTools.map((tool) => (
                      <code key={tool}>{tool}</code>
                    ))}
                  </div>
                ) : (
                  <p>This feature runs without a dedicated MCP tool. Agents can still use the local corpus it produces.</p>
                )}
                {feature.mcpExample ? (
                  <pre className="feature-code-example">
                    <code>{feature.mcpExample}</code>
                  </pre>
                ) : null}
                <p>
                  Full server metadata lives at <Link href="/mcp">/mcp</Link> and{" "}
                  <a href="/mcp/manifest.json">/mcp/manifest.json</a>.
                </p>
              </section>

              <section id="try-it-now" data-screen-label={`feature / ${feature.slug} / try it`}>
                <span className="eyebrow">try it now</span>
                <h2 className="display-m">Run it on your next source.</h2>
                <p>{feature.cta}</p>
                <p>
                  <a className="btn primary large" href={RELEASE_URL}>
                    Install Uoink
                  </a>
                </p>
              </section>
            </div>

            <aside className="feature-side">
              <div className="feature-side-card">
                <span className="eyebrow">product shot</span>
                <h3>{feature.screenshot.title}</h3>
                <p>{feature.screenshot.alt}</p>
                <p className="mono caps">Dashboard embed ready</p>
              </div>
              <div className="feature-side-card">
                <span className="eyebrow">related</span>
                <div className="related-list">
                  {getRelatedFeatures(feature).map((related) => (
                    <Link key={related.slug} href={`/features/${related.slug}`}>
                      {related.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="feature-side-card">
                <span className="eyebrow">source</span>
                <a className="arr-link" href={GITHUB_URL}>
                  Audit the code -&gt;
                </a>
              </div>
            </aside>
          </div>
        </section>
      </article>
      <FeatureJsonLd feature={feature} />
    </PageShell>
  );
}

function FeatureVisual({ feature }: { feature: Feature }) {
  const tool = feature.mcpTools[0] ?? "local corpus";

  return (
    <div className="feature-visual" aria-label={feature.screenshot.alt}>
      <div className="feature-visual-top">
        <span>{feature.category}</span>
        <span>{feature.status}</span>
      </div>
      <div className="feature-visual-body">
        <div className="mini-heading">{feature.title}</div>
        <div className="corpus compact">
          <div className="hd">
            <span>{feature.slug}.md</span>
            <span>{tool}</span>
          </div>
          <span className="ln k"># {feature.title}</span>
          <span className="ln dim">status: {feature.status}</span>
          <span className="ln dim">category: {feature.category}</span>
          <span className="ln">&nbsp;</span>
          <span className="ln k">## What it does</span>
          <span className="ln dim">{feature.summary}</span>
          <span className="ln k">## Agent path</span>
          <span className="ln hl">{tool}</span>
        </div>
      </div>
    </div>
  );
}

function FeatureJsonLd({ feature }: { feature: Feature }) {
  const url = `${CANONICAL_URL}/features/${feature.slug}`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Uoink",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Windows 10, Windows 11",
      softwareVersion: "3.2",
      downloadUrl: RELEASE_URL,
      url: CANONICAL_URL,
      license: `${GITHUB_URL}/blob/main/LICENSE`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [feature.title, feature.summary, ...feature.mcpTools],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `Use ${feature.title} in Uoink`,
      description: feature.summary,
      step: feature.gettingStarted.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: `Step ${index + 1}`,
        text: step,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${feature.title}: Uoink feature`,
      description: feature.summary,
      url,
      isPartOf: { "@type": "WebSite", name: "Uoink", url: CANONICAL_URL },
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />;
}

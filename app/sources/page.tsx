import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { PlatformLogoStrip } from "../components/PlatformLogoStrip";
import type { PlatformLogoKey } from "../components/PlatformLogoStrip";
import { RELEASE_URL, SitePage } from "../content/pages";

type SourceStatus = "shipped" | "in flight" | "planned";

const page: SitePage = {
  id: "features",
  route: "/sources",
  mode: "mode-light",
  title: "Uoink Sources: Video, Podcasts, Articles, Threads",
  description:
    "Browse the source types Uoink captures into a local corpus: YouTube, X video, podcasts, articles, Reddit, and newsletter platforms.",
  keywords: [
    "uoink sources",
    "youtube podcast article corpus",
    "local source capture",
    "video podcast text to ai",
    "reddit thread to ai",
  ],
  html: "",
};

const sources: {
  title: string;
  status: SourceStatus;
  capture: string;
  corpus: string;
  output: string;
  logos: PlatformLogoKey[];
  href?: string;
}[] = [
  {
    title: "YouTube",
    status: "shipped",
    capture: "Button, right-click, playlist queue, and Shorts.",
    corpus: "Transcript, frames, comments, metadata, channel context.",
    output: "Creator research, hook study, lecture notes, agent citations.",
    logos: ["youtube"],
    href: "/sources/youtube",
  },
  {
    title: "X video",
    status: "shipped",
    capture: "Right-click video posts and capture the source with creator credit.",
    corpus: "Transcript, post URL, author handle, media metadata, local citation.",
    output: "Credited threads, clip research, launch swipe files.",
    logos: ["x"],
    href: "/twitter",
  },
  {
    title: "Podcasts",
    status: "shipped",
    capture: "Add an RSS feed or episode URL and transcribe with local Whisper.",
    corpus: "Speaker labels, transcript, episode metadata, show context, entities.",
    output: "Interview notes, claim trails, guest research, agent search.",
    logos: ["apple-podcasts", "spotify"],
    href: "/sources/podcasts",
  },
  {
    title: "Reddit threads",
    status: "shipped",
    capture: "Save a thread and keep the comment tree as source material.",
    corpus: "Post body, nested comments, authors, score context, outbound links.",
    output: "Audience language, objection mining, product research.",
    logos: ["reddit"],
  },
  {
    title: "Web Articles & Pages",
    status: "shipped",
    capture: "Universal page extraction strips navigation, headers, ads, and trackers.",
    corpus: "Clean body markdown text, author details, metadata, outbound links.",
    output: "Writing anchors, source-backed essays, style study.",
    logos: ["web"],
  },
];

function statusClass(status: SourceStatus) {
  if (status === "shipped") return "shipped";
  if (status === "in flight") return "in-flight";
  return "planned";
}

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "The Uoink dashboard: a populated local corpus of saved videos ready to hand to your AI." }] },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
};

export default function Page() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Uoink supported and planned sources",
    itemListElement: sources.map((source, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: source.title,
      description: `${source.capture} ${source.corpus}`,
      url: source.href ? `https://uoink.app${source.href}` : "https://uoink.app/sources",
    })),
  };

  return (
    <PageShell page={page}>
      <section className="hero" data-screen-label="sources / hero">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">sources</span>
            <h1 className="display-xl">
              One corpus.
              <br />
              Every <em>source.</em>
            </h1>
            <p className="lede" style={{ maxWidth: "32ch" }}>
              Uoink starts with video and podcasts.
              <br />
              Articles and threads join the same local library.
              <br />
              Same source card. Same citations.
            </p>
            <div className="ctas">
              <a className="btn primary large" href={RELEASE_URL}>
                Get Uoink
              </a>
              <Link className="btn ghost large" href="/how-it-works">
                See the loop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-index section" data-screen-label="sources / source grid">
        <div className="container">
          <div className="feature-card-grid">
            {sources.map((source) => {
              const body = (
                <>
                  <div className="feature-card-head">
                    <PlatformLogoStrip logos={source.logos} compact />
                    <span className={`feature-status ${statusClass(source.status)}`}>{source.status}</span>
                  </div>
                  <h3>{source.title}</h3>
                  <p>
                    <b>Capture:</b> {source.capture}
                  </p>
                  <p>
                    <b>Corpus:</b> {source.corpus}
                  </p>
                  <p>
                    <b>Best for:</b> {source.output}
                  </p>
                  <span className="arr-link">{source.href ? "Open source page ->" : "Tracked on roadmap ->"}</span>
                </>
              );

              return source.href ? (
                <Link className="feature-card" href={source.href} key={source.title}>
                  {body}
                </Link>
              ) : (
                <article className="feature-card" key={source.title}>
                  {body}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="big-strip" data-screen-label="sources / local library">
        <div className="container">
          <span className="eyebrow">why source breadth matters</span>
          <h2 className="display-l">
            The source changes. The library <em>compounds.</em>
          </h2>
          <p className="body-l" style={{ maxWidth: "72ch" }}>
            A video, a podcast, and a newsletter issue can all mention the same person, tool, company, or idea. Uoink keeps those mentions on disk so your agent can search across the whole library later.
          </p>
          <p className="mt-24">
            <Link className="btn ink" href="/developers">
              See developer path
            </Link>{" "}
            <Link className="btn ghost" href="/features/memory-search">
              Local search
            </Link>
          </p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    </PageShell>
  );
}

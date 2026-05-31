import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { CANONICAL_URL, RELEASE_URL, SitePage } from "../content/pages";

const page: SitePage = {
  id: "twitter",
  route: "/twitter",
  mode: "mode-light",
  title: "Uoink for Twitter Video: Save X Video Context to Your AI Corpus",
  description:
    "Capture X and Twitter videos into Uoink, keep creator credit attached, and turn what you learned into grounded drafts.",
  keywords: [
    "twitter video to ai",
    "x video transcript",
    "save twitter video context",
    "twitter video to claude",
    "uoink twitter video",
  ],
  html: "",
};

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: "/twitter" },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/twitter",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Uoink for Twitter video" }],
  },
  twitter: { title: page.title, description: page.description, images: ["/og-image.png"] },
};

export default function TwitterPage() {
  return (
    <PageShell page={page}>
      <section className="hero twitter-hero" data-screen-label="twitter / hero">
        <div className="container twitter-hero-grid">
          <div className="section-head">
            <span className="eyebrow">twitter video</span>
            <div className="x-lockup" aria-label="X and Uoink">
              <span className="x-mark" aria-hidden="true">X</span>
              <span>into your corpus</span>
            </div>
            <h1 className="display-xl">Turn an X video into a source you can cite.</h1>
            <p className="lede">
              Right-click a Twitter video, capture the source locally, then use Uoink to draft a credited thread grounded in what the creator actually said.
            </p>
            <div className="ctas">
              <a className="btn primary large" href={RELEASE_URL}>
                Install Uoink
              </a>
              <Link className="btn ghost large" href="/features/twitter-video">
                Open feature page
              </Link>
            </div>
            <div
              className="brand-strip"
              aria-label="Twitter source logo"
              dangerouslySetInnerHTML={{
                __html:
                  '<!-- X logo source: https://about.x.com/en/who-we-are/brand-toolkit; license/usage confirmation: official X brand toolkit asset, unmodified integration callout. --><span class="logo-chip brand-mark-pill logo-mark" aria-label="X video"><img src="/assets/brand-logos/x.png" alt="X video" width="30" height="30" loading="lazy" decoding="async" /></span>',
              }}
            />
          </div>
          <figure className="twitter-shot tweet-creative">
            <Image
              src="/screenshots/twitter-video/micky-personal-agents-tweet.png"
              alt="X post with a video about personal agents"
              width={596}
              height={471}
              priority
            />
            <figcaption>X video source with creator credit intact.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section twitter-flow" data-screen-label="twitter / flow">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">the loop</span>
            <h2 className="display-l">Right-click. Save. Write with credit.</h2>
            <p className="lede">A tweet with video is still a source. Uoink treats it like one.</p>
          </div>
          <div className="twitter-step-grid">
            {[
              ["01", "Capture the video", "Use the browser context menu on a Twitter or X video link. Uoink sends the URL to the local helper."],
              ["02", "Keep creator credit", "The corpus keeps source URL, creator handle, title text, and citation notes close to the transcript."],
              ["03", "Draft from evidence", "Writing Studio turns the corpus into a post, thread, or blog draft while keeping the original creator visible."],
            ].map(([num, title, body]) => (
              <article className="twitter-step" key={num}>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section twitter-code" data-screen-label="twitter / agent examples">
        <div className="container twitter-code-grid">
          <div>
            <span className="eyebrow">agent path</span>
            <h2 className="display-l">Let the agent run the capture.</h2>
            <p className="body-l">
              If your client can call Uoink through MCP, the clipboard step disappears. The agent can capture the source, fetch the corpus, then draft with creator credit.
            </p>
          </div>
          <div className="code-stack">
            <pre>
              <code>{`uoink_page({
  url: "https://x.com/creator/status/...",
  mode: "video"
})`}</code>
            </pre>
            <pre>
              <code>{`write_tweet({
  source_uoink_id: "x-video-2026-05-30",
  angle: "what technical creators should steal"
})`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="section tight twitter-credit" data-screen-label="twitter / creator credit">
        <div className="container credit-card">
          <span className="eyebrow">creator credit</span>
          <h2 className="display-m">The source stays attached.</h2>
          <p>
            Uoink is built for research and remixing with receipts. Twitter video capture keeps the creator handle, source link, and citation trail in the corpus so your output points back to the person who made the original thing.
          </p>
          <div className="ctas">
            <Link className="btn ink" href="/blog/tweet-what-you-learned-from-a-youtube-video">
              Read the writing workflow
            </Link>
            <Link className="btn ghost" href="/features/writing-studio">
              Writing Studio
            </Link>
          </div>
        </div>
      </section>
      <TwitterJsonLd />
    </PageShell>
  );
}

function TwitterJsonLd() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url: `${CANONICAL_URL}/twitter`,
      isPartOf: { "@type": "WebSite", name: "Uoink", url: CANONICAL_URL },
      about: ["Twitter video", "X video", "local corpus", "MCP", "creator credit"],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Capture a Twitter video with Uoink",
      step: [
        { "@type": "HowToStep", name: "Right-click", text: "Use the browser context menu on a Twitter or X video link." },
        { "@type": "HowToStep", name: "Capture", text: "Uoink sends the URL to the local helper and saves a corpus." },
        { "@type": "HowToStep", name: "Write", text: "Use Writing Studio or MCP to draft with creator credit attached." },
      ],
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

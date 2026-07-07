import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { RELEASE_URL, SitePage } from "../content/pages";

const page: SitePage = {
  id: "how",
  route: "/how-it-works",
  mode: "mode-dark",
  title: "How Uoink Works: Capture, Corpus, Writing, Distribution",
  description:
    "See the five-step Uoink loop: capture sources, build a local library, assemble a workspace, write from evidence, and distribute with credit.",
  keywords: [
    "how uoink works",
    "local corpus workflow",
    "youtube to ai workflow",
    "ai writing from sources",
    "mcp research workflow",
  ],
  html: "",
};

const steps = [
  {
    label: "Capture",
    body:
      "Click the Uoink button, right-click a source, or queue a feed. The helper extracts transcripts, screenshots, comments, and metadata while you keep working.",
  },
  {
    label: "Library",
    body:
      "Every source lands as markdown on disk and gets indexed in local SQLite search. Your corpus keeps titles, creators, timestamps, and source links intact.",
  },
  {
    label: "Workspace",
    body:
      "Group source cards around a topic, channel, claim, or launch thread. The same card can open in Claude, feed a draft, or expose an MCP call.",
  },
  {
    label: "Iterate",
    body:
      "Writing Studio pulls from the corpus, checks Voice DNA, keeps creator credit visible, and lets you revise from evidence instead of memory.",
  },
  {
    label: "Distribute",
    body:
      "Copy the draft, open it in X, cite the creator, or let an agent pull the same source through Uoink's local MCP tools.",
  },
];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "The Uoink dashboard: a populated local corpus of saved videos ready to hand to your AI." }] },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
};

export default function Page() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Uoink turns a source into an AI-ready corpus",
    description: page.description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.label,
      text: step.body,
    })),
  };

  return (
    <PageShell page={page}>
      <section className="hero" data-screen-label="how-it-works / hero">
        <div className="container">
          <div className="hero-grid">
            <div className="copy">
              <span className="eyebrow">how it works</span>
              <h1 className="display-xl">
                Capture. Read. Write. <em>Cite.</em>
              </h1>
              <p className="lede">
                Uoink turns raw sources into a local corpus your AI can use. One source card travels from capture to library to Writing Studio to your agent.
              </p>
              <div className="ctas">
                <a className="btn primary large" href={RELEASE_URL}>
                  Get Uoink
                </a>
                <Link className="btn ghost large" href="/sources">
                  See sources
                </Link>
              </div>
              <p className="sub-cta">Capture - Library - Workspace - Iterate - Distribute</p>
            </div>
            <figure className="feature-visual">
              <div className="feature-visual-top">
                <span>dashboard hero</span>
                <span>local corpus</span>
              </div>
              <div className="feature-visual-body">
                <div className="feature-visual-shot">
                  <img
                    src="/screenshots/memory-search/library-populated-computer-use.png"
                    alt="Uoink dashboard showing a populated local library of source cards"
                    loading="eager"
                  />
                  <figcaption>The library is the home base. Source cards stay searchable, citable, and ready for agents.</figcaption>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="section" data-screen-label="how-it-works / five step loop">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">the five-step loop</span>
            <h2 className="display-l">
              From source to output, without losing the <em>receipts.</em>
            </h2>
            <p className="lede">
              The browser path and the agent path share one spine: save the source, keep it on disk, write from it with citations.
            </p>
          </div>
          <div className="hook-grid">
            {steps.map((step, index) => (
              <article className="hook" key={step.label}>
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <span className="label">step</span>
                <h3>{step.label}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="big-strip" data-screen-label="how-it-works / source card">
        <div
          className="container"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 32, alignItems: "center" }}
        >
          <div>
            <span className="eyebrow">same card, different verbs</span>
            <h2 className="display-l">
              One source card serves creators and <em>developers.</em>
            </h2>
            <p className="body-l">
              Creators click Study hooks, Write thread, or Pull evidence. Developers copy the MCP call, open the corpus file, or hand it to Cursor. Same source, different next move.
            </p>
          </div>
          <div className="corpus">
            <div className="hd">
              <span>source card</span>
              <span>karpathy-intro-to-llms.md</span>
            </div>
            <span className="ln k">hook: curiosity_gap + stakes</span>
            <span className="ln dim">creator: Andrej Karpathy / source: YouTube</span>
            <span className="ln dim">entities: OpenAI, transformer, tokenization, RLHF</span>
            <span className="ln hl">actions: Study hooks / Write thread / Copy MCP call</span>
            <span className="ln k">citation: source URL + timestamps preserved</span>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="how-it-works / paths">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">two paths after capture</span>
            <h2 className="display-l">
              Paste it yourself, or let your agent <em>pull it.</em>
            </h2>
          </div>
          <div className="agent-demo">
            <div className="chat">
              <div className="mini-heading">creator path</div>
              <p className="chat-bubble user">Uoink this video, paste the corpus into Claude or ChatGPT, and ask for a hook breakdown.</p>
              <p className="chat-bubble assistant">The answer cites transcript moments, screenshots, and audience comments from the saved source.</p>
            </div>
            <div className="log">
              <div className="mini-heading">developer path</div>
              <pre className="mcp-log" style={{ margin: 0, whiteSpace: "pre-wrap" }}>{`uoink_video(url)
get_job_status(job_id)
get_uoink_corpus(corpus_id)
classify_hook(corpus_id)
agent drafts from the cited corpus`}</pre>
            </div>
          </div>
          <figure className="feature-visual product-figure wide">
            <div className="feature-visual-top">
              <span>write</span>
              <span>cited draft</span>
            </div>
            <div className="feature-visual-body">
              <div className="feature-visual-shot">
                <img
                  src="/product/generate-result.webp"
                  width={1440}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  alt="Uoink generate result: a drafted tweet sits in the preview panel next to the source it was written from, with the creator credit and source link preserved."
                />
                <figcaption>The output stays tied to its source: a draft in the preview panel, written from the saved corpus with credit intact.</figcaption>
              </div>
            </div>
          </figure>
          <p className="mt-32">
            <Link className="btn primary" href="/creators">
              Creator workflow
            </Link>{" "}
            <Link className="btn ghost" href="/developers">
              Developer setup
            </Link>
          </p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
    </PageShell>
  );
}

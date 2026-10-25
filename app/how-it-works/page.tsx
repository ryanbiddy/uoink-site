import type { Metadata } from "next";
import Link from "next/link";
import { DocRule } from "../components/Doc";
import { PageShell } from "../components/PageShell";
import { RELEASE_URL, SitePage } from "../content/pages";
import useCases from "../content/use-cases.generated.json";

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
      "Writing Studio pulls from the corpus, shows canned-phrase warnings, keeps creator credit visible, and lets you revise from evidence instead of memory.",
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
            <figure className="figure">
              <div className="figure-label">
                <span>dashboard hero</span>
                <span>local corpus</span>
              </div>
              <img
                src="/screenshots/memory-search/library-populated-computer-use.png"
                alt="Uoink dashboard showing a populated local library of source cards"
                loading="eager"
              />
              <figcaption>The library is the home base. Source cards stay searchable, citable, and ready for agents.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="how-it-works / five step loop">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">the five-step loop</span>
              <h2 className="display-l">
                From source to output, without losing the <em>receipts.</em>
              </h2>
              <p className="lede">
                The browser path and the agent path share one spine: save the source, keep it on disk, write from it with citations.
              </p>
            </div>
            <ol className="doc-list numbered">
              {steps.map((step, index) => (
                <li key={step.label}>
                  <span className="num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.label}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <DocRule />

      <section className="section" data-screen-label="how-it-works / source card">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">same card, different verbs</span>
              <h2 className="display-l">
                One source card serves creators and <em>developers.</em>
              </h2>
              <p className="body-l">
                Creators click Study hooks, Write thread, or Pull evidence. Developers copy the MCP call, open the corpus file, or hand it to Cursor. Same source, different next move.
              </p>
            </div>
            <aside className="facts" aria-label="Source card">
              <p className="facts-head">
                <span>source card</span>
                <span className="verbatim">karpathy-intro-to-llms.md</span>
              </p>
              <dl className="facts-list">
                <div>
                  <dt>hook</dt>
                  <dd>curiosity_gap + stakes</dd>
                </div>
                <div>
                  <dt>creator</dt>
                  <dd>Andrej Karpathy / source: YouTube</dd>
                </div>
                <div>
                  <dt>entities</dt>
                  <dd>OpenAI, transformer, tokenization, RLHF</dd>
                </div>
                <div className="is-hl">
                  <dt>actions</dt>
                  <dd>Study hooks / Write thread / Copy MCP call</dd>
                </div>
                <div>
                  <dt>citation</dt>
                  <dd>source URL + timestamps preserved</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <DocRule />

      <section className="section" data-screen-label="how-it-works / paths">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">two paths after capture</span>
              <h2 className="display-l">
                Paste it yourself, or let your agent <em>pull it.</em>
              </h2>
            </div>
            <div className="exchange">
              <div className="mini-heading">creator path</div>
              <p className="chat-bubble user">Uoink this video, paste the corpus into Claude or ChatGPT, and ask for a hook breakdown.</p>
              <p className="chat-bubble assistant">The answer cites transcript moments, screenshots, and audience comments from the saved source.</p>
              <div className="mini-heading">developer path</div>
              <pre className="code-block">{`uoink_video(url)
get_job_status(job_id)
get_uoink_corpus(corpus_id)
classify_hook(corpus_id)
agent drafts from the cited corpus`}</pre>
            </div>
          </div>
          <figure className="figure">
            <div className="figure-label">
              <span>write</span>
              <span>cited draft</span>
            </div>
            <img
              src="/product/generate-result.webp"
              width={1440}
              height={900}
              loading="lazy"
              decoding="async"
              alt="Uoink generate result: a drafted tweet sits in the preview panel next to the source it was written from, with the creator credit and source link preserved."
            />
            <figcaption>The output stays tied to its source: a draft in the preview panel, written from the saved corpus with credit intact.</figcaption>
          </figure>
          <div className="doc">
            <div className="ctas">
              <Link className="btn primary" href="/creators">
                Creator workflow
              </Link>
              <Link className="btn ghost" href="/developers">
                Developer setup
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="use-cases">
        <div className="container"><div className="doc">
          <h2 id="use-cases" className="display-l">Search and cite your sources</h2>
          <ul className="doc-list">
            {useCases.pages.map(item => <li key={item.slug}><Link className="arr-link" href={item.route}>{item.title}</Link></li>)}
          </ul>
        </div></div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
    </PageShell>
  );
}

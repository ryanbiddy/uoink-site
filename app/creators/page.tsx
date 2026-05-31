import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { RELEASE_URL, SitePage } from "../content/pages";

const page: SitePage = {
  id: "creators",
  route: "/creators",
  mode: "mode-dark",
  title: "Uoink for Creators: Source-Backed Posts, Scripts, Threads",
  description:
    "Use Uoink to capture sources, study hooks, write from a local corpus, and publish creator-credit drafts in your own voice.",
  keywords: [
    "creator research tool",
    "youtube hook analysis",
    "ai writing from videos",
    "content strategy corpus",
    "write threads from sources",
  ],
  html: "",
};

const prompts = [
  "What hook type opens this video, and what proof shows the audience noticed?",
  "What claims should I verify before I repeat this idea?",
  "What pacing beats should I borrow for my next script?",
  "Which comments reveal objections I should answer?",
  "What source line should become the first tweet?",
  "What screenshot belongs with the main point?",
];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route },
  twitter: { title: page.title, description: page.description },
};

export default function Page() {
  return (
    <PageShell page={page}>
      <section className="hero" data-screen-label="creators / hero">
        <div className="container">
          <div className="hero-grid">
            <div className="copy">
              <span className="eyebrow">for creators</span>
              <h1 className="display-xl">
                Study the source. Ship in your <em>voice.</em>
              </h1>
              <p className="lede">
                Uoink keeps the videos, podcasts, and articles you study on disk, then gives Writing Studio source material it can cite and shape into posts.
              </p>
              <div className="ctas">
                <a className="btn primary large" href={RELEASE_URL}>
                  Get Uoink
                </a>
                <Link className="btn ghost large" href="/how-it-works">
                  Watch the loop
                </Link>
              </div>
              <p className="sub-cta">Hooks / screenshots / comments / Voice DNA / creator credit</p>
            </div>
            <div className="corpus">
              <div className="hd">
                <span>writing source</span>
                <span>ready</span>
              </div>
              <span className="ln k">source: karpathy-intro-to-llms.md</span>
              <span className="ln dim">hook: curiosity_gap / confidence 4 of 5</span>
              <span className="ln dim">best frame: 00:47 / compression of the internet</span>
              <span className="ln hl">thread angle: the metaphor that made LLMs click</span>
              <span className="ln k">credit: via @karpathy / source link preserved</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="creators / flow">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">creator loop</span>
            <h2 className="display-l">
              Turn research into output without flattening the <em>source.</em>
            </h2>
          </div>
          <div className="hook-grid">
            <article className="hook">
              <span className="num">01</span>
              <span className="label">capture</span>
              <h3>Grab the thing you are studying.</h3>
              <p>Uoink a video, podcast, article, or thread and keep the original source link intact.</p>
            </article>
            <article className="hook">
              <span className="num">02</span>
              <span className="label">read</span>
              <h3>Search the corpus like notes.</h3>
              <p>Find hooks, claims, screenshots, comments, people, products, and phrases across your saved library.</p>
            </article>
            <article className="hook">
              <span className="num">03</span>
              <span className="label">write</span>
              <h3>Draft from the source card.</h3>
              <p>Writing Studio pulls the saved material, checks Voice DNA, and keeps citations close.</p>
            </article>
            <article className="hook">
              <span className="num">04</span>
              <span className="label">publish</span>
              <h3>Carry creator credit forward.</h3>
              <p>Threads and blogs keep the source line visible so the original creator gets credit.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="creators / prompt library">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">starter prompts</span>
            <h2 className="display-l">
              Ask questions that start from <em>evidence.</em>
            </h2>
            <p className="lede">
              These are the questions Uoink makes cheap because the transcript, screenshots, comments, and metadata already sit in one file.
            </p>
          </div>
          <div className="prompt-grid">
            {prompts.map((prompt, index) => (
              <article className="prompt-tile" key={prompt}>
                <span className="label">{String(index + 1).padStart(2, "0")}</span>
                <span className="body-q">{prompt}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="big-strip" data-screen-label="creators / writing studio">
        <div className="container">
          <span className="eyebrow">writing studio</span>
          <h2 className="display-l">
            Draft the thread with source credit <em>baked in.</em>
          </h2>
          <p className="body-l" style={{ maxWidth: "72ch" }}>
            Uoink is built for creators who study other creators. The draft can move to X, a blog, or your editor, but the source link and creator handle stay close by default.
          </p>
          <p className="mt-24">
            <Link className="btn ink" href="/features/writing-studio">
              Writing Studio
            </Link>{" "}
            <Link className="btn ghost" href="/twitter">
              X video capture
            </Link>
          </p>
        </div>
      </section>

      <section className="section" data-screen-label="creators / privacy">
        <div className="container">
          <div className="agent-demo">
            <div className="chat">
              <div className="mini-heading">local by default</div>
              <p className="chat-bubble user">I am studying a competitor channel. Where does that research go?</p>
              <p className="chat-bubble assistant">Onto your disk. Uoink has no hosted corpus, no account, and no telemetry endpoint.</p>
            </div>
            <div className="log">
              <div className="mini-heading">best next click</div>
              <p className="body-l">Install Uoink, capture one source, then open Writing Studio with that source selected.</p>
              <p className="mt-24">
                <Link className="btn primary" href="/install">
                  Install Uoink
                </Link>{" "}
                <Link className="btn ghost" href="/privacy">
                  Read privacy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

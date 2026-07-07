import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { GITHUB_URL, RELEASE_URL, SitePage, FaqItem } from "../../content/pages";

const faq: FaqItem[] = [
  {
    question: "How do I give Claude or ChatGPT a YouTube transcript?",
    answer:
      "Click the Uoink button under the video (or right-click the link). Uoink puts a paste-ready corpus on your clipboard: the full timestamped transcript plus a few screenshots. Paste it into Claude or ChatGPT and ask your question. No copy-pasting the transcript by hand, no browser extension gymnastics.",
  },
  {
    question: "Can Claude actually watch or read a YouTube video?",
    answer:
      "Not from a bare link — it hallucinates. Give it a Uoink corpus and it can quote the transcript, cite timestamps, and read the top comments, because the words and frames are in the paste. For agents, Uoink's local MCP server exposes uoink_video and search_uoinks so Claude Desktop, Cursor, or Cline can pull the transcript directly.",
  },
  {
    question: "What does Uoink capture besides the transcript?",
    answer:
      "The timestamped transcript, timestamped screenshots throughout the video, the top comments with authors and like counts, the title, channel, description, tags, views, and upload date, the thumbnail and channel context, and a JSON sidecar for agents and scripts. Everything a transcript-only tool leaves behind.",
  },
  {
    question: "Does the transcript include timestamps?",
    answer:
      "Yes. Every line is timestamped and chapter-aware, and screenshots carry their own timestamps, so you (and your AI) can cite the exact moment and deep-link back to it on YouTube.",
  },
  {
    question: "Where do the saved videos go?",
    answer:
      "To your own disk, under your Uoink output folder (usually Desktop\\Uoink), auto-sorted into topic folders. No account, no Uoink cloud. You can search the whole library locally later.",
  },
  {
    question: "Can I save a whole playlist at once?",
    answer:
      "Yes. Paste a playlist URL and Uoink queues the videos, extracts them asynchronously with live progress, and writes a combined corpus plus per-video files.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. Uoink is free and open source (MIT). Core YouTube capture needs no API key. Optional AI features (Comment Intelligence, hook classification) use your own Anthropic key and are off by default.",
  },
];

const page: SitePage = {
  id: "sources",
  route: "/sources/youtube",
  mode: "mode-dark",
  title: "YouTube Transcript for AI: Save Videos to a Local Corpus",
  description:
    "Save any YouTube video to your own disk as a timestamped transcript, screenshots, and comments, then chat with it in Claude or ChatGPT. Free, local-first.",
  keywords: [
    "youtube transcript for ai",
    "chat with youtube video",
    "summarize youtube video with ai",
    "youtube to text with timestamps",
    "save youtube videos for research",
    "youtube mcp server",
  ],
  html: "",
  faq,
};

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: page.route },
  openGraph: {
    title: page.title,
    description: page.description,
    url: page.route,
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "A YouTube video saved as a local Uoink corpus: transcript, screenshots, and comments ready for your AI." }],
  },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
};

export default function Page() {
  return (
    <PageShell page={page}>
      <section className="hero" data-screen-label="sources youtube / hero">
        <div className="container">
          <div className="hero-grid">
            <div className="copy">
              <span className="eyebrow">sources / youtube</span>
              <h1 className="display-xl">
                Uoink the <em>video.</em>
              </h1>
              <p className="lede">
                Save any YouTube video to your own disk as a timestamped transcript, screenshots, and comments, then chat with it in Claude, ChatGPT, or your agent. One click. Local-first. Free.
              </p>
              <div className="ctas">
                <a className="btn primary large" href={RELEASE_URL}>
                  Get Uoink
                </a>
                <Link className="btn ghost large" href="/sources">
                  All sources
                </Link>
              </div>
              <div className="brand-strip" aria-label="Works with">
                <span>Claude</span>
                <span>ChatGPT</span>
                <span>Cursor</span>
                <span>MCP</span>
              </div>
            </div>
            <div className="corpus">
              <div className="hd">
                <span>youtube corpus</span>
                <span>video-native</span>
              </div>
              <span className="ln k"># Video title</span>
              <span className="ln dim">channel, subs, views, upload date, tags</span>
              <span className="ln k">## Transcript</span>
              <span className="ln dim">[04:12] the hook lands right here...</span>
              <span className="ln k">## Screenshots</span>
              <span className="ln hl">[04:12] [08:40] [12:03] frames on disk</span>
              <span className="ln k">## Comments</span>
              <span className="ln dim">top 50 with authors + likes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="sources youtube / what gets captured">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">youtube transcript, and everything around it</span>
            <h2 className="display-l">
              A transcript downloader stops at the <em>words.</em>
            </h2>
            <p className="lede">
              Uoink saves the full context so your AI can quote it, cite the timestamp, and read the room.
            </p>
          </div>
          <div className="three-cards">
            <article className="card">
              <span className="num">01</span>
              <h3>Timestamped transcript.</h3>
              <p>Full, chapter-aware transcript. Every line carries a timestamp your AI can cite and deep-link back to.</p>
            </article>
            <article className="card">
              <span className="num">02</span>
              <h3>Screenshots + comments.</h3>
              <p>Timestamped frames throughout the video, plus the top comments with authors and like counts.</p>
            </article>
            <article className="card">
              <span className="num">03</span>
              <h3>Metadata + channel context.</h3>
              <p>Title, description, tags, views, upload date, thumbnail, channel context, and a JSON sidecar for agents.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="big-strip" data-screen-label="sources youtube / agent path">
        <div className="container">
          <span className="eyebrow">for agents: youtube mcp server</span>
          <h2 className="display-l">
            Or let your agent <em>uoink it.</em>
          </h2>
          <p className="body-l" style={{ maxWidth: "72ch" }}>
            Connect Claude Desktop, Cursor, or Cline to the local Uoink helper and your agent can call{" "}
            <code>uoink_video</code>, <code>search_uoinks</code>, and <code>find_mentions</code> directly — no clipboard step. Ask it to &ldquo;uoink this video and decode the hook&rdquo; and it extracts, then analyzes.
          </p>
          <p className="mt-24">
            <Link className="btn ink" href="/developers">
              Developer setup
            </Link>{" "}
            <Link className="btn ghost" href="/compare/notebooklm">
              Uoink vs NotebookLM
            </Link>
          </p>
        </div>
      </section>

      <section className="section" data-screen-label="sources youtube / faq">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">youtube FAQ</span>
            <h2 className="display-l">
              How to chat with a <em>YouTube video.</em>
            </h2>
          </div>
          <div className="three-cards">
            {faq.map((item) => (
              <article className="card" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
          <p className="mt-24">
            <a className="btn ghost" href={`${GITHUB_URL}`}>
              Source on GitHub
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { RELEASE_URL, SitePage, FaqItem } from "../../content/pages";

const faq: FaqItem[] = [
  {
    question: "Is Uoink a local NotebookLM alternative?",
    answer:
      "Yes, for the video-and-research use case. Both let you ask questions grounded in sources instead of a model's guesses. The difference: NotebookLM runs in Google's cloud on your Google account; Uoink runs on your machine, saves sources to your own disk, needs no account, and is open source (MIT). Your corpus never leaves your computer unless you turn on an optional AI feature.",
  },
  {
    question: "What does NotebookLM do that Uoink doesn't?",
    answer:
      "NotebookLM is a polished cloud app with Audio Overviews (a generated podcast-style summary), a hosted chat UI, and no install. It runs on Gemini and works on any OS in a browser. If you want a zero-install, cross-platform, cloud notebook, NotebookLM is excellent.",
  },
  {
    question: "What does Uoink do that NotebookLM doesn't?",
    answer:
      "Uoink captures more than a YouTube URL: timestamped screenshots, top comments, channel context, and a JSON sidecar, all saved as Markdown you own. It exposes your corpus to Claude, Cursor, and Cline as MCP tools, and to any agent via an OpenAPI bridge. And it keeps everything local — no account, no cloud storage, no telemetry.",
  },
  {
    question: "Which should I use?",
    answer:
      "Use NotebookLM if you want a hosted, cross-platform notebook with audio summaries and zero setup. Use Uoink if you want to own your sources on disk, feed them to your own AI agents over MCP, and keep everything private and local. They're not mutually exclusive — Uoink's Markdown corpora import cleanly into other tools, including NotebookLM.",
  },
  {
    question: "Is Uoink free?",
    answer:
      "Yes, free and open source (MIT). Core capture needs no API key. Optional AI features use your own Anthropic key and are off by default. NotebookLM has a free tier with usage limits and a paid plan.",
  },
  {
    question: "Does Uoink work on Mac?",
    answer:
      "Windows 10 and 11 today. A Mac build is queued after Windows stabilizes, using the same corpus format and MCP surface. NotebookLM, being browser-based, works on any OS now.",
  },
];

const page: SitePage = {
  id: "features",
  route: "/compare/notebooklm",
  mode: "mode-light",
  title: "Uoink vs NotebookLM: Local, Video-Native, MCP",
  description:
    "A local, open-source NotebookLM alternative. Uoink saves YouTube videos and podcasts to your own disk and hands them to Claude, Cursor, or any MCP agent. Honest comparison.",
  keywords: [
    "notebooklm alternative",
    "local notebooklm",
    "notebooklm vs uoink",
    "private notebooklm alternative",
    "open source notebooklm",
    "youtube ai research local",
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
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "Uoink vs NotebookLM: a local, video-native, MCP-connected corpus you own." }],
  },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
};

const rows: { feature: string; uoink: string; notebooklm: string }[] = [
  { feature: "Where it runs", uoink: "Your machine (local-first)", notebooklm: "Google cloud" },
  { feature: "Account required", uoink: "None", notebooklm: "Google account" },
  { feature: "Where sources live", uoink: "Your disk, as Markdown you own", notebooklm: "Google's servers" },
  { feature: "YouTube capture", uoink: "Transcript + screenshots + comments + metadata", notebooklm: "Transcript from a URL" },
  { feature: "Podcasts", uoink: "RSS + local Whisper + speaker labels", notebooklm: "Audio upload" },
  { feature: "Agent / MCP access", uoink: "Local MCP server + OpenAPI bridge", notebooklm: "No public MCP surface" },
  { feature: "Audio Overviews", uoink: "No", notebooklm: "Yes" },
  { feature: "Cost", uoink: "Free, open source (MIT)", notebooklm: "Free tier + paid plan" },
  { feature: "Platform", uoink: "Windows today, Mac queued", notebooklm: "Any OS (browser)" },
  { feature: "Telemetry", uoink: "None in the app", notebooklm: "Standard Google product data" },
];

export default function Page() {
  return (
    <PageShell page={page}>
      <section className="hero" data-screen-label="compare notebooklm / hero">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">compare / notebooklm</span>
            <h1 className="display-xl">
              A NotebookLM you <em>own.</em>
            </h1>
            <p className="lede" style={{ maxWidth: "60ch" }}>
              NotebookLM is a great cloud notebook. Uoink is the local, open-source alternative: it saves your videos, podcasts, and articles to your own disk and hands them to Claude, Cursor, or any MCP agent — no account, no cloud.
            </p>
            <div className="ctas">
              <a className="btn primary large" href={RELEASE_URL}>
                Get Uoink
              </a>
              <Link className="btn ghost large" href="/sources/youtube">
                YouTube capture
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="compare notebooklm / table">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">honest comparison</span>
            <h2 className="display-l">
              Uoink vs <em>NotebookLM.</em>
            </h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "2px solid var(--ink)" }}>Feature</th>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "2px solid var(--ink)" }}>Uoink</th>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "2px solid var(--ink)" }}>NotebookLM</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature}>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--ink-dim, #ddd)", fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--ink-dim, #ddd)" }}>{row.uoink}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--ink-dim, #ddd)" }}>{row.notebooklm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="body-l mt-24" style={{ maxWidth: "72ch" }}>
            Bottom line: pick NotebookLM for a hosted, cross-platform notebook with audio summaries and zero setup. Pick Uoink to own your sources on disk, feed them to your own AI agents over MCP, and keep everything private and local.
          </p>
        </div>
      </section>

      <section className="section" data-screen-label="compare notebooklm / faq">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">NotebookLM alternative FAQ</span>
            <h2 className="display-l">
              Common <em>questions.</em>
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
        </div>
      </section>
    </PageShell>
  );
}

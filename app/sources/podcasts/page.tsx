import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { GITHUB_URL, RELEASE_URL, SitePage } from "../../content/pages";

const page: SitePage = {
  id: "podcasts",
  route: "/sources/podcasts",
  mode: "mode-dark",
  title: "Podcast RSS to Local AI Corpus",
  description:
    "Use Uoink to turn podcast RSS feeds and episodes into private local corpora with Whisper transcription and speaker labels.",
  keywords: ["podcast transcription open source", "podcast to ai", "podcast diarization local", "whisper podcast workflow"],
  html: "",
};

const faq = [
  {
    question: "Does Uoink identify speakers by real name?",
    answer:
      "Diarization separates speakers as Speaker 1, Speaker 2, and so on. You can rename them later when you know who is speaking.",
  },
  {
    question: "Does local Whisper need a GPU?",
    answer:
      "CPU transcription works. Larger models take longer. Dedicated GPUs can speed it up when available.",
  },
  {
    question: "Are podcast feeds uploaded to Uoink?",
    answer:
      "Feed polling, audio download, transcription, and corpus writing run from your machine.",
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
  return (
    <PageShell page={page}>
      <section className="hero" data-screen-label="sources podcasts / hero">
        <div className="container">
          <div className="hero-grid">
            <div className="copy">
              <span className="eyebrow">sources / podcasts</span>
              <h1 className="display-xl">
                Uoink your <em>podcasts</em> too.
              </h1>
              <p className="lede">
                Add an RSS feed, transcribe episodes locally, and file speaker-aware transcripts beside your video corpus.
              </p>
              <div className="ctas">
                <a className="btn primary large" href={RELEASE_URL}>
                  Get Uoink
                </a>
                <Link className="btn ghost large" href="/sources">
                  All sources
                </Link>
              </div>
              <div className="brand-strip" aria-label="Podcast sources">
                {/* Spotify logo source: https://newsroom.spotify.com/media-kit/; official Spotify newsroom media-kit logo, unmodified integration callout. */}
                <span className="logo-chip brand-mark-pill logo-wide" aria-label="Spotify">
                  <img src="/assets/brand-logos/spotify.png" alt="Spotify" width="130" height="39" loading="lazy" decoding="async" />
                </span>
                {/* Apple Podcasts logo source: https://tools.applemediaservices.com/apple-podcasts/identity-guidelines; official Apple Podcasts identity asset, unmodified integration callout. */}
                <span className="logo-chip brand-mark-pill logo-mark" aria-label="Apple Podcasts">
                  <img src="/assets/brand-logos/apple-podcasts.png" alt="Apple Podcasts" width="30" height="30" loading="lazy" decoding="async" />
                </span>
                <span>RSS</span>
                <span>Whisper</span>
              </div>
            </div>
            <div className="corpus">
              <div className="hd">
                <span>podcast corpus</span>
                <span>audio-first</span>
              </div>
              <span className="ln k"># Episode title</span>
              <span className="ln dim">feed, episode URL, duration, publish date</span>
              <span className="ln k">## Speakers</span>
              <span className="ln hl">Speaker 1 / Speaker 2 / Speaker 3</span>
              <span className="ln k">## Transcript</span>
              <span className="ln dim">[14:22] Speaker 2: the claim is...</span>
              <span className="ln k">## Entities</span>
              <span className="ln dim">companies, tools, people, topics</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="sources podcasts / workflow">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">audio to corpus</span>
            <h2 className="display-l">
              Same source card, longer <em>runtime.</em>
            </h2>
            <p className="lede">
              Podcasts sit in the same local library as videos. Your agent can search a founder interview, a lecture, and a YouTube teardown with the same tool call.
            </p>
          </div>
          <div className="three-cards">
            <article className="card">
              <span className="num">01</span>
              <h3>Feed in.</h3>
              <p>Add a public RSS feed or episode URL from the settings page.</p>
            </article>
            <article className="card">
              <span className="num">02</span>
              <h3>Whisper runs local.</h3>
              <p>The helper downloads audio and runs transcription on your machine.</p>
            </article>
            <article className="card">
              <span className="num">03</span>
              <h3>Corpus lands.</h3>
              <p>Episode markdown, speaker labels, metadata, and entities land in the library.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="big-strip" data-screen-label="sources podcasts / tradeoff">
        <div className="container">
          <span className="eyebrow">the local whisper trade</span>
          <h2 className="display-l">
            Private transcription costs <em>time.</em>
          </h2>
          <p className="body-l" style={{ maxWidth: "70ch" }}>
            Expect compute time for long audio, especially on CPU. Uoink keeps the job in the background and saves the transcript on disk when it finishes.
          </p>
          <p className="mt-24">
            <Link className="btn ink" href="/privacy">
              Privacy details
            </Link>{" "}
            <a className="btn ghost" href={`${GITHUB_URL}/issues`}>
              Request feed support
            </a>
          </p>
        </div>
      </section>

      <section className="section" data-screen-label="sources podcasts / faq">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">podcast FAQ</span>
            <h2 className="display-l">
              Useful caveats, kept <em>visible.</em>
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

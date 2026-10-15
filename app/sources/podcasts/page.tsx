import type { Metadata } from "next";
import Link from "next/link";
import { DocRule, FaqList } from "../../components/Doc";
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
      "Optional diarization separates speakers as Speaker 1, Speaker 2, and so on. It needs your own Hugging Face token for the speaker model. You can rename speakers later when you know who is speaking.",
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
            <figure className="code-figure">
              <div className="figure-label">
                <span>podcast corpus</span>
                <span>audio-first</span>
              </div>
              <pre className="code-block">{`# Episode title
feed, episode URL, duration, publish date
## Speakers
Speaker 1 / Speaker 2 / Speaker 3
## Transcript
[14:22] Speaker 2: the claim is...
## Entities
companies, tools, people, topics`}</pre>
            </figure>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="sources podcasts / workflow">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">audio to corpus</span>
              <h2 className="display-l">
                Same source card, longer <em>runtime.</em>
              </h2>
              <p className="lede">
                Podcasts sit in the same local library as videos. Your agent can search a founder interview, a lecture, and a YouTube teardown with the same tool call.
              </p>
            </div>
            <ol className="doc-list numbered">
              <li>
                <span className="num">01</span>
                <h3>Feed in.</h3>
                <p>Add a public RSS feed or episode URL from the settings page.</p>
              </li>
              <li>
                <span className="num">02</span>
                <h3>Whisper runs local.</h3>
                <p>The helper downloads audio and runs transcription on your machine.</p>
              </li>
              <li>
                <span className="num">03</span>
                <h3>Corpus lands.</h3>
                <p>Episode markdown, speaker labels, metadata, and entities land in the library.</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <DocRule />

      <section className="section" data-screen-label="sources podcasts / tradeoff">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">the local whisper trade</span>
              <h2 className="display-l">
                Private transcription costs <em>time.</em>
              </h2>
              <p className="body-l">
                Expect compute time for long audio, especially on CPU. Uoink keeps the job in the background and saves the transcript on disk when it finishes.
              </p>
            </div>
            <div className="ctas">
              <Link className="btn primary" href="/privacy">
                Privacy details
              </Link>
              <a className="btn ghost" href={`${GITHUB_URL}/issues`}>
                Request feed support
              </a>
            </div>
          </div>
        </div>
      </section>

      <DocRule />

      <section className="section" data-screen-label="sources podcasts / faq">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">podcast FAQ</span>
              <h2 className="display-l">
                Useful caveats, kept <em>visible.</em>
              </h2>
            </div>
            <FaqList items={faq} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

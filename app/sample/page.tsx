import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import type { SitePage } from "../content/pages";
import list from "../../public/samples/hackertube-top-50.json";
import { SampleLibrary, type SampleVideo } from "./SampleLibrary";
import "./sample.css";

// The list file, served as is so people can download it.
const LIST_URL = "/samples/hackertube-top-50.json";

// The secondary line under the main button. List import is being built for
// Uoink 3.13.0; edit these strings when it ships or if the wording changes.
const IMPORT_LINE = {
  label: "Import a list.",
  text: "Uoink 3.13.0 and later can import a list like this one.",
  link: "Download this list",
};

const page: SitePage = {
  id: "features", route: "/sample", mode: "mode-light",
  title: "Sample library: 50 videos Hacker News recommends",
  description: "See what a Uoink library looks like without installing anything: 50 videos Hacker News keeps recommending, with a summary of each and why people share it.",
  keywords: [], html: "",
};

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route },
};

const videos = list.videos as SampleVideo[];

function Credit({ className }: { className: string }) {
  return (
    <p className={className}>
      Picks from <a href={list.source.url}>HackerTube</a> (hackertube.org) by Andrej Karpathy, derived from
      the <a href={list.derived_from.url}>open-index/hacker-news</a> dataset, <a href={list.license.url}>ODC-By 1.0</a>.
    </p>
  );
}

export default function Page() {
  return (
    <PageShell page={page}>
      <section className="sl-hero" aria-labelledby="sl-title">
        <div className="container">
          <span className="eyebrow">Sample library</span>
          <h1 className="display-xl" id="sl-title">See a Uoink library.</h1>
          <p className="lede">
            {videos.length} videos Hacker News keeps telling people to watch. Pick one to read what it covers and why
            people share it. Nothing to install.
          </p>
          <div className="sl-cta">
            <Link className="btn primary large" href="/install">Get Uoink to build your own</Link>
          </div>
          <p className="sl-import">
            <b>{IMPORT_LINE.label}</b> {IMPORT_LINE.text}{" "}
            <a href={LIST_URL} download>{IMPORT_LINE.link}</a> (JSON).
          </p>
        </div>
      </section>
      <section className="sl-section" aria-label="Sample library">
        <div className="container">
          <Credit className="sl-credit" />
          <SampleLibrary videos={videos} />
          <p className="sl-notes">
            Ranked by HackerTube&apos;s score. Summaries and the &ldquo;why HN likes it&rdquo; lines were written by an
            LLM for HackerTube and are trimmed here. Thumbnails load from YouTube. Titles and channel names belong to
            their creators. Not affiliated with YouTube, Google, Hacker News or Y Combinator.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

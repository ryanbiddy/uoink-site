import labels from "../../public/media/hero/labels.json";

// The homepage, product first: a hero that shows the real flow in one glance
// (click Uoink on a video, the save lands in your library with its transcript,
// your AI quotes it with the minute), then three short sections: Save it,
// Find it, Write with receipts. The mocks mirror the light 3.11.2 UI: the
// YouTube Uoink button, the dashboard Library row and the Reader time gutter.
//
// Every source fact, quote, minute and link comes from
// public/media/hero/labels.json (the three cleared sources). Thumbnails are the
// cleared .jpg covers in public/media/hero/. The podcast row uses the product's
// neutral kind block instead of its cover. Nothing here plays video.
// scripts/check-hero-story.cjs and check-hero-sources.cjs check the export.

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function label(key: string): string {
  const value = key.split(".").reduce<unknown>((node, part) => node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined, labels);
  if (typeof value !== "string" && typeof value !== "number") throw new Error(`Missing hero label: ${key}`);
  if (/\.(url|link)$/.test(key) && !/^https:\/\//.test(String(value))) throw new Error(`Use a website address for ${key}`);
  return escape(String(value));
}

type Spoken = "lesson" | "podcast";
const SOURCE_NAME: Record<Spoken, string> = { lesson: "YC talk", podcast: "How I AI" };

// One exact caption line, marked so the source check can compare it.
const quote = (source: Spoken, key: string) =>
  `<mark data-source-quote="${source}.${key}">${label(`sources.${source}.receipts.${key}.quote`)}</mark>`;
const time = (source: Spoken, key: string) => label(`sources.${source}.receipts.${key}.time`);
const link = (source: Spoken, key: string) => label(`sources.${source}.receipts.${key}.link`);

// A receipt chip: the minute, linked to that moment in the source.
const receipt = (source: Spoken, key: string) =>
  `<a class="hm-receipt" href="${link(source, key)}" target="_blank" rel="noreferrer" aria-label="Open ${SOURCE_NAME[source]} at ${time(source, key)}"><b>${time(source, key)}</b><span>${SOURCE_NAME[source]}</span><span aria-hidden="true">↗</span></a>`;

// A transcript line in the Reader's style: the minute in the gutter, then the words.
const readerRow = (source: Spoken, key: string) =>
  `<p class="hm-reader-row"><a class="hm-reader-time" href="${link(source, key)}" target="_blank" rel="noreferrer" aria-label="Open ${SOURCE_NAME[source]} at ${time(source, key)}">${time(source, key)}</a><span>${quote(source, key)}</span></p>`;

// The Uoink mark, as drawn on the extension's YouTube button. Tips stay yellow (family rule).
const U_ICON = '<svg class="hm-u" viewBox="0 0 100 100" width="11" height="14" aria-hidden="true" focusable="false"><path d="M 0 0 L 32 0 L 32 60 L 68 60 L 68 0 L 100 0 L 100 80 Q 100 100 80 100 L 20 100 Q 0 100 0 80 Z" fill="currentColor"/><path d="M0 0H32V20H0ZM68 0H100V20H68Z" fill="#FFD23F"/></svg>';
const CURSOR = '<svg class="hm-cursor" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M5 2.5v17.2l4.3-4.1 2.8 6.4 3-1.3-2.8-6.3 6-.4z" fill="#0A0A0A" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/></svg>';

const cover = (slot: "source-lesson" | "source-x-video", alt: string, width: number, height: number, eager = false) =>
  `<img src="/media/hero/${slot}.jpg" alt="${escape(alt)}" width="${width}" height="${height}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
const lessonCover = (eager = false) => cover("source-lesson", "", 640, 360, eager);

// A dashboard Library row: thumbnail, title, source · platform, then the saved
// state line ("Done · YouTube captions"), as savedStateLine() renders it.
function libraryRow(thumb: string, title: string, source: string, detail: string) {
  return `<li class="hm-lib-row"><span class="hm-thumb">${thumb}</span><span class="hm-row-body"><span class="hm-row-title">${title}</span><span class="hm-row-source">${source}</span><span class="hm-row-state"><span class="hm-done"><i aria-hidden="true"></i>Done</span><span>· ${detail}</span></span></span></li>`;
}

const winBar = (title: string, meta = '<span class="hm-tag">Example</span>') =>
  `<div class="hm-win-bar"><span class="hm-win-title">${title}</span>${meta}</div>`;

export type HomeLinks = {
  windowsUrl: string;
  macUrl: string;
  windowsMark: string;
  macMark: string;
  platforms: string; // PRODUCT_STATUS.mac.visible
  toolCount: number;
};

export function homeHtml(o: HomeLinks): string {
  const lessonTitle = label("sources.lesson.title");
  const hero = `<section class="hm-hero" id="u-opening" data-home-part="first-screen" aria-labelledby="u-headline">
<div class="container hm-hero-grid">
<div class="hm-hero-copy">
<h1 id="u-headline">Uoink that shit.</h1>
<p class="hm-hero-line">Save YouTube videos, podcasts and X posts with their transcripts, on your own computer. Your AI searches them and cites the minute.</p>
<div class="hm-downloads">
<a class="btn primary with-logo" data-download="windows" href="${o.windowsUrl}">${o.windowsMark}Download for Windows</a>
<a class="btn ghost with-logo" data-download="mac" href="${o.macUrl}">${o.macMark}Download for Mac (preview)</a>
</div>
<p class="hm-hero-note">Free and open source (MIT). ${o.platforms}</p>
<p class="hm-hero-note"><a class="hm-link" href="/install">Install steps and the Chrome button -&gt;</a></p>
</div>
<ol class="hm-flow" id="u-flow" aria-label="How Uoink works, in three steps">
<li class="hm-step hm-step-watch">
<p class="hm-cap"><span class="hm-num" aria-hidden="true">1</span>Click Uoink while you watch</p>
<div class="hm-win hm-watch">
<div class="hm-video">${cover("source-lesson", "Boris Cherny on stage at YC Startup School", 640, 360, true)}<span class="hm-bar" aria-hidden="true"><i></i></span><span class="hm-video-time"><b>${time("lesson", "verify")}</b> / ${label("sources.lesson.length")}</span></div>
<div class="hm-watch-meta">
<p class="hm-watch-title">${lessonTitle}</p>
<p class="hm-watch-channel">Y Combinator</p>
<span class="hm-pill-wrap"><span class="hm-pill"><i class="hm-pill-dot" aria-hidden="true"></i>${U_ICON}Uoink</span>${CURSOR}</span>
</div>
</div>
</li>
<li class="hm-step hm-step-save">
<p class="hm-cap"><span class="hm-num" aria-hidden="true">2</span>Saved to your library, transcript included</p>
<div class="hm-win hm-library">
${winBar("Library", '<span class="hm-local"><i aria-hidden="true"></i>On this computer</span>')}
<ul class="hm-lib-list">${libraryRow(lessonCover(), lessonTitle, "Y Combinator · YouTube", "YouTube captions")}</ul>
${readerRow("lesson", "verify")}
</div>
</li>
<li class="hm-step hm-step-ask">
<p class="hm-cap"><span class="hm-num" aria-hidden="true">3</span>Your AI quotes it, with the minute</p>
<div class="hm-win hm-chat">
<p class="hm-ask">Where did I hear that an agent should check its own work?</p>
<div class="hm-answer"><p>Boris Cherny, in his YC talk: “${quote("lesson", "verify")}”</p>${receipt("lesson", "verify")}</div>
</div>
</li>
</ol>
</div>
</section>`;

  const save = `<section class="hm-sec" id="save" data-home-part="save" aria-labelledby="save-title">
<div class="container hm-sec-grid">
<div class="hm-sec-copy">
<h2 id="save-title">Save it.</h2>
<p class="hm-lead">One click while you watch. Uoink saves the video, podcast or X post into a library on your computer, with its transcript when there is one.</p>
<ul class="hm-facts"><li>YouTube, podcasts, X posts and X videos</li><li>Captions saved with timestamps; local Whisper can transcribe the rest</li><li>Markdown and JSON on your disk. No account, no Uoink cloud.</li></ul>
<a class="hm-link" href="/sources">Everything Uoink can save -&gt;</a>
</div>
<div class="hm-win hm-library hm-library-full">
${winBar("Library", '<span class="hm-local"><i aria-hidden="true"></i>Running on this computer</span>')}
<div class="hm-search" aria-hidden="true">Search your library or paste a link to uoink it</div>
<div class="hm-kinds" aria-hidden="true"><span class="is-on">All</span><span>Videos</span><span>Posts</span><span>Podcasts</span></div>
<ul class="hm-lib-list">
${libraryRow(lessonCover(), lessonTitle, "Y Combinator · YouTube", "YouTube captions")}
${libraryRow('<span class="hm-kind">podcast</span>', label("sources.podcast.title"), "How I AI · Podcast", "transcript saved")}
${libraryRow(cover("source-x-video", "", 720, 720), label("sources.x.title"), `${label("sources.x.note")} · X`, "transcript saved")}
</ul>
<p class="hm-win-foot"><span class="hm-tag">Example</span> Three saves on loop engineering.</p>
</div>
</div>
</section>`;

  const find = `<section class="hm-sec" id="find" data-home-part="find" aria-labelledby="find-title">
<div class="container hm-sec-grid">
<div class="hm-sec-copy">
<h2 id="find-title">Find it.</h2>
<p class="hm-lead">Ask your AI “Where did I hear that?” It searches your library and answers with the source and the minute, so you can check it.</p>
<a class="hm-link" href="/features/evidence-panel">How evidence cards work -&gt;</a>
</div>
<div class="hm-win hm-chat hm-chat-full">
${winBar("Your AI")}
<p class="hm-ask">Where did I hear that thing about goal loops?</p>
<p class="hm-tool"><code>uoink · search_clips "goal loop"</code><span>2 sources</span></p>
<div class="hm-answer">
<p>Two of your saved sources cover it.</p>
<div class="hm-cite"><p>Claire Vo on How I AI: “${quote("podcast", "goal")}”</p>${receipt("podcast", "goal")}</div>
<div class="hm-cite"><p>Boris Cherny at YC, on giving it a goal and a check: “${quote("lesson", "goal")}”</p>${receipt("lesson", "goal")}</div>
</div>
</div>
</div>
</section>`;

  const line = (text: string, cites: [Spoken, string][]) =>
    `<li><p class="hm-draft-line">${text}</p>${cites.map(([source, key]) => readerRow(source, key)).join("")}</li>`;
  const write = `<section class="hm-sec" id="write" data-home-part="write" aria-labelledby="write-title">
<div class="container hm-sec-grid">
<div class="hm-sec-copy">
<h2 id="write-title">Write with receipts.</h2>
<p class="hm-lead">Writing Studio drafts a tweet, a thread or a blog post from what you saved, and cites the sources it drew on so you can check them.</p>
<p class="hm-links"><a class="hm-link" href="/features/writing-studio">Writing Studio -&gt;</a><a class="hm-link" data-home-link="field-notes" href="/blog/loop-engineering">Loop engineering field notes -&gt;</a></p>
</div>
<div class="hm-win hm-studio">
${winBar("Writing Studio")}
<p class="hm-modes"><span class="hm-mode">Tweet</span><span class="hm-mode is-on">Thread</span><span class="hm-mode">Blog</span></p>
<ol class="hm-thread">
${line(label("sources.lesson.receipts.prompt.point") + ".", [["lesson", "prompt"]])}
${line(label("drafts.goal"), [["lesson", "verify"]])}
${line(`${label("drafts.job")} ${label("drafts.learn")}`, [["lesson", "job"], ["podcast", "schedule"]])}
</ol>
</div>
</div>
<p class="container hm-disclosure">Examples on this page: loop engineering, from three saved sources. ${label("example.disclosure")}</p>
</section>`;

  const connect = `<section class="hm-connect" data-home-part="connect" aria-labelledby="connect-title">
<div class="container hm-connect-row">
<h2 id="connect-title">Connect your AI</h2>
<ul class="hm-clients" aria-label="AI clients that connect over MCP"><li>Claude Desktop</li><li>Claude Code</li><li>Cursor</li><li>Codex</li></ul>
<p>Over MCP, with ${o.toolCount} tools. ChatGPT works by copy and paste.</p>
<a class="hm-link" href="/developers">Set up your AI -&gt;</a>
</div>
</section>`;

  const deeper = `<section class="go-deeper" id="live-uoink" data-home-part="go-deeper" aria-labelledby="deeper-title"><div class="container"><h2 id="deeper-title">Go deeper</h2><nav class="go-deeper-grid" aria-label="Go deeper"><a href="/sources">Sources</a><a href="/how-it-works">How it works</a><a href="/features">Features</a><a href="/mcp">MCP</a><a href="/creators">Creators</a><a href="/blog">Field notes</a></nav></div></section>`;

  const zing = `<section class="home-sibling" data-home-part="sibling" aria-labelledby="sibling-title"><div class="container"><div class="hm-zing"><span class="hm-charge" aria-hidden="true"></span><div><h2 id="sibling-title">Works with Zing</h2><p>Want the video version? Zing it.</p></div><a class="hm-zing-link" href="https://myzing.app">Meet Zing -&gt;</a></div></div></section>`;

  return [hero, save, find, write, connect, deeper, zing].join("\n");
}

import { MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT, mcpTools } from "./mcp-tools";
import { MCP_STDIO_CONFIG } from "./mcp-config";
import { PRODUCT_STATUS } from "./product-status";

export type PageId =
  | "home"
  | "install"
  | "how"
  | "features"
  | "podcasts"
  | "agents"
  | "mcp"
  | "about"
  | "privacy"
  | "changelog"
  | "terms"
  | "memory"
  | "tweaks"
  | "creators"
  | "research"
  | "agentDocs"
  | "hooks"
  | "blog"
  | "twitter"
  | "dashboard"
  | "installed"
  | "sources"
  | "developers";

export type FaqItem = { question: string; answer: string };

export type SitePage = {
  id: PageId;
  route: string;
  mode: string;
  title: string;
  subtitle?: string;
  description: string;
  keywords: string[];
  html: string;
  faq?: FaqItem[];
};

export const CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://uoink.app";
export const GITHUB_URL = "https://github.com/ryanbiddy/uoink";
export const RELEASE_URL = "https://github.com/ryanbiddy/uoink/releases/latest";
export const X_URL = "https://www.twitter.com/uoinkapp";
export const X_HANDLE = "@uoinkapp";
export const CONTACT_EMAIL = "hi@uoink.app";
// Single source of truth for the product version on the site. Keep this in sync
// with the app's VERSION file (ryanbiddy/uoink) on each release. The static JSON
// surfaces that can't import it -- public/.well-known/mcp.json and
// public/.well-known/mcp/server-card.json -- carry the same value and must be
// bumped alongside this constant.
export const VERSION = "v3.8.0";
// Numeric form (no leading "v") for machine-readable manifests and server cards.
export const VERSION_NUMBER = VERSION.replace(/^v/, "");

const WINDOWS_MARK =
  '<span class="os-logo windows-logo" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path d="M5 8l17-2.4v17.2H5V8zm20.5-2.8L43 2.7v20.1H25.5V5.2zM5 25.2h17v17.2L5 40V25.2zm20.5 0H43v20.1l-17.5-2.5V25.2z" fill="currentColor"/></svg></span>';
const MAC_MARK =
  '<span class="os-logo mac-logo" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path d="M32.4 4.4c.2 3.1-1.1 6.1-3 8.2-2.1 2.3-5.1 4-8 3.8-.4-3 .9-6 2.8-8.1 2-2.3 5.4-4 8.2-3.9zM42 34.3c-1.1 2.5-1.7 3.6-3.1 5.9-2 3-4.8 6.9-8.3 7-3.1.1-3.9-2-8.1-2s-5.1 1.9-8 2c-3.5.1-6.2-3.6-8.2-6.7-5.6-8.5-6.2-18.5-2.7-23.8 2.5-3.8 6.4-6 10-6.1 3.7-.1 7.1 2 9 2s5.6-2.4 9.5-2c1.6.1 6.2.7 9.1 4.9-.2.1-5.5 3.2-5.4 9.6.1 7.6 6.6 10.1 6.2 9.2z" fill="currentColor"/></svg></span>';

const installFaq: FaqItem[] = [
  {
    question: "What operating systems are supported by Uoink?",
    answer:
      `${PRODUCT_STATUS.mac.visible}`,
  },
  {
    question: "Does the helper require administrator permissions?",
    answer:
      "No. The helper runs in user space. On Windows it installs under %LOCALAPPDATA% and starts from the current-user startup entry.",
  },
  {
    question: "What browsers support the extension?",
    answer:
      "The extension is Manifest V3 and targets Chromium browsers: Chrome, Edge, Brave, Vivaldi, Arc, and Opera GX. Since Chrome Web Store approval is pending, sideload the extension manually from the folder Uoink places on your machine.",
  },
  {
    question: "Why does Uoink need a desktop helper?",
    answer:
      "The browser extension can't run yt-dlp, ffmpeg, Whisper, SQLite indexing, or the local MCP server by itself. The helper does that work locally so your corpus never has to pass through a Uoink cloud.",
  },
];

const privacyFaq: FaqItem[] = [
  {
    question: "Is my data sent to Uoink servers?",
    answer:
      "No. Uoink has no corpus server, no account system, and no telemetry endpoint. Captures live on your disk.",
  },
  {
    question: "Where is my Anthropic API key stored?",
    answer:
      "Optional AI features use your own Anthropic key. Entity extraction is off by default.",
  },
  {
    question: "When does anything leave my machine?",
    answer:
      "Network calls go to the source you asked to extract, such as YouTube, X, or an RSS feed. Optional AI passes call Anthropic with your own key only when enabled.",
  },
];

const agentsFaq: FaqItem[] = [
  {
    question: "What is MCP and how does Uoink use it?",
    answer:
      "Model Context Protocol lets an AI client call local tools. Uoink exposes a local stdio MCP server so Claude Desktop and Cursor (the tested clients) can capture and search your library.",
  },
  {
    question: "Does the agent need the clipboard flow?",
    answer:
      "No. Claude Desktop and Cursor can capture, search, and read your library over MCP. ChatGPT uses the clipboard path.",
  },
  {
    question: "Is HTTP transport supported?",
    answer:
      "Uoink exposes 32 tools over stdio and 88 over local HTTP JSON-RPC at 127.0.0.1:5179/mcp/v1.",
  },
];

export const pages: Record<PageId, SitePage> = {
  home: {
    id: "home",
    route: "/",
    mode: "mode-dark",
    title: "Uoink: Local video, podcast, and text corpus for your AI",
    description:
      "Uoink keeps the videos, podcasts, and articles you study on your own disk, then hands them to your AI as a cited corpus.",
    keywords: [
      "youtube to AI",
      "local video corpus",
      "mcp youtube server",
      "local knowledge base",
      "writing studio",
    ],
    html: `
<section class="hero" data-screen-label="home / hero">
  <div class="container">
    <div class="hero-grid">
      <div class="copy">
        <span class="eyebrow">uoink.app / ${VERSION}</span>
        <h1 class="display-xl">Uoink that <em>shit.</em></h1>
        <p class="lede">A local library for the videos and podcasts you study, that any AI you use can search and cite.</p>
        <div class="ctas">
          <a class="btn primary large" href="${RELEASE_URL}">Get Uoink</a>
          <a class="btn ghost large" href="#live-uoink">See a live uoink</a>
        </div>
        <p class="sub-cta">Free / MIT / no required telemetry / ${MCP_STDIO_TOOL_COUNT} stdio tools / ${MCP_TOOL_COUNT} HTTP tools / ${PRODUCT_STATUS.mac.visible}</p>
      </div>
      <div class="hero-demo" id="live-uoink">
        <div class="corpus" data-corpus-animate>
          <div class="hd"><span>karpathy-intro-to-llms.md</span><span>local corpus</span></div>
          <span class="ln k"># Intro to Large Language Models</span>
          <span class="ln dim">source: YouTube / channel: Andrej Karpathy</span>
          <span class="ln dim">saved: Desktop/Uoink/AI-and-ML/karpathy-intro-to-llms/</span>
          <span class="ln">&nbsp;</span>
          <span class="ln k">## Metadata</span>
          <span class="ln dim">duration, views, upload date, channel context, source URL</span>
          <span class="ln k">## Transcript</span>
          <span class="ln hl">[00:47] timestamped transcript excerpt</span>
          <span class="ln k">## Screenshots</span>
          <span class="ln dim">timestamped frames saved on disk</span>
          <span class="ln k">## Comments</span>
          <span class="ln dim">top comments saved with the source</span>
        </div>
        <p class="mono caps" style="color:var(--parchment);margin-top:14px;text-align:right;font-size:9.5px">one uoink / readable by Claude, ChatGPT, and agents</p>
      </div>
    </div>
  </div>
</section>
<section class="section" data-screen-label="home / living library" id="living-library">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">New in 3.8.0: Living Library</span>
      <h2 class="display-l">Find the moment. <em>Cite the source.</em></h2>
    </div>
    <div class="hook-grid">${featureCards([
      ["Clip search + evidence cards", "Search inside videos for timestamped, deep-linked excerpts your AI can quote and cite. Now on everyday stdio MCP."],
      ["Standing capture", "Follow a YouTube channel, YouTube playlist, or podcast RSS feed. With capture enabled, new uploads and episodes land in your library."],
      ["Library reach over MCP", "Search the library, read items, and use resource templates and prompts from your MCP client."],
      ["Cited range export", "Quote a stretch of video or an episode with speaker labels, chapters, and provenance."],
      ["Chapter navigation", "Jump between chapters on items that have them."]
    ])}</div>
    <p class="mt-32"><a class="btn primary" href="https://github.com/ryanbiddy/uoink/releases/tag/v3.8.0">3.8.0 release notes</a> <a class="btn ghost" href="/changelog">Changelog</a></p>
  </div>
</section>
<section class="section tight" data-screen-label="home / product shot">
  <div class="container">
    <figure class="feature-visual product-figure wide">
      <div class="feature-visual-top"><span>uoink dashboard</span><span>local corpus</span></div>
      <div class="feature-visual-body">
        <div class="feature-visual-shot">
          <img src="/product/hero-library.webp" width="1440" height="900" loading="lazy" decoding="async" alt="Uoink dashboard library showing dozens of saved YouTube videos as searchable source cards with transcripts, hook labels, topic filters, and channel context on the local machine." />
          <figcaption>Your captures, searchable on your own disk. Hand the transcript and frames to the AI you choose.</figcaption>
        </div>
      </div>
    </figure>
  </div>
</section>
<hr class="rule"/>
<section class="section" data-screen-label="home / corpus anatomy" id="corpus">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">what you get per uoink</span>
      <h2 class="display-l">Why paste a transcript when you can feed the <em>entire corpus?</em></h2>
      <p class="lede">Transcript-only tools flatten video into text. Uoink keeps the parts that make video useful: the words, the frames, the audience reaction, the channel context, and the source metadata.</p>
    </div>
    <div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      <article class="card"><span class="num">01</span><h3>Capture the <em>source.</em></h3><p>Transcript with timestamps, screenshots, description, title, thumbnail, channel context, and comments in one markdown file.</p><a class="arr-link" href="/how-it-works">See the workflow -></a></article>
      <article class="card"><span class="num">02</span><h3>Keep the <em>asset.</em></h3><p>Every capture writes to disk and into a local SQLite index. Search it later, cite it later, move it into your own vault.</p><a class="arr-link" href="/features">Browse features -></a></article>
      <article class="card"><span class="num">03</span><h3>Hand it to <em>AI.</em></h3><p>Paste transcript and frames into Claude or ChatGPT, or let an MCP agent search and cite your library.</p><a class="arr-link" href="/developers">Open developer docs -></a></article>
    </div>
  </div>
</section>
<section class="big-strip" data-screen-label="home / local first">
  <div class="container" style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center">
    <div>
      <span class="eyebrow">local-first, by design</span>
      <h2 class="display-l" style="margin:8px 0 0">No account. No Uoink cloud. <em>Your disk.</em></h2>
      <p class="body-l" style="margin-top:18px;max-width:60ch">The helper runs on localhost. Your corpus lands on your disk. Entity extraction is opt-in and off by default. If you add your own Anthropic key, the model-usage meter shows real usage.</p>
    </div>
    <a class="btn ink" href="/privacy">Read privacy -></a>
  </div>
</section>
<section class="section" data-screen-label="home / three audiences">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">three doors, one corpus</span>
      <h2 class="display-l">Creators and developers use the same <em>source card.</em></h2>
      <p class="lede">The card stays the shared object. The next move changes by job.</p>
    </div>
    <div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      <a class="card" href="/creators"><span class="num">01</span><h3>Creators.</h3><p>Find the moment you need, read the transcript beside the frames, and export a cited range for your next draft.</p><span class="arr-link">See creator workflow -></span></a>
      <a class="card" href="/developers"><span class="num">02</span><h3>Developers.</h3><p>Give Claude Desktop or Cursor a local library to search and cite. Start with the stdio config or the Claude Desktop bundle.</p><span class="arr-link">Open developer docs -></span></a>
      <a class="card" href="/sources"><span class="num">03</span><h3>Sources.</h3><p>Capture YouTube, X video and post text, podcasts, web articles, and Reddit threads into one local library.</p><span class="arr-link">Browse supported sources -></span></a>
    </div>
  </div>
</section>
<hr class="rule"/>
<section class="section" data-screen-label="home / generate demo">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">from source to draft</span>
      <h2 class="display-l">Pick a source, then <em>generate</em> from it.</h2>
      <p class="lede">Choose something you saved, aim it at a tweet, thread, or script, and Writing Studio drafts from the corpus with the creator credit attached.</p>
    </div>
    <figure class="feature-visual product-figure wide">
      <div class="feature-visual-top"><span>generate flow</span><span>silent loop</span></div>
      <div class="feature-visual-body">
        <div class="feature-visual-shot">
          <video src="/product/generate-flow.mp4" poster="/product/generate-flow-poster.jpg" width="1280" height="720" muted autoplay loop playsinline preload="none" aria-label="Screen recording of Uoink generating a tweet: a source is picked, the output is set to Tweet, a prompt is typed, and a cited draft appears in the preview panel."></video>
          <figcaption>Pick the ThursdAI source, set the output to Tweet, write the prompt, and the cited draft lands in the preview.</figcaption>
        </div>
      </div>
    </figure>
  </div>
</section>
<hr class="rule"/>
<section class="section" data-screen-label="home / model agnostic">
  <div class="container">
    <div class="agent-demo">
      <div class="chat">
        <div class="mini-heading">model agnostic</div>
        <p class="chat-bubble user">Find the moment this saved video discusses language models and give me a source link.</p>
        <p class="chat-bubble assistant">Calling <code>search_clips</code>, then <code>get_evidence_card</code>. Your AI reads timestamped excerpts it can quote and cite.</p>
      </div>
      <div class="log">
        <div class="mini-heading">mcp tool trace</div>
        <pre class="mcp-log" style="margin:0;white-space:pre-wrap">search_library(query)
get_library_item(video_id)
search_clips(query)
get_evidence_card(video_id)</pre>
      </div>
    </div>
    <div class="text-center mt-32">
      <a class="btn ghost" href="/developers">Read MCP setup -></a>
      <a class="btn ghost" href="/mcp">Machine-readable MCP manifest -></a>
    </div>
  </div>
</section>
<section class="section" data-screen-label="home / install">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">install Uoink</span>
      <h2 class="display-l">One helper. One extension. Then the <em>U button.</em></h2>
      <p class="lede">Download the helper, install the extension, open a video, and click Uoink. The helper bundles Python, yt-dlp, and ffmpeg so you never install them yourself.</p>
    </div>
    <div class="ledger">
      <div class="ledger-card live"><div class="top"><span>Windows</span><span>live path</span></div><div class="body-l"><h3>Download the helper.</h3><p class="ver">Uoink installer / Windows 10 and 11</p><p>Runs in your tray, writes to your local library, and exposes the local MCP server.</p></div><div class="foot"><a class="btn primary small" href="${RELEASE_URL}">Download -></a></div></div>
      <div class="ledger-card pend"><div class="top"><span>Extension</span><span>pending review</span></div><div class="body-l"><h3>Install the browser button.</h3><p class="ver">Chrome / Edge / Brave / Vivaldi / Arc / Opera GX</p><p>Chrome Web Store approval is pending. Sideload the extension by loading the unpacked folder located at <code>%LOCALAPPDATA%\\Uoink\\extension</code>.</p></div><div class="foot"><a class="btn ghost small" href="/install#extension">Install notes -></a></div></div>
      <div class="ledger-card"><div class="top"><span>Mac</span><span>${PRODUCT_STATUS.mac.label}</span></div><div class="body-l"><h3>${PRODUCT_STATUS.mac.heading}</h3><p class="ver">${PRODUCT_STATUS.mac.tech}</p><p>${PRODUCT_STATUS.mac.detail}</p></div><div class="foot"><a class="btn ghost small" href="/install#mac">Mac status -></a></div></div>
    </div>
  </div>
</section>
<section class="section tight" data-final-cta data-screen-label="home / final cta">
  <div class="container text-center">
    <span class="wm-line" style="font-size:110px;color:var(--vermillion);justify-content:center"><uoink-mark aria-hidden="true"></uoink-mark><span class="oink">OINK</span></span>
    <p class="display-m" style="margin:24px auto 32px;max-width:24ch">Take the video. Make it <em>usable.</em></p>
  </div>
</section>`,
  },
  install: {
    id: "install",
    route: "/install",
    mode: "mode-dark",
    title: "Download Uoink: Local Helper and Browser Extension Install",
    description:
      "Install Uoink for Windows, add the browser extension, and start extracting local video and text corpora for Claude, ChatGPT, and MCP.",
    keywords: ["install uoink", "uoink download windows", "uoink chrome extension", "yt-dlp Chrome extension", "reddit context for AI"],
    faq: installFaq,
    html: `
<section class="hero" data-screen-label="install / hero">
  <div class="container">
    <div class="hero-grid">
      <div class="copy">
        <span class="eyebrow">install</span>
        <h1 class="display-xl">Install <em>Uoink.</em></h1>
        <div class="ctas"><a class="btn primary large with-logo" href="${RELEASE_URL}">${WINDOWS_MARK}Download Windows installer</a><a class="btn ghost large" href="/how-it-works">See how it works</a></div>
        <p class="footnote text-xs dim mt-8">The installer is unsigned. Windows SmartScreen will show a warning. <strong>More info → Run anyway</strong>.</p>
        <p class="sub-cta mt-16">Windows 10/11 only / About 390 MB / No admin rights needed</p>
        <p class="lede">Get the helper running, add the browser button, and click Uoink on any video or Reddit thread. No Python, no command line, no path wrangling.</p>
        <div class="brand-strip" aria-label="Install surfaces">
          <!-- GitHub logo source: https://github.com/logos; license/usage confirmation: official GitHub mark, unmodified integration callout under GitHub logo guidelines. -->
          <span class="logo-chip logo-mark"><img src="/assets/brand-logos/github.svg" alt="GitHub" width="22" height="22" loading="lazy" decoding="async" /><span>GitHub Releases</span></span>
          <span>Chromium browsers</span>
          <span class="cws-chip">Chrome Web Store pending</span>
        </div>
      </div>
      <div class="corpus">
        <div class="hd"><span>install steps</span><span>sideload flow</span></div>
        <span class="ln k">1. Run helper installer</span>
        <span class="ln dim">Places local helper under %LOCALAPPDATA%\\Uoink</span>
        <span class="ln k">2. Sideload extension</span>
        <span class="ln dim">Load unpacked folder from the helper directory</span>
        <span class="ln k">3. Start capturing</span>
        <span class="ln dim">YouTube and Reddit threads save directly to disk</span>
      </div>
    </div>
  </div>
</section>

<section class="section" data-screen-label="install / steps">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">setup steps</span>
      <h2 class="display-l">Three steps to <em>sideload.</em></h2>
      <p class="lede">Uoink runs entirely on your machine. Follow this sequence to set it up.</p>
    </div>
    <div class="three-cards">
      <article class="card">
        <span class="num">01</span>
        <h3>Download the helper.</h3>
        <p>Run the unsigned Windows installer (about 390 MB). No admin rights needed; it installs to <code>%LOCALAPPDATA%\\Uoink</code>.</p>
        <p class="footnote text-xs dim">The installer is unsigned. Windows SmartScreen will show a warning. <strong>More info → Run anyway</strong>.</p>
      </article>
      <article class="card">
        <span class="num">02</span>
        <h3>Load the browser extension.</h3>
        <p>We're waiting on Web Store approval, so you'll need to load the extension folder manually:</p>
        <ol class="step-list text-sm" style="margin-top: 12px; padding-left: 18px; list-style-type: decimal;">
          <li style="margin-bottom: 6px;">Open your browser extensions page: <code>chrome://extensions</code> (Chrome), <code>edge://extensions</code> (Edge), or <code>brave://extensions</code> (Brave).</li>
          <li style="margin-bottom: 6px;">Enable <strong>Developer mode</strong> in the top right.</li>
          <li style="margin-bottom: 6px;">Click <strong>Load unpacked</strong> and select the <code>%LOCALAPPDATA%\\Uoink\\extension</code> directory.</li>
        </ol>
      </article>
      <article class="card">
        <span class="num">03</span>
        <h3>Click capture.</h3>
        <p>Open YouTube or Reddit. Click the Uoink button on any video or thread page to save the corpus directly to your local files.</p>
      </article>
    </div>
  </div>
</section>

<section class="section" data-screen-label="install / platforms">
  <div class="container">
    <div class="ledger">
      <div class="ledger-card live" id="windows">
        <div class="top"><span class="platform-label">${WINDOWS_MARK}Windows</span><span>now</span></div>
        <div class="body-l">
          <h3>Desktop helper.</h3>
          <p class="ver">Windows 10/11 / release page</p>
          <p>The helper bundles Python, yt-dlp, ffmpeg, SQLite, and the local MCP server. It runs in user space and exposes the loopback server on port 5179.</p>
        </div>
        <div class="foot"><a class="btn primary small with-logo" href="${RELEASE_URL}">${WINDOWS_MARK}Open release -></a></div>
      </div>
      <div class="ledger-card pend" id="extension">
        <div class="top"><span>Extension</span><span>pending review</span></div>
        <div class="body-l">
          <h3>Browser button.</h3>
          <p class="ver">Chrome / Edge / Brave / Vivaldi / Arc / Opera GX</p>
          <p>The extension adds capture buttons directly to supported web pages. It communicates locally with the helper and skips broad history permissions.</p>
          <p>Chrome Web Store approval is pending. Sideload the extension by loading the unpacked folder located at <code>%LOCALAPPDATA%\\Uoink\\extension</code>.</p>
        </div>
        <div class="foot">
          <span class="text-xs dim">Web Store review pending</span>
        </div>
      </div>
      <div class="ledger-card" id="mac">
        <div class="top"><span class="platform-label">${MAC_MARK}Mac</span><span>${PRODUCT_STATUS.mac.label}</span></div>
        <div class="body-l">
          <h3>${PRODUCT_STATUS.mac.heading}</h3>
          <p class="ver">${PRODUCT_STATUS.mac.tech}</p>
          <p>${PRODUCT_STATUS.mac.detail}</p>
        </div>
        <div class="foot"><span class="text-xs dim">Windows 10/11 only</span></div>
      </div>
    </div>
  </div>
</section>

<section class="section" data-screen-label="install / post install">
  <div class="container">
    <div class="section-head"><span class="eyebrow">post-install</span><h2 class="display-l">What happens when it's <em>running.</em></h2><p class="lede">The helper starts in the background. The extension checks localhost. When both are green, the Uoink button appears on supported pages.</p></div>
    <figure class="feature-visual product-figure wide">
      <div class="feature-visual-top"><span>dashboard</span><span>after install</span></div>
      <div class="feature-visual-body">
        <div class="feature-visual-shot">
          <img src="/product/hero-library.webp" width="1440" height="900" loading="lazy" decoding="async" alt="The Uoink dashboard running locally after install: a populated library of captured videos with search, channel and topic filters, and per-source hook labels." />
          <figcaption>The local dashboard once the helper is running: your captures, searchable and filterable on your own machine.</figcaption>
        </div>
      </div>
    </figure>
    <div class="three-cards">
      <article class="card"><span class="num">01</span><h3>Tray status.</h3><p>The helper sits in the tray and opens the local dashboard when you need logs, settings, or recent jobs.</p></article>
      <article class="card"><span class="num">02</span><h3>Local files.</h3><p>Captures write to your Uoink folder and into a local SQLite index. Nothing uploads to Uoink because there's no Uoink cloud.</p></article>
      <article class="card"><span class="num">03</span><h3>AI handoff.</h3><p>Paste into Claude or ChatGPT, or skip the clipboard and let your MCP client call Uoink directly.</p></article>
    </div>
  </div>
</section>

<section class="section" data-screen-label="install / faq">
  <div class="container"><div class="section-head"><span class="eyebrow">troubleshooting</span><h2 class="display-l">The boring questions that <em>matter.</em></h2></div>${renderFaq(installFaq)}</div>
</section>`,
  },
  how: {
    id: "how",
    route: "/how-it-works",
    mode: "mode-light",
    title: "How Uoink Works: Local Video and Podcast Corpus Workflow",
    description:
      "Learn how Uoink captures videos and podcasts, writes them to your disk as a local corpus, and exposes them to Claude and Cursor.",
    keywords: [
      "how uoink works",
      "local video corpus workflow",
      "transcribe video offline",
      "mcp video workflow",
    ],
    html: `
<section class="hero" data-screen-label="how / hero">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">how it works</span>
      <h1 class="display-xl">How Uoink <em>works.</em></h1>
      <p class="lede">One click turns video and audio into a structured text database on your machine.</p>
      <p class="body-l" style="max-width:70ch;margin-top:16px">A local helper does the work: download, transcribe, index. Your browser extension and your AI agents talk to it over localhost, so the files never leave your disk.</p>
    </div>
    
    <div class="hero-image-container" style="margin:48px 0;border:1px solid var(--ink-dim);border-radius:8px;overflow:hidden">
      <img src="/screenshots/how-it-works/01-dashboard-hero.png" alt="Dashboard Main Screen showing library grid and active tasks" style="width:100%;height:auto;display:block" />
      <div style="background:var(--ink-bg);padding:12px 18px;font-size:12px;color:var(--parchment);border-top:1px solid var(--ink-dim)">
        <span><b>Dashboard Main Screen:</b> Browsing the local library grid and active transcription tasks. Your files stay on your disk.</span>
      </div>
    </div>
  </div>
</section>

<section class="section" data-screen-label="how / five step loop">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">the five step loop</span>
      <h2 class="display-l">From raw video to context your model can <em>cite.</em></h2>
      <p class="lede">Capture to draft in 5 steps, all on your machine.</p>
    </div>
    
    <div class="card-grid" style="display:grid;grid-template-columns:1fr;gap:32px;max-width:80ch;margin:0 auto">
      <article class="step-card" style="border-left:4px solid var(--vermillion);padding-left:24px">
        <span class="num" style="font-size:24px;font-weight:bold;color:var(--vermillion)">01</span>
        <h3 style="margin:8px 0;font-size:22px">Capture the source.</h3>
        <p>One click grabs the transcript, screenshots, comments, and metadata. Hit the Uoink button on a YouTube watch page, right-click any link, or paste feed URLs into settings. The helper queues downloads in the background and handles the rate limits for you.</p>
      </article>
      
      <article class="step-card" style="border-left:4px solid var(--vermillion);padding-left:24px">
        <span class="num" style="font-size:24px;font-weight:bold;color:var(--vermillion)">02</span>
        <h3 style="margin:8px 0;font-size:22px">Build the library.</h3>
        <p>Every capture lands on your workstation as standard markdown and gets indexed in a local SQLite database. Search transcripts and comments instantly, even offline.</p>
      </article>
      
      <article class="step-card" style="border-left:4px solid var(--vermillion);padding-left:24px">
        <span class="num" style="font-size:24px;font-weight:bold;color:var(--vermillion)">03</span>
        <h3 style="margin:8px 0;font-size:22px">Assemble workspaces.</h3>
        <p>Group your captures around the thing you're making: transcripts, self-channel performance metrics, and research themes in one workspace. That workspace becomes clean grounding data for your model.</p>
      </article>
      
      <article class="step-card" style="border-left:4px solid var(--vermillion);padding-left:24px">
        <span class="num" style="font-size:24px;font-weight:bold;color:var(--vermillion)">04</span>
        <h3 style="margin:8px 0;font-size:22px">Iterate on drafts.</h3>
        <p>Draft in the local Writing Studio. The helper feeds grounding context to your AI client, checks each draft against your style anchors and formatting rules, and appends creator credit automatically.</p>
      </article>
      
      <article class="step-card" style="border-left:4px solid var(--vermillion);padding-left:24px">
        <span class="num" style="font-size:24px;font-weight:bold;color:var(--vermillion)">05</span>
        <h3 style="margin:8px 0;font-size:22px">Distribute with agents.</h3>
        <p>Claude Desktop and Cursor can search and cite your library over MCP. For ChatGPT, paste the transcript and frames from the clipboard.</p>
      </article>
    </div>
  </div>
</section>

<section class="big-strip" data-screen-label="how / install-cta">
  <div class="container" style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center">
    <div>
      <span class="eyebrow">get started</span>
      <h2 class="display-l" style="margin:8px 0 0">Your corpus starts with one capture.</h2>
      <p class="body-l" style="margin-top:18px">Download the helper and the extension, then click Uoink on the next video you study.</p>
    </div>
    <a class="btn ink" href="/install">Install Uoink -></a>
  </div>
</section>
    `,
  },
  features: {
    id: "features",
    route: "/features",
    mode: "mode-dark",
    title: "Local Video Corpus and Creator Research Features",
    description:
      "Explore Uoink features: video capture, local memory, hook taxonomy, comment intelligence, MCP tools, podcast support, and privacy.",
    keywords: ["youtube transcript tool features", "local video corpus database", "uoink vs glasp", "uoink vs notebooklm"],
    html: `
<section class="hero" data-screen-label="features / hero"><div class="container"><div class="section-head"><span class="eyebrow">feature inventory</span><h1 class="display-xl">Everything Uoink <em>does.</em></h1><p class="lede">Extraction is the on-ramp. The real product is the local corpus that grows every time you capture something worth studying.</p><div class="ctas"><a class="btn primary large" href="${RELEASE_URL}">Install Uoink</a><a class="btn ghost large" href="/changelog">See roadmap</a></div></div></div></section>
<section class="section" data-screen-label="features / capture"><div class="container"><div class="section-head"><span class="eyebrow">job 1 / capture</span><h2 class="display-l">Get content out of video and <em>audio.</em></h2><p class="lede">Capture from the browser, from a playlist, from a URL, or from a feed. The interface changes; the corpus shape stays stable.</p></div><div class="hook-grid">${featureCards([
["In-page Uoink button","Button under supported video pages with helper status and fast capture."],
["Right-click capture","Context menu for links, thumbnails, and video pages."],
["Playlist mode","Queue up to 10 videos at a time with partial-failure tolerance."],
["Universal URL mode","yt-dlp backed extraction for supported web video beyond YouTube."],
["Podcast RSS feeds","Poll feeds and process episodes through local transcription."],
["Mobile queue bridge","Save to a playlist on mobile; let the desktop helper catch up later."]
])}</div></div></section>
<section class="section" data-screen-label="features / organize"><div class="container"><div class="section-head"><span class="eyebrow">job 2 / organize</span><h2 class="display-l">Turn captures into a <em>library.</em></h2><p class="lede">Every capture compounds: searchable, tagged, and citable from one local index that keeps getting denser.</p></div><div class="hook-grid">${featureCards([
["SQLite FTS5 search","Search transcripts, titles, comments, metadata, and corpus text locally."],
["Local files","Structured Markdown and a JSON sidecar on your own disk."],
["Memory dashboard","Browse recent captures, job states, thumbnails, health, and actions."],
["Entity mentions","Find every corpus that names a person, tool, company, or topic."],
["Hook taxonomy","Classify openings across nine categories for creator research."],
["Taste calibration","Planned local memory layer that learns what you actually revisit."]
])}</div></div></section>
<section class="section" data-screen-label="features / send"><div class="container"><div class="section-head"><span class="eyebrow">job 3 / send it to AI</span><h2 class="display-l">Use the model you already <em>pay for.</em></h2><p class="lede">Uoink skips the model bundle and chat lock-in. Paste anywhere, send directly, or let an agent call tools.</p></div><div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px"><article class="card"><span class="num">01</span><h3>Paste flow.</h3><p>Clipboard corpus for Claude, ChatGPT, Gemini, local models, or any editor that accepts markdown.</p></article><article class="card"><span class="num">02</span><h3>MCP flow.</h3><p>${MCP_TOOL_COUNT} local tools for capture, search, comments, hooks, health, taxonomy, citations, writing, and site access.</p><a class="arr-link" href="/agents">See agents -></a></article><article class="card"><span class="num">03</span><h3>Operator Skill.</h3><p>Portable Skill instructions teach compatible agents how to use the corpus with citation discipline.</p></article></div></div></section>
<section class="section" data-screen-label="features / tune"><div class="container"><div class="section-head"><span class="eyebrow">job 4 / tune the helper</span><h2 class="display-l">Make the defaults fit your <em>machine.</em></h2></div><ul class="fact-list" style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px 56px;list-style:none;padding:0"><li><div><b>BYO Anthropic key</b>Enables Hook Type, Comment Intelligence, and Entity Extraction. Stored in the OS credential vault.</div></li><li><div><b>Clipboard budget</b>Set screenshot caps, compression, and comment limits before pasting into a model.</div></li><li><div><b>Whisper model selector</b>Choose tiny/base/small/medium/large for podcast transcription cost and accuracy tradeoffs.</div></li><li><div><b>Output folder picker</b>Send corpora where your work already lives, including markdown vault workflows.</div></li></ul></div></section>
<section class="big-strip" data-screen-label="features / comparison"><div class="container"><span class="eyebrow">why not Glasp, NoteGPT, or NotebookLM?</span><h2 class="display-l">Transcript tools give you text. Uoink gives you a <em>local asset.</em></h2><p class="body-l" style="max-width:70ch">Cloud tools summarize, extensions grab transcripts, and generic MCP servers fetch captions. Uoink's wedge is the combination: local corpus, screenshots, comments, hook classification, entity search, and MCP access. The archive compounds because it belongs to you.</p><p class="mt-24"><a class="btn ink" href="/privacy">Check privacy -></a> <a class="btn ghost" href="/agents">Check MCP -></a></p></div></section>`,
  },
  podcasts: aliasPage("podcasts", "/podcasts", "Podcast details moved to Sources", "Podcasts are now listed on the Uoink sources page.", "/sources#podcasts"),
  agents: {
    id: "agents",
    route: "/agents",
    mode: "mode-light",
    title: "MCP YouTube Server: Claude Desktop and Cursor Tools",
    subtitle: `${MCP_TOOL_COUNT} MCP tools in the registry, ${MCP_STDIO_TOOL_COUNT} curated over stdio. Available instantly.`,
    description:
      "Use Uoink as a local MCP server for Claude Desktop and Cursor.",
    keywords: ["mcp youtube server", "claude desktop youtube tool", "cursor mcp server", "mcp video tool"],
    faq: agentsFaq,
    html: `
<section class="hero" data-screen-label="agents / hero"><div class="container"><div class="section-head"><span class="eyebrow">agents and MCP</span><h1 class="display-xl">Uoink is an <em>MCP server.</em></h1><p class="lede">Give your agent a local library to search and cite. Uoink exposes ${MCP_STDIO_TOOL_COUNT} tools over stdio and ${MCP_TOOL_COUNT} in the HTTP registry.</p><div class="ctas"><a class="btn primary large" href="#configs">Copy config</a><a class="btn ghost large" href="/mcp">Read MCP manifest</a></div><div class="brand-strip" aria-label="Agent clients">
<!-- Claude logo source: https://www.anthropic.com/ and https://claude.ai/favicon.svg; license/usage confirmation: official Claude site mark, unmodified integration callout. -->
<span class="logo-chip brand-mark-pill logo-mark" aria-label="Claude"><img src="/assets/brand-logos/claude.svg" alt="Claude" width="30" height="30" loading="lazy" decoding="async" /></span>
<!-- Cursor logo source: https://cursor.com/ and https://cursor.com/marketing-static/favicon.svg; license/usage confirmation: official Cursor site asset, unmodified integration callout because no separate public brand portal was found. -->
<span class="logo-chip brand-mark-pill logo-mark" aria-label="Cursor"><img src="/assets/brand-logos/cursor.svg" alt="Cursor" width="30" height="30" loading="lazy" decoding="async" /></span>
<!-- GitHub logo source: https://github.com/logos; license/usage confirmation: official GitHub mark, unmodified integration callout under GitHub logo guidelines. -->
<span class="logo-chip brand-mark-pill logo-mark" aria-label="GitHub"><img src="/assets/brand-logos/github.svg" alt="GitHub" width="30" height="30" loading="lazy" decoding="async" /></span>
</div></div></div></section>
<section class="section" data-screen-label="agents / configs" id="configs"><div class="container"><div class="section-head"><span class="eyebrow">install in your client</span><h2 class="display-l">Connect your <em>library.</em></h2><p class="lede">Tested with Claude Desktop and Cursor. Open the <a href="${RELEASE_URL}">.mcpb bundle from the latest release</a> for one-click Claude Desktop setup, or use the README config:</p></div><div class="docs-main"><pre>${escapeHtml(MCP_STDIO_CONFIG)}</pre><p>Claude Desktop does not expand <code>%LOCALAPPDATA%</code>. Use absolute paths in both fields, or copy the generated config from the extension’s Settings page. Restart the client after saving. Cline and Continue were not individually smoke-tested. ChatGPT uses the clipboard path.</p></div></div></section>
<section class="section" data-screen-label="agents / tools"><div class="container"><div class="section-head"><span class="eyebrow">tools your agent can call</span><h2 class="display-l">Real names, real <em>tools.</em></h2><p class="lede">Use the <code>uoink_*</code> names for new configs. Migration aliases may exist in older installs, but the public docs should point agents at Uoink.</p></div><div class="docs-main">${toolRows()}</div><p class="mt-32"><a class="btn primary" href="/mcp">Open machine-readable MCP page -></a></p></div></section>
<section class="section" data-screen-label="agents / trace"><div class="container"><div class="section-head"><span class="eyebrow">composing Uoink with other tools</span><h2 class="display-l">Ask Cursor to tear down 3 competitor videos <em>for real.</em></h2></div><div class="agent-demo"><div class="chat"><div class="mini-heading">prompt</div><p class="chat-bubble user">Uoink these three competitor videos, classify the hooks, then write a short doc comparing pacing patterns.</p><div class="mini-heading">result</div><p class="chat-bubble assistant">The agent extracts each video, polls the jobs, fetches the corpora, runs hook classification, then writes the comparison into your repo or notes folder.</p></div><div class="log"><div class="mini-heading">tool sequence</div><pre class="mcp-log" style="margin:0;white-space:pre-wrap">uoink_video(url_1)
uoink_video(url_2)
uoink_video(url_3)
get_job_status(job_id)
get_uoink_corpus(corpus_id)
classify_hook(corpus_id)
search_uoinks("pacing")</pre></div></div></div></section>
<section class="big-strip" data-screen-label="agents / transport"><div class="container"><span class="eyebrow">transport options</span><h2 class="display-l">Stdio and HTTP <em>transports.</em></h2><p class="body-l" style="max-width:70ch">Uoink supports both stdio and HTTP (SSE) transports. The stdio path connects agents directly as subprocesses. The HTTP transport runs on <code>http://localhost:5179/mcp/v1</code> and requires the header <code>X-Uoink-Token</code> (token stored in <code>%LOCALAPPDATA%\\Uoink\\token.txt</code>).</p><p class="mt-24"><a class="btn ink" href="/install">Install Uoink -></a> <a class="btn ghost" href="${GITHUB_URL}">GitHub -></a></p></div></section>
<section class="section" data-screen-label="agents / faq"><div class="container"><div class="section-head"><span class="eyebrow">agent FAQ</span><h2 class="display-l">The integration questions <em>first.</em></h2></div>${renderFaq(agentsFaq)}</div></section>`,
  },
  mcp: {
    id: "mcp",
    route: "/mcp",
    mode: "mode-light",
    title: "Uoink MCP Manifest and Tool Schemas",
    description:
      "Machine-readable Uoink MCP server details: local transport, client snippets, capabilities, and tool names.",
    keywords: ["uoink mcp manifest", "mcp server manifest", "claude desktop mcp youtube", "cursor mcp video"],
    html: `
<section class="section" data-screen-label="mcp / manifest">
  <div class="container docs-shell">
    <aside class="docs-sidebar"><p class="mini-heading">MCP</p><ul><li><a href="#server">Server</a></li><li><a href="#tools">Tools</a></li><li><a href="/mcp/manifest.json">manifest.json</a></li><li><a href="/llms.txt">llms.txt</a></li></ul></aside>
    <article class="docs-main">
      <p class="crumb">machine-readable product surface</p>
      <h1 class="display-l">Uoink MCP <em>manifest.</em></h1>
      <p>Agents should use this page and <a href="/mcp/manifest.json">/mcp/manifest.json</a> to discover the local server, install path, supported transports, and tool names.</p>
      <h2 id="server">Server</h2>
      <pre>name: uoink
version: ${VERSION_NUMBER}
homepage: ${CANONICAL_URL}
source: https://github.com/ryanbiddy/uoink
license: MIT
transport:
  - stdio: supported
  - http: http://127.0.0.1:5179/mcp/v1
tools:
  stdio: ${MCP_STDIO_TOOL_COUNT}
  http: ${MCP_TOOL_COUNT}
install:
  windows: ${CANONICAL_URL}/install#windows
platform: Windows 10/11 only. No Mac build scheduled.</pre>
      <h2>Stdio setup</h2>
      <p>Tested with Claude Desktop and Cursor. Install Uoink, then open the <a href="${RELEASE_URL}">.mcpb bundle from the latest release</a> for one-click Claude Desktop setup, or use this README config:</p>
      <pre>${escapeHtml(MCP_STDIO_CONFIG)}</pre>
      <p>Claude Desktop does not expand <code>%LOCALAPPDATA%</code>. Replace it in both paths with your full user app-data directory, or copy the generated config from the extension’s Settings page. Restart your client after saving. Cline and Continue are standard-stdio compatibility paths; they were not individually smoke-tested.</p>
      <p>HTTP uses <code>X-Uoink-Token</code> from <code>%LOCALAPPDATA%\\Uoink\\token.txt</code>. The OpenAPI 3.1 bridge is for local agents that do not speak MCP.</p>
      <h2 id="tools">Tools</h2>
      <p>${MCP_STDIO_TOOL_COUNT} over stdio; ${MCP_TOOL_COUNT} in the HTTP registry below. The manifest marks each tool’s transports.</p>
      ${toolRows()}
      <h2>Canonical config note</h2>
      <p>Use the generated local paths. After install, Uoink's setup page generates the real config for the user's machine. Snippets on the website are templates for humans and crawlers.</p>
      <p><a class="btn primary" href="/developers">Human setup page</a> <a class="btn ghost" href="/mcp/manifest.json">Raw manifest JSON</a></p>
    </article>
  </div>
</section>
<script type="application/json" id="uoink-mcp-manifest">
{"server":{"name":"uoink","version":"${VERSION_NUMBER}","homepage":"${CANONICAL_URL}","source":"https://github.com/ryanbiddy/uoink","license":"MIT","transports":["stdio","http"],"stdio_tool_count":${MCP_STDIO_TOOL_COUNT},"tool_count":${MCP_TOOL_COUNT}},"tools":${JSON.stringify(mcpTools.map(([name, description]) => ({ name, description })))}}</script>`,
  },
  about: {
    id: "about",
    route: "/about",
    mode: "mode-dark",
    title: "About Uoink: Open Source Local Corpus Software",
    description:
      "Learn why Uoink is local-first, open source, and built around public GitHub releases instead of user tracking.",
    keywords: ["uoink about", "uoink maker", "open source youtube tool", "local-first ai tool"],
    html: `
<section class="hero" data-screen-label="about / hero">
  <div class="container">
    <div class="hero-grid">
      <div class="copy">
        <span class="eyebrow">about</span>
        <h1 class="display-xl">Your sources. Your disk. <em>Your AI.</em></h1>
        <p class="lede">Uoink is local corpus software for people who want to own the source material they study. Ryan Biddy (@replayryan) makes Uoink as a personal side project. It is free and MIT-licensed.</p>
        <div class="ctas">
          <a class="btn primary large" href="${RELEASE_URL}">Latest release</a>
          <a class="btn ghost large" href="${GITHUB_URL}">Browse GitHub</a>
        </div>
      </div>
      <div class="corpus">
        <div class="hd"><span>project posture</span><span>public facts</span></div>
        <span class="ln k">license: MIT</span>
        <span class="ln dim">source: github.com/ryanbiddy/uoink</span>
        <span class="ln k">tracking: none from Uoink</span>
        <span class="ln dim">Vercel Web Analytics only; cookieless pageviews</span>
        <span class="ln k">platform: Windows 10/11 only</span>
        <span class="ln dim">no Mac build scheduled</span>
      </div>
    </div>
  </div>
</section>
<section class="section" data-screen-label="about / why">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">why this exists</span>
      <h2 class="display-l">The corpus belongs on <em>your machine.</em></h2>
      <p class="lede">Uoink exists because useful videos should become durable working material: timestamped words, frames, comments, metadata, and citations that your model can actually use.</p>
    </div>
    <div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      <article class="card"><span class="num">01</span><h3>Local-first.</h3><p>No Uoink account, no hosted corpus, no product database full of your research.</p></article>
      <article class="card"><span class="num">02</span><h3>Open source.</h3><p>The helper, extension, and agent surface are inspectable. If the work matters, you should be able to audit the tool.</p></article>
      <article class="card"><span class="num">03</span><h3>Agent-readable.</h3><p>The site exposes /llms.txt and /mcp/manifest.json so agents can find the real integration surface.</p></article>
    </div>
  </div>
</section>`,
  },
  privacy: {
    id: "privacy",
    route: "/privacy",
    mode: "mode-light",
    title: "Local-First Privacy: No Cloud Telemetry Policy",
    description:
      "Uoink stores your corpus locally, uses no telemetry, and only calls Anthropic with your own key when optional AI features are enabled.",
    keywords: ["uoink privacy", "local-first youtube extractor", "no telemetry youtube tool", "byo key youtube ai"],
    faq: privacyFaq,
    html: `
<section class="section" data-screen-label="privacy / main"><div class="container"><article class="article"><div class="meta"><span>privacy</span><span>local-first</span></div><h1>Your corpus lives on your <em>machine.</em></h1><p class="standfirst">Uoink extracts video and podcast content, stores it on your disk, and hands it to the AI you choose. There is no Uoink cloud because we never built one.</p><h2>What Uoink does.</h2><p>Uoink captures transcripts, screenshots, comments, channel context, podcast transcripts, metadata, and local indexes. It writes those artifacts into normal local files and a local SQLite index. You can paste the corpus into Claude or ChatGPT, or let an MCP agent read it directly.</p><h2>What Uoink skips.</h2><p>No account, no Uoink cloud, and no required telemetry.</p><h3>Website analytics vs. local app privacy</h3><p>While the local Uoink desktop application and browser extension require no telemetry, the public marketing website (<code>uoink.app</code>) uses basic, privacy-respecting Vercel Analytics to count page visits and help us see how people find the installer. No information from your local captures, library, settings, or API keys is ever accessible to or shared with website analytics.</p><h3>Manual update check</h3><p>When you click the update check button in the dashboard settings, the application makes a direct query to <code>api.github.com</code> to compare version tags. This request transmits no user details, telemetry, or library data.</p><h2>Where your data lives.</h2><p>On Windows, the helper lives under <code>%LOCALAPPDATA%\\Uoink</code>. Captures write into your Uoink library folder. The optional Anthropic key is stored in Windows Credential Manager.</p><h2>Network calls Uoink makes.</h2><p>Extraction calls go to the source you asked for: YouTube, X, RSS hosts, or another supported URL. Optional AI calls use your own Anthropic key. Entity extraction is opt-in and off by default; the model-usage meter reports real usage. Nothing is proxied through Uoink.</p><h2>Open source: audit it yourself.</h2><p>The source is MIT-licensed at <a href="${GITHUB_URL}">github.com/ryanbiddy/uoink</a>. You can inspect the helper, loopback server, and network code.</p><p><a class="btn primary large" href="/install">Install Uoink</a> <a class="btn ghost large" href="/terms">Read terms</a></p></article></div></section><section class="section" data-screen-label="privacy / faq"><div class="container">${renderFaq(privacyFaq)}</div></section>`,
  },
  changelog: {
    id: "changelog",
    route: "/changelog",
    mode: "mode-dark",
    title: "Changelog: Version Updates and Universal Extraction",
    description:
      "Read dated Uoink release notes from 3.4 through 3.8.0 Living Library.",
    keywords: ["uoink changelog", "uoink release notes", "uoink updates", "universal video uoink changelog"],
    html: `
<section class="section" data-screen-label="changelog / main"><div class="container"><article class="article"><div class="meta"><span>changelog</span><span>newest first</span></div><h1>Uoink <em>release notes.</em></h1><p class="standfirst">3.8.0 is Living Library. Dates below follow the product changelog.</p>
<h2>v3.8.0 — Living Library</h2><p class="meta"><time datetime="2026-09-15">2026-09-15</time></p><p>Clip search and evidence cards join everyday stdio MCP. Standing capture follows YouTube channels, playlists, and podcast RSS feeds; MCP library search, item reads, resource templates, and prompts make the library easier to cite. Cited range export carries speaker labels, chapters, and provenance, with chapter navigation where chapters exist. Captures now show a toast instead of opening Explorer. Entity extraction is opt-in, the Anthropic usage meter reports real usage, and the recall hook is hardened against prompt injection from captured text.</p>
<h2>v3.7.0</h2><p class="meta"><time datetime="2026-07-24">2026-07-24</time></p><p>Library cards and filters became quieter, Sources put available captures first, and saved items gained a clearer action menu. Updated video extraction and stricter URL, schema, and path checks hardened capture and local integrations; MCP initialization began reporting the product version.</p>
<h2>v3.6.0</h2><p class="meta"><time datetime="2026-07-08">2026-07-08</time></p><p>Added local notes, short-video capture for TikTok, Reels, and Shorts, and image capture as library items. Each entered the shared corpus with source filters; image search used captions, filenames, and source metadata, with OCR deferred.</p>
<h2>v3.5.0</h2><p class="meta"><time datetime="2026-07-08">2026-07-08</time></p><p>Made the Library source-first with platform, source-type, and author filters, readable folders, and searchable author information. X Article detection became consistent across capture entry points, with clearer messages when X blocked a fetch.</p>
<h2>v3.4.1</h2><p class="meta"><time datetime="2026-07-07">2026-07-07</time></p><p>Pinned the extension popup’s primary capture action so it stayed reachable while secondary panels scrolled. Enlarged source and screenshot thumbnails in Generate and gave text sources an explicit no-preview tile.</p>
<h2>v3.4.0</h2><p class="meta"><time datetime="2026-07-07">2026-07-07</time></p><p>Added X Article capture from the rendered, logged-in page and clearer failures for blocked link fetches. Activity messages better explained X posts without downloadable video, and saved-item action buttons wrapped to stay reachable on smaller displays.</p>
<p><a class="btn primary large" href="https://github.com/ryanbiddy/uoink/releases/tag/v3.8.0">3.8.0 release notes</a> <a class="btn ghost large" href="${RELEASE_URL}">Latest GitHub release</a></p></article></div></section>`,
  },
  terms: {
    id: "terms",
    route: "/terms",
    mode: "mode-light",
    title: "License and Open Source Terms",
    description:
      "Uoink is MIT-licensed local software. Review short terms for website use, open source license, warranty, and contact.",
    keywords: ["uoink terms", "uoink license", "uoink mit license"],
    html: `
<section class="section" data-screen-label="terms / main"><div class="container"><article class="article"><div class="meta"><span>terms</span><span>short by design</span></div><h1>Terms of <em>use.</em></h1><p class="standfirst">Uoink is local, open-source software. These terms are intentionally short.</p><h2>The software is MIT-licensed.</h2><p>Uoink source is published at <a href="${GITHUB_URL}">github.com/ryanbiddy/uoink</a> under the MIT License. The license grants broad permission to use, copy, modify, merge, publish, distribute, sublicense, and sell copies, subject to the license notice.</p><h2>No warranty.</h2><p>The software is provided as-is, without warranty of any kind. Use it at your own discretion and keep backups of work you care about.</p><h2>Your responsibility.</h2><p><strong>Uoink is designed and built for personal research and study.</strong> You are solely responsible for ensuring that your use of video, podcast, transcript, screenshot, and comment material captured with Uoink complies with the Terms of Service, copyright policies, and API guidelines of YouTube, Reddit, X (Twitter), and any other source platforms. Uoink does not host, share, or claim any ownership rights over third-party media.</p><h2>Trademark and brand.</h2><p>Uoink is Ryan Biddy's product name and mark. Avoid impersonating the project or representing unofficial builds as official.</p><h2>Contact.</h2><p>Email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> or follow <a href="${X_URL}">${X_HANDLE}</a> for terms, trademark, or abuse concerns.</p><p><a class="btn primary large" href="/install">Install Uoink</a> <a class="btn ghost large" href="/privacy">Privacy policy</a></p></article></div></section>`,
  },
  memory: aliasPage("memory", "/memory", "Uoink Memory moved into Features", "Memory is now covered in the Uoink feature inventory.", "/features"),
  tweaks: aliasPage("tweaks", "/tweaks", "Uoink settings moved into Features", "Settings and tuning are now covered in the Uoink feature inventory.", "/features"),
  creators: {
    id: "creators",
    route: "/creators",
    mode: "mode-light",
    title: "Uoink for Creators: Ground your drafts in your local corpus",
    description:
      "Turn your videos, podcasts, and articles into clean local markdown files. Draft posts in your voice with attribution intact.",
    keywords: [
      "uoink for creators",
      "ai writing tool creators",
      "local video corpus creator",
      "grounded script writing",
    ],
    html: `
<section class="hero" data-screen-label="creators / hero">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">uoink for creators</span>
      <h1 class="display-xl">Turn your research into <em>original drafts.</em></h1>
      <p class="lede">Stop copying transcripts and guessing the context. Uoink keeps the videos, podcasts, and articles you study on your own disk, then helps you write drafts that match your voice.</p>
    </div>
  </div>
</section>

<section class="section" data-screen-label="creators / workflow">
  <div class="container" style="max-width:80ch">
    <h2 class="display-l" style="margin-bottom:32px">Write from a cited <em>corpus.</em></h2>
    
    <div style="display:flex;flex-direction:column;gap:32px">
      <div>
        <h3>1. Capture any source</h3>
        <p>Save YouTube videos, podcasts, web articles, X video and post text, and Reddit threads. Uoink structures the transcript, frames, comments, and metadata into a clean markdown document on your disk.</p>
      </div>

      <div>
        <h3>2. Calibrate your voice</h3>
        <p>Import your own articles or newsletters as style anchors. Uoink studies your writing patterns, vocabulary, and paragraph lengths to guide draft outputs. You avoid generic, salesy AI phrasing by grounding the model in your tone.</p>
      </div>

      <div>
        <h3>3. Draft in Writing Studio</h3>
        <p>Select any source from your library and load it into the local editor. Draft threads, posts, or articles directly from the transcript facts. Uoink checks the drafts for style guidelines, character counts, and formatting rules.</p>
      </div>

      <div>
        <h3>4. Protect creator credit</h3>
        <p>We believe in creator credit. Every draft you write in Writing Studio automatically appends a citation linking back to the original source. You share insights while keeping the citation trail visible for your audience.</p>
      </div>
    </div>
  </div>
</section>

<section class="big-strip" data-screen-label="creators / install-cta">
  <div class="container" style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center">
    <div>
      <span class="eyebrow">get started</span>
      <h2 class="display-l" style="margin:8px 0 0">Ready to write in your voice?</h2>
      <p class="body-l" style="margin-top:18px">Download Uoink to build your local research library.</p>
    </div>
    <a class="btn ink" href="/install">Install Uoink -></a>
  </div>
</section>
    `,
  },
  research: aliasPage("research", "/research", "Research workflow moved into Podcasts and Features", "Research workflows now live across Podcasts and Features.", "/features"),
  agentDocs: aliasPage("agentDocs", "/agent-docs", "Agent docs moved to Developers and MCP", "Agent docs now live at /developers and /mcp.", "/developers"),
  hooks: aliasPage("hooks", "/hooks", "Hook taxonomy moved into Features", "Hook Type classification is covered in Features and Agents.", "/features"),
  blog: aliasPage("blog", "/blog", "Uoink Field Notes", "Launch articles about hooks, agents, local-first architecture, and corpus workflows.", "/blog"),
  twitter: aliasPage("twitter", "/twitter", "Uoink for Twitter video", "Capture X and Twitter video context into your local corpus.", "/twitter"),
  dashboard: aliasPage("dashboard", "/dashboard", "Dashboard moved into Features", "The dashboard and memory surfaces are covered in Features.", "/features"),
  installed: aliasPage("installed", "/installed", "Uoink installed", "Start with the install and how-it-works pages.", "/how-it-works"),
  sources: {
    id: "sources",
    route: "/sources",
    mode: "mode-dark",
    title: "Supported Sources: Capture YouTube, Podcasts, Reddit, and Web Pages",
    description:
      "Browse supported sources in Uoink, including video platforms, podcast feeds, web articles, and social thread discussions.",
    keywords: [
      "uoink sources",
      "youtube to ai",
      "reddit thread to ai",
      "podcast whisper transcription",
      "web page markdown extractor",
    ],
    html: `
<section class="hero" data-screen-label="sources / hero">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">supported sources</span>
      <h1 class="display-xl">Supported <em>sources.</em></h1>
      <p class="lede">Uoink runs entirely on your local machine to extract transcripts, text, and media. We are explicit about what we support and honest about where platforms block you.</p>
    </div>
  </div>
</section>

<section class="section" data-screen-label="sources / grid">
  <div class="container">
    <div class="sources-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px">
      
      <article class="card" id="youtube" style="border:1px solid var(--ink-dim);padding:24px;border-radius:6px;background:rgba(255,255,255,0.02)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <span style="font-weight:bold;font-size:20px;color:var(--cream)">YouTube</span>
          <span class="feature-status shipped" style="padding:2px 8px;font-size:10px;text-transform:uppercase;border-radius:4px;background:rgba(0,200,83,0.15);color:#00C853;border:1px solid rgba(0,200,83,0.3)">active</span>
        </div>
        <p style="font-size:14px;color:var(--parchment);margin-bottom:12px"><strong>What it captures:</strong> Video transcripts (both manual and auto-generated), descriptions, comments, and video frames (via the clipboard screenshot utility).</p>
        <p style="font-size:14px;color:var(--parchment-dim);margin-bottom:12px"><strong>How it lands:</strong> Saves directly to your local library as clean Markdown text files with timestamps and optional JSON sidecars.</p>
        <p style="font-size:13px;color:var(--vermillion)"><strong>Limitations:</strong> Private or age-gated videos require configuring your local browser cookie path. HD video downloads are throttled by YouTube's rate limits.</p>
      </article>

      <article class="card" id="podcasts" style="border:1px solid var(--ink-dim);padding:24px;border-radius:6px;background:rgba(255,255,255,0.02)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <span style="font-weight:bold;font-size:20px;color:var(--cream)">Podcasts</span>
          <span class="feature-status shipped" style="padding:2px 8px;font-size:10px;text-transform:uppercase;border-radius:4px;background:rgba(0,200,83,0.15);color:#00C853;border:1px solid rgba(0,200,83,0.3)">active</span>
        </div>
        <p style="font-size:14px;color:var(--parchment);margin-bottom:12px"><strong>What it captures:</strong> Audio files from public RSS podcast feeds or direct uploads, processing them through a local transcription engine.</p>
        <p style="font-size:14px;color:var(--parchment-dim);margin-bottom:12px"><strong>How it lands:</strong> Transcribes audio into text using local Whisper/WhisperX with speaker diarization (separating guest and host dialogue).</p>
        <p style="font-size:13px;color:var(--vermillion)"><strong>Limitations:</strong> Local audio processing requires CPU and GPU power. Transcribing a long episode can take a few minutes on standard hardware.</p>
      </article>

      <article class="card" id="reddit" style="border:1px solid var(--ink-dim);padding:24px;border-radius:6px;background:rgba(255,255,255,0.02)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <span style="font-weight:bold;font-size:20px;color:var(--cream)">Reddit Threads</span>
          <span class="feature-status shipped" style="padding:2px 8px;font-size:10px;text-transform:uppercase;border-radius:4px;background:rgba(0,200,83,0.15);color:#00C853;border:1px solid rgba(0,200,83,0.3)">active</span>
        </div>
        <p style="font-size:14px;color:var(--parchment);margin-bottom:12px"><strong>What it captures:</strong> In-depth text discussions and comment trees from public Reddit thread links.</p>
        <p style="font-size:14px;color:var(--parchment-dim);margin-bottom:12px"><strong>How it lands:</strong> Flattens nested reply trees into structured Markdown files, mapping author names, scores, and comment relationships.</p>
        <p style="font-size:13px;color:var(--vermillion)"><strong>Limitations:</strong> Giant threads with thousands of replies are trimmed to top-rated branches to keep context within model limits.</p>
      </article>

      <article class="card" id="pages" style="border:1px solid var(--ink-dim);padding:24px;border-radius:6px;background:rgba(255,255,255,0.02)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <span style="font-weight:bold;font-size:20px;color:var(--cream)">Web Articles & Pages</span>
          <span class="feature-status shipped" style="padding:2px 8px;font-size:10px;text-transform:uppercase;border-radius:4px;background:rgba(0,200,83,0.15);color:#00C853;border:1px solid rgba(0,200,83,0.3)">active</span>
        </div>
        <p style="font-size:14px;color:var(--parchment);margin-bottom:12px"><strong>What it captures:</strong> Universal web pages, technical articles, and text-based posts using local page extraction selectors.</p>
        <p style="font-size:14px;color:var(--parchment-dim);margin-bottom:12px"><strong>How it lands:</strong> Strips out navigation bars, headers, ads, and trackers to save the primary body content as clean Markdown prose.</p>
        <p style="font-size:13px;color:var(--vermillion)"><strong>Limitations:</strong> Dynamic single-page apps (SPAs) or sites protected behind paywalls and Cloudflare shields can fail to extract correctly.</p>
      </article>

      <article class="card" id="twitter" style="border:1px solid var(--ink-dim);padding:24px;border-radius:6px;background:rgba(255,255,255,0.02)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <span style="font-weight:bold;font-size:20px;color:var(--cream)">X (Twitter) Video</span>
          <span class="feature-status shipped" style="padding:2px 8px;font-size:10px;text-transform:uppercase;border-radius:4px;background:rgba(0,200,83,0.15);color:#00C853;border:1px solid rgba(0,200,83,0.3)">active</span>
        </div>
        <p style="font-size:14px;color:var(--parchment);margin-bottom:12px"><strong>What it captures:</strong> Video media attached to tweets and posts.</p>
        <p style="font-size:14px;color:var(--parchment-dim);margin-bottom:12px"><strong>How it lands:</strong> Downloads the video stream, extracts the audio, and runs local Whisper transcription to produce text transcripts.</p>
        <p style="font-size:13px;color:var(--vermillion)"><strong>Limitations:</strong> X post text can also be captured into the local library.</p>
      </article>

    </div>
  </div>
</section>
    `,
  },
  developers: {
    id: "developers",
    route: "/developers",
    mode: "mode-dark",
    title: "Uoink for Developers: Local MCP Server and SQLite Database",
    description:
      "Connect Uoink to Claude Desktop and Cursor using Model Context Protocol. Run loopback tools to query transcripts locally.",
    keywords: [
      "uoink for developers",
      "mcp server video",
      "model context protocol server",
      "sqlite video corpus",
      "local video indexer api",
    ],
    html: `
<section class="hero" data-screen-label="developers / hero">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">uoink for developers</span>
      <h1 class="display-xl">Local tools for <em>AI agents.</em></h1>
      <p class="lede">Uoink runs a local Model Context Protocol (MCP) server on your machine. Give Claude Desktop and Cursor tools to capture, index, and query web media without clipboard steps.</p>
    </div>
  </div>
</section>

<section class="section" data-screen-label="developers / integration">
  <div class="container" style="max-width:80ch">
    <h2 class="display-l" style="margin-bottom:24px">Standard stdio & HTTP <em>transports.</em></h2>
    <p class="body-l" style="margin-bottom:32px">The helper exposes ${MCP_STDIO_TOOL_COUNT} tools over stdio and ${MCP_TOOL_COUNT} over local HTTP. Capture fetches the source; optional AI calls use your own Anthropic key.</p>

    <h3>1. Copy the stdio MCP configuration</h3>
    <p>Add the server to your client configuration file. Use absolute paths to your installation directory (e.g. replacing <code>YOUR_USERNAME</code> with your Windows username):</p>
    
    <div class="docs-main" style="margin-bottom:32px">
      <h4>Claude Desktop Configuration</h4>
      <pre style="background:var(--ink-bg);padding:18px;border-radius:6px;border:1px solid var(--ink-dim);color:var(--parchment)">{
  "mcpServers": {
    "uoink": {
      "command": "C:\\\\Users\\\\YOUR_USERNAME\\\\AppData\\\\Local\\\\Uoink\\\\python\\\\python.exe",
      "args": [
        "C:\\\\Users\\\\YOUR_USERNAME\\\\AppData\\\\Local\\\\Uoink\\\\uoink_mcp.py"
      ]
    }
  }
}</pre>
    </div>

    <h3>2. HTTP (SSE) Transport Details</h3>
    <div class="docs-main" style="margin-bottom:32px;padding:20px;background:rgba(255,255,255,0.02);border-radius:6px;border:1px solid var(--ink-dim)">
      <p style="margin:0 0 8px"><strong>Endpoint URL:</strong> <code>http://localhost:5179/mcp/v1</code></p>
      <p style="margin:0 0 8px"><strong>Authentication Header:</strong> <code>X-Uoink-Token</code></p>
      <p style="margin:0"><strong>Token Location:</strong> Read the token from the local file <code>%LOCALAPPDATA%\\Uoink\\token.txt</code>.</p>
    </div>

    <h3>2. Run a sample tool call</h3>
    <p>Your agent can call tools like <code>uoink_video</code>, poll for job completion, and read the local corpus directly.</p>
    
    <div class="docs-main" style="margin-bottom:32px">
      <h4>Tool Call Schema</h4>
      <pre style="background:var(--ink-bg);padding:18px;border-radius:6px;border:1px solid var(--ink-dim);color:var(--parchment)">{
  "name": "uoink_video",
  "arguments": {
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
}</pre>
    </div>

    <h3>3. Local SQLite database</h3>
    <p>Uoink stores transcripts, tags, and comment records in an offline SQLite database under your local app data directory. You can query the index via SQL, back up the files, or load the database into other tools.</p>
  </div>
</section>

<section class="big-strip" data-screen-label="developers / github-cta">
  <div class="container" style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center">
    <div>
      <span class="eyebrow">open source</span>
      <h2 class="display-l" style="margin:8px 0 0">Built on MIT licensed code.</h2>
      <p class="body-l" style="margin-top:18px">Inspect the MCP server implementation, sqlite schemas, and helper logic on GitHub.</p>
    </div>
    <a class="btn ink" href="${GITHUB_URL}">Browse GitHub -></a>
  </div>
</section>
    `,
  },
};

function featureCards(items: [string, string][]): string {
  return items
    .map(
      ([title, body], index) =>
        `<article class="hook"><span class="num">${String(index + 1).padStart(2, "0")}</span><span class="label">capability</span><h3>${title}</h3><p>${body}</p></article>`,
    )
    .join("");
}

function toolRows(): string {
  return mcpTools
    .map(
      ([name, description]) =>
        `<div class="tool-row"><div class="name">${escapeHtml(name)}<span class="args">HTTP registry; see manifest for stdio availability</span></div><div class="desc">${escapeHtml(description)}<span class="ex">See /mcp/manifest.json for machine-readable schema.</span></div></div>`,
    )
    .join("");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderFaq(items: FaqItem[]): string {
  return `<div class="three-cards" style="display:grid;grid-template-columns:repeat(2,1fr);gap:18px">${items
    .map((item) => `<article class="card"><h3>${item.question}</h3><p>${item.answer}</p></article>`)
    .join("")}</div>`;
}

function aliasPage(id: PageId, route: string, title: string, description: string, target: string): SitePage {
  return {
    id,
    route,
    mode: "mode-light",
    title,
    description,
    keywords: [],
    html: `<section class="section" data-screen-label="${id} / moved"><div class="container"><article class="article"><h1>${title}</h1><p class="standfirst">${description}</p><p><a class="btn primary large" href="${target}">Go to the current page</a> <a class="btn ghost large" href="/install">Install Uoink</a></p></article></div></section>`,
  };
}

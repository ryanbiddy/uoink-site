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
  | "installed";

export type FaqItem = { question: string; answer: string };

export type SitePage = {
  id: PageId;
  route: string;
  mode: string;
  title: string;
  description: string;
  keywords: string[];
  html: string;
  faq?: FaqItem[];
};

export const CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://uoink.app";
export const GITHUB_URL = "https://github.com/ryanbiddy/uoink";
export const RELEASE_URL = "https://github.com/ryanbiddy/uoink/releases/latest";
export const VERSION = "v3.2";

export const mcpTools = [
  ["uoink_video", "Extract a structured corpus from one video URL."],
  ["uoink_playlist", "Extract up to 10 videos from a playlist URL."],
  ["get_job_status", "Poll a running extraction job."],
  ["cancel_job", "Cancel a running extraction job."],
  ["list_recent_uoinks", "Return the latest captures from the local library."],
  ["search_uoinks", "Run full-text search across transcripts, comments, and titles."],
  ["get_uoink_corpus", "Fetch one saved corpus as markdown."],
  ["analyze_comments", "Cluster comment themes, products, and disagreements."],
  ["classify_hook", "Classify an opening into the nine Hook Type categories."],
  ["get_taxonomy", "Return the Hook Type taxonomy."],
  ["get_citation_map", "Map corpus slugs to source URLs and timestamps."],
  ["get_uoink_health", "Check helper status and diagnostics."],
  ["find_mentions", "Find every video or podcast that mentions an entity."],
] as const;

const installFaq: FaqItem[] = [
  {
    question: "What operating systems are supported by Uoink?",
    answer:
      "Uoink supports Windows 10 and 11 today. macOS support is on the v2.3 track with a signed DMG target. A manual source path is available for developers who want to run the local helper directly.",
  },
  {
    question: "Does the helper require administrator permissions?",
    answer:
      "No. The helper runs in user space. On Windows it installs under %LOCALAPPDATA% and starts from the current-user startup entry.",
  },
  {
    question: "What browsers support the extension?",
    answer:
      "The extension is Manifest V3 and targets Chromium browsers: Chrome, Edge, Brave, Vivaldi, Arc, and Opera GX. Web Store approval is pending, so the launch path uses the GitHub release zip.",
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
      "Your key is stored in the operating system credential vault. On Windows that means Windows Credential Manager. On macOS that means Keychain.",
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
      "Model Context Protocol lets an AI client call local tools. Uoink exposes a local stdio MCP server so Claude Desktop, Cursor, Cline, Continue, and similar clients can capture and search your library.",
  },
  {
    question: "Does the agent need the clipboard flow?",
    answer:
      "No. The agent can call uoink_video, poll get_job_status, then read the corpus with get_uoink_corpus.",
  },
  {
    question: "Is HTTP transport supported?",
    answer:
      "Stdio is the supported path. HTTP JSON-RPC on 127.0.0.1:5179/mcp is experimental for local integrations.",
  },
];

const podcastsFaq: FaqItem[] = [
  {
    question: "Does Uoink identify speakers by real name?",
    answer:
      "Diarization separates speakers as Speaker 1, Speaker 2, and so on. You can rename them later when you know who is speaking.",
  },
  {
    question: "Does local Whisper need a GPU?",
    answer:
      "No. CPU transcription works, but larger models take longer. Apple Silicon and dedicated GPUs can speed it up when available.",
  },
  {
    question: "Are podcast feeds uploaded to Uoink?",
    answer:
      "No. Feed polling, audio download, transcription, and corpus writing run from your machine.",
  },
];

export const pages: Record<PageId, SitePage> = {
  home: {
    id: "home",
    route: "/",
    mode: "mode-dark",
    title: "YouTube to Claude: Local AI Video Summarizer",
    description:
      "Uoink turns any video or podcast into a private local corpus for Claude, ChatGPT, Cursor, or your MCP agent.",
    keywords: [
      "youtube to claude",
      "youtube transcript download",
      "youtube ai workflow",
      "local youtube extractor",
      "mcp youtube server",
    ],
    html: `
<section class="hero" data-screen-label="home / hero">
  <div class="container">
    <div class="hero-grid">
      <div class="copy">
        <span class="eyebrow">uoink.app / v3.2</span>
        <h1 class="display-xl">Uoink that <em>shit.</em></h1>
        <p class="lede">One click under any video. Your AI gets the whole thing: transcript, screenshots, comments, channel context, podcasts too. Local. Yours.</p>
        <div class="ctas">
          <a class="btn primary large" href="${RELEASE_URL}">Get Uoink</a>
          <a class="btn ghost large" href="#live-uoink">See a live uoink</a>
        </div>
        <p class="sub-cta">Open source / MIT / zero telemetry / MCP tools / Windows now / Mac track in progress</p>
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
          <span class="ln hl">[00:47] hook classified as curiosity_gap + stakes</span>
          <span class="ln k">## Screenshots</span>
          <span class="ln dim">12 frames on disk / 4 in clipboard budget</span>
          <span class="ln k">## Comments</span>
          <span class="ln dim">top 50 comments with themes and disagreements</span>
        </div>
        <p class="mono caps" style="color:var(--parchment);margin-top:14px;text-align:right;font-size:9.5px">one uoink / readable by Claude, ChatGPT, and agents</p>
      </div>
    </div>
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
      <article class="card"><span class="num">01</span><h3>Capture the <em>source.</em></h3><p>Transcript with timestamps, screenshots, description, title, thumbnail, channel context, and comments in one markdown file.</p><a class="arr-link" href="/how">See the workflow -></a></article>
      <article class="card"><span class="num">02</span><h3>Keep the <em>asset.</em></h3><p>Every capture writes to disk and into a local SQLite index. Search it later, cite it later, move it into your own vault.</p><a class="arr-link" href="/features">Browse features -></a></article>
      <article class="card"><span class="num">03</span><h3>Hand it to <em>AI.</em></h3><p>Paste into Claude or ChatGPT, send directly, or let an MCP agent call Uoink without touching the clipboard.</p><a class="arr-link" href="/agents">Open agent docs -></a></article>
    </div>
  </div>
</section>
<section class="big-strip" data-screen-label="home / local first">
  <div class="container" style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center">
    <div>
      <span class="eyebrow">local-first, by design</span>
      <h2 class="display-l" style="margin:8px 0 0">No account. No Uoink cloud. <em>No telemetry.</em></h2>
      <p class="body-l" style="margin-top:18px;max-width:60ch">The helper runs on localhost. Your corpus lands on your disk. Optional Hook Type, Comment Intelligence, and Entity Extraction calls use your own Anthropic key, not a Uoink proxy.</p>
    </div>
    <a class="btn ink" href="/privacy">Read privacy -></a>
  </div>
</section>
<section class="section" data-screen-label="home / three audiences">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">three audiences, one tool</span>
      <h2 class="display-l">Creators, researchers, and agent builders all hit the same <em>button.</em></h2>
      <p class="lede">The on-ramp stays simple. The depth shows up after the corpus exists.</p>
    </div>
    <div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      <a class="card" href="/how"><span class="num">01</span><h3>Creators.</h3><p>Watch less. Read more. Audit hooks, pacing, screenshots, comments, and competitor channels without taking notes at 2x.</p><span class="arr-link">See creator workflow -></span></a>
      <a class="card" href="/podcasts"><span class="num">02</span><h3>Researchers.</h3><p>Build a local library from videos and podcasts. Pull claims, guests, tools, products, and recurring entities across everything you saved.</p><span class="arr-link">Use it for podcasts -></span></a>
      <a class="card" href="/agents"><span class="num">03</span><h3>Agent developers.</h3><p>Give Claude Desktop, Cursor, Cline, Continue, or ChatGPT Desktop 13 local tools for video capture and corpus search.</p><span class="arr-link">Wire up MCP -></span></a>
    </div>
  </div>
</section>
<hr class="rule"/>
<section class="section" data-screen-label="home / model agnostic">
  <div class="container">
    <div class="agent-demo">
      <div class="chat">
        <div class="mini-heading">model agnostic</div>
        <p class="chat-bubble user">Uoink this video and compare the hook against my last ten saved competitor videos.</p>
        <p class="chat-bubble assistant">Calling <code>uoink_video</code>, then <code>classify_hook</code>, then <code>search_uoinks</code>. Your model reads the corpus. Uoink stays the capture layer.</p>
      </div>
      <div class="log">
        <div class="mini-heading">mcp tool trace</div>
        <pre class="mcp-log" style="margin:0;white-space:pre-wrap">uoink_video(url)
get_job_status(job_id)
get_uoink_corpus(corpus_id)
classify_hook(corpus_id)
find_mentions("Karpathy")</pre>
      </div>
    </div>
    <div class="text-center mt-32">
      <a class="btn ghost" href="/agents">Read MCP setup -></a>
      <a class="btn ghost" href="/mcp">Machine-readable MCP manifest -></a>
    </div>
  </div>
</section>
<section class="section" data-screen-label="home / install">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">install in a minute</span>
      <h2 class="display-l">One helper. One extension. Then the <em>U button.</em></h2>
      <p class="lede">Download the helper, install the extension, open a video, and click Uoink. The helper bundles what it needs so you do not install Python, yt-dlp, or ffmpeg yourself.</p>
    </div>
    <div class="ledger">
      <div class="ledger-card live"><div class="top"><span>Windows</span><span>live path</span></div><div class="body-l"><h3>Download the helper.</h3><p class="ver">Uoink installer / Windows 10 and 11</p><p>Runs in your tray, writes to your local library, and exposes the local MCP server.</p></div><div class="foot"><a class="btn primary small" href="${RELEASE_URL}">Download -></a></div></div>
      <div class="ledger-card pend"><div class="top"><span>Extension</span><span>CWS pending</span></div><div class="body-l"><h3>Install the browser button.</h3><p class="ver">Chrome, Edge, Brave, Vivaldi, Opera GX</p><p>Until the Web Store listing lands, install the release zip from GitHub.</p></div><div class="foot"><a class="btn ghost small" href="/install#extension">Install notes -></a></div></div>
      <div class="ledger-card queue"><div class="top"><span>Mac</span><span>v2.3 track</span></div><div class="body-l"><h3>Menu-bar helper next.</h3><p class="ver">DMG + Keychain + LaunchAgent</p><p>The same corpus format, MCP server, and privacy model are planned for macOS.</p></div><div class="foot"><a class="btn ghost small" href="/install#mac">Mac status -></a></div></div>
    </div>
  </div>
</section>
<section class="section tight" data-final-cta data-screen-label="home / final cta">
  <div class="container text-center">
    <span class="wm-line" style="font-size:110px;color:var(--vermillion);justify-content:center"><uoink-mark aria-hidden="true"></uoink-mark><span class="oink">OINK</span></span>
    <p class="display-m" style="margin:24px auto 32px;max-width:24ch">Take the video. Make it <em>usable.</em></p>
    <div class="ctas flex center" style="display:flex;justify-content:center;gap:14px;flex-wrap:wrap">
      <a class="btn primary large" href="${RELEASE_URL}">Get Uoink</a>
      <a class="btn ghost large" href="${GITHUB_URL}">Browse the code</a>
    </div>
  </div>
</section>`,
  },
  install: {
    id: "install",
    route: "/install",
    mode: "mode-dark",
    title: "Download Uoink: Local Helper and Browser Extension Install",
    description:
      "Install Uoink for Windows, add the browser extension, and start extracting local video corpora for Claude, ChatGPT, and MCP.",
    keywords: ["install uoink", "uoink download windows", "uoink chrome extension", "yt-dlp Chrome extension"],
    faq: installFaq,
    html: `
<section class="hero" data-screen-label="install / hero">
  <div class="container">
    <div class="hero-grid">
      <div class="copy">
        <span class="eyebrow">install</span>
        <h1 class="display-xl">Install <em>Uoink.</em></h1>
        <p class="lede">Get the helper running, add the browser button, then click Uoink on any video. No Python install, no command line, no PATH wrangling.</p>
        <div class="ctas"><a class="btn primary large" href="${RELEASE_URL}">Download Windows installer</a><a class="btn ghost large" href="/how">See what happens after install</a></div>
        <p class="sub-cta">Windows 10/11 / local helper / extension sideload until Web Store approval</p>
      </div>
      <div class="corpus">
        <div class="hd"><span>install ledger</span><span>honest path</span></div>
        <span class="ln k">1. Download and run Uoink installer</span>
        <span class="ln dim">installs helper under %LOCALAPPDATA%\\Uoink</span>
        <span class="ln k">2. Install extension from GitHub release zip</span>
        <span class="ln dim">Chrome Web Store listing pending approval</span>
        <span class="ln k">3. Click the U button on a video</span>
        <span class="ln dim">corpus lands on disk and clipboard</span>
      </div>
    </div>
  </div>
</section>
<section class="section" data-screen-label="install / platforms">
  <div class="container">
    <div class="ledger">
      <div class="ledger-card live" id="windows"><div class="top"><span>Windows</span><span>now</span></div><div class="body-l"><h3>Desktop helper.</h3><p class="ver">Windows 10/11 / release page</p><p>The helper bundles Python, yt-dlp, ffmpeg, keyring, SQLite, and MCP pieces. It runs locally and exposes the loopback server at <code>127.0.0.1:5179</code>.</p><p>Windows may flag early builds as an unrecognized publisher. Click More info, then Run anyway if you trust the GitHub release.</p></div><div class="foot"><a class="btn primary small" href="${RELEASE_URL}">Open release -></a></div></div>
      <div class="ledger-card pend" id="extension"><div class="top"><span>Extension</span><span>pending review</span></div><div class="body-l"><h3>Browser button.</h3><p class="ver">Chrome / Edge / Brave / Vivaldi / Opera GX</p><p>The extension needs host permissions for supported video pages so it can render the in-page Uoink button and context menu. It skips browsing-history permission.</p><p>Until Web Store approval lands, download the extension zip from the same GitHub release and load it through your browser extension page.</p></div><div class="foot"><a class="btn ghost small" href="${RELEASE_URL}">Get release zip -></a></div></div>
      <div class="ledger-card queue" id="mac"><div class="top"><span>Mac</span><span>v2.3 track</span></div><div class="body-l"><h3>Menu-bar app next.</h3><p class="ver">DMG, Keychain, LaunchAgent</p><p>The macOS path uses the same corpus format and MCP surface. The signed DMG and notarization work are tracked in the release queue.</p></div><div class="foot"><a class="btn ghost small" href="${GITHUB_URL}/watchers">Watch GitHub -></a></div></div>
    </div>
  </div>
</section>
<section class="section" data-screen-label="install / post install">
  <div class="container">
    <div class="section-head"><span class="eyebrow">post-install</span><h2 class="display-l">What happens when it is <em>running.</em></h2><p class="lede">The helper starts in the background. The extension checks localhost. When both are green, the Uoink button appears on supported video pages.</p></div>
    <div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      <article class="card"><span class="num">01</span><h3>Tray status.</h3><p>The helper sits in the tray and opens the local dashboard when you need logs, settings, or recent jobs.</p></article>
      <article class="card"><span class="num">02</span><h3>Local files.</h3><p>Captures write to your Uoink folder and into a local SQLite index. Nothing uploads to Uoink because there is no Uoink cloud.</p></article>
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
    route: "/how",
    mode: "mode-light",
    title: "How to Feed YouTube Videos to ChatGPT and Claude",
    description:
      "Step-by-step Uoink workflow: click, capture transcript screenshots and comments, then paste the corpus into Claude or ChatGPT.",
    keywords: ["youtube ai workflow", "decode youtube hooks", "analyze youtube comments ai", "youtube research workflow"],
    html: `
<section class="hero" data-screen-label="how / hero">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">how it works</span>
      <h1 class="display-xl">How Uoink <em>works.</em></h1>
      <p class="lede">Click, corpus, AI, result. That loop is the product. The helper does the boring extraction work so your model gets context it can actually reason over.</p>
    </div>
    <div class="card-grid four">
      <article class="card"><span class="num">01</span><h3>Find a video.</h3><p>Open a YouTube video, an X video, or a supported web video. Podcast feeds run through the audio path.</p></article>
      <article class="card"><span class="num">02</span><h3>Click Uoink.</h3><p>The extension sends the URL to the local helper. The helper extracts transcript, frames, comments, metadata, and channel context.</p></article>
      <article class="card"><span class="num">03</span><h3>Read the corpus.</h3><p>A markdown file lands on disk and on your clipboard with timestamps, screenshot references, comments, and source links.</p></article>
      <article class="card"><span class="num">04</span><h3>Ask your model.</h3><p>Paste into Claude or ChatGPT, or ask your MCP agent to call Uoink directly.</p></article>
    </div>
  </div>
</section>
<section class="section" data-screen-label="how / context deficit">
  <div class="container">
    <article class="article">
      <h2>Resolve the video context deficit.</h2>
      <p>Most AI workflows fail at video for a simple reason: the model gets a URL or a raw transcript and has to guess the rest. A transcript alone omits the slides, the code on screen, the audience corrections in the comments, and the channel context that tells you whether a video overperformed or just existed.</p>
      <p>Uoink captures the richer shape. It turns the video into a local corpus: timestamped transcript, screenshots, comments, metadata, channel context, and optional classifier blocks. That corpus is readable by humans, pasteable into Claude and ChatGPT, and callable by MCP agents.</p>
      <p>The workflow stays deliberately plain. Install the helper. Install the extension. Click Uoink. Paste, or let the agent skip the paste. Uoink gives the model the source material it was missing.</p>
    </article>
  </div>
</section>
<section class="section" data-screen-label="how / anatomy">
  <div class="container">
    <div class="section-head"><span class="eyebrow">what lands in your clipboard</span><h2 class="display-l">Anatomy of one <em>uoink.</em></h2><p class="lede">Same structure every time. Easy to read, easy to cite, easy for an agent to parse.</p></div>
    <div class="agent-demo">
      <div class="corpus"><div class="hd"><span>corpus markdown</span><span>human readable</span></div><span class="ln k"># Title and source</span><span class="ln dim">URL, channel, upload date, duration, views</span><span class="ln k">## Transcript</span><span class="ln dim">timestamped segments with source anchors</span><span class="ln k">## Screenshots</span><span class="ln dim">inline budget + full folder on disk</span><span class="ln k">## Comments</span><span class="ln dim">top 50, likes, timestamps, disagreement signals</span><span class="ln k">## Classification</span><span class="ln dim">hook type, format, topic, performance tier</span></div>
      <div class="log"><div class="mini-heading">why this beats a raw transcript</div><p class="body-l">The model can connect what was said with what was shown and how the audience reacted. That matters for code walkthroughs, product teardowns, lectures, creator analysis, and podcast interviews.</p><p class="body-l">Large payloads still need discipline, so the extension includes clipboard budgeting: screenshot caps, compression settings, and comment limits. Rich enough to reason over, small enough to paste.</p></div>
    </div>
  </div>
</section>
<section class="section" data-screen-label="how / examples">
  <div class="container">
    <div class="section-head"><span class="eyebrow">three example workflows</span><h2 class="display-l">Use it the way you already <em>work.</em></h2></div>
    <div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      <article class="card"><span class="num">01</span><h3>Decode a hook.</h3><p>Uoink a competitor video. Ask Claude or ChatGPT why the first 15 seconds work, where the promise is made, and what comments prove the audience noticed.</p></article>
      <article class="card"><span class="num">02</span><h3>Audit a channel.</h3><p>Run playlist mode on the last ten uploads. Compare hook type, format, comments, and performance patterns across the channel.</p></article>
      <article class="card"><span class="num">03</span><h3>Pull a claim trail.</h3><p>Uoink a long interview or podcast. Ask for every claim a guest made, then cite timestamps back to the original source.</p></article>
    </div>
  </div>
</section>
<section class="big-strip" data-screen-label="how / agents">
  <div class="container" style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center">
    <div><span class="eyebrow">send to your model, or skip the paste</span><h2 class="display-l">Clipboard is the on-ramp. <em>MCP is the upgrade.</em></h2><p class="body-l">Claude Desktop, Cursor, Cline, Continue, and ChatGPT Desktop can call Uoink directly through the local MCP server.</p></div>
    <a class="btn ink" href="/agents">Configure agents -></a>
  </div>
</section>
<section class="section" data-screen-label="how / storage">
  <div class="container">
    <article class="article">
      <h2>Where the corpus lives.</h2>
      <p>Uoink writes captures to a local folder you control and indexes the useful parts in SQLite FTS5. The exact path depends on platform, but the principle is stable: your corpus is ordinary files and a local index, not a proprietary cloud workspace.</p>
      <p>On Windows, the helper lives under <code>%LOCALAPPDATA%\\Uoink</code> and your captures land in your Uoink library folder. On macOS, the helper path is planned around <code>~/Library/Application Support/Uoink/</code>. Topic folders and markdown sidecars make the archive portable.</p>
      <p>That is the compounding asset. First capture solves a single problem. Fifty captures become a library. Five hundred captures become something your agent can search, cite, compare, and build from.</p>
      <p><a class="btn primary large" href="/install">Install Uoink</a> <a class="btn ghost large" href="/privacy">Read privacy</a></p>
    </article>
  </div>
</section>`,
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
<section class="section" data-screen-label="features / organize"><div class="container"><div class="section-head"><span class="eyebrow">job 2 / organize</span><h2 class="display-l">Turn captures into a <em>library.</em></h2><p class="lede">This is where Uoink stops looking like a transcript downloader. Every capture makes your local archive more useful.</p></div><div class="hook-grid">${featureCards([
["SQLite FTS5 search","Search transcripts, titles, comments, metadata, and corpus text locally."],
["Topic folders","Route captures into folders from editable keyword rules."],
["Memory dashboard","Browse recent captures, job states, thumbnails, health, and actions."],
["Entity mentions","Find every corpus that names a person, tool, company, or topic."],
["Hook taxonomy","Classify openings across nine categories for creator research."],
["Taste calibration","Planned local memory layer that learns what you actually revisit."]
])}</div></div></section>
<section class="section" data-screen-label="features / send"><div class="container"><div class="section-head"><span class="eyebrow">job 3 / send it to AI</span><h2 class="display-l">Use the model you already <em>pay for.</em></h2><p class="lede">Uoink skips the model bundle and chat lock-in. Paste anywhere, send directly, or let an agent call tools.</p></div><div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px"><article class="card"><span class="num">01</span><h3>Paste flow.</h3><p>Clipboard corpus for Claude, ChatGPT, Gemini, local models, or any editor that accepts markdown.</p></article><article class="card"><span class="num">02</span><h3>MCP flow.</h3><p>13 local tools for capture, search, comments, hooks, health, taxonomy, and citations.</p><a class="arr-link" href="/agents">See agents -></a></article><article class="card"><span class="num">03</span><h3>Operator Skill.</h3><p>Portable Skill instructions teach compatible agents how to use the corpus with citation discipline.</p></article></div></div></section>
<section class="section" data-screen-label="features / tune"><div class="container"><div class="section-head"><span class="eyebrow">job 4 / tune the helper</span><h2 class="display-l">Make the defaults fit your <em>machine.</em></h2></div><ul class="fact-list" style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px 56px;list-style:none;padding:0"><li><div><b>BYO Anthropic key</b>Enables Hook Type, Comment Intelligence, and Entity Extraction. Stored in the OS credential vault.</div></li><li><div><b>Clipboard budget</b>Set screenshot caps, compression, and comment limits before pasting into a model.</div></li><li><div><b>Whisper model selector</b>Choose tiny/base/small/medium/large for podcast transcription cost and accuracy tradeoffs.</div></li><li><div><b>Output folder picker</b>Send corpora where your work already lives, including markdown vault workflows.</div></li></ul></div></section>
<section class="big-strip" data-screen-label="features / comparison"><div class="container"><span class="eyebrow">why not Glasp, NoteGPT, or NotebookLM?</span><h2 class="display-l">Transcript tools give you text. Uoink gives you a <em>local asset.</em></h2><p class="body-l" style="max-width:70ch">Cloud tools can summarize. Browser extensions can grab a transcript. Generic MCP servers can fetch captions. Uoink's wedge is the combination: local corpus, screenshots, comments, hook classification, entity search, and MCP access. The archive compounds because it belongs to you.</p><p class="mt-24"><a class="btn ink" href="/privacy">Check privacy -></a> <a class="btn ghost" href="/agents">Check MCP -></a></p></div></section>`,
  },
  podcasts: {
    id: "podcasts",
    route: "/podcasts",
    mode: "mode-dark",
    title: "Local Podcast Transcription and Speaker Diarization",
    description:
      "Use Uoink to turn podcast RSS feeds and episodes into private local corpora with Whisper transcription and speaker diarization.",
    keywords: ["podcast transcription open source", "podcast to ai", "podcast diarization local", "whisper podcast workflow"],
    faq: podcastsFaq,
    html: `
<section class="hero" data-screen-label="podcasts / hero"><div class="container"><div class="hero-grid"><div class="copy"><span class="eyebrow">podcasts</span><h1 class="display-xl">Uoink your <em>podcasts</em> too.</h1><p class="lede">The thing you do with videos also works for long audio: RSS feed in, speaker-aware transcript out, local corpus ready for your model.</p><div class="ctas"><a class="btn primary large" href="${RELEASE_URL}">Get Uoink</a><a class="btn ghost large" href="/how">See workflow</a></div></div><div class="corpus"><div class="hd"><span>podcast corpus</span><span>audio-first</span></div><span class="ln k"># Episode title</span><span class="ln dim">feed, episode URL, duration, publish date</span><span class="ln k">## Speakers</span><span class="ln hl">Speaker 1 / Speaker 2 / Speaker 3</span><span class="ln k">## Transcript</span><span class="ln dim">[14:22] Speaker 2: the claim is...</span><span class="ln k">## Entities</span><span class="ln dim">companies, tools, people, topics</span></div></div></div></section>
<section class="section" data-screen-label="podcasts / rss"><div class="container"><div class="section-head"><span class="eyebrow">any RSS feed</span><h2 class="display-l">Add the feed. Let the helper <em>poll.</em></h2><p class="lede">Drop in a public podcast RSS URL. Uoink can fetch new episodes, run transcription, and file them beside your video library.</p></div><div class="three-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px"><article class="card"><span class="num">01</span><h3>Audio extraction.</h3><p>yt-dlp handles the media download path where supported.</p></article><article class="card"><span class="num">02</span><h3>Local Whisper.</h3><p>Transcription runs on your machine. Choose speed or quality based on the model size.</p></article><article class="card"><span class="num">03</span><h3>Diarization.</h3><p>WhisperX separates speakers as labels you can rename later.</p></article></div></div></section>
<section class="section" data-screen-label="podcasts / use cases"><div class="container"><div class="section-head"><span class="eyebrow">who wins</span><h2 class="display-l">For audio people who need <em>receipts.</em></h2></div><div class="hook-grid">${featureCards([
["Journalists","Pull every factual claim a guest made and keep timestamp citations beside the transcript."],
["Founders","Map a competitor's interview circuit and search every mention of a product, market, or investor."],
["Researchers","Build a private guest-claim corpus across a niche, then ask your model to compare positions."],
["Creators","Study how long-form interviewers frame questions, interrupts, topic shifts, and sponsor reads."],
["Analysts","Search multiple shows for every mention of a company, product category, or technical term."],
["Students","Turn lectures and seminar feeds into searchable notes you can cite later."]
])}</div></div></section>
<section class="big-strip" data-screen-label="podcasts / tradeoff"><div class="container"><span class="eyebrow">the local Whisper trade</span><h2 class="display-l">Private transcription costs <em>time</em>, not trust.</h2><p class="body-l" style="max-width:70ch">Expect roughly 10 to 15 minutes of compute per hour of audio on CPU, depending on model size and machine. That is the cost of keeping raw audio and transcripts local. Uoink runs the job in the background and files the corpus when it finishes.</p><p class="mt-24"><a class="btn ink" href="/privacy">Privacy details -></a> <a class="btn ghost" href="/agents">Agent search -></a></p></div></section>
<section class="section" data-screen-label="podcasts / faq"><div class="container"><div class="section-head"><span class="eyebrow">podcast FAQ</span><h2 class="display-l">Useful caveats, not <em>fine print.</em></h2></div>${renderFaq(podcastsFaq)}</div></section>`,
  },
  agents: {
    id: "agents",
    route: "/agents",
    mode: "mode-light",
    title: "MCP YouTube Server: Claude Desktop and Cursor Tools",
    description:
      "Use Uoink as a local MCP server for Claude Desktop, Cursor, Cline, Continue, and ChatGPT Desktop with 13 video tools.",
    keywords: ["mcp youtube server", "claude desktop youtube tool", "cursor mcp server", "mcp video tool"],
    faq: agentsFaq,
    html: `
<section class="hero" data-screen-label="agents / hero"><div class="container"><div class="section-head"><span class="eyebrow">agents and MCP</span><h1 class="display-xl">Uoink is an <em>MCP server.</em></h1><p class="lede">Give your local AI agent eyes and ears on the web. Uoink exposes capture, search, hook classification, comment analysis, and entity lookup as local tools.</p><div class="ctas"><a class="btn primary large" href="#configs">Copy config</a><a class="btn ghost large" href="/mcp">Read MCP manifest</a></div></div></div></section>
<section class="section" data-screen-label="agents / configs" id="configs"><div class="container"><div class="section-head"><span class="eyebrow">install in your client</span><h2 class="display-l">Copy the config. Then let the agent <em>call tools.</em></h2><p class="lede">These snippets use placeholder paths. After install, Uoink's setup page generates the exact command for your machine.</p></div><div class="docs-main"><h3><span class="anchor">Claude Desktop</span></h3><pre>{
  "mcpServers": {
    "uoink": {
      "command": "%LOCALAPPDATA%\\\\Uoink\\\\uoink_mcp.exe",
      "args": []
    }
  }
}</pre><h3><span class="anchor">Cursor</span></h3><pre>{
  "mcpServers": {
    "uoink": {
      "command": "%LOCALAPPDATA%\\\\Uoink\\\\uoink_mcp.exe",
      "args": []
    }
  }
}</pre><h3><span class="anchor">Cline / Continue</span></h3><pre>{
  "name": "uoink",
  "transport": "stdio",
  "command": "%LOCALAPPDATA%\\\\Uoink\\\\uoink_mcp.exe"
}</pre></div></div></section>
<section class="section" data-screen-label="agents / tools"><div class="container"><div class="section-head"><span class="eyebrow">tools your agent can call</span><h2 class="display-l">Real names, real <em>tools.</em></h2><p class="lede">Use the new <code>uoink_*</code> names. Legacy <code>yoink_*</code> aliases should remain for migration, but new configs should use Uoink.</p></div><div class="docs-main">${toolRows()}</div><p class="mt-32"><a class="btn primary" href="/mcp">Open machine-readable MCP page -></a></p></div></section>
<section class="section" data-screen-label="agents / trace"><div class="container"><div class="section-head"><span class="eyebrow">composing Uoink with other tools</span><h2 class="display-l">Ask Cursor to research the web video <em>for real.</em></h2></div><div class="agent-demo"><div class="chat"><div class="mini-heading">prompt</div><p class="chat-bubble user">Uoink these three competitor videos, classify the hooks, then write a short doc comparing pacing patterns.</p><div class="mini-heading">result</div><p class="chat-bubble assistant">The agent extracts each video, polls the jobs, fetches the corpora, runs hook classification, then writes the comparison into your repo or notes folder.</p></div><div class="log"><div class="mini-heading">tool sequence</div><pre class="mcp-log" style="margin:0;white-space:pre-wrap">uoink_video(url_1)
uoink_video(url_2)
uoink_video(url_3)
get_job_status(job_id)
get_uoink_corpus(corpus_id)
classify_hook(corpus_id)
search_uoinks("pacing")</pre></div></div></div></section>
<section class="big-strip" data-screen-label="agents / transport"><div class="container"><span class="eyebrow">stdio first</span><h2 class="display-l">Supported transport is <em>stdio.</em></h2><p class="body-l" style="max-width:70ch">The local helper defaults to stdio because that is the path Claude Desktop, Cursor, Cline, and Continue expect. HTTP JSON-RPC at <code>127.0.0.1:5179/mcp</code> is experimental for local integrations.</p><p class="mt-24"><a class="btn ink" href="/install">Install Uoink -></a> <a class="btn ghost" href="${GITHUB_URL}">GitHub -></a></p></div></section>
<section class="section" data-screen-label="agents / faq"><div class="container"><div class="section-head"><span class="eyebrow">agent FAQ</span><h2 class="display-l">The integration questions <em>first.</em></h2></div>${renderFaq(agentsFaq)}</div></section>`,
  },
  mcp: {
    id: "mcp",
    route: "/mcp",
    mode: "mode-light",
    title: "Uoink MCP Manifest and Tool Schemas",
    description:
      "Machine-readable Uoink MCP server details: local transport, client snippets, capabilities, and 13 tool names.",
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
version: 3.1
homepage: ${CANONICAL_URL}
source: https://github.com/ryanbiddy/uoink
license: MIT
transport:
  - stdio: supported
  - http: experimental at 127.0.0.1:5179/mcp
install:
  windows: ${CANONICAL_URL}/install#windows
  mac: ${CANONICAL_URL}/install#mac</pre>
      <h2 id="tools">Tools</h2>
      ${toolRows()}
      <h2>Canonical config note</h2>
      <p>Do not guess local paths. After install, Uoink's setup page generates the real config for the user's machine. Snippets on the website are templates for humans and crawlers.</p>
      <p><a class="btn primary" href="/agents">Human setup page</a> <a class="btn ghost" href="/mcp/manifest.json">Raw manifest JSON</a></p>
    </article>
  </div>
</section>
<script type="application/json" id="uoink-mcp-manifest">
{"server":{"name":"uoink","version":"3.2","homepage":"${CANONICAL_URL}","source":"https://github.com/ryanbiddy/uoink","license":"MIT","transports":["stdio","http-experimental"]},"tools":${JSON.stringify(mcpTools.map(([name, description]) => ({ name, description })))}}</script>`,
  },
  about: {
    id: "about",
    route: "/about",
    mode: "mode-dark",
    title: "About Uoink: Open Source Local Corpus Software",
    description:
      "Learn why Uoink is local-first, open source, and built around public GitHub releases instead of user tracking.",
    keywords: ["uoink about", "uoink github downloads", "open source youtube tool", "local-first ai tool"],
    html: `
<section class="hero" data-screen-label="about / hero">
  <div class="container">
    <div class="hero-grid">
      <div class="copy">
        <span class="eyebrow">about</span>
        <h1 class="display-xl">Built in public. Counted in <em>public.</em></h1>
        <p class="lede">Uoink is local corpus software for people who want the source material, not another cloud inbox. The code is MIT. The releases are public. The total download count below comes straight from GitHub.</p>
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
        <span class="ln k">downloads: GitHub public API</span>
        <span class="ln dim">release assets counted, people never counted</span>
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
<section class="section" data-screen-label="privacy / main"><div class="container"><article class="article"><div class="meta"><span>privacy</span><span>local-first</span></div><h1>Your corpus never leaves your <em>machine.</em></h1><p class="standfirst">Uoink extracts video and podcast content, stores it on your disk, and hands it to the AI you chose. There is no Uoink cloud because we never built one.</p><h2>What Uoink does.</h2><p>Uoink captures transcripts, screenshots, comments, channel context, podcast transcripts, metadata, and local indexes. It writes those artifacts into normal local files and a local SQLite index. You can paste the corpus into Claude or ChatGPT, or let an MCP agent read it directly.</p><h2>What Uoink skips.</h2><p>No telemetry. No analytics SDK. No account. No phone-home. No hosted corpus. No newsletter capture. No tracking pixel. No remote logging.</p><h2>Where your data lives.</h2><p>On Windows, the helper lives under <code>%LOCALAPPDATA%\\Uoink</code>. Captures write into your Uoink library folder. The optional Anthropic key is stored in Windows Credential Manager. On macOS, the planned path uses <code>~/Library/Application Support/Uoink/</code> and Keychain.</p><h2>Network calls Uoink makes.</h2><p>Extraction calls go to the source you asked for: YouTube, X, RSS hosts, or another supported URL. Optional Comment Intelligence, Hook Type, and Entity Extraction calls go to Anthropic with your key only when enabled. Nothing is proxied through Uoink.</p><h2>Open source: audit it yourself.</h2><p>The source is MIT-licensed at <a href="${GITHUB_URL}">github.com/ryanbiddy/uoink</a>. You can inspect the helper, loopback server, and network code.</p><p><a class="btn primary large" href="/install">Install Uoink</a> <a class="btn ghost large" href="/terms">Read terms</a></p></article></div></section><section class="section" data-screen-label="privacy / faq"><div class="container">${renderFaq(privacyFaq)}</div></section>`,
  },
  changelog: {
    id: "changelog",
    route: "/changelog",
    mode: "mode-dark",
    title: "Changelog: Version Updates and Universal Extraction",
    description:
      "Read Uoink release notes, v3.2 direction, universal extraction, podcast support, MCP improvements, and local corpus roadmap.",
    keywords: ["uoink changelog", "uoink release notes", "uoink updates", "universal video uoink changelog"],
    html: `
<section class="section" data-screen-label="changelog / main"><div class="container"><article class="article"><div class="meta"><span>changelog</span><span>latest first</span></div><h1>What's shipped, what's <em>coming.</em></h1><p class="standfirst">Engineers read changelogs to decide whether a tool is alive. Uoink is alive. This is the public summary; GitHub remains canonical.</p><h2>Latest: v3.2 track</h2><ul><li>Universal URL expansion for web video via yt-dlp backed extraction.</li><li>Podcast RSS and local transcription workstream.</li><li>Agent-readable site surfaces: /agents, /mcp, /llms.txt, /llms-full.txt.</li><li>Sharper positioning around corpus, local memory, and model-agnostic workflows.</li></ul><h2>Recent: v2.2</h2><ul><li>Dashboard, tray flow, install wizard, and local helper polish.</li><li>Memory/library surfaces for local captures.</li><li>13 MCP tools for capture, search, health, citation maps, comments, hooks, taxonomy, and entities.</li></ul><h2>In flight.</h2><ul><li>Signed macOS DMG and menu-bar helper.</li><li>Podcast corpus UI and Whisper model controls.</li><li>Markdown memory layer and richer local corpus map.</li><li>Verification assistance that presents evidence, not automatic verdicts.</li></ul><h2>Boundaries.</h2><p>Uoink stays away from hosted video warehouses, recommendation feeds, and social networks. The point is deliberate local work, not another cloud inbox.</p><p><a class="btn primary large" href="${RELEASE_URL}">Latest GitHub release</a> <a class="btn ghost large" href="/features">Feature inventory</a></p></article></div></section>`,
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
<section class="section" data-screen-label="terms / main"><div class="container"><article class="article"><div class="meta"><span>terms</span><span>short by design</span></div><h1>Terms of <em>use.</em></h1><p class="standfirst">Uoink is local, open-source software. These terms are intentionally short.</p><h2>The software is MIT-licensed.</h2><p>Uoink source is published at <a href="${GITHUB_URL}">github.com/ryanbiddy/uoink</a> under the MIT License. The license grants broad permission to use, copy, modify, merge, publish, distribute, sublicense, and sell copies, subject to the license notice.</p><h2>No warranty.</h2><p>The software is provided as-is, without warranty of any kind. Use it at your own discretion and keep backups of work you care about.</p><h2>Your responsibility.</h2><p>You are responsible for how you use video, podcast, transcript, screenshot, and comment material captured with Uoink. Follow the terms of the source platforms and any AI provider you choose to use.</p><h2>Trademark and brand.</h2><p>Uoink is Ryan Biddy's product name and mark. Do not impersonate the project or represent unofficial builds as official.</p><h2>Contact.</h2><p>Email <a href="mailto:hi@uoink.video">hi@uoink.video</a> for terms, trademark, or abuse concerns.</p><p><a class="btn primary large" href="/install">Install Uoink</a> <a class="btn ghost large" href="/privacy">Privacy policy</a></p></article></div></section>`,
  },
  memory: aliasPage("memory", "/memory", "Uoink Memory moved into Features", "Memory is now covered in the Uoink feature inventory.", "/features"),
  tweaks: aliasPage("tweaks", "/tweaks", "Uoink settings moved into Features", "Settings and tuning are now covered in the Uoink feature inventory.", "/features"),
  creators: aliasPage("creators", "/creators", "Creator workflow moved into How Uoink Works", "Creator workflows now live on the main workflow page.", "/how"),
  research: aliasPage("research", "/research", "Research workflow moved into Podcasts and Features", "Research workflows now live across Podcasts and Features.", "/features"),
  agentDocs: aliasPage("agentDocs", "/agent-docs", "Agent docs moved to Agents and MCP", "Agent docs now live at /agents and /mcp.", "/agents"),
  hooks: aliasPage("hooks", "/hooks", "Hook taxonomy moved into Features", "Hook Type classification is covered in Features and Agents.", "/features"),
  blog: aliasPage("blog", "/blog", "Uoink Field Notes", "Launch articles about hooks, agents, local-first architecture, and corpus workflows.", "/blog"),
  twitter: aliasPage("twitter", "/twitter", "Uoink for Twitter video", "Capture X and Twitter video context into your local corpus.", "/twitter"),
  dashboard: aliasPage("dashboard", "/dashboard", "Dashboard moved into Features", "The dashboard and memory surfaces are covered in Features.", "/features"),
  installed: aliasPage("installed", "/installed", "Uoink installed", "Start with the install and how-it-works pages.", "/how"),
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
        `<div class="tool-row"><div class="name">${name}<span class="args">local MCP tool</span></div><div class="desc">${description}<span class="ex">See /mcp/manifest.json for machine-readable schema.</span></div></div>`,
    )
    .join("");
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

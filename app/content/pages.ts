import { homeHtml } from "./hero";
import { AGENT_SETUP_HTML } from "./agent-setup";
import { MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT, mcpTools } from "./mcp-tools";
import { CLAUDE_CODE_COMMAND, MCP_CURSOR_CONFIG, MCP_STDIO_CONFIG } from "./mcp-config";
import { MAC_DMG_URL, PRODUCT_STATUS } from "./product-status";
import release from "../../content/release.json";

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
// content/release.json also supplies the release version to both content scripts.
// Static public metadata is checked against it by check-launch-content.cjs.
export const VERSION = `v${release.version}`;
// Numeric form (no leading "v") for machine-readable manifests and server cards.
export const VERSION_NUMBER = release.version;
export const INSTALLER_SIZE = `${Math.round(release.installerSizeBytes / 1_000_000)} MB`;
export const DOWNLOAD_URL = `${GITHUB_URL}/releases/download/${VERSION}/Uoink-Setup-${VERSION_NUMBER}.exe`;

const WINDOWS_MARK =
  '<span class="os-logo windows-logo" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path d="M5 8l17-2.4v17.2H5V8zm20.5-2.8L43 2.7v20.1H25.5V5.2zM5 25.2h17v17.2L5 40V25.2zm20.5 0H43v20.1l-17.5-2.5V25.2z" fill="currentColor"/></svg></span>';
const MAC_MARK =
  '<span class="os-logo mac-logo" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path d="M32.4 4.4c.2 3.1-1.1 6.1-3 8.2-2.1 2.3-5.1 4-8 3.8-.4-3 .9-6 2.8-8.1 2-2.3 5.4-4 8.2-3.9zM42 34.3c-1.1 2.5-1.7 3.6-3.1 5.9-2 3-4.8 6.9-8.3 7-3.1.1-3.9-2-8.1-2s-5.1 1.9-8 2c-3.5.1-6.2-3.6-8.2-6.7-5.6-8.5-6.2-18.5-2.7-23.8 2.5-3.8 6.4-6 10-6.1 3.7-.1 7.1 2 9 2s5.6-2.4 9.5-2c1.6.1 6.2.7 9.1 4.9-.2.1-5.5 3.2-5.4 9.6.1 7.6 6.6 10.1 6.2 9.2z" fill="currentColor"/></svg></span>';

// Hairline between reading-column sections; the TSX pages use <DocRule />.
const DOC_RULE = '<div class="container"><hr class="doc-rule"/></div>';

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
      "The extension is Manifest V3 and is built and tested for Chrome. Other Chromium browsers such as Edge and Brave may work but are not tested. Since Chrome Web Store approval is pending, sideload the extension manually from the folder Uoink places on your machine.",
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
      "Captures live on your disk, with no Uoink account or hosted corpus. Source requests, model downloads and dependency telemetry still contact outside services. AI features and connected clients can share content.",
  },
  {
    question: "Where is my Anthropic API key stored?",
    answer:
      "Your Anthropic key is stored in Windows Credential Manager and excluded from normal settings writes. On a Mac, it is stored in the macOS Keychain. Removing it in Uoink may leave a legacy Yoink credential or an older plaintext settings entry; deletion failures can go unreported. Removal does not revoke the key at Anthropic. Allowed agent actions can use a saved key even if automatic analysis is off.",
  },
  {
    question: "When does anything leave my machine?",
    answer:
      "Capture requests go to source sites and can use FxTwitter for X text. Enabled subscriptions poll in the background. Thumbnails, the automatic Claude tab after extension capture, model downloads, dependency telemetry and release checks can also connect. Anthropic receives data for automatic AI analysis you enable or an on-demand action you or an allowed agent starts with your key. ScrapeCreators receives a handle, channel ID, or query only after you enable discovery and authorize the request.",
  },
  {
    question: "Does semantic search send my library anywhere?",
    answer:
      "No. Semantic search is optional and stays off until you turn it on in Settings. After you accept Google's Gemma terms, Uoink downloads the EmbeddingGemma model from Hugging Face once (about 330 MB) and builds its index on your computer. Your searches and saved text stay on your computer, and search works offline after setup. The model is never bundled with Uoink. Removing semantic search deletes the model and its index; keyword search keeps working.",
  },
];

const agentsFaq: FaqItem[] = [
  {
    question: "What is MCP and how does Uoink use it?",
    answer:
      "Model Context Protocol lets an AI client call local tools. Uoink exposes a local stdio MCP server so Claude Desktop, Claude Code, and Cursor (the tested clients) can capture and search your library.",
  },
  {
    question: "Does the agent need the clipboard flow?",
    answer:
      "No. Claude Desktop, Claude Code, and Cursor can capture, search, and read your library over MCP. ChatGPT uses the clipboard path.",
  },
  {
    question: "Is HTTP transport supported?",
    answer:
      `Uoink exposes ${MCP_STDIO_TOOL_COUNT} tools over stdio and ${MCP_TOOL_COUNT} over local HTTP JSON-RPC at 127.0.0.1:5179/mcp/v1.`,
  },
];

// Text moved off home by REVIEW-HERO-1. Render only on the matching route.
export const HOME_MOVED_CONTENT: Record<string, string> = {
  "/changelog": `<section class="section" data-screen-label="changelog / living library" id="living-library">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">Living Library and research</span>
        <h2 class="display-l">Find the moment. <em>Cite the source.</em></h2>
      </div>
      <ul class="doc-list">${docItems([
        ["Smarter search", "Search no longer needs every word to match, so plain questions find the right source. Choose Exact words when you need every word. Optional semantic search finds similar meaning and runs on your computer after you turn it on in Settings."],
        ["Clip search + evidence cards", "Search inside videos for timestamped, deep-linked excerpts your AI can quote and cite. Now on everyday stdio MCP."],
        ["Standing capture", "Follow a YouTube channel, YouTube playlist, or podcast RSS feed. With capture enabled, new uploads and episodes land in your library."],
        ["Library reach over MCP", "Search the library, read items, and use resource templates and prompts from your MCP client."],
        ["Cited range export", "Quote a stretch of video or an episode with speaker labels, chapters, and provenance."],
        ["Chapter navigation", "Jump between chapters on items that have them."],
        ["Library, Reader, and Activity", "Search or paste a link in Library, open a capture in Reader, and follow Activity’s five-step strip. One Settings page saves individual preferences as you change them; the extension popup and setup keep capture and connection controls close."],
        ["Five research playbooks", "Use your own library for outlier posts, transcript intelligence, comment mining, creator teardowns, and repurposing. MCP agents can request cited packets without a model call. Optional ScrapeCreators discovery is off by default, with a default 25-credit daily cap and paid calls only with consent."],
        ["Podcasts and quieter notifications", "Podcast transcripts enter the searchable library; interrupted jobs resume after a restart. Feed audio stays off until you enable Auto-ingest. Captures show a toast instead of opening Explorer, and notifications can be muted or suppressed during fullscreen use."],
        ["More reliable YouTube capture", "Caption rate limits no longer fail the whole capture. Local transcription can fill in when an already-downloaded model is available; missing transcripts stay labeled. Requests are paced, yt-dlp is newer, and Activity distinguishes waiting, failure, and cancellation."],
        ["Tighter local boundaries", "Extension token minting checks the pinned extension ID, and page scripts cannot trigger capture buttons. Public-network checks protect supported fetch paths; error responses scrub paths and credentials, and corpus imports stay inside the exports folder."]
      ])}</ul>
      <p class="doc-links"><a class="arr-link" href="${GITHUB_URL}/releases/tag/${VERSION}">${VERSION_NUMBER} release notes</a> <a class="arr-link" href="/changelog">Changelog</a></p>
    </div>
  </div>
</section>`,
  "/how-it-works": `<section class="section" data-screen-label="how-it-works / corpus anatomy" id="corpus">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">what you get per uoink</span>
        <h2 class="display-l">Why paste a transcript when you can feed the <em>entire corpus?</em></h2>
        <p class="lede">Transcript-only tools flatten video into text. Uoink keeps the parts that make video useful: the words, the frames, the audience reaction, the channel context, and the source metadata.</p>
      </div>
      <ol class="doc-list numbered">
        <li><span class="num">01</span><h3>Capture the <em>source.</em></h3><p>Transcript with timestamps, screenshots, description, title, thumbnail, channel context, and comments in one markdown file.</p><a class="arr-link" href="/how-it-works">See the workflow -></a></li>
        <li><span class="num">02</span><h3>Keep the <em>asset.</em></h3><p>Every capture writes to disk and into a local SQLite index. Search it later, cite it later, move it into your own vault.</p><a class="arr-link" href="/features">Browse features -></a></li>
        <li><span class="num">03</span><h3>Hand it to <em>AI.</em></h3><p>Paste transcript and frames into Claude or ChatGPT, or let an MCP agent search and cite your library.</p><a class="arr-link" href="/developers">Open developer docs -></a></li>
      </ol>
    </div>
  </div>
</section>`,
  "/privacy": `<section class="section" data-screen-label="privacy / local first">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">local-first, by design</span>
        <h2 class="display-l">No account. No Uoink cloud. <em>Your disk.</em></h2>
        <p class="lede">The helper runs on localhost. Your corpus lands on your disk. Entity extraction is opt-in and off by default. If you add your own Anthropic key, the model-usage meter shows real usage.</p>
      </div>
      <p class="doc-links"><a class="arr-link" href="/privacy">Read privacy -></a></p>
    </div>
  </div>
</section>`,
  "/creators": `<section class="section" data-screen-label="creators / three audiences">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">three doors, one corpus</span>
        <h2 class="display-l">Creators and developers use the same <em>source card.</em></h2>
        <p class="lede">The card stays the shared object. The next move changes by job.</p>
      </div>
      <ul class="doc-list linked">
        <li><a class="doc-row" href="/creators"><h3>Creators.</h3><p>Find the moment you need, read the transcript beside the frames, and export a cited range for your next draft.</p><span class="arr-link">See creator workflow -></span></a></li>
        <li><a class="doc-row" href="/developers"><h3>Developers.</h3><span class="arr-link">Open developer docs -></span></a></li>
        <li><a class="doc-row" href="/sources"><h3>Sources.</h3><span class="arr-link">Browse supported sources -></span></a></li>
      </ul>
    </div>
  </div>
</section>`,
  "/mcp": `<section class="section" data-screen-label="mcp / model agnostic">
  <div class="container">
    <div class="doc">
      <div class="exchange">
        <div class="mini-heading">model agnostic</div>
        <p class="chat-bubble user">Find the moment this saved video discusses language models and give me a source link.</p>
        <p class="chat-bubble assistant">Calling <code>search_clips</code>, then <code>get_evidence_card</code>. Your AI reads timestamped excerpts it can quote and cite.</p>
        <div class="mini-heading">mcp tool trace</div>
        <pre class="code-block">search_library(query)
get_library_item(video_id)
search_clips(query)
get_evidence_card(video_id)</pre>
      </div>
      <p class="doc-links"><a class="arr-link" href="/developers">Read MCP setup -></a> <a class="arr-link" href="/mcp">Machine-readable MCP manifest -></a></p>
    </div>
  </div>
</section>`,
  "/install": `<section class="section" data-screen-label="install / install">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">install Uoink</span>
        <h2 class="display-l">One helper. One extension. Then the <em>U button.</em></h2>
        <p class="lede">Download the helper, install the extension, open a video, and click Uoink. The helper bundles Python, yt-dlp, and ffmpeg so you never install them yourself.</p>
      </div>
      <ul class="doc-list">
        <li><p class="doc-meta"><b>Windows</b><span>live path</span></p><p class="doc-ver">Uoink installer / Windows 10 and 11</p><p>Runs in your tray, writes to your local library, and exposes the local MCP server.</p><a class="btn primary small" href="${DOWNLOAD_URL}">Download -></a></li>
        <li><h3>Install the browser button.</h3><a class="arr-link" href="/install#extension">Install notes -></a></li>
        <li><p class="doc-meta"><b>Mac</b></p><a class="arr-link" href="/install#mac">${PRODUCT_STATUS.mac.linkLabel}</a></li>
      </ul>
    </div>
  </div>
</section>`,
  "/developers": `<section class="section"><div class="container"><div class="doc"><ul class="doc-list linked"><li><a class="doc-row" href="/developers"><h3>Developers.</h3><p>Give Claude Desktop or Cursor a local library to search and cite. Start with the stdio config or the Claude Desktop bundle.</p><span class="arr-link">Open developer docs -></span></a></li></ul></div></div></section>`,
  "/sources": `<section class="section"><div class="container"><div class="doc"><ul class="doc-list linked"><li><a class="doc-row" href="/sources"><h3>Sources.</h3><p>Capture YouTube, X video and post text, podcasts, web articles, and Reddit threads into one local library.</p><span class="arr-link">Browse supported sources -></span></a></li></ul></div></div></section>`,
};

export const pages: Record<PageId, SitePage> = {
  home: {
    id: "home",
    route: "/",
    mode: "mode-dark",
    title: "Uoink | Save YouTube and podcast transcripts for your AI",
    description:
      "Save YouTube videos, podcasts and articles to your own disk. Your AI searches the library and cites the timestamp. Free and open source, for Windows.",
    keywords: [
      "youtube to AI",
      "local video corpus",
      "mcp youtube server",
      "local knowledge base",
      "writing studio",
    ],
    // Product first: hero with both downloads and the real flow, then Save it,
    // Find it, Write with receipts, Connect your AI, Go deeper and Zing. See hero.ts.
    html: homeHtml({
      windowsUrl: DOWNLOAD_URL,
      macUrl: MAC_DMG_URL,
      windowsMark: WINDOWS_MARK,
      macMark: MAC_MARK,
      platforms: PRODUCT_STATUS.mac.visible,
      toolCount: MCP_TOOL_COUNT,
    }),
  },
  install: {
    id: "install",
    route: "/install",
    mode: "mode-dark",
    title: "Download Uoink: Local Helper and Browser Extension Install",
    description:
      "Install Uoink on Windows or the Mac preview, add the browser extension, and start extracting local video and text corpora for Claude, ChatGPT, and MCP.",
    keywords: ["install uoink", "uoink download windows", "uoink download mac", "uoink chrome extension", "yt-dlp Chrome extension", "reddit context for AI"],
    faq: installFaq,
    html: `
<section class="hero" data-screen-label="install / hero">
  <div class="container">
    <div class="hero-grid">
      <div class="copy">
        <span class="eyebrow">install</span>
        <h1 class="display-xl">Install <em>Uoink.</em></h1>
        <p class="lede">Get the helper running, add the browser button, and click Uoink on any video or Reddit thread. No Python, no command line, no path wrangling.</p>
        <div class="ctas"><a class="btn primary large with-logo" href="${DOWNLOAD_URL}">${WINDOWS_MARK}Download Windows installer</a><a class="btn ghost large" href="/how-it-works">See how it works</a></div>
        <p class="footnote">The installer is unsigned. Windows SmartScreen will show a warning. <strong>More info → Run anyway</strong>.</p>
        <p class="sub-cta">${PRODUCT_STATUS.mac.windowsLabel} / About ${INSTALLER_SIZE} / No admin rights needed</p>${PRODUCT_STATUS.mac.heroLink}
        <div class="brand-strip" aria-label="Install surfaces">
          <!-- GitHub logo source: https://github.com/logos; license/usage confirmation: official GitHub mark, unmodified integration callout under GitHub logo guidelines. -->
          <span class="logo-chip logo-mark"><img src="/assets/brand-logos/github.svg" alt="GitHub" width="22" height="22" loading="lazy" decoding="async" /><span>GitHub Releases</span></span>
          <span>Chrome (tested)</span>
          <span class="cws-chip">Chrome Web Store pending</span>
        </div>
      </div>
      <aside class="facts" aria-label="Install steps">
        <p class="facts-head"><span>install steps</span><span>sideload flow</span></p>
        <ol class="facts-list">
          <li><b>1. Run helper installer</b><span>Places local helper under %LOCALAPPDATA%\\Uoink</span></li>
          <li><b>2. Sideload extension</b><span>Load unpacked folder from the helper directory. Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible.</span></li>
          <li><b>3. Start capturing</b><span>YouTube and Reddit threads save directly to disk</span></li>
        </ol>
      </aside>
    </div>
  </div>
</section>

<section class="section" data-screen-label="install / steps">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">setup steps</span>
        <h2 class="display-l">Three steps to <em>sideload.</em></h2>
        <p class="lede">Uoink runs entirely on your machine. Follow this sequence to set it up.</p>
      </div>
      <ol class="doc-list numbered">
        <li>
          <span class="num">01</span>
          <h3>Download the helper.</h3>
          <p>Run the unsigned Windows installer (about ${INSTALLER_SIZE}). No admin rights needed; it installs to <code>%LOCALAPPDATA%\\Uoink</code>.</p>
          <p class="footnote">The installer is unsigned. Windows SmartScreen will show a warning. <strong>More info → Run anyway</strong>.</p>
        </li>
        <li>
          <span class="num">02</span>
          <h3>Load the browser extension.</h3>
          <p>We're waiting on Web Store approval, so you'll need to load the extension folder manually:</p>
          <ol class="steps">
            <li>Open Chrome's extensions page: <code>chrome://extensions</code>.</li>
            <li>Enable <strong>Developer mode</strong> in the top right.</li>
            <li>Click <strong>Load unpacked</strong> and select the <code>%LOCALAPPDATA%\\Uoink\\extension</code> directory.</li>
            <li>Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible.</li>
          </ol>
        </li>
        <li>
          <span class="num">03</span>
          <h3>Click capture.</h3>
          <p>Open YouTube or Reddit. Click the Uoink button on any video or thread page to save the corpus directly to your local files.</p>
        </li>
      </ol>
    </div>
  </div>
</section>

<section class="section flush" data-screen-label="install / platforms">
  <div class="container">
    <div class="doc">
      <ul class="doc-list">
        <li id="windows">
          <p class="doc-meta"><b class="platform-label">${WINDOWS_MARK}Windows</b><span>now</span></p>
          <h3>Desktop helper.</h3><p>Leave <strong>Add the uoink command to PATH for AI agents</strong> checked to use the command in new terminals. After installing, open a new terminal and run <code>uoink status</code>. See <a href="/developers">agent setup</a> or the <a href="https://github.com/ryanbiddy/uoink/blob/main/llms-install.md">agent installation steps</a>.</p>
          <p class="doc-ver">Windows 10/11 / release page</p>
          <p>The helper bundles Python, yt-dlp, ffmpeg, SQLite, the local MCP server, and the uoink command. It runs in user space and exposes the loopback server on port 5179.</p>
          <a class="btn primary small with-logo" href="${RELEASE_URL}">${WINDOWS_MARK}Open release -></a>
        </li>
        <li id="extension">
          <p class="doc-meta"><b>Extension</b><span>pending review</span></p>
          <h3>Browser button.</h3>
          <p class="doc-ver">Chrome (tested); other Chromium browsers such as Edge and Brave may work but are not tested.</p>
          <p>The extension adds capture buttons directly to supported web pages. It communicates locally with the helper and skips broad history permissions.</p>
          <p>Chrome Web Store approval is pending. Sideload the extension by loading the unpacked folder located at <code>%LOCALAPPDATA%\\Uoink\\extension</code>. Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible.</p>
          <p>After updating the helper, reload the extension once from your browser’s extensions page. If its ID changes to the pinned <code>bkcapfidedhfcjpmjabeopfbcjcbmdmi</code>, reapply your extension preferences. Your saved captures are unaffected.</p>
          <p class="footnote">Web Store review pending</p>
        </li>
        <li id="mac">
          <p class="doc-meta"><b class="platform-label">${MAC_MARK}Mac</b></p>
          <h3>${PRODUCT_STATUS.mac.heading}</h3>
          ${PRODUCT_STATUS.mac.installSteps}
        </li>
      </ul>
    </div>
  </div>
</section>
${DOC_RULE}
<section class="section" data-screen-label="install / post install">
  <div class="container">
    <div class="doc"><div class="doc-head"><span class="eyebrow">post-install</span><h2 class="display-l">What happens when it's <em>running.</em></h2><p class="lede">The helper starts in the background. The extension checks localhost. When both are green, the Uoink button appears on supported pages.</p></div></div>
    <figure class="figure">
      <div class="figure-label"><span>dashboard</span><span>after install</span></div>
      <img src="/product/hero-library.webp" width="1440" height="900" loading="lazy" decoding="async" alt="The Uoink dashboard running locally after install: a populated library of captured videos with search, channel and topic filters, and per-source hook labels." />
      <figcaption>The local dashboard once the helper is running: your captures, searchable and filterable on your own machine.</figcaption>
    </figure>
    <div class="doc">
      <ol class="doc-list numbered">
        <li><span class="num">01</span><h3>Tray status.</h3><p>The helper sits in the tray and opens the local dashboard when you need logs, settings, or recent jobs.</p></li>
        <li><span class="num">02</span><h3>Local files.</h3><p>Captures write to your Uoink folder and into a local SQLite index. Nothing uploads to Uoink because there's no Uoink cloud.</p></li>
        <li><span class="num">03</span><h3>AI handoff.</h3><p>Paste into Claude or ChatGPT, or skip the clipboard and let your MCP client call Uoink directly.</p></li>
      </ol>
    </div>
  </div>
</section>
${DOC_RULE}
<section class="section" data-screen-label="install / faq">
  <div class="container"><div class="doc"><div class="doc-head"><span class="eyebrow">troubleshooting</span><h2 class="display-l">The boring questions that <em>matter.</em></h2></div>${renderFaq(installFaq)}</div></div>
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
    <div class="doc">
      <span class="eyebrow">how it works</span>
      <h1 class="display-xl">How Uoink <em>works.</em></h1>
      <p class="lede">One click turns video and audio into a structured text database on your machine.</p>
      <p class="body-l">A local helper does the work: download, transcribe, index. Your browser extension and your AI agents talk to it over localhost. Captures are stored locally; AI features, connected clients, exports and synced folders can share copies.</p>
    </div>
    <figure class="figure">
      <img src="/product/hero-library.webp" alt="Dashboard Main Screen showing library grid and active tasks" />
      <figcaption><b>Dashboard Main Screen:</b> Browsing the local library grid and active transcription tasks. Your files stay on your disk.</figcaption>
    </figure>
  </div>
</section>

<section class="section" data-screen-label="how / five step loop">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">the five step loop</span>
        <h2 class="display-l">From raw video to context your model can <em>cite.</em></h2>
        <p class="lede">Capture to draft in 5 steps, all on your machine.</p>
      </div>
      <ol class="doc-list numbered">
        <li><span class="num">01</span><h3>Capture the source.</h3><p>One click grabs the transcript, screenshots, comments, and metadata. Hit the Uoink button on a YouTube watch page, right-click any link, or paste feed URLs into settings. The helper queues downloads in the background and handles the rate limits for you.</p></li>
        <li><span class="num">02</span><h3>Build the library.</h3><p>Every capture lands on your workstation as standard markdown and gets indexed in a local SQLite database. Search transcripts and comments instantly, even offline.</p></li>
        <li><span class="num">03</span><h3>Assemble workspaces.</h3><p>Group your captures around the thing you're making: transcripts, self-channel performance metrics, and research themes in one workspace. That workspace becomes clean grounding data for your model.</p></li>
        <li><span class="num">04</span><h3>Iterate on drafts.</h3><p>Draft in the local Writing Studio. The helper feeds grounding context to your AI client, checks each draft against your style anchors and formatting rules, and appends creator credit automatically.</p></li>
        <li><span class="num">05</span><h3>Distribute with agents.</h3><p>Claude Desktop, Claude Code, and Cursor can search and cite your library over MCP. For ChatGPT, paste the transcript and frames from the clipboard.</p></li>
      </ol>
    </div>
  </div>
</section>
${DOC_RULE}
<section class="section" data-screen-label="how / install-cta">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">get started</span>
        <h2 class="display-l">Your corpus starts with one capture.</h2>
        <p class="body-l">Download the helper and the extension, then click Uoink on the next video you study.</p>
      </div>
      <a class="btn primary" href="/install">Install Uoink -></a>
    </div>
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
  podcasts: aliasPage("podcasts", "/podcasts", "Podcast details moved to Sources", "Podcasts are now listed on the Uoink sources page.", "/sources/podcasts"),
  agents: {
    id: "agents",
    route: "/agents",
    mode: "mode-light",
    title: "MCP YouTube Server: Claude Desktop, Claude Code, and Cursor Tools",
    subtitle: `${MCP_STDIO_TOOL_COUNT} tools over stdio and ${MCP_TOOL_COUNT} in the HTTP registry. Every tool is available on both transports.`,
    description:
      "Use Uoink as a local MCP server for Claude Desktop, Claude Code, and Cursor.",
    keywords: ["mcp youtube server", "claude desktop youtube tool", "cursor mcp server", "mcp video tool"],
    faq: agentsFaq,
    html: `
<section class="hero" data-screen-label="agents / hero"><div class="container"><div class="doc"><span class="eyebrow">agents and MCP</span><h1 class="display-xl">Uoink is an <em>MCP server.</em></h1><p class="lede">Give your agent a local library to search and cite. Uoink exposes ${MCP_STDIO_TOOL_COUNT} tools over stdio and ${MCP_TOOL_COUNT} in the HTTP registry.</p><div class="ctas"><a class="btn primary large" href="#configs">Copy config</a><a class="btn ghost large" href="/mcp">Read MCP manifest</a></div><div class="brand-strip" aria-label="Agent clients">
<!-- Claude logo source: https://www.anthropic.com/ and https://claude.ai/favicon.svg; license/usage confirmation: official Claude site mark, unmodified integration callout. -->
<span class="logo-chip brand-mark-pill logo-mark" aria-label="Claude"><img src="/assets/brand-logos/claude.svg" alt="Claude" width="30" height="30" loading="lazy" decoding="async" /></span>
<!-- Cursor logo source: https://cursor.com/ and https://cursor.com/marketing-static/favicon.svg; license/usage confirmation: official Cursor site asset, unmodified integration callout because no separate public brand portal was found. -->
<span class="logo-chip brand-mark-pill logo-mark" aria-label="Cursor"><img src="/assets/brand-logos/cursor.svg" alt="Cursor" width="30" height="30" loading="lazy" decoding="async" /></span>
<!-- GitHub logo source: https://github.com/logos; license/usage confirmation: official GitHub mark, unmodified integration callout under GitHub logo guidelines. -->
<span class="logo-chip brand-mark-pill logo-mark" aria-label="GitHub"><img src="/assets/brand-logos/github.svg" alt="GitHub" width="30" height="30" loading="lazy" decoding="async" /></span>
</div></div></div></section>
<section class="section" data-screen-label="agents / configs" id="configs"><div class="container"><div class="doc"><div class="doc-head"><span class="eyebrow">install in your client</span><h2 class="display-l">Connect your <em>library.</em></h2><p class="lede">Tested with Claude Desktop, Claude Code, and Cursor. Open the <a href="${RELEASE_URL}">.mcpb bundle from the latest release</a> for one-click Claude Desktop setup, or use the README config:</p></div><div class="docs-main"><pre class="code-block">${escapeHtml(MCP_STDIO_CONFIG)}</pre><p>Claude Desktop does not expand <code>%LOCALAPPDATA%</code>. Use absolute paths in both fields, or copy the generated config from the extension’s Settings page. Restart the client after saving. Cline and Continue were not individually smoke-tested. ChatGPT uses the clipboard path.</p></div></div></div></section>
${DOC_RULE}
<section class="section" data-screen-label="agents / tools"><div class="container"><div class="doc"><div class="doc-head"><span class="eyebrow">tools your agent can call</span><h2 class="display-l">Real names, real <em>tools.</em></h2><p class="lede">Use the <code>uoink_*</code> names for new configs. Migration aliases may exist in older installs, but the public docs should point agents at Uoink.</p></div><div class="docs-main">${toolRows()}</div><div class="ctas"><a class="btn primary" href="/mcp">Open machine-readable MCP page -></a></div></div></div></section>
${DOC_RULE}
<section class="section" data-screen-label="agents / trace"><div class="container"><div class="doc"><div class="doc-head"><span class="eyebrow">composing Uoink with other tools</span><h2 class="display-l">Ask Cursor to tear down 3 competitor videos <em>for real.</em></h2></div><div class="exchange"><div class="mini-heading">prompt</div><p class="chat-bubble user">Uoink these three competitor videos, classify the hooks, then write a short doc comparing pacing patterns.</p><div class="mini-heading">result</div><p class="chat-bubble assistant">The agent extracts each video, polls the jobs, fetches the corpora, runs hook classification, then writes the comparison into your repo or notes folder.</p><div class="mini-heading">tool sequence</div><pre class="code-block">uoink_video(url_1)
uoink_video(url_2)
uoink_video(url_3)
get_job_status(job_id)
get_uoink_corpus(corpus_id)
classify_hook(corpus_id)
search_uoinks("pacing")</pre></div></div></div></section>
${DOC_RULE}
<section class="section" data-screen-label="agents / transport"><div class="container"><div class="doc"><div class="doc-head"><span class="eyebrow">transport options</span><h2 class="display-l">Stdio and HTTP <em>transports.</em></h2><p class="body-l">Uoink supports both stdio and HTTP (SSE) transports. The stdio path connects agents directly as subprocesses. The HTTP transport runs on <code>http://localhost:5179/mcp/v1</code> and requires the header <code>X-Uoink-Token</code> (token stored in <code>%LOCALAPPDATA%\\Uoink\\token.txt</code>).</p></div><div class="ctas"><a class="btn primary" href="/install">Install Uoink -></a><a class="btn ghost" href="${GITHUB_URL}">GitHub -></a></div></div></div></section>
${DOC_RULE}
<section class="section" data-screen-label="agents / faq"><div class="container"><div class="doc"><div class="doc-head"><span class="eyebrow">agent FAQ</span><h2 class="display-l">The integration questions <em>first.</em></h2></div>${renderFaq(agentsFaq)}</div></div></section>`,
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
      <p>Official MCP registry: <code>io.github.ryanbiddy/uoink</code>. Clients and directories that read the registry can find Uoink.</p>
      <h2 id="server">Server</h2>
      <pre class="code-block">name: uoink
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
  windows: ${CANONICAL_URL}/install#windows${PRODUCT_STATUS.mac.available ? `
  macos: ${CANONICAL_URL}/install#mac` : ""}
platform: ${PRODUCT_STATUS.mac.visible}</pre>
      ${AGENT_SETUP_HTML}
      <h2>Stdio setup</h2>
      <p>For Claude Desktop on Windows, download and open <a href="${GITHUB_URL}/releases/download/${VERSION}/uoink-${VERSION_NUMBER}.mcpb">uoink-${VERSION_NUMBER}.mcpb</a> for one-click Claude Desktop setup. Enter your full Uoink folder path when asked. After updating, reinstall the bundle and restart Desktop.</p>
      <p>Stdio works without the Uoink helper running. Start Uoink from the Start menu for the dashboard, browser button, and monitored-playlist polling.</p>
      <h3>Claude Code</h3>
      <p>Run this in PowerShell to use absolute paths. Verified with Claude Code 2.1.302:</p>
      <pre class="code-block">${escapeHtml(CLAUDE_CODE_COMMAND)}</pre>
      <h3>Cursor</h3>
      <p>Cursor is reported to send only the first 40 tools to its agent. Set <code>UOINK_MCP_TOOLSET=core</code> in the server environment to keep the previous 35-tool set and stay under that cap:</p>
      <pre class="code-block">${escapeHtml(MCP_CURSOR_CONFIG)}</pre>
      <h3>Other stdio clients and manual Claude Desktop config</h3>
      <pre class="code-block">${escapeHtml(MCP_STDIO_CONFIG)}</pre>
      <p>Replace <code>%LOCALAPPDATA%</code> in both paths with your full local app-data directory. Claude Desktop does not expand it. You can also copy the generated config from the extension's Settings page. Restart your client after saving. Cline and Continue were not individually smoke-tested.</p>
      <p>ChatGPT and claude.ai use copy and paste. Uoink does not connect to the ChatGPT app over MCP.</p>
      <p>HTTP uses <code>X-Uoink-Token</code> from <code>%LOCALAPPDATA%\\Uoink\\token.txt</code>. The OpenAPI 3.1 bridge is for local agents that do not speak MCP.</p>
      <p>HTTP MCP uses the same flattened tool schemas as stdio, so HTTP clients no longer drop Uoink's tools because of their schema shape. The server still checks the exact schema for every call.</p>
      <h2 id="tools">Tools</h2>
      <p>${MCP_STDIO_TOOL_COUNT} tools over stdio and ${MCP_TOOL_COUNT} in the HTTP registry below. Every tool is available on both transports. Consent gates are unchanged.</p>
      ${toolRows(true)}
      <h2>Canonical config note</h2>
      <p>Use the generated local paths. After install, Uoink's setup page generates the real config for the user's machine. Snippets on the website are templates for humans and crawlers.</p>
      <div class="ctas"><a class="btn primary" href="/developers">Human setup page</a><a class="btn ghost" href="/mcp/manifest.json">Raw manifest JSON</a></div>
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
      <aside class="facts" aria-label="Project posture">
        <p class="facts-head"><span>project posture</span><span>public facts</span></p>
        <dl class="facts-list">
          <div><dt>license</dt><dd>MIT<small>source: github.com/ryanbiddy/uoink</small></dd></div>
          <div><dt>tracking</dt><dd>none from Uoink unless you opt in<small>Vercel Web Analytics only; cookieless pageviews</small></dd></div>
          <div><dt>platform</dt><dd>${PRODUCT_STATUS.mac.aboutPlatform}<small>${PRODUCT_STATUS.mac.aboutNote}</small></dd></div>
        </dl>
      </aside>
    </div>
  </div>
</section>
<section class="section" data-screen-label="about / why">
  <div class="container">
    <div class="doc">
      <div class="doc-head">
        <span class="eyebrow">why this exists</span>
        <h2 class="display-l">The corpus belongs on <em>your machine.</em></h2>
        <p class="lede">Uoink exists because useful videos should become durable working material: timestamped words, frames, comments, metadata, and citations that your model can actually use.</p>
      </div>
      <ol class="doc-list numbered">
        <li><span class="num">01</span><h3>Local-first.</h3><p>No Uoink account, no hosted corpus, no product database full of your research.</p></li>
        <li><span class="num">02</span><h3>Open source.</h3><p>The helper, extension, and agent surface are inspectable. If the work matters, you should be able to audit the tool.</p></li>
        <li><span class="num">03</span><h3>Agent-readable.</h3><p>The site exposes /llms.txt and /mcp/manifest.json so agents can find the real integration surface.</p></li>
      </ol>
    </div>
  </div>
</section>`,
  },
  privacy: {
    id: "privacy",
    route: "/privacy",
    mode: "mode-light",
    title: "Local-First Privacy: Network Calls and Controls",
    description:
      "Uoink stores your corpus locally with no hosted corpus database. Optional Anthropic calls and ScrapeCreators discovery use your own keys with your permission.",
    keywords: ["uoink privacy", "local-first youtube extractor", "opt-in telemetry youtube tool", "byo key youtube ai"],
    faq: privacyFaq,
    html: `
<section class="section" data-screen-label="privacy / main"><div class="container"><article class="article"><div class="meta"><span>privacy</span><span>local-first</span></div><h1>Your corpus lives on your <em>machine.</em></h1><p class="standfirst">Uoink extracts video and podcast content, stores it on your disk, and hands it to the AI you choose. There is no Uoink cloud because we never built one.</p><h2>What Uoink does.</h2><p>Uoink captures transcripts, screenshots, comments, channel context, podcast transcripts, metadata, and local indexes. It writes those artifacts into normal local files and a local SQLite index. You can paste the corpus into Claude or ChatGPT, or let an MCP agent read it directly.</p><h2>What Uoink skips.</h2><p>No account or Uoink-hosted corpus. Local storage does not make every operation offline; model dependencies can send telemetry.</p><h3>Website analytics vs. local app privacy</h3><p>The public marketing website (<code>uoink.app</code>) uses Vercel Analytics to count page visits and help us see how people find the installer. This integration does not send your local captures, library, settings, or API keys. The desktop helper sends no Uoink analytics or crash reports unless you turn on anonymous usage counts, described next. Model-library telemetry is separate.</p><h3>Anonymous usage counts (off by default)</h3><p>Uoink sends nothing about how you use it unless you turn on <strong>Share anonymous usage counts</strong> in Settings. When it is on, the helper sends at most one report a day to <code>usage.uoink.app</code> with: a random install ID and report ID, the app version, your OS family, major version and processor type, the install type, the hours the report covers, and counts of MCP tool calls by tool name and by stdio or HTTP, AI apps connected (from a fixed list of names, anything else counted as other), captures by source type and whether they succeeded, and searches. It never sends content, URLs, titles, file paths, search text, prompts, API keys or account details.</p><p>Settings shows the exact report before it is sent and the last 10 reports sent. Turning sharing off stops reports and deletes the install ID and the counts on your PC. The receiver stores only daily totals, keeps no raw reports, and does not store IP addresses; like any web request, the connection exposes your IP address to the hosting provider.</p><h3>Update checks</h3><p>The release-check endpoint queries <code>api.github.com</code> when its cache needs refreshing or a caller forces a check. It sends no library payload and does not install an update. Like other internet requests, it exposes connection metadata such as your IP address.</p><h2>Where your data lives.</h2><p>On Windows, the helper lives under <code>%LOCALAPPDATA%\\Uoink</code>. Captures write into your chosen library folder, normally on your Windows Desktop. Windows can redirect that folder to OneDrive; upgrades can retain an older Yoink output folder. Settings, the index, jobs and subscription records normally live under the local app-data folder. Logs can contain source URLs, paths and capture details. Optional Anthropic and ScrapeCreators keys are stored in Windows Credential Manager.</p><p>On a Mac (the Apple Silicon preview, from 3.11.2), Uoink keeps the same items in macOS locations: captures, including the <code>_yoink-trash</code> folder, in <code>~/Desktop/Uoink/</code>; the library index, settings, helper state, discovery runs, optional usage counts and the extension copy in <code>~/Library/Application Support/Uoink/</code>; the Anthropic and ScrapeCreators keys in the macOS Keychain, under the same service and usernames as on Windows; and login-startup logs in <code>~/Library/Logs/Uoink/</code>.</p><h2>Network calls Uoink makes.</h2><p>Extraction calls go to the source you asked for: YouTube, X, RSS hosts, or another supported URL. Enabled podcast, YouTube channel and playlist subscriptions poll while the helper runs, even with automatic capture off. Connected agents can register subscriptions. Automatic capture starts off for a new source; enabling it permits eligible captures within its limits. Podcast auto-ingest does not approve downloading a missing Whisper model. X text extraction attempts a full-text supplement through FxTwitter using the post ID, even when the post was not identified as truncated; it has no separate prompt. Source delivery hosts and redirects can receive requests too. Queued work can retry. Optional AI calls use your own Anthropic key. Entity extraction is opt-in and off by default; the model-usage meter reports real usage.</p><p>Connected agents can start paid Anthropic calls with your saved key when you allow those actions, even when automatic analysis is off. Comment and hook analysis, writing, and research generation can send relevant library text, comments, metadata, and saved discovery results to Anthropic; repurposing can also send active writing style anchors. Hook classification can send up to eight saved corrections, including the same video’s past corrections. It prioritizes the same channel, then topic, then recent corrections. Writing generation can include all active style anchors unless you select particular anchors. Local MCP playbook packets make no model call. Key removal has limits: Uoink attempts to delete the current Anthropic credential, but can still fall back to a legacy Yoink credential, and deletion failures can go unreported. Older plaintext keys can remain if migration failed. Check Windows Credential Manager and the active profile settings when removing a key; revoke it at Anthropic to invalidate it. Disconnect an agent in its client to end that client’s access. Nothing is proxied through Uoink.</p><h3>Connections without a new capture</h3><p>Extension setup screens and saved-item previews can load YouTube thumbnails, exposing the video ID and connection metadata. After successfully copying a completed capture, the extension opens <code>claude.ai/new</code> even without an API key or automatic AI analysis. There is no setting to disable that tab. Opening it contacts Anthropic’s website; it does not paste the capture or put the capture in the URL. You decide whether to paste and submit it.</p><h3>Local transcription and model telemetry</h3><p>Audio transcription runs locally. A missing Whisper model requires a per-request download-approval flag; a connected agent can set that flag without showing a Uoink prompt. The reliability checker has a separate model-download action and can fetch source audio again. Optional speaker labeling downloads <code>pyannote/speaker-diarization-community-1</code> from Hugging Face when needed and can send your Hugging Face token to <code>huggingface.co</code>. Supporting transcription and alignment models can also download from Hugging Face or PyTorch hosts, and language data from NLTK. A cached Whisper model does not make the whole runtime offline.</p><p>The pinned pyannote-audio 4.0.7 dependency enables metrics to <code>otel.pyannote.ai</code> by default. Its metrics include model or pipeline origin, library version, a random session identifier and, for pipeline runs, duration and speaker-count parameters. WhisperX uses pyannote for voice-activity detection even with speaker labeling off. Uoink provides no dashboard switch; the dependency supports setting <code>PYANNOTE_METRICS_ENABLED=false</code> in the helper’s environment.</p><h3>X text privacy controls</h3><p>X text capture is enabled by default. Setting <code>x_text_capture_enabled</code> to <code>false</code> in local settings stops both syndication and FxTwitter text requests. There is no dashboard or extension toggle, and <code>POST /settings</code> does not accept this field. Video capture is separate.</p><h3>Background capture controls</h3><p>Turning automatic capture off stops new automatic starts; already-started work may finish and polling continues. <strong>Stop Uoink</strong> stops the helper and polling until restart. Disable <strong>Autostart on login</strong> to prevent a restart at Windows login. There is no per-source polling-pause button in the dashboard or extension. The authenticated local API can archive a subscription through <code>POST /sources/archive</code>; legacy podcast and monitored-playlist enable controls cover only sources with those records.</p><h3>Copies and retention</h3><p>Connected clients, clipboard copies and exports can carry library content to other services. Corpus exports write under <code>_exports</code> in the output folder. Optional library and Obsidian mirrors create more local copies, which sync software can upload; the memory mirror includes <code>TASTE.md</code> and <code>USER.md</code>. The extension’s screenshot-interval preference uses browser sync storage.</p><p>Soft-deleted captures stay in the output folder’s trash until purged. Cleanup of items older than 30 days is attempted at startup and every 24 hours. Uninstall leaves captures, the index, settings and saved credentials; model caches and the helper token can remain. Edited <code>topics.json</code> routing rules are removed with the application, so save a copy first. Uninstall is not data erasure: retained files, trash, legacy folders, exports and mirrors need separate cleanup. Copies already shared have their own lifecycles.</p><h3>Uninstall on a Mac</h3><p>Close AI clients that use Uoink, then run <code>bash /Applications/Uoink.app/Contents/Resources/scripts/mac/uninstall.sh /Applications/Uoink.app --remove</code>. It removes the app and its login item and keeps your data. Then, if you want, delete <code>~/Library/Application Support/Uoink/</code> and <code>~/Desktop/Uoink/</code>, and the <code>Uoink</code> entries in Keychain Access.</p><h3>Optional ScrapeCreators discovery</h3><p>Discovery is off by default. Only after you enable it, add your own key, and authorize a request does Uoink send your typed creator handle, YouTube channel ID, or search query to ScrapeCreators. It sends no library text, transcripts, or comments. Paid calls require credit confirmation and either a dashboard intent or separately enabled agent discovery. The daily cap defaults to 25 credits; checking the balance may also use a credit. Picking saved candidates queues ordinary source captures without another ScrapeCreators call.</p><p>Local discovery run files store the typed handle, channel ID, or query; request identity (provider, endpoint, mode, platform, and fetch time); normalized candidates and metrics; credit accounting, daily cap, and coverage; queue state; and errors, including partial and failed runs. They contain no raw vendor responses, thumbnails, or API keys. The daily purge removes these run files once they are older than 90 days. Local playbooks may reuse eligible snapshots up to 30 days old.</p><h2>Open source: audit it yourself.</h2><p>The source is MIT-licensed at <a href="${GITHUB_URL}">github.com/ryanbiddy/uoink</a>. You can inspect the helper, loopback server, and network code.</p><div class="ctas"><a class="btn primary large" href="/install">Install Uoink</a><a class="btn ghost large" href="/terms">Read terms</a></div></article></div></section>
${DOC_RULE}
<section class="section" data-screen-label="privacy / faq"><div class="container"><div class="doc">${renderFaq(privacyFaq)}</div></div></section>`,
  },
  changelog: {
    id: "changelog",
    route: "/changelog",
    mode: "mode-dark",
    title: "Changelog: Version Updates and Universal Extraction",
    description:
      `Read Uoink release notes from 3.4 through ${VERSION_NUMBER}, including Living Library and research playbooks.`,
    keywords: ["uoink changelog", "uoink release notes", "uoink updates", "universal video uoink changelog"],
    html: `
<section class="section" data-screen-label="changelog / main"><div class="container"><article class="article"><div class="meta"><span>changelog</span><span>newest first</span></div><h1>Uoink <em>release notes.</em></h1><p class="standfirst">${VERSION_NUMBER} adds a Mac preview for Apple Silicon and stops one failed save from blocking every later save. Earlier releases are listed below, with dates from the product changelog.</p>
<h2>${VERSION}: Mac preview and steadier saves</h2><p class="meta"><time datetime="2026-10-25">2026-10-25</time></p>
${PRODUCT_STATUS.mac.changelog}
<p>A failed index write no longer wedges the helper. Before, a write that failed, for example on a duplicate folder name during the startup backfill, left its database transaction open, and every later save failed until a restart. Upserts, deletes and the other 22 older write paths now roll back their own failures.</p>
<p>Re-capturing an item saved by an older version refreshes it in place instead of creating a second folder. Duplicate folder names no longer fail the startup backfill; each is skipped with one warning, and <code>uoink doctor</code> lists them. Known items are not re-indexed on each start.</p>
<p>An MCP stdio request over 64 KiB, such as a long <code>uoink_note</code>, is refused with its own request ID, so the client no longer waits forever. Captions longer than the video are cut at the video's end, and YouTube's hard-space and censor markers are cleaned out of transcripts. The supervisor writes the helper's output to <code>helper-output.log</code> as it arrives.</p>
<p>The setup page, dashboard and extension popup know which system they run on and no longer say Windows-only things on a Mac. The extension no longer requests the unused youtu.be, mobile.twitter.com and localhost:5179 host permissions. The setup splash lists Chrome first and detects Comet; when a browser won't open its extensions page from the splash, Uoink copies the address and the steps say to paste it in the address bar.</p>
<p>The MCP server still exposes 91 tools, or 35 with <code>UOINK_MCP_TOOLSET=core</code>. The Windows installer is still unsigned, so SmartScreen warns. The Chrome Web Store listing is not live yet, so the extension still loads unpacked.</p>
${/* TODO(receipt 28): add "What was tested for 3.11.2" here when the 3.11.2 receipt lands. Until then no 3.11.2 test claims. */ ""}
<p>On Windows, reload the browser extension once after updating; Claude Desktop users should reinstall the 3.11.2 bundle and restart Desktop.</p>
<h2>v3.11.1: Saves that stick and better captures</h2><p class="meta"><time datetime="2026-10-25">2026-10-25</time></p>
<p>Caption-less X videos can now get a local Whisper transcript. The fallback previously received a video-only file and always failed. Uoink now checks for audio and downloads the source audio when needed. The fallback needs a Whisper model you have already downloaded in Settings. If the video has no audio, the saved note says <strong>No transcript:</strong> and explains why.</p>
<p>Built-in Readability-style article extraction keeps headings, lists, quotes, code, simple tables and links. Paywalls, login walls and empty pages are labeled failures. Saved X posts keep quote posts, media descriptors, expanded links and real counts, and disclose whether the text is complete, truncated or unknown.</p>
<p>Fixed 22 helper write paths for tags, claims, style anchors, allowed sites, channels, writing drafts, workspaces and more. These saves could report success, vanish when the helper closed, and leave the library locked for other apps. They now commit when the save succeeds.</p>
<p>A per-user scheduled task restarts the helper after a crash, up to three times in ten minutes. Quit stays quit until the next login or a manual start. Typing <code>127.0.0.1:5179</code> in a browser opens the dashboard instead of an error.</p>
<p>Tool and listing descriptions were rewritten. The MCP inventory remains 91 tools over stdio and 91 in the HTTP registry, with 35 in core mode.</p>
<h3>What was tested for 3.11.1</h3>
<p>Agent Install 27 passed 11/11 checks with the installed 3.11.1 build in an isolated profile: installation; <code>/health</code> at 3.11.1, migration 32; stdio with 91 full, 35 core and 91 modern tools; Claude Code 2.1.310 (haiku) connected with 91 tools and called <code>get_schema_version</code>; usage sharing off with no network sends observed in that check; the bundled ffprobe audio probe; no isolated startup entries; dashboard at 1400 and 1100 pixels wide; clean uninstall; helper writes persisted across a restart; and <code>GET /</code> redirected to <code>/dashboard</code>. Codex CLI was not re-tested in receipt 27. Earlier client results are documented in the <a href="/changelog/3-11-0">3.11.0</a> and <a href="/changelog/3-10-0">3.10.0</a> release notes.</p>
<p>This release was for Windows 10/11. The Mac preview followed in <a href="/changelog/3-11-2">3.11.2</a>.</p>
<p>Installing over the previous release keeps your library and saved captures. Reload the browser extension once; Claude Desktop users should reinstall the 3.11.1 bundle and restart Desktop.</p>
<h2>v3.11.0: Smarter search and MCP SDK 2.3.0</h2><p class="meta"><time datetime="2026-10-22">2026-10-22</time></p>
<p>Search no longer requires every word. It skips common words, matches the words that remain, and ranks sources with every word and exact titles first. In a test of 30 questions over 693 saved sources, keyword search now puts the right source in the top 5 for 24 questions; the old search found it for 10.</p>
<p>Optional semantic search finds passages with similar meaning even when the words differ. Turn it on in Settings under <strong>Semantic search</strong>. After you accept Google's Gemma terms, Uoink downloads the EmbeddingGemma model once (about 330 MB) and builds its index in the background. It runs on your computer, works offline after setup, and is never bundled with Uoink. In the same test, semantic search found the right source for 27 of 30 questions, and hybrid search, which combines both, found 28. Removing semantic search deletes the model and its index; keyword search keeps working.</p>
<p>Strict matching is still there: choose <strong>Exact words</strong> in the dashboard, or pass <code>match: "strict"</code> to a search tool. A result includes a quotable passage only when that passage really contains the match. Otherwise <code>passage_verified</code> is false and the result says why.</p>
<p>For agents, <code>search_library</code>, <code>search_uoinks</code>, and <code>search_clips</code> take optional <code>match</code> (<code>forgiving</code> or <code>strict</code>) and <code>mode</code> (<code>auto</code>, <code>keyword</code>, <code>semantic</code>, or <code>hybrid</code>) parameters; <code>find_mentions</code> takes <code>match</code>. Auto uses hybrid when semantic search is ready and keyword search otherwise, and each response says which mode ran. The MCP server still exposes 91 tools, or 35 with <code>UOINK_MCP_TOOLSET=core</code>. Updating rebuilds the local keyword search index once.</p>
<p>The MCP server now runs on the official MCP Python SDK 2.3.0. Claude Desktop, Claude Code, Cursor, and Codex keep connecting as before, and apps that speak the newer 2026-07-28 MCP protocol can connect too. No action is needed. The local HTTP endpoint keeps its existing behavior.</p>
<p><code>uoink connect</code> recipes and the client tables in <a href="${GITHUB_URL}/blob/main/docs/connect-your-agent.md">Connect your agent</a> now list a Linux location where the client has a Linux setup. Clients without a Linux build say so instead of printing another system's path. Continue is set up by hand; the dashboard now shows it as connected once its config launches this Uoink install. Claude Desktop, Cursor, and Cline also count as connected only when an entry launches this install, so an entry that points at an old or moved install shows Connect, which rewrites it and keeps a backup.</p>
<p><code>uoink connect --list</code> now has setup recipes for 48 clients and integrations, 10 more than 3.10.0. 45 are checked against each client's official documentation, and each recipe prints its verification status. Most recipes are not yet tested in the client itself.</p>
<p>Anonymous usage counts are off by default. If you turn on <strong>Share anonymous usage counts</strong> in Settings, Uoink sends at most one report a day: a random install ID and report ID, the app version, your OS family, major version and processor type, the install type, the hours covered, and counts of tool calls (by tool name and by stdio or HTTP), connected AI apps from a fixed list, captures by source type and result, and searches. It never sends content, URLs, titles, file paths, search text, prompts, or API keys. Settings shows the exact report before it is sent. See <a href="/privacy">Privacy</a> for details.</p>
<p>Tested with the installed 3.11.0 build in an isolated profile: Claude Code 2.1.308 listed all 91 tools and called one, and Codex CLI 0.153.4 called two tools.</p>
<p>Installing over the previous release keeps your library and saved captures.</p>
<h2>v3.10.0: Use Uoink from any AI agent</h2><p class="meta"><time datetime="2026-10-19">2026-10-19</time></p>
<p>The <code>uoink</code> command lets agents search saved sources, read evidence, capture URLs, save notes, and call registry tools from a shell:</p>
<pre class="code-block">uoink search "working memory" --limit 5
uoink recent --limit 10
uoink note "A useful thought" --title "Research note"</pre>
<p>Local reads work without the helper running. Capture and paid tools keep their existing gates. The installer leaves <strong>Add the uoink command to PATH for AI agents</strong> checked by default. Open a new terminal after installing, then run <code>uoink status</code>.</p>
<p>The portable Uoink skill covers Claude Code, Codex, pi, Hermes Agent, and OpenClaw. Find it with <code>uoink skill path</code> or copy it with its references using <code>uoink skill install --to &lt;dir&gt;</code>. The Claude Code plugin marketplace bundles the skill and MCP connection for a default install:</p>
<pre class="code-block">claude plugin marketplace add ryanbiddy/uoink-agent-kit
claude plugin install uoink@uoink</pre>
<p><code>uoink connect --list</code> lists setup recipes for 38 clients and integrations. Run <code>uoink connect &lt;client&gt;</code> for config or instructions and their destination. It does not edit client settings. The dashboard's <strong>Add to Cursor</strong> and <strong>Add to VS Code</strong> buttons open the client's review flow.</p>
<p>The MCP server still exposes 91 tools by default. Consent gates are unchanged. There are no data or settings changes besides the optional PATH entry, and no new index or migration. Installing over the previous release keeps your library and saved captures.</p>
<p>Tested on a clean, isolated install: Claude Code 2.1.302 over MCP (all 91 tools listed; a note saved and listed back), Claude Code with the skill and CLI only (skill loaded; <code>uoink note</code> and <code>uoink recent</code> ran), Codex CLI 0.153.4 over MCP (a note saved and listed back), and the CLI's <code>status</code>, <code>note</code>, <code>recent</code>, and <code>connect</code> commands.</p>
<p>The Claude Code plugin loads its skill and starts its MCP server. Its tool calls were not run end to end because the test install is isolated from a normal one. Not yet tested: Gemini CLI and pi (no sign-in on the test machine) and every other recipe in <code>uoink connect</code>.</p>
<p>See <a href="/developers">agent setup</a>, <a href="${GITHUB_URL}/blob/main/docs/connect-your-agent.md">Connect your agent</a>, and the <a href="${GITHUB_URL}/blob/main/llms-install.md">agent installation steps</a>.</p>
<h2>v3.9.3: MCP registry listing and HTTP tool fix</h2><p class="meta"><time datetime="2026-10-19">2026-10-19</time></p><p>Uoink is now listed in the official MCP registry as <code>io.github.ryanbiddy/uoink</code>. Clients and directories that read the registry can find it.</p>
<p>HTTP MCP now uses the same flattened tool schemas as stdio, so HTTP clients no longer drop Uoink's tools because of their schema shape. The server still checks the exact schema for every call.</p>
<p>Activity reads are faster on large libraries. Median read time fell from 461 to 286 ms at 10,000 items in local runs. This release makes no data or settings changes. Installing over 3.9.2 keeps your library and saved captures.</p>
<h2>v3.9.2: Every tool on the standard connection</h2><p class="meta"><time datetime="2026-10-18">2026-10-18</time></p><p>Every Uoink tool is now available through the standard stdio connection used by Claude Desktop (.mcpb), Claude Code, and Cursor: 91 tools over stdio and 91 in the HTTP registry. Agents can capture pages, X posts, Reddit threads, notes, and images; use writing, script, and workspace tools; and work with sources and the Library queue.</p>
<p><code>UOINK_MCP_TOOLSET=core</code> keeps the previous 35-tool set for clients that cap tool counts. Full mode is the default and keeps those tools first. Consent gates are unchanged. This release makes no data or settings changes. Installing over 3.9.1 keeps your library and saved captures.</p>
<h2>v3.9.1 — Writing warnings and reliability</h2><p class="meta"><time datetime="2026-10-18">2026-10-18</time></p><p>Writing checks now say “canned-phrase warnings”. Voice DNA remains the voice spec’s name. This patch includes reliability and test fixes, with no data or settings changes. Installing over 3.9.0 keeps your library and saved captures.</p>
<h2>v3.9.0 — Living Library and research</h2><p class="meta">First public release since v3.7.0</p><p>The 3.8.x work was not published separately. Clip search and evidence cards join everyday stdio MCP. Standing capture follows YouTube channels, playlists, and podcast RSS feeds; MCP library search, item reads, resource templates, and prompts make the library easier to cite. Cited range export carries speaker labels, chapters, and provenance, with chapter navigation where chapters exist. Captures now show a toast instead of opening Explorer. Entity extraction is opt-in, the Anthropic usage meter reports real usage, and the recall hook is hardened against prompt injection from captured text.</p>
<p>Podcast feeds poll for new episode metadata; audio stays off until you enable Auto-ingest for a feed. Local transcription jobs survive restarts, and completed episodes enter the searchable corpus. Notifications can be silenced and are suppressed during fullscreen use without losing Activity history.</p>
<p>The redesigned dashboard puts search-or-paste in Library and opens saved captures in Reader. Activity shows five steps: details, waiting for YouTube, video, transcript, and screenshots and save. Settings brings preferences into one page and saves individual changes automatically. The extension popup keeps capture at hand, with setup and connection controls available.</p>
<p>Five local research playbooks cover outlier posts, transcript intelligence, comment mining, creator teardowns, and repurposing over your own library. MCP agents can request cited packets without a model or network call. That release had 35 stdio tools and 91 HTTP tools. Optional ScrapeCreators discovery is off by default, uses your own key, and has a default 25-credit daily cap. Paid calls need credit confirmation and a dashboard intent or separately enabled agent discovery.</p>
<p>YouTube caption rate limits no longer fail a capture: Uoink tries local transcription with an already-downloaded model when fallback is enabled, and labels a missing transcript when it cannot produce one. Paced requests and newer yt-dlp improve capture reliability. Waiting, failures, and cancellation remain distinct; a cancellation request is refused once publication has started.</p>
<p>Extension token minting checks the pinned extension ID (or an ID you explicitly configure), and in-page capture buttons reject scripted clicks. Private-network fetch protection now covers feed polls, standard page fetches, thumbnails, and checked redirect chains. Requests inside yt-dlp and the browser renderer are outside that protection. Returned and stored job errors scrub local paths and credentials; the local diagnostic log can retain raw tool output. Corpus imports accept only files inside the active output folder’s <code>_exports</code> directory.</p>
<h2>v3.7.0</h2><p class="meta"><time datetime="2026-07-24">2026-07-24</time></p><p>Library cards and filters became quieter, Sources put available captures first, and saved items gained a clearer action menu. Updated video extraction and stricter URL, schema, and path checks hardened capture and local integrations; MCP initialization began reporting the product version.</p>
<h2>v3.6.0</h2><p class="meta"><time datetime="2026-07-08">2026-07-08</time></p><p>Added local notes, short-video capture for TikTok, Reels, and Shorts, and image capture as library items. Each entered the shared corpus with source filters; image search used captions, filenames, and source metadata, with OCR deferred.</p>
<h2>v3.5.0</h2><p class="meta"><time datetime="2026-07-08">2026-07-08</time></p><p>Made the Library source-first with platform, source-type, and author filters, readable folders, and searchable author information. X Article detection became consistent across capture entry points, with clearer messages when X blocked a fetch.</p>
<h2>v3.4.1</h2><p class="meta"><time datetime="2026-07-07">2026-07-07</time></p><p>Pinned the extension popup’s primary capture action so it stayed reachable while secondary panels scrolled. Enlarged source and screenshot thumbnails in Generate and gave text sources an explicit no-preview tile.</p>
<h2>v3.4.0</h2><p class="meta"><time datetime="2026-07-07">2026-07-07</time></p><p>Added X Article capture from the rendered, logged-in page and clearer failures for blocked link fetches. Activity messages better explained X posts without downloadable video, and saved-item action buttons wrapped to stay reachable on smaller displays.</p>
<div class="ctas"><a class="btn primary large" href="${GITHUB_URL}/releases/tag/${VERSION}">${VERSION_NUMBER} release notes</a><a class="btn ghost large" href="${RELEASE_URL}">Latest GitHub release</a></div></article></div></section>`,
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
<section class="section" data-screen-label="terms / main"><div class="container"><article class="article"><div class="meta"><span>terms</span><span>short by design</span></div><h1>Terms of <em>use.</em></h1><p class="standfirst">Uoink is local, open-source software. These terms are intentionally short.</p><h2>The software is MIT-licensed.</h2><p>Uoink source is published at <a href="${GITHUB_URL}">github.com/ryanbiddy/uoink</a> under the MIT License. The license grants broad permission to use, copy, modify, merge, publish, distribute, sublicense, and sell copies, subject to the license notice.</p><h2>No warranty.</h2><p>The software is provided as-is, without warranty of any kind. Use it at your own discretion and keep backups of work you care about.</p><h2>Your responsibility.</h2><p><strong>Uoink is designed and built for personal research and study.</strong> You are solely responsible for ensuring that your use of video, podcast, transcript, screenshot, and comment material captured with Uoink complies with the Terms of Service, copyright policies, and API guidelines of YouTube, Reddit, X (Twitter), and any other source platforms. Uoink does not host, share, or claim any ownership rights over third-party media.</p><h2>Trademark and brand.</h2><p>Uoink is Ryan Biddy's product name and mark. Avoid impersonating the project or representing unofficial builds as official.</p><h2>Contact.</h2><p>Email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> or follow <a href="${X_URL}">${X_HANDLE}</a> for terms, trademark, or abuse concerns.</p><div class="ctas"><a class="btn primary large" href="/install">Install Uoink</a><a class="btn ghost large" href="/privacy">Privacy policy</a></div></article></div></section>`,
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
        <p style="font-size:14px;color:var(--parchment-dim);margin-bottom:12px"><strong>How it lands:</strong> Transcribes audio into text on your machine with WhisperX. Optional speaker diarization (separating guest and host) needs your own Hugging Face token.</p>
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
      "Connect Uoink to Claude Desktop, Claude Code, and Cursor using Model Context Protocol. Run loopback tools to query transcripts locally.",
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
      <h1 class="display-xl">Use Uoink from any <em>AI agent.</em></h1>
      <p class="lede">Uoink runs a local Model Context Protocol (MCP) server on your machine. Give Claude Desktop, Claude Code, and Cursor tools to capture, index, and query web media without clipboard steps.</p>
    </div>
  </div>
</section>

<section class="section" data-screen-label="developers / integration">
  <div class="container" style="max-width:80ch">
    ${AGENT_SETUP_HTML}
    <h2 class="display-l" style="margin-bottom:24px">Standard stdio & HTTP <em>transports.</em></h2>
    <p class="body-l" style="margin-bottom:32px">The helper exposes ${MCP_STDIO_TOOL_COUNT} tools over stdio and ${MCP_TOOL_COUNT} over local HTTP. Capture fetches the source; optional AI calls use your own Anthropic key.</p>

      <p>For Claude Desktop on Windows, download and open <a href="${GITHUB_URL}/releases/download/${VERSION}/uoink-${VERSION_NUMBER}.mcpb">uoink-${VERSION_NUMBER}.mcpb</a> for one-click Claude Desktop setup. Enter your full Uoink folder path when asked. After updating, reinstall the bundle and restart Desktop.</p>
      <p>Stdio works without the Uoink helper running. Start Uoink from the Start menu for the dashboard, browser button, and monitored-playlist polling.</p>
      <h3>Claude Code</h3>
      <p>Run this in PowerShell to use absolute paths. Verified with Claude Code 2.1.302:</p>
      <pre class="code-block">${escapeHtml(CLAUDE_CODE_COMMAND)}</pre>
      <h3>Cursor</h3>
      <p>Cursor is reported to send only the first 40 tools to its agent. Set <code>UOINK_MCP_TOOLSET=core</code> in the server environment to keep the previous 35-tool set and stay under that cap:</p>
      <pre class="code-block">${escapeHtml(MCP_CURSOR_CONFIG)}</pre>
      <h3>Other stdio clients and manual Claude Desktop config</h3>
      <pre class="code-block">${escapeHtml(MCP_STDIO_CONFIG)}</pre>
      <p>Replace <code>%LOCALAPPDATA%</code> in both paths with your full local app-data directory. Claude Desktop does not expand it. You can also copy the generated config from the extension's Settings page. Restart your client after saving. Cline and Continue were not individually smoke-tested.</p>
      <p>ChatGPT and claude.ai use copy and paste. Uoink does not connect to the ChatGPT app over MCP.</p>

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

function docItems(items: [string, string][]): string {
  return items.map(([title, body]) => `<li><h3>${title}</h3><p>${body}</p></li>`).join("");
}

function toolRows(linkTools = false): string {
  return mcpTools
    .map(
      ([name, description]) =>
        `<div class="tool-row"><div class="name">${linkTools ? `<a style="text-decoration:underline;text-underline-offset:3px" href="/mcp/tools/${escapeHtml(name)}">${escapeHtml(name)}</a>` : escapeHtml(name)}<span class="args">Available over stdio and HTTP</span></div><div class="desc">${escapeHtml(description)}<span class="ex">See /mcp/manifest.json for machine-readable schema.</span></div></div>`,
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

// Same markup as FaqList in app/components/Doc.tsx: question and answer on
// the reading column, one hairline row each.
function renderFaq(items: FaqItem[]): string {
  return `<ul class="doc-list">${items
    .map((item) => `<li><h3>${item.question}</h3><p>${item.answer}</p></li>`)
    .join("")}</ul>`;
}

function aliasPage(id: PageId, route: string, title: string, description: string, target: string): SitePage {
  return {
    id,
    route,
    mode: "mode-light",
    title,
    description,
    keywords: [],
    html: `<section class="section" data-screen-label="${id} / moved"><div class="container"><article class="article"><h1>${title}</h1><p class="standfirst">${description}</p><div class="ctas"><a class="btn primary large" href="${target}">Go to the current page</a><a class="btn ghost large" href="/install">Install Uoink</a></div></article></div></section>`,
  };
}

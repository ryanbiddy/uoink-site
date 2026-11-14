import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { PhoneBlock } from "../components/PhoneBlock";
import { CHROME_STORE_URL, NPX_COMMAND, PHONE_INBOX_ENABLED } from "../content/phone";
import {
  WINDOWS_GET_URL,
  WINDOWS_MCPB_GET_URL,
  GITHUB_URL,
  INSTALLER_SIZE,
  MAC_MARK,
  RELEASE_URL,
  VERSION,
  VERSION_NUMBER,
  WINDOWS_MARK,
  pages,
} from "../content/pages";
import { MAC_DMG_NAME, MAC_DMG_SIZE, MAC_DMG_GET_URL, MAC_EXTENSION_PATH, MAC_MCPB_GET_URL, PRODUCT_STATUS } from "../content/product-status";
import { InstallHero, type HeroOption } from "./InstallHero";
import "./install.css";

// /install: the download page. An app-icon hero with one button that matches the
// visitor's OS, a framed look at the app, one card per platform, three setup
// steps, how to connect an AI, and the update and trust facts. Every version,
// size and link comes from content/release.json through pages.ts and
// product-status.ts, the same constants the rest of the site uses.

const page = pages.install;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "The Uoink dashboard: a populated local corpus of saved videos ready to hand to your AI." }] },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
};

const WINDOWS_MCPB_NAME = `uoink-${VERSION_NUMBER}.mcpb`;
const LINUX_DOCS_URL = `${GITHUB_URL}/blob/${VERSION}/docs/linux.md`;
const AGENT_INSTALL_URL = `${GITHUB_URL}/blob/main/llms-install.md`;

const heroOptions: Record<"windows" | "mac" | "linux", HeroOption> = {
  windows: {
    label: "Download for Windows",
    href: WINDOWS_GET_URL,
    markHtml: WINDOWS_MARK,
    meta: [VERSION, PRODUCT_STATUS.mac.windowsLabel, `about ${INSTALLER_SIZE}`, "No admin rights"],
  },
  mac: {
    label: "Download for Mac",
    href: MAC_DMG_GET_URL,
    markHtml: MAC_MARK,
    meta: [VERSION, "Apple Silicon", "macOS 15 or later", `about ${MAC_DMG_SIZE}`, "Signed and notarized", "Preview"],
  },
  linux: {
    label: "Set up on Linux",
    href: "#linux",
    meta: [VERSION, "Headless", "For agents and sandboxes"],
  },
};

function Mark({ html }: { html: string }) {
  return <span className="ip-mark" dangerouslySetInnerHTML={{ __html: html }} />;
}

const DOWNLOAD_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const U_PATH = "M 0 0 L 32 0 L 32 60 L 68 60 L 68 0 L 100 0 L 100 80 Q 100 100 80 100 L 20 100 Q 0 100 0 80 Z";

function UMark({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={U_PATH} fill="currentColor" />
    </svg>
  );
}

export default function Page() {
  return (
    <PageShell page={page}>
      <div className="ip">
        {/* 1. Hero */}
        <section className="ip-hero" data-screen-label="install / hero" aria-labelledby="ip-title">
          <img className="ip-icon" src="/assets/icon-512.png" width={120} height={120} alt="" decoding="async" />
          <h1 id="ip-title" className="ip-title">Download Uoink</h1>
          <p className="ip-lede">
            Save videos, podcasts and posts to a library on your computer. Your AI searches it and cites the minute.
          </p>
          <div className="desktop-only">
            <InstallHero options={heroOptions} />
          </div>
          <PhoneBlock />
          <p className="ip-other desktop-only">
            <a href="#platforms">Other platforms</a>
            <span aria-hidden="true">·</span>
            <a href={RELEASE_URL}>GitHub release</a>
          </p>
          {/* Hidden by content/flags.json until the owner turns them on. */}
          {CHROME_STORE_URL ? (
            <p className="flag-row desktop-only" data-flag-chrome>
              <a className="btn ghost" href={CHROME_STORE_URL}>Add to Chrome</a>
              <span>Edge, Brave, Arc, Opera and Vivaldi install from the Chrome Web Store too.</span>
            </p>
          ) : null}
          {NPX_COMMAND ? (
            <p className="flag-row desktop-only" data-flag-npx>
              <span>Install from your terminal:</span>
              <code>{NPX_COMMAND}</code>
            </p>
          ) : null}

          <figure className="ip-shot">
            <div className="ip-window">
              <div className="ip-titlebar" aria-hidden="true">
                <span className="ip-dots"><i /><i /><i /></span>
                <span className="ip-wintitle">Uoink</span>
                <span className="ip-dots-spacer" />
              </div>
              <img
                src="/product/app-library-dark.webp"
                width={1440}
                height={900}
                decoding="async"
                alt="The Uoink app in dark mode: a library of saved videos, podcasts and posts on your computer, with search and filters."
              />
            </div>
          </figure>
        </section>

        {/* 2. Platforms */}
        <section className="ip-section desktop-only" id="platforms" data-screen-label="install / platforms" aria-labelledby="ip-platforms-title">
          <h2 id="ip-platforms-title" className="ip-h2">Pick your computer</h2>
          <p className="ip-sub">{PRODUCT_STATUS.mac.visible}</p>
          <div className="ip-cards">
            <article className="ip-card" id="windows">
              <header className="ip-card-head">
                <Mark html={WINDOWS_MARK} />
                <h3>Windows</h3>
              </header>
              <p className="ip-card-meta">{`${PRODUCT_STATUS.mac.windowsLabel} · about ${INSTALLER_SIZE}`}</p>
              <p className="ip-card-status">Unsigned installer. SmartScreen asks first.</p>
              <div className="ip-card-actions">
                <a className="btn primary with-logo" href={WINDOWS_GET_URL}>{DOWNLOAD_ICON}Download for Windows</a>
                <a className="ip-sha" href={RELEASE_URL}>SHA-256</a>
              </div>
            </article>

            <article className="ip-card" id="mac">
              <header className="ip-card-head">
                <Mark html={MAC_MARK} />
                <h3>Mac</h3>
                <span className="ip-badge">Preview</span>
              </header>
              <p className="ip-card-meta">Apple Silicon · macOS 15 or later</p>
              <p className="ip-card-status">{`Signed and notarized disk image, about ${MAC_DMG_SIZE}. Intel Macs are not supported.`}</p>
              <div className="ip-card-actions">
                <a className="btn primary with-logo" href={MAC_DMG_GET_URL}>{DOWNLOAD_ICON}Download for Mac</a>
                <a className="ip-sha" href={RELEASE_URL}>SHA-256</a>
              </div>
            </article>

            <article className="ip-card" id="linux">
              <header className="ip-card-head">
                <h3>Linux</h3>
                <span className="ip-badge ip-badge-quiet">Headless</span>
              </header>
              <p className="ip-card-meta">For agents in Docker, Codespaces and sandboxes</p>
              <pre className="code-block ip-cmd" tabIndex={0}>{`git clone --branch ${VERSION} --depth 1 https://github.com/ryanbiddy/uoink
sh uoink/scripts/linux/install.sh
export PATH="$HOME/.local/bin:$PATH"
uoink mcp`}</pre>
              <p className="ip-card-status">Needs Git, Python 3.11 or newer, ffmpeg and ffprobe.</p>
              <details className="ip-mini">
                <summary>More about Linux</summary>
                <p>You need Git, Python 3.11 or newer, venv support, ffmpeg and ffprobe. Linux has no tray, splash or dashboard window; the helper serves the dashboard at its local URL. The installer stages the pinned Whisper base model. YouTube can block cloud IPs.</p>
              </details>
              <div className="ip-card-actions">
                <a className="btn ghost" href={LINUX_DOCS_URL}>Linux guide</a>
              </div>
            </article>
          </div>
        </section>

        {/* 3. Setup in three steps */}
        <section className="ip-section" id="setup" data-screen-label="install / setup" aria-labelledby="ip-setup-title">
          <h2 id="ip-setup-title" className="ip-h2">Set up in three steps</h2>
          <p className="ip-sub">Windows and Mac include the Chrome button. No command line needed.</p>
          <ol className="ip-steps">
            <li className="ip-step">
              <div className="ip-art" aria-hidden="true">
                <span className="ip-art-icon"><img src="/assets/icon-192.png" width={44} height={44} alt="" /></span>
                <span className="ip-art-bar"><i /></span>
              </div>
              <h3>Install the app</h3>
              <p>On Windows, run the installer and press Install. On a Mac, open the disk image and drag Uoink onto Applications. The helper bundles Python, yt-dlp and ffmpeg and does the work on your computer.</p>
            </li>
            <li className="ip-step">
              <div className="ip-art" aria-hidden="true">
                <span className="ip-art-toolbar"><i /><i /><b><UMark size={13} /></b></span>
              </div>
              <h3>Add the Chrome button</h3>
              <p>Load the extension once, then pin Uoink so its button stays visible. The details are just below.</p>
            </li>
            <li className="ip-step">
              <div className="ip-art" aria-hidden="true">
                <span className="ip-art-video"><i /></span>
                <span className="ip-art-pill"><em /><UMark size={11} />Uoink</span>
              </div>
              <h3>Click Uoink on a video</h3>
              <p>Uoink saves X posts and videos, podcasts, Reddit threads and web articles too. <Link href="/sources">Sources</Link> shows how to save each one.</p>
            </li>
          </ol>

          <div className="ip-disclosures">
            <details className="ip-details desktop-only" id="windows-steps">
              <summary><Mark html={WINDOWS_MARK} />Windows steps</summary>
              <div className="ip-details-body">
                <p>The helper installs to <code>%LOCALAPPDATA%\Uoink</code> and runs in user space. No admin rights needed. Along with Python, yt-dlp and ffmpeg, it includes SQLite, the local MCP server and the uoink command.</p>
                <ol>
                  <li>Download <a href={WINDOWS_GET_URL}>Uoink-Setup-{VERSION_NUMBER}.exe</a>. The <a href={RELEASE_URL}>release page</a> lists its SHA-256.</li>
                  <li>Run it. The installer is unsigned. Windows SmartScreen will show a warning. Choose <strong>More info → Run anyway</strong>.</li>
                  <li>Setup opens on one screen. Press <strong>Install</strong>. To pick the install folder, the desktop shortcut or the PATH option for AI agents, tick <strong>Choose the install folder and shortcuts</strong> first.</li>
                  <li>Load the extension. In Chrome, open <code>chrome://extensions</code>, turn on <strong>Developer mode</strong> and click <strong>Load unpacked</strong>. Select the <code>%LOCALAPPDATA%\Uoink\extension</code> folder.</li>
                  <li>Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible.</li>
                </ol>
              </div>
            </details>

            <details className="ip-details desktop-only" id="mac-steps">
              <summary><Mark html={MAC_MARK} />Mac steps</summary>
              <div className="ip-details-body">
                <p>The Mac build runs on Apple Silicon Macs with macOS 15 or later. Intel Macs are not supported. The app and the DMG are signed with a Developer ID, notarized by Apple and stapled, so macOS asks only its standard question about apps downloaded from the internet. No security override is needed.</p>
                <ol>
                  <li>Download <a href={MAC_DMG_GET_URL}>{MAC_DMG_NAME}</a>. The release page lists its SHA-256.</li>
                  <li>Open the DMG. A window shows Uoink, an arrow and Applications. Drag Uoink onto Applications.</li>
                  <li>Eject the disk, then open Uoink from Applications and confirm the &quot;downloaded from the internet&quot; prompt.</li>
                  <li>Load the extension. Open Uoink once so it creates the extension folder. In Chrome, open <code>chrome://extensions</code>, turn on <strong>Developer mode</strong> and click <strong>Load unpacked</strong>. The picker hides <code>~/Library</code>, so press ⌘⇧G, paste the path that the dashboard&apos;s <strong>Get the extension</strong> card copies (<code>{MAC_EXTENSION_PATH}</code>) and press Return.</li>
                  <li>Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible.</li>
                </ol>
                <p>If macOS reports an unidentified developer, a damaged app or malware instead, don&apos;t open it. Report it with the DMG&apos;s SHA-256.</p>
                <p>On an older version than 3.15.1, install this DMG the usual way. Quit Uoink and close MCP clients before replacing the app. Library mirroring is unavailable. macOS still credits Uoink&apos;s alerts to Script Editor.</p>
              </div>
            </details>

            <details className="ip-details" id="extension">
              <summary>About the Chrome button</summary>
              <div className="ip-details-body">
                <p>Chrome is tested. Other Chromium browsers such as Edge and Brave may work but are not tested. The extension adds capture buttons directly to supported web pages. It communicates locally with the helper and skips broad history permissions. Chrome Web Store approval is pending, so for now you load it from the helper&apos;s folder, as in the steps above.</p>
                <p>After updating the helper, reload the extension once from your browser&apos;s extensions page. If its ID changes to the pinned <code>bkcapfidedhfcjpmjabeopfbcjcbmdmi</code>, reapply your extension preferences. Your saved captures are unaffected.</p>
              </div>
            </details>

            <details className="ip-details" id="terminal-check">
              <summary>Optional: check from a terminal</summary>
              <div className="ip-details-body">
                <p>You don&apos;t need a terminal to install or use Uoink. This check is for AI agents and troubleshooting. On Windows, the installer&apos;s <strong>Add the uoink command to PATH for AI agents</strong> option is checked by default. Leave it on, then open a new terminal and run:</p>
                <pre className="code-block" tabIndex={0}>uoink status</pre>
                <p>On a Mac, the command ships inside the app, and <Link href="/developers">agent setup</Link> shows how to link it. Agents can follow the <a href={AGENT_INSTALL_URL}>agent installation steps</a>.</p>
              </div>
            </details>
          </div>
        </section>

        {/* 4. Connect your AI */}
        <section className="ip-section" id="connect" data-screen-label="install / connect" aria-labelledby="ip-connect-title">
          <h2 id="ip-connect-title" className="ip-h2">Connect your AI</h2>
          <p className="ip-sub">Your AI can search and cite your library over MCP. It reads the library on your computer.</p>
          <div className="ip-cards ip-cards-two">
            <article className="ip-card desktop-only">
              <header className="ip-card-head">
                <img src="/assets/brand-logos/claude.svg" width={24} height={24} alt="" />
                <h3>Claude Desktop</h3>
              </header>
              <p className="ip-card-meta">Open the .mcpb bundle for your computer.</p>
              <div className="ip-card-actions">
                <a className="btn ghost small with-logo" href={WINDOWS_MCPB_GET_URL}><Mark html={WINDOWS_MARK} />Windows bundle</a>
                <a className="btn ghost small with-logo" href={MAC_MCPB_GET_URL}><Mark html={MAC_MARK} />Mac bundle</a>
              </div>
              <p className="ip-card-status">On a Mac, use the Mac bundle, not the Windows bundle, and select the installed Uoink.app in its Uoink app setting.</p>
            </article>
            <article className="ip-card">
              <header className="ip-card-head">
                <img src="/assets/brand-logos/cursor.svg" width={24} height={24} alt="" />
                <h3>Claude Code, Cursor, Codex and more</h3>
              </header>
              <p className="ip-card-meta">Print a setup recipe for your client.</p>
              <pre className="code-block ip-cmd" tabIndex={0}>uoink connect &lt;client&gt;</pre>
              <div className="ip-card-actions">
                <Link className="btn ghost small" href="/developers">Agent setup</Link>
              </div>
            </article>
          </div>
        </section>

        {/* 4b. Phone inbox explainer. Shown while content/flags.json (phoneInbox) is on. */}
        {PHONE_INBOX_ENABLED ? (
          <section className="ip-section" id="phone-inbox" data-screen-label="install / phone inbox" aria-labelledby="ip-inbox-title">
            <h2 id="ip-inbox-title" className="ip-h2">Send links from your phone</h2>
            <p className="ip-sub">Share a link from your phone and it lands in your Uoink library on your computer.</p>
            <ol className="ip-inbox-steps">
              <li><strong>Make your relay.</strong> In Uoink, open Settings &gt; Capture &gt; Phone inbox and press Deploy to Render. The relay runs on your own free Render account.</li>
              <li><strong>Connect it.</strong> Paste the relay&apos;s address and pull token into Uoink. It says Connected, or Not connected and why.</li>
              <li><strong>Scan the QR code with your phone.</strong> It opens a page on your own relay. Paste links there, add Uoink to the Android share sheet, or follow the one-time iPhone Shortcut steps.</li>
            </ol>
            <p className="ip-sub">Uoink draws the QR code on your computer, with no outside QR service. The key in it sits after the # in the link, so opening it never puts the key in a server log.</p>
            <p className="ip-sub">The relay holds each link with an optional note, an ID and the time it arrived. It deletes each one after your computer picks it up, or after 7 days. No Uoink cloud is involved.</p>
            <p className="ip-sub">Made your relay before 3.17.0? Open it in Render and choose Manual Deploy to get the phone page. Your existing Shortcut keeps working either way.</p>
          </section>
        ) : null}

        {/* 5. Questions */}
        <section className="ip-section" id="questions" data-screen-label="install / questions" aria-labelledby="ip-faq-title">
          <h2 id="ip-faq-title" className="ip-h2">Questions</h2>
          <div className="ip-disclosures">
            {(page.faq ?? []).map((item) => (
              <details className="ip-details" key={item.question}>
                <summary>{item.question}</summary>
                <div className="ip-details-body"><p>{item.answer}</p></div>
              </details>
            ))}
          </div>
        </section>

        {/* 6. Updates and trust */}
        <section className="ip-section ip-trust" id="trust" data-screen-label="install / trust" aria-label="Updates and trust">
          <div className="ip-trust-row">
            <div>
              <h3>Updates</h3>
              <p>From 3.15.1 or later, <strong>Update now</strong> (Windows) or <strong>Download update</strong> (Mac) in Settings, Updates checks each new download against the release&apos;s SHA256SUMS.txt. Nothing downloads until you press it.</p>
            </div>
            <div>
              <h3>Free and open source</h3>
              <p>MIT licensed. No account, no Uoink cloud. Your library stays on your computer.</p>
            </div>
            <div>
              <h3>Release notes</h3>
              <p><Link href="/changelog">Changelog</Link> · <a href={`${GITHUB_URL}/releases`}>GitHub releases</a> · <a href={GITHUB_URL}>Source</a></p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

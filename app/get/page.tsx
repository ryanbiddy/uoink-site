import type { Metadata } from "next";
import Link from "next/link";
import labels from "../../public/media/hero/labels.json";
import { FamilyWordmark } from "../components/FamilyWordmark";
import { PhoneBlock } from "../components/PhoneBlock";
import { CHROME_STORE_URL, NPX_COMMAND } from "../content/phone";
import { GITHUB_URL, INSTALLER_SIZE, MAC_MARK, RELEASE_URL, VERSION, WINDOWS_GET_URL, WINDOWS_MARK } from "../content/pages";
import { MAC_DMG_GET_URL, MAC_MCPB_GET_URL, PRODUCT_STATUS } from "../content/product-status";
import "./get.css";

// /get: the one page to send people to. One screen: a short demo, the headline,
// one line on what Uoink is, then Windows / Mac tabs with the download and the
// one-line install commands. Both panels are server-rendered and work without
// JavaScript (stacked, with /get#windows and /get#mac anchors); the inline script
// only turns them into tabs, picks the visitor's OS and wires the copy buttons.
// Download URLs and the version come from content/release.json via pages.ts and
// product-status.ts, the same constants /install uses.

const title = "Get Uoink for Windows and Mac";
const description =
  "Download Uoink free for Windows or Mac. Save YouTube videos, podcasts, X posts and web pages with transcripts, then let Claude, Cursor or Codex cite them.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/get" },
  openGraph: { title, description, url: "/get", images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "Uoink: Save what you watch. Your AI writes from it, with receipts." }] },
  twitter: { title, description, images: ["/og-cover.png"] },
};

// Tap and cask verified in github.com/ryanbiddy/homebrew-uoink (Casks/uoink.rb).
// The cask links the uoink command onto PATH, so `uoink connect` works right after.
const BREW_COMMAND = "brew install --cask ryanbiddy/uoink/uoink";
// Client ids come from uoink_connect.CLIENTS; `uoink connect --list` prints them all.
const CONNECT_COMMAND = "uoink connect claude-code";
// winget: the winget-pkgs submission is not merged yet. When it lands, add a
// "winget" row to the Windows panel with `winget install <PackageIdentifier>`
// (use the identifier from the merged manifest) and a copy button, like the
// Homebrew row in the Mac panel.

const verify = labels.sources.lesson.receipts.verify;

const COPY_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
    <rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

function Command({ command, label }: { command: string; label: string }) {
  return (
    <span className="gp-cmd">
      <code>{command}</code>
      <button type="button" className="gp-copy" data-copy={command} aria-label={`Copy ${label}`} hidden>
        {COPY_ICON}
        <span className="gp-copy-text" aria-hidden="true">Copy</span>
      </button>
    </span>
  );
}

function Mark({ html }: { html: string }) {
  return <span className="gp-mark" dangerouslySetInnerHTML={{ __html: html }} />;
}

const script = `(function(){
var root=document.getElementById('gp');if(!root)return;
root.classList.add('gp-js');
var tabs=[].slice.call(root.querySelectorAll('[role=tab]'));
var list=root.querySelector('[role=tablist]');if(list)list.hidden=false;
function pick(os,focus){tabs.forEach(function(t){var on=t.getAttribute('data-os')===os;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;var p=document.getElementById(t.getAttribute('aria-controls'));if(p)p.hidden=!on;if(on&&focus)t.focus();});}
var h=(location.hash||'').slice(1),os='windows';
if(h==='mac'||h==='windows'){os=h;}else{var d=navigator.userAgentData,pf=(d&&d.platform)||navigator.platform||navigator.userAgent||'';if(/mac/i.test(pf))os='mac';}
pick(os,false);
tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(t.getAttribute('data-os'),false);});
t.addEventListener('keydown',function(e){var k=e.key,n=null;if(k==='ArrowRight')n=(i+1)%tabs.length;else if(k==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(k==='Home')n=0;else if(k==='End')n=tabs.length-1;if(n!==null){e.preventDefault();pick(tabs[n].getAttribute('data-os'),true);}});});
var live=root.querySelector('.gp-live');
function done(b){var s=b.querySelector('.gp-copy-text');b.classList.add('is-copied');if(s)s.textContent='Copied';if(live)live.textContent='Copied to clipboard';clearTimeout(b._t);b._t=setTimeout(function(){b.classList.remove('is-copied');if(s)s.textContent='Copy';if(live)live.textContent='';},1800);}
function fallback(text){var a=document.createElement('textarea');a.value=text;a.setAttribute('readonly','');a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand('copy');}catch(e){}document.body.removeChild(a);return ok;}
[].slice.call(root.querySelectorAll('.gp-copy')).forEach(function(b){b.hidden=false;b.addEventListener('click',function(){var t=b.getAttribute('data-copy');if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){done(b);},function(){if(fallback(t))done(b);});}else if(fallback(t)){done(b);}});});
var v=root.querySelector('.gp-video'),pb=root.querySelector('.gp-play');
if(v&&pb){v.removeAttribute('controls');pb.hidden=false;var hint=root.querySelector('.gp-hint');if(hint)hint.hidden=false;
function sync(){var playing=!v.paused;pb.setAttribute('aria-label',playing?'Pause the demo':'Play the demo');root.classList.toggle('gp-playing',playing);}
pb.addEventListener('click',function(){if(v.paused){var r=v.play();if(r&&r.catch)r.catch(function(){});}else{v.pause();}});
v.addEventListener('play',sync);v.addEventListener('pause',sync);sync();}
})();`;

export default function Page() {
  return (
    <div className="site-root gp" id="gp">
      <header className="gp-head">
        <Link href="/" className="gp-brand" aria-label="Uoink home">
          <FamilyWordmark cap={22} />
        </Link>
        <a className="gp-gh" href={GITHUB_URL}>
          <img src="/assets/brand-logos/github.svg" alt="" width="18" height="18" />
          GitHub
        </a>
      </header>

      <main className="gp-main">
        <figure className="gp-demo">
          <div className="gp-frame">
            <video
              className="gp-video"
              src="/media/hero/source-lesson.mp4"
              poster="/media/hero/source-lesson.jpg"
              width={640}
              height={360}
              controls
              muted
              loop
              playsInline
              preload="none"
              aria-label="Demo clip: a YouTube talk playing, the moment Uoink saves with its transcript"
            />
            <button type="button" className="gp-play" aria-label="Play the demo" hidden>
              <svg className="gp-play-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
              <svg className="gp-pause-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
            </button>
          </div>
          <figcaption className="gp-saved">
            <span className="gp-pill" aria-hidden="true">
              <i className="gp-pill-dot" />
              <svg viewBox="0 0 100 100" width="10" height="13" focusable="false"><path d="M 0 0 L 32 0 L 32 60 L 68 60 L 68 0 L 100 0 L 100 80 Q 100 100 80 100 L 20 100 Q 0 100 0 80 Z" fill="currentColor" /><path d="M0 0H32V20H0ZM68 0H100V20H68Z" fill="#FFD23F" /></svg>
              Uoink
            </span>
            <span className="gp-saved-text">
              Saved with its transcript. <b>{verify.time}</b> “{verify.quote}”
            </span>
          </figcaption>
          <p className="gp-hint" hidden>Click to play</p>
        </figure>

        <h1 className="gp-title">Save it. Ask it.</h1>
        <p className="gp-line">
          A free, local library for what you watch and read. Save YouTube videos, podcasts, X posts, Reddit threads and web pages with
          their transcripts, then search and cite them from Claude, Cursor or Codex over MCP.
        </p>

        <PhoneBlock />

        <section className="gp-install desktop-only" aria-label="Download Uoink">
          <div className="gp-tabs" role="tablist" aria-label="Choose your computer" hidden>
            <button type="button" role="tab" id="gp-tab-windows" data-os="windows" aria-controls="windows" aria-selected="true">
              <Mark html={WINDOWS_MARK} />Windows
            </button>
            <button type="button" role="tab" id="gp-tab-mac" data-os="mac" aria-controls="mac" aria-selected="false" tabIndex={-1}>
              <Mark html={MAC_MARK} />Mac
            </button>
          </div>

          <div className="gp-panel" id="windows" role="tabpanel" aria-labelledby="gp-tab-windows">
            <h2 className="gp-os"><Mark html={WINDOWS_MARK} />Windows</h2>
            <div className="gp-rows">
              <div className="gp-row">
                <span className="gp-label">Installer</span>
                <span className="gp-meta">{PRODUCT_STATUS.mac.windowsLabel} · about {INSTALLER_SIZE} · {VERSION}</span>
                <a className="btn primary gp-dl" href={WINDOWS_GET_URL}>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Download
                </a>
              </div>
            </div>
            <p className="gp-note">
              The installer is unsigned, so SmartScreen asks first: choose <b>More info</b>, then <b>Run anyway</b>. No admin rights needed.{" "}
              <a href={RELEASE_URL}>SHA-256 and all files</a> · <Link href="/install#windows">Step by step</Link>
            </p>
          </div>

          <div className="gp-panel" id="mac" role="tabpanel" aria-labelledby="gp-tab-mac">
            <h2 className="gp-os"><Mark html={MAC_MARK} />Mac</h2>
            <div className="gp-rows">
              <div className="gp-row">
                <span className="gp-label">Disk image</span>
                <span className="gp-meta">{PRODUCT_STATUS.mac.aboutNote} · {VERSION}</span>
                <a className="btn primary gp-dl" href={MAC_DMG_GET_URL}>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Download
                </a>
              </div>
              <div className="gp-row">
                <span className="gp-label">Homebrew</span>
                <Command command={BREW_COMMAND} label="Homebrew command" />
              </div>
            </div>
            <p className="gp-note">
              Intel Macs are not supported. Signed and notarized by Apple.{" "}
              <a href={MAC_MCPB_GET_URL}>Claude Desktop bundle</a> · <Link href="/install#mac">Step by step</Link>
            </p>
          </div>
        </section>

        <div className="gp-next desktop-only">
          {/* Hidden by content/flags.json until the owner turns them on. */}
          {CHROME_STORE_URL ? (
            <p className="gp-next-line" data-flag-chrome>
              <span>Chrome, Edge, Brave, Arc, Opera or Vivaldi:</span>
              <a className="btn ghost small" href={CHROME_STORE_URL}>Add to Chrome</a>
            </p>
          ) : null}
          {NPX_COMMAND ? (
            <p className="gp-next-line" data-flag-npx>
              <span>Install from your terminal:</span>
              <Command command={NPX_COMMAND} label="npx command" />
            </p>
          ) : null}
          <p className="gp-next-line">
            <span>Then connect your AI:</span>
            <Command command={CONNECT_COMMAND} label="connect command" />
          </p>
          <p className="gp-links">
            <Link href="/developers">Cursor, Codex and more</Link>
            <a href={GITHUB_URL}>GitHub</a>
            <Link href="/install#extension">Chrome extension</Link>
          </p>
        </div>
        <p className="gp-live" aria-live="polite" />
      </main>

      <footer className="gp-foot">
        <p>
          Free and open source (MIT). No account, no Uoink cloud. <Link href="/">uoink.app</Link> · <Link href="/privacy">Privacy</Link>
        </p>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  );
}

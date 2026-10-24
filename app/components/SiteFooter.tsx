import Link from "next/link";
import { FamilyStrip } from "./FamilyStrip";
import { CONTACT_EMAIL, GITHUB_URL, X_HANDLE, X_URL, VERSION } from "../content/pages";

export function SiteFooter({ home = false }: { home?: boolean }) {
  const closing = <section className="home-end" data-final-cta data-home-part={home ? "closing" : undefined}>
    <div className="container"><p className="display-m">Take the video. Make it usable.</p></div>
  </section>;
  return (
    <>
    {home && closing}
    <footer className="site-footer" data-home-part={home ? "footer" : undefined}>
      {!home && <>{closing}<FamilyStrip /></>}
      <div className="container footer-grid">
        <div className="footer-brand">
          <p>Local video and podcast corpus software. Open source. No Uoink cloud.</p>
        </div>
        <div>
          <h2>Product</h2>
          <ul>
            <li>
              <Link href="/install">Install</Link>
            </li>
            <li>
              <Link href="/how-it-works">How it works</Link>
            </li>
            <li>
              <Link href="/sources">Sources</Link>
            </li>
            <li>
              <Link href="/features">Features</Link>
            </li>
            <li>
              <Link href="/compare">Compare</Link>
            </li>
            <li>
              <Link href="/blog">Field notes</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Developers</h2>
          <ul>
            <li>
              <Link href="/developers">Developer door</Link>
            </li>
            <li>
              <Link href="/creators">Creator door</Link>
            </li>
            <li>
              <Link href="/mcp">MCP manifest</Link>
            </li>
            <li>
              <a href="/mcp/manifest.json">manifest.json</a>
            </li>
            <li>
              <a href="/llms.txt">llms.txt</a>
            </li>
          </ul>
        </div>
        <div>
          <h2>About</h2>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/changelog">Changelog</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
            <li>
              <a href={GITHUB_URL}>GitHub</a>
            </li>
            <li>
              <a href={X_URL}>X {X_HANDLE}</a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>uoink.app / {VERSION} / 2026</span>
        <span>Local-first. Model-agnostic. MIT.</span>
      </div>
      {home && <FamilyStrip />}
    </footer>
    </>
  );
}

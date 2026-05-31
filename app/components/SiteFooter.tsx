import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="wm-line">
            <uoink-mark aria-hidden="true"></uoink-mark>
            <span className="oink">OINK</span>
          </span>
          <p>Local video and podcast corpus software. Open source. No Uoink cloud.</p>
        </div>
        <div>
          <h5>Product</h5>
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
              <Link href="/blog">Field notes</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5>Developers</h5>
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
          <h5>About</h5>
          <ul>
            <li>
              <Link href="/about">About + downloads</Link>
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
              <a href="https://github.com/ryanbiddy/uoink">GitHub</a>
            </li>
            <li>
              <a href="mailto:hi@uoink.app">hi@uoink.app</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>uoink.app / v3.3 / 2026</span>
        <span>Local-first. Model-agnostic. MIT.</span>
      </div>
    </footer>
  );
}

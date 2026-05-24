import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="wm-line"><uoink-mark aria-hidden="true"></uoink-mark><span className="oink">OINK</span></span>
          <p>The YouTube layer for any AI. Local-first. Open source.</p>
        </div>
        <div>
          <h4>Product</h4>
          <ul>
            <li><Link href="/creators">Creators →</Link></li>
            <li><Link href="/research">Research →</Link></li>
            <li><Link href="/agents">Agents →</Link></li>
            <li><Link href="/hooks">Hook taxonomy →</Link></li>
          </ul>
        </div>
        <div>
          <h4>Build</h4>
          <ul>
            <li><Link href="/install">Install →</Link></li>
            <li><Link href="/agent-docs">Agent docs →</Link></li>
            <li><a href="https://github.com/ryanbiddy/uoink">GitHub →</a></li>
            <li><a href="https://github.com/ryanbiddy/uoink/blob/main/CHANGELOG.md">Changelog →</a></li>
          </ul>
        </div>
        <div>
          <h4>About</h4>
          <ul>
            <li><Link href="/privacy">Privacy →</Link></li>
            <li><a href="https://ryanbiddy.com">Made by Ryan Biddy →</a></li>
            <li><a href="https://github.com/ryanbiddy/uoink/blob/main/LICENSE">MIT License</a></li>
            <li><a href="mailto:hi@uoink.video">hi@uoink.video</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>uoink<span className="dot">.</span>video <span className="dot">·</span> v2.1 <span className="dot">·</span> © 2026</span>
        <span>Local-first. No cloud corpus. No telemetry.</span>
      </div>
    </footer>
  );
}

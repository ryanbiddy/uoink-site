import Link from "next/link";

const links = [
  ["/install", "Install"],
  ["/how", "How"],
  ["/features", "Features"],
  ["/blog", "Blog"],
  ["/podcasts", "Podcasts"],
  ["/agents", "Agents"],
  ["/mcp", "MCP"],
];

function tickerFor(active: string) {
  if (active.startsWith("/install")) return ["UOINK v3.2 / install", "helper / extension / local corpus"];
  if (active.startsWith("/how")) return ["UOINK v3.2 / workflow", "click / corpus / AI / result"];
  if (active.startsWith("/features")) return ["UOINK v3.2 / features", "corpus / memory / hooks / dashboard"];
  if (active.startsWith("/blog")) return ["UOINK v3.2 / field notes", "hooks / agents / corpus / local-first"];
  if (active.startsWith("/podcasts")) return ["UOINK v3.2 / podcasts", "RSS / Whisper / diarization / local"];
  if (active.startsWith("/agents") || active.startsWith("/mcp")) return ["UOINK v3.2 / MCP", "13 tools / Claude Desktop / Cursor / Cline"];
  if (active.startsWith("/about")) return ["UOINK v3.2 / about", "GitHub releases / public downloads / no tracking"];
  if (active.startsWith("/privacy")) return ["UOINK v3.2 / privacy", "local-first / no cloud / no telemetry"];
  return ["UOINK v3.2 / local video corpus", "open source / MIT / model agnostic"];
}

export function TopNav({ active }: { active: string }) {
  const [left, right] = tickerFor(active);

  return (
    <header className="site-header">
      <div className="ticker" role="banner">
        <div className="row">
          <span>
            <b>{left}</b>
          </span>
          <span>{right}</span>
        </div>
      </div>
      <nav className="top-nav" aria-label="Primary">
        <div className="container nav-inner">
          <Link href="/" className="brand" aria-label="Uoink home">
            <span className="wm-line">
              <uoink-mark aria-hidden="true"></uoink-mark>
              <span className="oink">OINK</span>
            </span>
          </Link>
          <div className="nav-links">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className={active === href || active.startsWith(`${href}/`) ? "active" : ""}>
                {label}
              </Link>
            ))}
          </div>
          <Link className="nav-cta" href="/install">
            Get Uoink
          </Link>
          <button
            className="nav-burger"
            type="button"
            data-nav-burger
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="mobile-menu"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 4h12M2 8h12M2 12h12" />
            </svg>
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className="mobile-menu" data-mobile-menu aria-hidden="true" aria-modal="true" role="dialog">
        <button className="close" type="button" data-nav-close aria-label="Close menu">
          x
        </button>
        <span className="wm-line" style={{ fontSize: 48, color: "var(--vermillion)" }}>
          <uoink-mark aria-hidden="true"></uoink-mark>
          <span className="oink">OINK</span>
        </span>
        <div className="links">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={active === href || active.startsWith(`${href}/`) ? "active" : ""}>
              {label}
            </Link>
          ))}
          <Link href="/privacy" className={active === "/privacy" ? "active" : ""}>
            Privacy
          </Link>
          <Link href="/changelog" className={active === "/changelog" ? "active" : ""}>
            Changelog
          </Link>
          <Link href="/about" className={active === "/about" ? "active" : ""}>
            About
          </Link>
        </div>
        <Link className="nav-cta" href="/install">
          Get Uoink
        </Link>
      </div>
    </header>
  );
}

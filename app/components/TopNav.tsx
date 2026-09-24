import Link from "next/link";
import { VERSION } from "../content/pages";

const links = [
  ["/install", "Install"],
  ["/how-it-works", "How It Works"],
  ["/sources", "Sources"],
  ["/creators", "Creators"],
  ["/developers", "Developers"],
  ["/features", "Features"],
  ["/blog", "Field Notes"],
];

function tickerFor(active: string) {
  if (active.startsWith("/install")) return [`UOINK ${VERSION} / install`, "helper / extension / local corpus"];
  if (active.startsWith("/how-it-works")) return [`UOINK ${VERSION} / workflow`, "capture / library / workspace / iterate / distribute"];
  if (active.startsWith("/sources")) return [`UOINK ${VERSION} / sources`, "youtube / podcasts / substack / articles / dev-hubs"];
  if (active.startsWith("/creators")) return [`UOINK ${VERSION} / creators`, "source capture / writing studio / Voice DNA / attribution"];
  if (active.startsWith("/developers")) return [`UOINK ${VERSION} / developers`, "local helper / sqlite / mcp server / agent tools"];
  if (active.startsWith("/features")) return [`UOINK ${VERSION} / features`, "corpus / memory / hooks / dashboard"];
  if (active.startsWith("/blog")) return [`UOINK ${VERSION} / field notes`, "hooks / agents / corpus / local-first"];
  if (active.startsWith("/twitter")) return [`UOINK ${VERSION} / twitter video`, "X capture / creator credit / Writing Studio"];
  if (active.startsWith("/podcasts")) return [`UOINK ${VERSION} / podcasts`, "RSS / Whisper / diarization / local"];
  if (active.startsWith("/agents") || active.startsWith("/mcp")) return [`UOINK ${VERSION} / MCP`, "local tools / Claude Desktop / Cursor"];
  if (active.startsWith("/about")) return [`UOINK ${VERSION} / about`, "GitHub releases / personal side project / no tracking"];
  if (active.startsWith("/privacy")) return [`UOINK ${VERSION} / privacy`, "local-first / no cloud / no telemetry"];
  return [`UOINK ${VERSION} / local video corpus`, "open source / MIT / model agnostic"];
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

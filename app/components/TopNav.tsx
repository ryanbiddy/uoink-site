import Link from "next/link";

const links = [
  ["/how", "How"],
  ["/dashboard", "Dashboard"],
  ["/memory", "Memory"],
  ["/creators", "Creators"],
  ["/agents", "Agents"],
  ["/install", "Install"],
];

function tickerFor(active: string) {
  if (active === "/dashboard") return ["UOINK v2.2 · dashboard", "library · activity · settings · about"];
  if (active === "/agent-docs") return ["UOINK v2.2 · agent docs", "uoink.video · stdio + experimental HTTP"];
  if (active === "/install") return ["UOINK v2.2 · windows is live", "uoink.video · wizard · splash · tray · dashboard"];
  if (active === "/how") return ["UOINK v2.2 · how it works", "helper · extension · dashboard · paste"];
  if (active === "/memory") return ["UOINK v2.2 · memory", "dashboard Library is canonical"];
  if (active === "/tweaks") return ["UOINK v2.2 · tweaks", "shortcuts · topics · clipboard budget"];
  if (active === "/hooks") return ["UOINK v2.2 · the YouTube layer for any AI", "uoink.video · the nine hook types · field manual"];
  if (active === "/privacy") return ["UOINK v2.2 · local-first", "privacy · no telemetry · BYO key only"];
  if (active === "/terms") return ["UOINK v2.2 · terms", "MIT · local software · hi@uoink.video"];
  if (active === "/changelog") return ["UOINK v2.2 · changelog", "latest release notes · GitHub canonical"];
  return ["UOINK v2.2 · the YouTube layer for any AI", "uoink.video · Windows live · Mac next · CWS pending"];
}

export function TopNav({ active }: { active: string }) {
  const [left, right] = tickerFor(active);
  const [leftStrong, ...leftRest] = left.split(" · ");

  return (
    <header className="site-header">
      <div className="ticker" role="banner">
        <div className="row">
          <span>
            <span className="star" aria-hidden="true">
              ★
            </span>{" "}
            <b>{leftStrong}</b>
            {leftRest.length ? ` · ${leftRest.join(" · ")}` : ""}
          </span>
          <span>
            {right}{" "}
            <span className="star" aria-hidden="true">
              ★
            </span>
          </span>
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
              <Link key={href} href={href} className={active === href ? "active" : ""}>
                {label}
              </Link>
            ))}
          </div>
          <Link className="nav-cta" href="/install">
            ↓ Get Uoink
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
      <div
        id="mobile-menu"
        className="mobile-menu"
        data-mobile-menu
        aria-hidden="true"
        aria-modal="true"
        role="dialog"
      >
        <button className="close" type="button" data-nav-close aria-label="Close menu">
          ×
        </button>
        <span className="wm-line" style={{ fontSize: 48, color: "var(--vermillion)" }}>
          <uoink-mark aria-hidden="true"></uoink-mark>
          <span className="oink">OINK</span>
        </span>
        <div className="links">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={active === href ? "active" : ""}>
              {label}
            </Link>
          ))}
        </div>
        <Link className="nav-cta" href="/install">
          ↓ Get Uoink for Windows
        </Link>
      </div>
    </header>
  );
}

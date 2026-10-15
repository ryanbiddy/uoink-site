import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

const links: [string, string][] = [
  ["/install", "Install"],
  ["/how-it-works", "How it works"],
  ["/sources", "Sources"],
  ["/creators", "Creators"],
  ["/developers", "Developers"],
  ["/features", "Features"],
  ["/blog", "Field notes"],
];

const moreLinks: [string, string][] = [
  ["/privacy", "Privacy"],
  ["/changelog", "Changelog"],
  ["/about", "About"],
];

function isActive(active: string, href: string) {
  return active === href || active.startsWith(`${href}/`);
}

function Wordmark() {
  return (
    <span className="wm-line">
      <uoink-mark aria-hidden="true"></uoink-mark>
      <span className="oink">OINK</span>
    </span>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: string }) {
  const current = isActive(active, href);

  return (
    <Link href={href} className={current ? "active" : undefined} aria-current={current ? "page" : undefined}>
      {label}
    </Link>
  );
}

export function TopNav({ active }: { active: string }) {
  return (
    <header className="site-header">
      <nav className="top-nav" aria-label="Primary">
        <div className="container nav-inner">
          <Link href="/" className="brand" aria-label="Uoink home">
            <Wordmark />
          </Link>
          <div className="nav-links">
            {links.map(([href, label]) => (
              <NavLink key={href} href={href} label={label} active={active} />
            ))}
          </div>
          <Link className="nav-cta" href="/install">
            Get Uoink
          </Link>
          <MobileMenu wordmark={<Wordmark />}>
            <div className="links">
              {links.map(([href, label]) => (
                <NavLink key={href} href={href} label={label} active={active} />
              ))}
            </div>
            <div className="links-more">
              {moreLinks.map(([href, label]) => (
                <NavLink key={href} href={href} label={label} active={active} />
              ))}
            </div>
            <Link className="nav-cta" href="/install">
              Get Uoink
            </Link>
          </MobileMenu>
        </div>
      </nav>
    </header>
  );
}

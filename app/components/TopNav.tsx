import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { FamilyWordmark } from "./FamilyWordmark";

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
    <header className="site-header family-header">
      <div className="container">
        <div className="site-header-top">
          <Link href="/" className="brand-link" aria-label="Uoink home">
            <FamilyWordmark />
          </Link>
          <Link className="nav-cta" href="/install">
            Get Uoink
          </Link>
        </div>
        <div className="family-nav-row">
          <nav className="family-nav" aria-label="Primary">
            {links.filter(([href]) => ["/install", "/how-it-works", "/features"].includes(href)).map(([href, label]) => (
              <NavLink key={href} href={href} label={label} active={active} />
            ))}
          </nav>
          <MobileMenu wordmark={<FamilyWordmark />}>
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
      </div>
    </header>
  );
}

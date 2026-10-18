import Link from "next/link";
import { PageShell } from "./components/PageShell";
import { RELEASE_URL, SitePage } from "./content/pages";

const page: SitePage = {
  id: "home",
  route: "/404",
  mode: "mode-light",
  title: "Uoink page not found",
  description: "The page moved, but the corpus is still local.",
  keywords: ["uoink 404", "uoink site"],
  html: "",
};

export default function NotFound() {
  return (
    <PageShell page={page}>
      <section className="hero" data-screen-label="404 / hero">
        <div className="container hero-grid">
          <div className="copy">
            <span className="eyebrow">404</span>
            <h1 className="display-xl">This page slipped out of the corpus.</h1>
            <p className="lede">The feature map, field notes, install path, and MCP docs are still where they should be.</p>
            <div className="ctas">
              <Link className="btn primary large" href="/features">
                Feature index
              </Link>
              <Link className="btn ghost large" href="/blog">
                Field notes
              </Link>
              <a className="btn ghost large" href={RELEASE_URL}>
                Latest release
              </a>
            </div>
          </div>
          <aside className="facts" aria-label="Missing page diagnostic">
            <p className="facts-head">
              <span className="verbatim">missing-page.md</span>
              <span>local diagnostic</span>
            </p>
            <dl className="facts-list">
              <div>
                <dt>404</dt>
                <dd>requested: page outside the current map</dd>
              </div>
              <div className="is-hl">
                <dt>suggested paths</dt>
                <dd className="paths">
                  <Link className="arr-link" href="/features">
                    /features
                  </Link>
                  <Link className="arr-link" href="/blog">
                    /blog
                  </Link>
                  <Link className="arr-link" href="/install">
                    /install
                  </Link>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

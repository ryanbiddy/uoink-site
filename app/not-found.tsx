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
      <section className="hero not-found-page" data-screen-label="404 / hero">
        <div className="container not-found-grid">
          <div className="section-head">
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
          <div className="corpus lost-corpus" aria-label="Missing page diagnostic">
            <div className="hd">
              <span>missing-page.md</span>
              <span>local diagnostic</span>
            </div>
            <span className="ln k"># 404</span>
            <span className="ln dim">requested: page outside the current map</span>
            <span className="ln k">## suggested paths</span>
            <span className="ln hl">/features</span>
            <span className="ln hl">/blog</span>
            <span className="ln hl">/install</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

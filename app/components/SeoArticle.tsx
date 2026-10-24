import { TopNav } from "./TopNav";
import { SiteFooter } from "./SiteFooter";

export function SeoArticle({ route, children }: { route: string; children: React.ReactNode }) {
  return (
    <div className="site-root mode-light">
      <TopNav active={route} />
      <main>
        <section className="section">
          <div className="container"><article className="article">{children}</article></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

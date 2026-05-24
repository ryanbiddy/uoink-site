import { SitePage } from "../content/pages";
import { SiteFooter } from "./SiteFooter";
import { TopNav } from "./TopNav";

export function PageShell({ page, children }: { page: SitePage; children?: React.ReactNode }) {
  return (
    <div className={`site-root ${page.mode}`}>
      <TopNav active={page.route} />
      <main>
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

import { CANONICAL_URL, HOME_MOVED_CONTENT, SitePage } from "../content/pages";
import { breadcrumbs, organization, softwareApplication, website } from "../lib/structured-data";
import { applySiteLinks } from "../lib/links";
import { SiteFooter } from "./SiteFooter";
import { TopNav } from "./TopNav";

export function PageShell({ page, children }: { page: SitePage; children?: React.ReactNode }) {
  return (
    <div className={`site-root ${page.mode}`}>
      <TopNav active={page.route} />
      <main>
        <div dangerouslySetInnerHTML={{ __html: applySiteLinks(page.html) }} />
        {children}
        {HOME_MOVED_CONTENT[page.route] && <div dangerouslySetInnerHTML={{ __html: applySiteLinks(HOME_MOVED_CONTENT[page.route]) }} />}
      </main>
      <JsonLd page={page} />
      <SiteFooter home={page.id === "home"} />
    </div>
  );
}

const SECTION_NAMES: Record<string, string> = { sources: "Sources", compare: "Compare", features: "Features", mcp: "MCP" };

function JsonLd({ page }: { page: SitePage }) {
  const pageUrl = `${CANONICAL_URL}${page.route === "/" ? "" : page.route}`;
  const schemas: object[] = [
    organization,
    website,
    softwareApplication(),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url: pageUrl,
      keywords: page.keywords.join(", "),
      isPartOf: { "@type": "WebSite", name: "Uoink", url: CANONICAL_URL },
    },
  ];

  const [section, leaf] = page.route.split("/").filter(Boolean);
  if (leaf && SECTION_NAMES[section]) {
    schemas.push(breadcrumbs([[SECTION_NAMES[section], `/${section}`], [page.title.replace(/ \| Uoink$/, ""), page.route]]));
  }

  if (page.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  if (page.id === "install") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Install Uoink",
      description: "Install the local helper on Windows or the Mac preview, load the Chrome extension, then click Uoink on a video.",
      step: [
        { "@type": "HowToStep", name: "Download the helper", text: "Download the Windows installer or the Mac preview disk image from GitHub Releases." },
        { "@type": "HowToStep", name: "Install the extension", text: "The Chrome Web Store listing is pending, so load the extension unpacked from %LOCALAPPDATA%\\Uoink\\extension on Windows or ~/Library/Application Support/Uoink/extension on a Mac. Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible." },
        { "@type": "HowToStep", name: "Click Uoink", text: "Open a supported video page and click the Uoink button." },
      ],
    });
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />;
}

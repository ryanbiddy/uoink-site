import { CANONICAL_URL, GITHUB_URL, RELEASE_URL, SitePage, VERSION } from "../content/pages";
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
      </main>
      <JsonLd page={page} />
      <SiteFooter />
    </div>
  );
}

function JsonLd({ page }: { page: SitePage }) {
  const pageUrl = `${CANONICAL_URL}${page.route === "/" ? "" : page.route}`;
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Uoink",
      url: CANONICAL_URL,
      logo: `${CANONICAL_URL}/og-image.png`,
      sameAs: [GITHUB_URL, "https://twitter.com/ryanbiddy"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Uoink",
      url: CANONICAL_URL,
      description:
        "Local-first corpus software for creators and AI developers working from videos, podcasts, articles, and threads.",
      publisher: { "@type": "Organization", name: "Uoink" },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Uoink",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Windows 10, Windows 11",
      softwareVersion: VERSION.replace("v", ""),
      downloadUrl: RELEASE_URL,
      url: CANONICAL_URL,
      license: "https://github.com/ryanbiddy/uoink/blob/main/LICENSE",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Uoink extracts structured local corpora from videos, podcasts, articles, and threads, then hands them to Claude, ChatGPT, Cursor, or a local MCP agent.",
      featureList: [
        "Timestamped transcripts",
        "Screenshots",
        "Comments",
        "Channel context",
        "Podcast transcription",
        "Article capture",
        "Thread capture",
        "Local SQLite search",
        "Model Context Protocol server",
        "Hook Type classification",
        "Comment Intelligence",
        "Entity Extraction",
      ],
    },
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
      description: "Install the local helper, install the browser extension, then click Uoink on a video.",
      step: [
        { "@type": "HowToStep", name: "Download the helper", text: "Download the Windows installer from GitHub Releases." },
        { "@type": "HowToStep", name: "Install the extension", text: "Install the browser extension from the release zip until Web Store approval lands." },
        { "@type": "HowToStep", name: "Click Uoink", text: "Open a supported video page and click the Uoink button." },
      ],
    });
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />;
}

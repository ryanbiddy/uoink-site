import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { pages } from "../content/pages";
import { releases, withoutEmDashes } from "../content/seo-pages";

const index = `<nav aria-label="Releases"><ul>${releases.map(release => `<li><a href="${release.route}">Uoink ${release.version}</a>${release.date ? `: <time datetime="${release.date}">${release.date}</time>` : ": release date not recorded"}</li>`).join("")}</ul></nav><p><a href="/">Uoink home</a> / <a href="/facts">Uoink facts</a></p>`;
const page = {
  ...pages.changelog,
  html: withoutEmDashes(pages.changelog.html).replace(/(<p class="standfirst">[\s\S]*?<\/p>)/, `$1${index}`),
};

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "The Uoink dashboard: a populated local corpus of saved videos ready to hand to your AI." }] },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
};

export default function Page() {
  return <PageShell page={page} />;
}

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoArticle } from "../../components/SeoArticle";
import { releases } from "../../content/seo-pages";

type Props = { params: Promise<{ version: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return releases.map(release => ({ version: release.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version } = await params;
  const release = releases.find(item => item.slug === version);
  if (!release) notFound();
  return {
    title: release.title,
    description: release.description,
    alternates: { canonical: release.route },
    openGraph: { title: release.title, description: release.description, url: release.route },
    twitter: { title: release.title, description: release.description },
  };
}

export default async function ReleasePage({ params }: Props) {
  const { version } = await params;
  const release = releases.find(item => item.slug === version);
  if (!release) notFound();
  return (
    <SeoArticle route={release.route}>
      <p className="meta"><Link href="/changelog">All release notes</Link></p>
      <h1>{release.heading}</h1>
      <p className="meta">{release.date ? <>Released <time dateTime={release.date}>{release.date}</time></> : "Release date not recorded in the changelog."}</p>
      <div dangerouslySetInnerHTML={{ __html: release.html }} />
      {release.context ? <p className="meta">{release.context}</p> : null}
      <div className="ctas"><Link className="btn ghost" href="/changelog">All releases</Link><Link className="btn primary" href="/install">Get Uoink</Link></div>
    </SeoArticle>
  );
}

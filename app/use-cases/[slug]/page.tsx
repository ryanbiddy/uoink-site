import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "../../components/TopNav";
import { SiteFooter } from "../../components/SiteFooter";
import data from "../../content/use-cases.generated.json";
import styles from "./use-case.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return data.pages.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
async function findPage(params: Props["params"]) {
  const { slug } = await params;
  return data.pages.find(page => page.slug === slug) ?? notFound();
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await findPage(params);
  return { title: page.title, description: page.description, alternates: { canonical: page.route },
    openGraph: { title: page.title, description: page.description, url: page.route },
    twitter: { title: page.title, description: page.description } };
}
export default async function Page({ params }: Props) {
  const page = await findPage(params);
  return <div className={`site-root mode-light ${styles.page}`}>
    <TopNav active="/how-it-works" />
    <main className="container">
      <article className="doc">
        <header className={styles.intro}>
          <Link className="arr-link" href="/how-it-works">How Uoink works</Link>
          <h1 className="display-xl">{page.title}</h1>
          <p className="lede">{data.facts.opening}</p>
          <p>{page.sourceFact} {data.facts.storage}</p>
        </header>
        <section aria-labelledby="setup">
          <h2 id="setup">Start with a saved source</h2>
          <p>{page.setup} <Link href="/install">Follow the installation steps.</Link></p>
          <p>{data.facts.windows} {data.facts.browser}</p>
          <h3>Ask your connected AI</h3>
          <blockquote className={styles.prompt}>{page.prompt}</blockquote>
        </section>
        <section aria-labelledby="flow">
          <h2 id="flow">Search, then get the evidence</h2>
          <ol className="doc-list numbered">
            {data.flow.map((call, index) => <li key={call.name}>
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <h3><code>{call.name}</code></h3>
              <p>{index === 0 ? "Replace YOUR_TOPIC with what you want to find." : "Choose a source from the search results. Replace VIDEO_ID_FROM_SEARCH with its video_id."}</p>
              <pre className={`code-block ${styles.code}`}><code>{JSON.stringify(call, null, 2)}</code></pre>
            </li>)}
          </ol>
          <p className={styles.note}>Example calls use placeholders. They are not search results.</p>
        </section>
        <section aria-labelledby="quote">
          <h2 id="quote">Check before quoting</h2>
          <p>{data.facts.search}</p>
          <p><Link href="/llms.txt">Uoink facts</Link> · <Link href="/mcp/manifest.json">Tool schemas</Link></p>
        </section>
        <section className={styles.install} aria-labelledby="install">
          <h2 id="install">Try it with your library</h2>
          <div className="ctas"><Link className="btn primary" href="/install">Install Uoink</Link></div>
        </section>
      </article>
    </main>
    <SiteFooter />
  </div>;
}

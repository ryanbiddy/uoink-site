import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "../../../components/TopNav";
import { SiteFooter } from "../../../components/SiteFooter";
import { displayText, exampleCall, inputDefault, inputType, inputVariants, resolveSchema, toolAnswer, toolDescription, toolManifest, toolPages, toolPath, toolTitle } from "../../../content/mcp-tool-pages";
import "./tool-page.css";

type Props = { params: Promise<{ tool: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return toolPages.map(tool => ({ tool: tool.name })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: name } = await params;
  const tool = toolPages.find(tool => tool.name === name);
  if (!tool) notFound();
  const title = toolTitle(tool);
  const description = toolDescription(tool);
  const url = `https://uoink.app${toolPath(tool.name)}`;
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { title, description },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool: name } = await params;
  const tool = toolPages.find(tool => tool.name === name);
  if (!tool) notFound();
  const variants = inputVariants(tool.inputSchema);
  const sourceCommit = toolManifest.source.match(/@([a-f0-9]+):/)![1];
  return <div className="site-root mode-light">
    <TopNav active="/mcp" />
    <main className="container mcp-tool-page">
      <article>
        <nav aria-label="Breadcrumb"><Link href="/mcp">MCP tools</Link><span aria-hidden="true"> / </span><span>{tool.name}</span></nav>
        <header className="mcp-tool-heading">
          <p className="eyebrow">Uoink {toolManifest.version} / tool reference</p>
          <h1>{tool.name}</h1>
          <p className="lede" data-tool-answer>{toolAnswer(tool)}</p>
        </header>
        <nav className="mcp-tool-sections" aria-label="On this page">
          <a href="#inputs">Inputs</a><a href="#outputs">Outputs</a><a href="#example">Example call</a><a href="#clients">Clients</a>
        </nav>
        <section id="inputs">
          <h2>Inputs</h2>
          {variants.map((variant, index) => <div key={index}>
            {variants.length > 1 && <h3>Input variant {index + 1}</h3>}
            {!Object.keys(variant.properties || {}).length ? <p>No input arguments.</p> : <dl className="mcp-tool-inputs">
              {Object.entries(variant.properties || {}).map(([name, raw]) => {
                const schema = resolveSchema(raw, tool.inputSchema);
                const { description } = schema;
                return <div key={name}>
                  <dt><code>{name}</code><span>{variant.required?.includes(name) ? "Required" : "Optional"}</span></dt>
                  <dd>{description && <p>{displayText(description)}</p>}<p data-input-type>{displayText(inputType(schema, tool.inputSchema))}{"default" in schema && ` (default: ${displayText(inputDefault(schema))})`}</p></dd>
                </div>;
              })}
            </dl>}
          </div>)}
          <details><summary>Full input schema</summary><pre>{JSON.stringify(tool.inputSchema, null, 2).replace(/\u2014/g, "\\u2014")}</pre></details>
        </section>
        <section id="outputs">
          <h2>Outputs and behavior</h2>
          <p>{displayText(tool.description)}</p>
          <p className="mcp-tool-note">The registry does not publish an output schema for this tool. The description above is its documented behavior; response fields beyond it are not specified here.</p>
        </section>
        <section id="example">
          <h2>Example call</h2>
          <p>Example tool name and arguments, generated from the input schema. Replace placeholder strings and sample numbers with your own values. This is a request template, not a recorded call or response.</p>
          {variants.map((variant, index) => <div key={index}>
            {variants.length > 1 && <h3>Input variant {index + 1}</h3>}
            <pre data-example-call>{JSON.stringify(exampleCall(tool, variant), null, 2)}</pre>
          </div>)}
        </section>
        <section id="clients">
          <h2>Clients</h2>
          <p>This tool is available to MCP clients using {tool.transports.join(" or ")}.</p>
          <p>The registry records transport support, not individual client test results. See the <Link href="/mcp#server">MCP setup reference</Link> for named clients, configuration, and tool-list limits.</p>
          <div className="ctas"><Link className="btn primary" href="/mcp#server">Set up your client</Link><Link className="btn ghost" href="/mcp#tools">All MCP tools</Link></div>
        </section>
        <section className="mcp-tool-source">
          <h2>Source</h2>
          <p>Uoink {toolManifest.version} tool registry. Synced <time dateTime={toolManifest.generated}>{toolManifest.generated}</time>.</p>
          <p><a href="/mcp/manifest.json">Synced tool manifest</a> / <a href={`https://github.com/ryanbiddy/uoink/blob/${sourceCommit}/uoink_mcp_tools.py`}>Registry at source commit {sourceCommit.slice(0, 7)}</a></p>
        </section>
      </article>
    </main>
    <SiteFooter />
  </div>;
}

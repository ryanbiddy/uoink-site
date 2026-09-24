import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { GITHUB_URL, RELEASE_URL, SitePage } from "../content/pages";
import { MCP_STDIO_CONFIG } from "../content/mcp-config";
import { mcpStdioToolNames, mcpTools, MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT } from "../content/mcp-tools";

const page: SitePage = {
  id: "agents",
  route: "/developers",
  mode: "mode-light",
  title: "Uoink for Developers: Local MCP Tools for Source Research",
  description:
    "Connect Uoink to Claude Desktop and Cursor with local MCP tools for source capture and corpus search.",
  keywords: [
    "mcp source research",
    "mcp youtube server",
    "claude desktop mcp config",
    "cursor mcp corpus",
    "local ai agent tools",
  ],
  html: "",
};

const configs = [{ name: "README stdio config", body: MCP_STDIO_CONFIG }];

const stdioNames = new Set<string>(mcpStdioToolNames);
const toolGroups = [
  {
    title: "Everyday stdio tools",
    dek: "Capture, podcasts, clip search, evidence cards, library reads, and cited range export. Also available over HTTP.",
    names: [...mcpStdioToolNames],
  },
  {
    title: "Additional HTTP registry tools",
    dek: "Standing capture, library work, Writing Studio, workspaces, and source controls. The Librarian proposes; applying is off by default and its quality gate has not passed.",
    names: mcpTools.map(([name]) => name).filter((name) => !stdioNames.has(name)),
  },
];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "The Uoink dashboard: a populated local corpus of saved videos ready to hand to your AI." }] },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
  other: {
    "mcp-manifest": "https://uoink.app/mcp/manifest.json",
  },
};

export default function Page() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Uoink local MCP tools",
    itemListElement: mcpTools.map(([name, description], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      description,
    })),
  };

  return (
    <PageShell page={page}>
      <section className="hero" data-screen-label="developers / hero">
        <div className="container">
          <div className="hero-grid">
            <div className="copy">
              <span className="eyebrow">for developers</span>
              <h1 className="display-xl">
                Give your agent a local <em>source layer.</em>
              </h1>
              <p className="lede">
                Uoink runs a local Model Context Protocol (MCP) server on your machine. The stdio path gives Claude Desktop and Cursor the {MCP_STDIO_TOOL_COUNT} curated everyday tools to capture, search, and cite your corpus. The local HTTP endpoint exposes the full {MCP_TOOL_COUNT}-tool registry.
              </p>
              <div className="ctas">
                <a className="btn primary large" href="#configs">
                  Copy config
                </a>
                <Link className="btn ghost large" href="/mcp">
                  Raw manifest
                </Link>
              </div>
              <div className="brand-strip" aria-label="Developer clients">
                {/* Claude logo source: https://www.anthropic.com/ and https://claude.ai/favicon.svg; official Claude site mark, unmodified integration callout. */}
                <span className="logo-chip brand-mark-pill logo-mark" aria-label="Claude">
                  <img src="/assets/brand-logos/claude.svg" alt="Claude" width="30" height="30" loading="lazy" decoding="async" />
                </span>
                {/* Cursor logo source: https://cursor.com/; official Cursor site asset, unmodified integration callout. */}
                <span className="logo-chip brand-mark-pill logo-mark" aria-label="Cursor">
                  <img src="/assets/brand-logos/cursor.svg" alt="Cursor" width="30" height="30" loading="lazy" decoding="async" />
                </span>
                {/* GitHub logo source: https://github.com/logos; official GitHub mark, unmodified integration callout under GitHub logo guidelines. */}
                <span className="logo-chip brand-mark-pill logo-mark" aria-label="GitHub">
                  <img src="/assets/brand-logos/github.svg" alt="GitHub" width="30" height="30" loading="lazy" decoding="async" />
                </span>
              </div>
            </div>
            <div className="corpus">
              <div className="hd">
                <span>local mcp trace</span>
                <span>stdio</span>
              </div>
              <span className="ln k">uoink_video(url)</span>
              <span className="ln dim">capture one source into the local library</span>
              <span className="ln k">search_uoinks(&quot;Karpathy&quot;)</span>
              <span className="ln dim">query transcript, comments, titles, metadata</span>
              <span className="ln k">search_clips(query)</span>
              <span className="ln hl">find timestamped excerpts with source links</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="developers / configs" id="configs">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">client config</span>
            <h2 className="display-l">
              Stdio and HTTP <em>transports.</em>
            </h2>
            <p className="lede">
              Tested with Claude Desktop and Cursor. Install Uoink before connecting your client.
            </p>
            <p className="body-l">
              Uoink runs a local Model Context Protocol (MCP) server. The stdio transport connects as a local subprocess and exposes the {MCP_STDIO_TOOL_COUNT} curated everyday tools. The local HTTP JSON-RPC endpoint exposes the full {MCP_TOOL_COUNT}-tool registry.
            </p>
            
            <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--ink-dim)', marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>HTTP JSON-RPC Transport Details</h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}><strong>Endpoint URL:</strong> <code>http://localhost:5179/mcp/v1</code></p>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}><strong>Authentication:</strong> Include the header <code>X-Uoink-Token</code> on every request.</p>
              <p style={{ margin: '0', fontSize: '14px' }}><strong>Token Location:</strong> Read the token string from the local file <code>%LOCALAPPDATA%\Uoink\token.txt</code>.</p>
            </div>
          </div>
          <div className="docs-main">
            <h3>One-click Claude Desktop setup</h3>
            <p>Open the <a href={RELEASE_URL}>.mcpb bundle from the latest release</a> to install the stdio server without editing config.</p>
            <p>For manual setup, use the README JSON below. Claude Desktop does not expand <code>%LOCALAPPDATA%</code>: replace it in both paths with your full app-data directory (for example <code>{String.raw`C:\Users\YOUR_USERNAME\AppData\Local`}</code>), or copy the generated config from the extension’s Settings page. Restart the client after saving.</p>
            <p>Cline and Continue are standard-stdio compatibility paths; they were not individually smoke-tested. Use the clipboard path for ChatGPT.</p>
            {configs.map((config) => (
              <section key={config.name}>
                <h3>
                  <span className="anchor">{config.name}</span>
                </h3>
                <pre>{config.body}</pre>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="big-strip" data-screen-label="developers / sample run">
        <div className="container">
          <span className="eyebrow">sample agent run</span>
          <h2 className="display-l">
            Ask Cursor to research a launch video from <em>source.</em>
          </h2>
          <div className="agent-demo mt-32">
            <div className="chat">
              <div className="mini-heading">prompt</div>
              <p className="chat-bubble user">Search my saved videos for the launch announcement and give me timestamped excerpts I can cite.</p>
              <div className="mini-heading">result</div>
              <p className="chat-bubble assistant">The agent searches the local library, reads matching items, and retrieves evidence cards with timestamped source links.</p>
            </div>
            <div className="log">
              <div className="mini-heading">tool sequence</div>
              <pre className="mcp-log" style={{ margin: 0, whiteSpace: "pre-wrap" }}>{`search_library({ query: "launch announcement" })
get_library_item({ video_id })
search_clips({ query: "launch announcement" })
get_evidence_card({ video_id })`}</pre>
            </div>
          </div>
          <figure className="feature-visual product-figure wide mt-32">
            <div className="feature-visual-top">
              <span>search_uoinks</span>
              <span>local sqlite fts</span>
            </div>
            <div className="feature-visual-body">
              <div className="feature-visual-shot">
                <img
                  src="/product/library-search.webp"
                  width={1440}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  alt="Uoink dashboard search: a query for nvidia narrows the local library to matching source cards, showing the full-text SQLite index that agents query through the MCP tools."
                />
                <figcaption>What <code>search_uoinks</code> reaches: a local SQLite full-text index over every transcript, comment, and title on disk.</figcaption>
              </div>
            </div>
          </figure>
          <p className="mt-32">
            <Link className="btn ink" href="/install">
              Install Uoink
            </Link>{" "}
            <a className="btn ghost" href={GITHUB_URL}>
              GitHub
            </a>
          </p>
        </div>
      </section>

      <section className="section" data-screen-label="developers / tool catalog">
        <div className="container">
          <div className="section-head compact-head">
            <span className="eyebrow">tool catalog</span>
            <h2 className="display-l">
              Names stay visible. Details stay <em>folded.</em>
            </h2>
            <p className="lede">
              The manifest includes the release registry’s schemas and transport labels. This page keeps the public tool names readable for humans, crawlers, and agents without turning the page into one endless list.
            </p>
            <p className="body-l">
              Start with <code>uoink_video</code>, <code>search_uoinks</code>, <code>get_uoink_corpus</code>, <code>classify_hook</code>, and <code>find_mentions</code>. Open a bucket when you need the rest.
            </p>
          </div>
          <div className="tool-accordion" aria-label="Uoink MCP tool groups">
            {toolGroups.map((group) => (
              <ToolGroup key={group.title} group={group} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="developers / docs split">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">docs split</span>
            <h2 className="display-l">
              Humans read this page. Agents read the <em>manifest.</em>
            </h2>
          </div>
          <div className="three-cards">
            <Link className="card" href="/mcp">
              <span className="num">01</span>
              <h3>MCP page.</h3>
              <p>Human-readable server metadata, transport notes, config reminders, and tool list.</p>
              <span className="arr-link">Open /mcp {"->"}</span>
            </Link>
            <a className="card" href="/mcp/manifest.json">
              <span className="num">02</span>
              <h3>Manifest JSON.</h3>
              <p>Machine-readable tool surface for agent crawlers and registry submissions.</p>
              <span className="arr-link">Open JSON {"->"}</span>
            </a>
            <a className="card" href="/llms.txt">
              <span className="num">03</span>
              <h3>llms.txt.</h3>
              <p>Short product summary, install links, source pages, and agent docs in crawler-friendly text.</p>
              <span className="arr-link">Open llms.txt {"->"}</span>
            </a>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    </PageShell>
  );
}

function ToolGroup({ group }: { group: (typeof toolGroups)[number] }) {
  const tools = group.names.map((name) => {
    const tool = mcpTools.find(([toolName]) => toolName === name);
    if (!tool) throw new Error(`Missing MCP tool ${name}`);
    return tool;
  });

  return (
    <details className="tool-group">
      <summary>
        <span>
          <strong>{group.title}</strong>
          <em>{group.dek}</em>
        </span>
        <span className="tool-count">{tools.length} tools</span>
      </summary>
      <div className="tool-group-body">
        {tools.map(([name, description]) => (
          <div className="tool-row compact" key={name}>
            <div className="name">
              {name}
              <span className="args">local MCP tool</span>
            </div>
            <div className="desc">
              {description}
              <span className="ex">Schema lives in /mcp/manifest.json.</span>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

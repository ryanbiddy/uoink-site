import type { Metadata } from "next";
import Link from "next/link";
import { DocRule } from "../components/Doc";
import { PageShell } from "../components/PageShell";
import { GITHUB_URL, VERSION, VERSION_NUMBER, SitePage } from "../content/pages";
import { CLAUDE_CODE_COMMAND, MCP_CURSOR_CONFIG, MCP_STDIO_CONFIG } from "../content/mcp-config";
import { mcpStdioToolNames, mcpTools, MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT } from "../content/mcp-tools";

const page: SitePage = {
  id: "agents",
  route: "/developers",
  mode: "mode-light",
  title: "Uoink for Developers: Local MCP Tools for Source Research",
  description:
    "Connect Uoink to Claude Desktop, Claude Code, and Cursor with local MCP tools for source capture and corpus search.",
  keywords: [
    "mcp source research",
    "mcp youtube server",
    "claude desktop mcp config",
    "cursor mcp corpus",
    "local ai agent tools",
  ],
  html: "",
};

const configs = [
  { name: "Cursor config with the core toolset", body: MCP_CURSOR_CONFIG },
  { name: "Other stdio clients and manual Claude Desktop config", body: MCP_STDIO_CONFIG },
];

const toolGroups = [
  {
    title: "All tools over stdio and HTTP",
    dek: "Capture, search, citations, research, writing, scripts, workspaces, sources, and the Library queue. Consent gates are unchanged. The Librarian proposes; applying is off by default and its quality gate has not passed.",
    names: [...mcpStdioToolNames],
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
                Uoink gives Claude Desktop, Claude Code, and Cursor every tool to capture, search, cite, and write from your local library: {MCP_STDIO_TOOL_COUNT} tools over stdio and {MCP_TOOL_COUNT} in the HTTP registry.
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
            <aside className="facts" aria-label="Local MCP trace">
              <p className="facts-head">
                <span>local mcp trace</span>
                <span>stdio</span>
              </p>
              <ol className="facts-list">
                <li>
                  <pre className="code-block">uoink_video(url)</pre>
                  <span>capture one source into the local library</span>
                </li>
                <li>
                  <pre className="code-block">search_uoinks(&quot;Karpathy&quot;)</pre>
                  <span>query transcript, comments, titles, metadata</span>
                </li>
                <li className="is-hl">
                  <pre className="code-block">search_clips(query)</pre>
                  <span>find timestamped excerpts with source links</span>
                </li>
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="developers / configs" id="configs">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">client config</span>
              <h2 className="display-l">
                Stdio and HTTP <em>transports.</em>
              </h2>
              <p className="lede">
                Tested with Claude Desktop, Claude Code, and Cursor. Install Uoink before connecting your client.
              </p>
              <p className="body-l">
                Stdio connects as a local subprocess with all {MCP_STDIO_TOOL_COUNT} tools. It works without the Uoink helper running. Start Uoink from the Start menu for the dashboard, browser button, and monitored-playlist polling. HTTP exposes the same {MCP_TOOL_COUNT} tools through the running helper.
              </p>
            </div>
            <div className="callout">
              <h3>HTTP JSON-RPC Transport Details</h3>
              <p><strong>Endpoint URL:</strong> <code>http://localhost:5179/mcp/v1</code></p>
              <p><strong>Authentication:</strong> Include the header <code>X-Uoink-Token</code> on every request.</p>
              <p><strong>Token Location:</strong> Read the token string from the local file <code>%LOCALAPPDATA%\Uoink\token.txt</code>.</p>
            </div>
            <div className="docs-main">
              <h3>One-click Claude Desktop setup</h3>
              <p>Download and open <a href={`${GITHUB_URL}/releases/download/${VERSION}/uoink-${VERSION_NUMBER}.mcpb`}>uoink-{VERSION_NUMBER}.mcpb</a>. Claude Desktop installs it as an extension and asks for the Uoink folder. Enter the full path to <code>%LOCALAPPDATA%\Uoink</code>; Desktop does not expand that variable. After updating, reinstall the bundle and restart Desktop.</p>
              <h3>Claude Code</h3>
              <p>Run this in PowerShell. It expands the paths to your local install. Verified with Claude Code 2.1.302, including tool listing, saving a note, and reading recent captures.</p>
              <pre className="code-block">{CLAUDE_CODE_COMMAND}</pre>
              <h3>Cursor and other stdio clients</h3>
              <p>Cursor is reported to send only the first 40 tools to its agent. Add <code>UOINK_MCP_TOOLSET=core</code> to the server environment to keep the previous 35-tool set and stay under that cap. The Cursor config below includes it. Omit that setting for the full toolset.</p>
              <p>For manual setup, use the README JSON below. Claude Desktop does not expand <code>%LOCALAPPDATA%</code>: replace it in both paths with your full app-data directory, or copy the generated config from the extension’s Settings page. Restart the client after saving.</p>
              <p>Cline and Continue are standard-stdio compatibility paths; they were not individually smoke-tested. ChatGPT and claude.ai use copy and paste. Uoink does not connect to the ChatGPT app over MCP.</p>
              {configs.map((config) => (
                <section key={config.name}>
                  <h3>
                    <span className="anchor">{config.name}</span>
                  </h3>
                  <pre className="code-block">{config.body}</pre>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DocRule />

      <section className="section" data-screen-label="developers / sample run">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">sample agent run</span>
              <h2 className="display-l">
                Ask Cursor to research a launch video from <em>source.</em>
              </h2>
            </div>
            <div className="exchange">
              <div className="mini-heading">prompt</div>
              <p className="chat-bubble user">Search my saved videos for the launch announcement and give me timestamped excerpts I can cite.</p>
              <div className="mini-heading">result</div>
              <p className="chat-bubble assistant">The agent searches the local library, reads matching items, and retrieves evidence cards with timestamped source links.</p>
              <div className="mini-heading">tool sequence</div>
              <pre className="code-block">{`search_library({ query: "launch announcement" })
get_library_item({ video_id })
search_clips({ query: "launch announcement" })
get_evidence_card({ video_id })`}</pre>
            </div>
          </div>
          <figure className="figure">
            <div className="figure-label">
              <span className="verbatim">search_uoinks</span>
              <span>local sqlite fts</span>
            </div>
            <img
              src="/product/library-search.webp"
              width={1440}
              height={900}
              loading="lazy"
              decoding="async"
              alt="Uoink dashboard search: a query for nvidia narrows the local library to matching source cards, showing the full-text SQLite index that agents query through the MCP tools."
            />
            <figcaption>What <code>search_uoinks</code> reaches: a local SQLite full-text index over every transcript, comment, and title on disk.</figcaption>
          </figure>
          <div className="doc">
            <div className="ctas">
              <Link className="btn primary" href="/install">
                Install Uoink
              </Link>
              <a className="btn ghost" href={GITHUB_URL}>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <DocRule />

      <section className="section" data-screen-label="developers / tool catalog">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
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
        </div>
      </section>

      <DocRule />

      <section className="section" data-screen-label="developers / docs split">
        <div className="container">
          <div className="doc">
            <div className="doc-head">
              <span className="eyebrow">docs split</span>
              <h2 className="display-l">
                Humans read this page. Agents read the <em>manifest.</em>
              </h2>
            </div>
            <ol className="doc-list numbered linked">
              <li>
                <Link className="doc-row" href="/mcp">
                  <span className="num">01</span>
                  <h3>MCP page.</h3>
                  <p>Human-readable server metadata, transport notes, config reminders, and tool list.</p>
                  <span className="arr-link">Open /mcp {"->"}</span>
                </Link>
              </li>
              <li>
                <a className="doc-row" href="/mcp/manifest.json">
                  <span className="num">02</span>
                  <h3>Manifest JSON.</h3>
                  <p>Machine-readable tool surface for agent crawlers and registry submissions.</p>
                  <span className="arr-link">Open JSON {"->"}</span>
                </a>
              </li>
              <li>
                <a className="doc-row" href="/llms.txt">
                  <span className="num">03</span>
                  <h3>llms.txt.</h3>
                  <p>Short product summary, install links, source pages, and agent docs in crawler-friendly text.</p>
                  <span className="arr-link">Open llms.txt {"->"}</span>
                </a>
              </li>
            </ol>
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

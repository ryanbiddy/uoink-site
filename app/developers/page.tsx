import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { GITHUB_URL, SitePage } from "../content/pages";
import { MCP_TOOL_COUNT, mcpTools } from "../content/mcp-tools";

const page: SitePage = {
  id: "agents",
  route: "/developers",
  mode: "mode-light",
  title: "Uoink for Developers: Local MCP Tools for Source Research",
  description:
    "Connect Uoink to Claude Desktop, Cursor, Cline, Continue, and ChatGPT Desktop with local MCP tools for source capture and corpus search.",
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
  {
    name: "Claude Desktop",
    body: `{
  "mcpServers": {
    "uoink": {
      "command": "%LOCALAPPDATA%\\\\Uoink\\\\uoink_mcp.exe",
      "args": []
    }
  }
}`,
  },
  {
    name: "Cursor",
    body: `{
  "mcpServers": {
    "uoink": {
      "command": "%LOCALAPPDATA%\\\\Uoink\\\\uoink_mcp.exe",
      "args": []
    }
  }
}`,
  },
  {
    name: "Cline / Continue",
    body: `{
  "name": "uoink",
  "transport": "stdio",
  "command": "%LOCALAPPDATA%\\\\Uoink\\\\uoink_mcp.exe"
}`,
  },
];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route },
  twitter: { title: page.title, description: page.description },
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
                Uoink runs a local MCP server with {MCP_TOOL_COUNT} tools for capture, search, writing, citations, hooks, comments, and source health.
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
                {/* ChatGPT logo source: https://openai.com/brand/; official ChatGPT/OpenAI asset, unmodified integration callout. */}
                <span className="logo-chip brand-mark-pill logo-mark logo-dark" aria-label="ChatGPT">
                  <img src="/assets/brand-logos/chatgpt.svg" alt="ChatGPT" width="30" height="30" loading="lazy" decoding="async" />
                </span>
                {/* Cursor logo source: https://cursor.com/; official Cursor site asset, unmodified integration callout. */}
                <span className="logo-chip brand-mark-pill logo-mark" aria-label="Cursor">
                  <img src="/assets/brand-logos/cursor.svg" alt="Cursor" width="30" height="30" loading="lazy" decoding="async" />
                </span>
                {/* Obsidian logo source: https://obsidian.md/brand; official Obsidian brand asset, unmodified integration callout. */}
                <span className="logo-chip brand-mark-pill logo-mark" aria-label="Obsidian">
                  <img src="/assets/brand-logos/obsidian.svg" alt="Obsidian" width="30" height="30" loading="lazy" decoding="async" />
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
              <span className="ln k">write_tweet(corpus_id)</span>
              <span className="ln hl">draft from source with creator credit intact</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="developers / configs" id="configs">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">client config</span>
            <h2 className="display-l">
              Stdio first. Local paths generated after <em>install.</em>
            </h2>
            <p className="lede">
              These snippets use placeholder paths. Uoink setup page generates the real command for your machine after install.
            </p>
          </div>
          <div className="docs-main">
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

      <section className="section" data-screen-label="developers / tool catalog">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">tool catalog</span>
            <h2 className="display-l">
              The public tool names agents should <em>read.</em>
            </h2>
            <p className="lede">
              The manifest remains canonical for schemas. This page keeps the names visible for humans, crawlers, and agents evaluating the integration.
            </p>
          </div>
          <div className="docs-main">
            {mcpTools.map(([name, description]) => (
              <div className="tool-row" key={name}>
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
              <p className="chat-bubble user">Uoink these three competitor videos, classify their hooks, and write a launch memo with citations.</p>
              <div className="mini-heading">result</div>
              <p className="chat-bubble assistant">The agent captures each source, polls jobs, fetches corpora, classifies hooks, searches your library, then writes the memo into your workspace.</p>
            </div>
            <div className="log">
              <div className="mini-heading">tool sequence</div>
              <pre className="mcp-log" style={{ margin: 0, whiteSpace: "pre-wrap" }}>{`uoink_video(url_1)
uoink_video(url_2)
uoink_video(url_3)
get_job_status(job_id)
get_uoink_corpus(corpus_id)
classify_hook(corpus_id)
search_uoinks("launch narrative")
write_blog(corpus_set)`}</pre>
            </div>
          </div>
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

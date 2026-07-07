import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { GITHUB_URL, SitePage } from "../content/pages";
import { mcpTools } from "../content/mcp-tools";

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
      "command": "C:\\\\Users\\\\YOUR_USERNAME\\\\AppData\\\\Local\\\\Uoink\\\\python\\\\python.exe",
      "args": [
        "C:\\\\Users\\\\YOUR_USERNAME\\\\AppData\\\\Local\\\\Uoink\\\\uoink_mcp.py"
      ]
    }
  }
}`,
  },
  {
    name: "Cursor",
    body: `{
  "mcpServers": {
    "uoink": {
      "command": "C:\\\\Users\\\\YOUR_USERNAME\\\\AppData\\\\Local\\\\Uoink\\\\python\\\\python.exe",
      "args": [
        "C:\\\\Users\\\\YOUR_USERNAME\\\\AppData\\\\Local\\\\Uoink\\\\uoink_mcp.py"
      ]
    }
  }
}`,
  },
  {
    name: "Cline / Continue",
    body: `{
  "name": "uoink",
  "transport": "stdio",
  "command": "C:\\\\Users\\\\YOUR_USERNAME\\\\AppData\\\\Local\\\\Uoink\\\\python\\\\python.exe",
  "args": [
    "C:\\\\Users\\\\YOUR_USERNAME\\\\AppData\\\\Local\\\\Uoink\\\\uoink_mcp.py"
  ]
}`,
  },
];

const toolGroups = [
  {
    title: "Core stdio tools",
    dek: "The core daily path for capture, search, comments, hooks, citations, and health.",
    names: [
      "uoink_video",
      "uoink_playlist",
      "get_job_status",
      "cancel_job",
      "list_recent_uoinks",
      "search_uoinks",
      "get_uoink_corpus",
      "analyze_comments",
      "classify_hook",
      "get_taxonomy",
      "get_citation_map",
      "get_uoink_health",
      "find_mentions",
      "get_transcript_reliability",
    ],
  },
  {
    title: "Library, role, and live status",
    dek: "Local reads and setup helpers that shape the library around the user's workflow.",
    names: ["analyze_self_channel", "get_schema_version", "get_user_role", "set_user_role", "check_live_status"],
  },
  {
    title: "Podcast and mobile bridge",
    dek: "RSS feeds, WhisperX checks, monitored playlists, and mobile save-to-playlist workflows.",
    names: [
      "add_podcast_feed",
      "list_podcast_feeds",
      "remove_podcast_feed",
      "poll_podcast_feed",
      "list_podcast_episodes",
      "download_podcast_episode",
      "get_whisperx_status",
      "transcribe_podcast_episode",
      "add_monitored_playlist",
      "list_monitored_playlists",
      "remove_monitored_playlist",
      "poll_monitored_playlist",
      "list_monitored_playlist_events",
    ],
  },
  {
    title: "Memory, facets, and workspace assembly",
    dek: "Taste memory, engagement signals, facet filters, workspace planning, and corpus critique.",
    names: [
      "get_user_taste",
      "get_user_memory",
      "update_user_taste",
      "get_engagement_signal",
      "classify_facets",
      "query_by_facets",
      "get_facet_taxonomy",
      "assemble_workspace",
      "critique_against_corpus",
      "list_workspaces",
      "get_workspace",
    ],
  },
  {
    title: "Claims, scripts, and Writing Studio",
    dek: "Evidence capture, script versions, shot lists, tweets, blogs, and voice anchors.",
    names: [
      "extract_claims",
      "verify_claim",
      "list_claims",
      "get_claim",
      "generate_script",
      "revise_script",
      "get_shot_list",
      "list_scripts",
      "get_script",
      "write_tweet",
      "write_blog",
      "list_writing_pieces",
      "get_writing_piece",
      "add_style_anchor",
      "list_style_anchors",
      "remove_style_anchor",
    ],
  },
  {
    title: "Universal page and thread capture",
    dek: "Page and Reddit-thread capture plus allowed-site controls for the local helper.",
    names: ["uoink_page", "uoink_reddit_thread", "list_allowed_sites", "add_allowed_site", "remove_allowed_site"],
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
                Uoink runs a local Model Context Protocol (MCP) server on your machine. The stdio path gives Claude Desktop, Cursor, and Cline all 64 tools to capture, search, cite, classify, and write from your corpus.
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
              Stdio and HTTP <em>transports.</em>
            </h2>
            <p className="lede">
              Configure stdio connections in your agent client, or query the programmatic HTTP endpoint.
            </p>
            <p className="body-l">
              Uoink runs a local Model Context Protocol (MCP) server exposing all 64 tools. You can connect using either the standard stdio transport as a local subprocess, or query the local HTTP (SSE) endpoint.
            </p>
            
            <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--ink-dim)', marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--cream)' }}>HTTP (SSE) Transport Details</h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--parchment)' }}><strong>Endpoint URL:</strong> <code>http://localhost:5179/mcp/v1</code></p>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--parchment)' }}><strong>Authentication:</strong> Include the header <code>X-Uoink-Token</code> on every request.</p>
              <p style={{ margin: '0', fontSize: '14px', color: 'var(--parchment)' }}><strong>Token Location:</strong> Read the token string from the local file <code>%LOCALAPPDATA%\Uoink\token.txt</code> (or <code>~/Library/Application Support/Uoink/token.txt</code> on macOS).</p>
            </div>
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
              The manifest remains canonical for schemas. This page keeps the public tool names readable for humans, crawlers, and agents without turning the page into one endless list.
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

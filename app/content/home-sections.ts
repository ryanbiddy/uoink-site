// Capture facts: product README, CHANGELOG and uoink_mcp_tools.py at v3.10.0.
// Client routes: docs/connect-your-agent.md. Testing: 3.10.0 release notes
// and the site's existing tested_clients. A recipe is not a tested connection.
const sources = [
  ["YouTube", "Videos, Shorts, channels and playlists", "Keep the transcript with timestamps, screenshots, top comments, channel context and metadata. Follow channels and playlists for new uploads."],
  ["Podcasts", "RSS and Atom feeds", "Watch feeds for new episodes and metadata. Turn on Auto-ingest per feed to download audio, transcribe it locally and add it to your library."],
  ["X / Twitter", "Posts, threads, articles and video", "Save post text, author credit, thread context and articles, plus video transcripts. Articles behind a login may need in-page capture from the extension."],
  ["Reddit", "Threads and top comments", "Keep the thread and its top comments together as readable Markdown in your library."],
  ["Web pages and articles", "Readable text", "Extract the page's readable text into the same local library as your videos and threads."],
  ["Images", "Screenshots, memes and diagrams", "Save PNG, JPEG or WebP images. Search by caption, filename and source. No cloud OCR or vision service runs."],
  ["Your own notes", "Text and Markdown", "Save a thought with an optional title. Your notes join the same library your AI can search and read."],
  ["TikTok", "Short videos", "Keep the video, creator credit, thumbnail, caption and transcript when available. Capture depends on the platform allowing the fetch."],
  ["Instagram Reels", "Short videos", "Keep the video, creator credit, thumbnail, caption and transcript when available. Capture depends on the platform allowing the fetch."],
] as const;

export const HOME_SOURCES_HTML = `
<section class="section home-catalog" data-screen-label="home / sources" id="pull-from" aria-labelledby="sources-title">
  <div class="container">
    <div class="home-section-head">
      <span class="eyebrow">Your sources, one library</span>
      <h2 class="display-l" id="sources-title">Pull from</h2>
      <p class="lede">Save what you watch, read and write. Here's what Uoink keeps.</p>
    </div>
    <ul class="home-card-grid source-grid">
      ${sources.map(([name, kind, detail]) => `<li class="home-card source-card"><h3>${name}</h3><p class="source-kind">${kind}</p><p>${detail}</p></li>`).join("\n      ")}
    </ul>
    <aside class="home-discovery" aria-labelledby="discovery-title">
      <h3 id="discovery-title">Optional discovery with ScrapeCreators</h3>
      <p>Find candidates on YouTube, YouTube Shorts, TikTok and Instagram, then choose up to ten for the normal capture queue. Discovery is off by default. It needs your own key, consent to spend paid credits and a daily credit cap (25 by default). Agents need a separate opt-in. Discovery saves candidates; it does not capture them automatically.</p>
    </aside>
    <p class="doc-links"><a class="arr-link" href="/sources">Explore sources and capture details →</a></p>
  </div>
</section>`;

function chip(name: string, status?: string) {
  return `<li class="client-chip"><span>${name}</span>${status ? `<small>${status}</small>` : ""}</li>`;
}

const codingRecipes = ["VS Code", "Gemini CLI", "Windsurf", "Cline", "Zed", "Goose", "OpenCode", "Warp", "JetBrains Junie", "Amp", "Roo Code", "Kilo Code", "Continue"];

export const HOME_AI_HTML = `
<section class="section home-catalog" data-screen-label="home / AI" id="works-with" aria-labelledby="ai-title">
  <div class="container">
    <div class="home-section-head">
      <span class="eyebrow">Bring the AI you use</span>
      <h2 class="display-l" id="ai-title">Works with your AI</h2>
      <p class="lede">Connect an agent to your local library, or copy a source into chat. MCP and command-line agents need access to the Windows PC holding your library.</p>
    </div>
    <div class="home-card-grid ai-grid">
      <article class="home-card">
        <h3>One-click setup</h3>
        <ul class="client-chips">${chip("Claude Desktop", "MCP tested")}</ul>
        <p>Install the .mcpb bundle for Claude Desktop. No config editing needed.</p>
        <p class="client-note">Earlier MCP testing. The new 3.10.0 setup recipe has not been tested.</p>
      </article>
      <article class="home-card coding-clients">
        <h3>Coding agents and IDEs</h3>
        <ul class="client-chips tested-clients">${chip("Claude Code", "3.10.0 tested")}${chip("Codex CLI", "3.10.0 tested")}${chip("Cursor", "MCP tested")}</ul>
        <p class="client-note">Claude Code 2.1.302 and Codex CLI 0.153.4 saved a note and listed it back over MCP on a clean, isolated 3.10.0 install. Claude Code listed all 91 tools. Cursor retains earlier MCP testing; its new recipe and install button are untested.</p>
        <p class="client-label">Setup recipe only, not yet tested</p>
        <ul class="client-chips">${codingRecipes.map(name => chip(name)).join("")}</ul>
      </article>
      <article class="home-card">
        <h3>Agent harnesses</h3>
        <p class="client-label">Setup recipe only, not yet tested</p>
        <ul class="client-chips">${["pi", "Hermes Agent", "OpenClaw"].map(name => chip(name)).join("")}</ul>
        <p>Load the Uoink skill and use the <code>uoink</code> command from a local shell. Hermes Agent also has an MCP recipe.</p>
        <p class="client-note">The skill and CLI path was tested in Claude Code with no MCP server. These three harnesses were not tested.</p>
      </article>
      <article class="home-card">
        <h3>Local-model apps</h3>
        <p class="client-label">Setup recipe only, not yet tested</p>
        <ul class="client-chips">${["LM Studio", "Open WebUI", "AnythingLLM", "Jan", "Cherry Studio", "Msty", "LibreChat"].map(name => chip(name)).join("")}</ul>
        <p>Use a model that supports tool calls. Open WebUI's recipe needs a local mcpo bridge; its native MCP support is unverified. Check the recipe against your installed app.</p>
      </article>
      <article class="home-card">
        <h3>Copy and paste</h3>
        <ul class="client-chips">${chip("ChatGPT")}${chip("claude.ai")}</ul>
        <p>Copy a capture, then paste the transcript and a paste-safe set of screenshots into chat.</p>
        <p class="client-note">This is the clipboard path. Uoink does not connect to ChatGPT or claude.ai over MCP.</p>
      </article>
    </div>
    <div class="home-setup-link">
      <p><code>uoink connect --list</code> prints setup for 38 tools.</p>
      <p class="client-note">The list includes clients, integrations and guidance for routes with limits. Run <code>uoink connect &lt;client&gt;</code> for its config or instructions.</p>
      <a class="arr-link" href="/developers">Connect your AI →</a>
    </div>
  </div>
</section>`;

export const HOME_FEATURES_HTML = `
<section class="section home-catalog" data-screen-label="home / living library" id="living-library" aria-labelledby="library-title">
  <div class="container">
    <div class="home-section-head">
      <span class="eyebrow">Use what you saved</span>
      <h2 class="display-l" id="library-title">Find the moment. Cite the source.</h2>
    </div>
    <ul class="home-card-grid">
      <li class="home-card"><h3>Cite with timestamps</h3><p>Search inside saved videos for the passage you need.<br>Give your AI excerpts with timestamps and source links.</p></li>
      <li class="home-card"><h3>Standing capture</h3><p>Follow YouTube channels, playlists and podcast feeds.<br>Enable capture to bring new uploads and episodes into your library.</p></li>
      <li class="home-card"><h3>Research playbooks</h3><p>Find outliers, mine comments or study a creator across five playbooks.<br>Uoink supplies cited evidence from your library; your AI writes the report.</p></li>
    </ul>
    <p class="doc-links"><a class="arr-link" href="/features">All features →</a><a class="arr-link" href="/changelog">What's new →</a></p>
  </div>
</section>`;

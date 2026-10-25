const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, file);

const release = require("../content/release.json");
const { pages, HOME_MOVED_CONTENT, VERSION, VERSION_NUMBER, DOWNLOAD_URL, INSTALLER_SIZE } = require("../app/content/pages.ts");
const { mcpTools, mcpStdioToolNames, MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT } = require("../app/content/mcp-tools.ts");
const { CLAUDE_CODE_COMMAND, MCP_CURSOR_CONFIG, MCP_STDIO_CONFIG } = require("../app/content/mcp-config.ts");
const { features } = require("../app/features/feature-data.ts");
const { AGENT_SETUP_HTML } = require("../app/content/agent-setup.ts");
const { PRODUCT_STATUS, MAC_PREVIEW_STATUS } = require("../app/content/product-status.ts");
const manifest = JSON.parse(fs.readFileSync("public/mcp/manifest.json", "utf8"));
const path = require("node:path");
function walk(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
function checkMacDownloads(text, file) {
  assert(!/\.(?:dmg|pkg)(?:["'\s?#<]|$)/i.test(text), `${file}: Mac installer URL`);
  for (const [link, href, body] of [...text.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(match => [match[0], match[1], match[2]])) {
    const label = body.replace(/<[^>]*>/g, " ");
    const mac = /\bmac\b|macos|darwin|apple silicon/i.test(`${href} ${label}`);
    const download = /\bdownload\b|releases\/download|installer|\.(?:zip|tar|gz)\b/i.test(link);
    assert(!(mac && download), `${file}: Mac download offered: ${href}`);
  }
}
// Guard the guard: reject installer files and download calls to action, even
// when a download endpoint has no file extension.
for (const unsafe of ['<a href="/build.dmg">Preview</a>', '<a href="/build.pkg">Preview</a>', '<a href="/download">Download for Mac</a>', '<a href="/mac-preview.zip">Get preview</a>']) {
  assert.throws(() => checkMacDownloads(unsafe, "regression fixture"));
}
for (const file of walk("out").filter(file => /\.(?:html|txt|json)$/.test(file))) {
  const text = fs.readFileSync(file, "utf8");
  checkMacDownloads(text, file);
  assert(!/No Mac build scheduled|no scheduled Mac build|no Mac installer or scheduled Mac release/i.test(text), `${file}: stale Mac status`);
  for (const [, os] of text.matchAll(/"operatingSystem"\s*:\s*"([^"]+)"/g)) assert.equal(os, "Windows 10, Windows 11", `${file}: supported platform`);
}
// 3.11.1 fixes captures and persistent saves; the Mac preview is not in
// this release. The removable <!-- 3.11: NAME --> blocks are resolved, so no
// marker may remain. Mac copy may announce the preview but never offer a download.
assert.equal(MAC_PREVIEW_STATUS, "Mac (Apple Silicon, macOS 15 or later): preview coming soon.");
const contentFiles = ["app/content/pages.ts", "app/content/agent-setup.ts", "app/content/product-status.ts", "app/features/feature-data.ts", "app/compare/notebooklm/page.tsx", "app/developers/page.tsx", "public/llms.txt", "public/llms-full.txt", "public/.well-known/mcp.json", "public/.well-known/mcp/server-card.json"];
for (const file of contentFiles) {
  const text = fs.readFileSync(file, "utf8");
  assert(!/<!-- \/?3\.11:/.test(text), `${file}: leftover 3.11 block marker`);
  assert(!/No Mac build scheduled|no scheduled Mac build|no Mac installer or scheduled Mac release/i.test(text), `${file}: stale Mac status`);
}
assert.equal(PRODUCT_STATUS.mac.available, false, "3.11.1 ships no Mac build");
assert.equal(release.version, "3.11.1");
assert.equal(release.mcpSourceRef, `v${release.version}`);
assert.equal(release.installerSizeBytes, 390110203);
assert.equal(INSTALLER_SIZE, `${Math.round(release.installerSizeBytes / 1_000_000)} MB`);
assert.equal(VERSION, `v${release.version}`);
assert.equal(VERSION_NUMBER, release.version);
assert.equal(DOWNLOAD_URL, `https://github.com/ryanbiddy/uoink/releases/download/${VERSION}/Uoink-Setup-${release.version}.exe`);
assert(pages.install.html.includes(`href="${DOWNLOAD_URL}"`));
assert.equal(MCP_TOOL_COUNT, release.httpToolCount);
assert.equal(MCP_STDIO_TOOL_COUNT, release.stdioToolCount);
assert.equal(mcpTools.length, release.httpToolCount);
assert.equal(new Set(mcpTools.map(([name]) => name)).size, release.httpToolCount);
assert.equal(manifest.version, release.version);
assert.equal(manifest.tool_count, release.httpToolCount);
assert.equal(manifest.stdio_tool_count, release.stdioToolCount);
assert.deepEqual(manifest.tools.map(t => t.name), mcpTools.map(([name]) => name));
assert.deepEqual(manifest.tools.filter(t => t.transports.includes("stdio")).map(t => t.name).sort(), [...mcpStdioToolNames].sort());
assert(manifest.tools.every(t => t.description && t.inputSchema));
assert.equal(release.stdioToolCount, release.httpToolCount);
assert(manifest.tools.every(t => t.transports.includes("stdio") && t.transports.includes("http")));
for (const name of ["get_playbook_input", "discover_candidates", "queue_discovered"]) {
  assert(mcpStdioToolNames.includes(name), `Missing stdio tool: ${name}`);
  assert(manifest.tools.some(tool => tool.name === name), `Missing HTTP tool: ${name}`);
}
const playbookSchema = manifest.tools.find(tool => tool.name === "get_playbook_input").inputSchema;
assert.deepEqual(playbookSchema.properties.playbook.enum, ["outlier-posts", "transcript-intel", "comment-mining", "creator-teardown", "repurpose-pack"]);
assert(fs.readFileSync("app/content/mcp-tools.ts", "utf8").startsWith(`// Generated for Uoink ${release.version} `));
for (const file of ["public/.well-known/mcp.json", "public/.well-known/mcp/server-card.json"]) {
  const card = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(card.version, release.version);
  assert.equal(card.platform, PRODUCT_STATUS.mac.visible, `${file}: Windows support and Mac preview status`);
  assert.equal(card.name, "io.github.ryanbiddy/uoink");
  assert(card.install.notes.includes(`about ${INSTALLER_SIZE}`));
  assert.equal(card.tool_count, release.httpToolCount);
  assert.equal(card.stdio_tool_count, release.stdioToolCount);
  assert.deepEqual(card.transports[0].tested_clients, ["Claude Desktop", "Claude Code", "Cursor", "Codex CLI"]);
  assert.deepEqual(JSON.parse(MCP_STDIO_CONFIG).mcpServers.uoink, {command:card.transports[0].command,args:card.transports[0].args,env:card.transports[0].env});
  assert.equal(card.install.mcpb_bundle, `https://github.com/ryanbiddy/uoink/releases/download/${VERSION}/uoink-${release.version}.mcpb`);
}
const cursorServer = JSON.parse(MCP_CURSOR_CONFIG).mcpServers.uoink;
assert.deepEqual(cursorServer, { ...JSON.parse(MCP_STDIO_CONFIG).mcpServers.uoink, env: { PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1", UOINK_MCP_TOOLSET: "core" } });
for (const page of [pages.mcp, pages.developers]) {
  for (const fact of ["Claude Code", "UOINK_MCP_TOOLSET=core", "previous 35-tool set", "first 40 tools", "without the Uoink helper running", "claude mcp add --scope user --transport stdio uoink"]) assert(page.html.includes(fact), `${page.id}: ${fact}`);
  assert(page.html.includes(AGENT_SETUP_HTML), `${page.id}: shared agent setup`);
}
for (const fact of ["official MCP Python SDK 2.3.0", "Claude Desktop, Claude Code, Cursor, and Codex", "2026-07-28 MCP protocol", "No action is needed", "Linux location where the client has a Linux setup", "Continue is set up by hand"]) assert(AGENT_SETUP_HTML.includes(fact), `Agent setup 3.11: ${fact}`);
for (const fact of ["no longer needs every word", "<code>match</code>", "<code>mode</code>", "<code>strict</code>", "<code>hybrid</code>", "Exact words", "A person turns it on in Uoink Settings", "Gemma terms", "about 330 MB", "passage_verified", "The tool list is unchanged"]) assert(AGENT_SETUP_HTML.includes(fact), `Agent setup smarter-search: ${fact}`);
assert(!AGENT_SETUP_HTML.includes("On a Mac"), "Agent setup: Mac section");
// No Mac build ships, so pages keep the Windows-only copy.
assert(pages.install.html.includes(`<h3>${MAC_PREVIEW_STATUS}</h3>`) && pages.install.html.includes("Windows 10/11 only / About"), "install: preview status and Windows support");
assert(pages.home.html.includes(`${PRODUCT_STATUS.mac.visible}</p>`) && HOME_MOVED_CONTENT['/install'].includes("Mac status ->"), "home platform fact and relocated install status");
assert(pages.mcp.html.includes(`platform: ${PRODUCT_STATUS.mac.visible}</pre>`), "mcp: preview status");
assert(pages.about.html.includes(`Windows 10/11 only<small>${MAC_PREVIEW_STATUS}</small>`), "about: preview status");
assert(fs.readFileSync("app/developers/page.tsx", "utf8").includes("__html: AGENT_SETUP_HTML"));
for (const fact of ["Use Uoink from any AI agent", "uoink connect --list", "48 clients and integrations", "10 of them new in 3.11.0", "45 recipes are checked", "verification status", "uoink connect claude-code", "uoink connect cursor", "uoink connect codex", "uoink connect vscode", "does not edit client settings", "Add to Cursor", "Add to VS Code", "uoink skill install --to &lt;dir&gt;", "Claude Code, Codex, pi, Hermes Agent, and OpenClaw", "claude plugin marketplace add ryanbiddy/uoink-agent-kit", "claude plugin install uoink@uoink", 'uoink search "working memory" --limit 5', "uoink recent --limit 10", 'uoink note "A useful thought" --title "Research note"', "What was tested for 3.11.1", "Agent Install 27 passed 11/11 checks", "installed 3.11.1 build in an isolated profile", "Claude Code 2.1.310 (haiku)", "get_schema_version", "35 in core", "91 in modern", "migration 32", "no network sends observed in that check", "bundled ffprobe", "1400 and 1100 pixels wide", "Helper writes persisted across a restart", "Codex CLI was not re-tested in receipt 27", "Earlier 3.11.0 testing", "Claude Code 2.1.308 over MCP: all 91 tools listed; a tool called", "Codex CLI 0.153.4 over MCP: two tools called", "with no MCP server", "tool calls were not run end to end", "Not yet tested: Gemini CLI and pi", "every other recipe", "https://github.com/ryanbiddy/uoink/blob/main/llms-install.md", "Uoink does not connect to the ChatGPT app over MCP"]) assert(AGENT_SETUP_HTML.includes(fact), `Agent setup: ${fact}`);
assert(!AGENT_SETUP_HTML.includes("38 clients"), "Agent setup: stale client count");
for (const feature of features) {
  for (const name of feature.mcpTools) assert(mcpTools.some(([tool]) => tool === name), `${feature.slug}: unknown tool ${name}`);
}
for (const text of ["Living Library and research", "Clip search + evidence cards", "Standing capture", "Library reach over MCP", "Cited range export", "Chapter navigation", "Five research playbooks", "ScrapeCreators", "25-credit daily cap", "Caption rate limits", "five-step strip"]) assert(HOME_MOVED_CONTENT['/changelog'].includes(text), `Relocated to changelog: ${text}`);
for (const text of ["unsigned", "SmartScreen will show a warning", "More info → Run anyway", INSTALLER_SIZE, "No admin rights needed", "reload the extension once", "bkcapfidedhfcjpmjabeopfbcjcbmdmi", "reapply your extension preferences", "saved captures are unaffected"]) assert(pages.install.html.includes(text), text);
for (const text of ["Connected agents can start paid Anthropic calls", "even when automatic analysis is off", "ScrapeCreators", "credit confirmation", "separately enabled agent discovery", "typed handle, channel ID, or query", "request identity", "normalized candidates", "credit accounting", "partial and failed runs", "daily purge", "older than 90 days", "up to 30 days old"]) assert(pages.privacy.html.includes(text), text);
const versions = [...pages.changelog.html.matchAll(/<h2>v(\d+\.\d+\.\d+)/g)].map(match => match[1]);
assert.deepEqual(versions, ["3.11.1", "3.11.0", "3.10.0", "3.9.3", "3.9.2", "3.9.1", "3.9.0", "3.7.0", "3.6.0", "3.5.0", "3.4.1", "3.4.0"]);
assert.equal(versions[0], release.version);
// The patch dates come from the product changelog. Preserve the undated
// 3.9.0 entry and the five earlier published dates.
assert.deepEqual([...pages.changelog.html.matchAll(/<time datetime="([^"]+)"/g)].map(match => match[1]), ["2026-10-25", "2026-10-22", "2026-10-19", "2026-10-19", "2026-10-18", "2026-10-18", "2026-07-24", "2026-07-08", "2026-07-08", "2026-07-07", "2026-07-07"]);
const entryList = [...pages.changelog.html.matchAll(/<h2>v(\d+\.\d+\.\d+)([\s\S]*?)(?=<h2>|$)/g)];
const entries = Object.fromEntries(entryList.map(match => [match[1], match[2]]));
const newest = entryList[0][2];
assert(newest.includes('<time datetime="2026-10-25">'), "Newest changelog entry needs its release date");
for (const fact of ["Caption-less X videos", "Whisper model you have already downloaded in Settings", "No transcript:", "Paywalls, login walls", "complete, truncated or unknown", "22 helper write paths", "per-user scheduled task", "Quit stays quit", "127.0.0.1:5179", "91 tools over stdio and 91 in the HTTP registry", "35 in core mode", "Agent Install 27 passed 11/11 checks", "Claude Code 2.1.310 (haiku)", "get_schema_version", "migration 32", "91 full, 35 core and 91 modern", "no network sends observed in that check", "bundled ffprobe audio probe", "no isolated startup entries", "1400 and 1100 pixels wide", "clean uninstall", "helper writes persisted across a restart", "Codex CLI was not re-tested in receipt 27"]) assert(newest.includes(fact), `3.11.1: ${fact}`);
for (const fact of ["MCP SDK 2.3.0", "official MCP Python SDK 2.3.0", "Claude Desktop, Claude Code, Cursor, and Codex keep connecting as before", "2026-07-28 MCP protocol", "No action is needed", "Linux location where the client has a Linux setup", "Continue is set up by hand", "keeps a backup", "48 clients and integrations, 10 more than 3.10.0", "45 are checked", "verification status", "not yet tested in the client itself", "installed 3.11.0 build in an isolated profile", "Claude Code 2.1.308 listed all 91 tools and called one", "Codex CLI 0.153.4 called two tools", "Installing over the previous release keeps your library and saved captures"]) assert(entries["3.11.0"].includes(fact), `3.11.0: ${fact}`);
for (const fact of ["Smarter search", "no longer requires every word", "30 questions over 693 saved sources", "top 5 for 24 questions", "found it for 10", "27 of 30", "found 28", "Semantic search", "Gemma terms", "about 330 MB", "works offline after setup", "never bundled with Uoink", "Exact words", 'match: "strict"', "passage_verified", "<code>find_mentions</code> takes <code>match</code>", "91 tools, or 35", "Updating rebuilds the local keyword search index once"]) assert(entries["3.11.0"].includes(fact), `3.11.0 smarter-search: ${fact}`);
for (const fact of ["Anonymous usage counts are off by default", "Share anonymous usage counts", "never sends content", "Settings shows the exact report before it is sent"]) assert(entries["3.11.0"].includes(fact), `3.11.0 usage-counts: ${fact}`);
assert(pages.about.html.includes("none from Uoink unless you opt in"), "about: opt-in usage counts");
for (const fact of ['uoink search "working memory" --limit 5', "uoink recent --limit 10", 'uoink note "A useful thought" --title "Research note"', "Local reads work without the helper running", "Capture and paid tools keep their existing gates", "Add the uoink command to PATH for AI agents", "uoink status", "Claude Code, Codex, pi, Hermes Agent, and OpenClaw", "uoink skill install --to &lt;dir&gt;", "claude plugin marketplace add ryanbiddy/uoink-agent-kit", "claude plugin install uoink@uoink", "uoink connect --list", "38 clients and integrations", "does not edit client settings", "Add to Cursor", "Add to VS Code", "91 tools by default", "Consent gates are unchanged", "no data or settings changes besides the optional PATH entry", "no new index or migration", "keeps your library and saved captures", "Claude Code 2.1.302 over MCP", "skill and CLI only", "Codex CLI 0.153.4 over MCP", "tool calls were not run end to end", "Not yet tested: Gemini CLI and pi", "every other recipe"]) assert(entries["3.10.0"].includes(fact), `3.10.0: ${fact}`);
for (const text of ["official MCP registry", "io.github.ryanbiddy/uoink", "Clients and directories that read the registry can find it", "HTTP MCP now uses the same flattened tool schemas as stdio", "HTTP clients no longer drop Uoink", "server still checks the exact schema for every call", "Activity reads are faster", "461 to 286 ms", "10,000 items in local runs", "no data or settings changes", "Installing over 3.9.2 keeps your library and saved captures"]) assert(entries["3.9.3"].includes(text), `3.9.3: ${text}`);
for (const text of ["Every Uoink tool", "standard stdio connection", "Claude Desktop (.mcpb), Claude Code, and Cursor", `${release.stdioToolCount} tools over stdio and ${release.httpToolCount} in the HTTP registry`, "pages, X posts, Reddit threads, notes, and images", "writing, script, and workspace tools", "Library queue", "UOINK_MCP_TOOLSET=core", "previous 35-tool set", "Consent gates are unchanged", "no data or settings changes", "Installing over 3.9.1 keeps your library and saved captures"]) assert(entries["3.9.2"].includes(text), `3.9.2: ${text}`);
for (const text of ["canned-phrase warnings", "Voice DNA remains the voice spec", "reliability and test fixes", "no data or settings changes", "Installing over 3.9.0 keeps your library and saved captures"]) assert(entries["3.9.1"].includes(text), `3.9.1: ${text}`);
for (const text of ["First public release since v3.7.0", "3.8.x work was not published separately", "five steps", "cancellation request is refused once publication has started", "inside yt-dlp and the browser renderer", "_exports", "35 stdio tools and 91 HTTP tools"]) assert(entries["3.9.0"].includes(text), `3.9.0: ${text}`);
for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
  const text = fs.readFileSync(file, "utf8");
  for (const fact of [VERSION, `${release.stdioToolCount} tools over stdio`, `${release.httpToolCount} in the HTTP registry`, DOWNLOAD_URL, `about ${INSTALLER_SIZE}`, "Official MCP registry: io.github.ryanbiddy/uoink", "unsigned", "off by default", "five local research playbooks", "25-credit daily cap", "older than 90 days", "reload the extension once", "Anonymous usage counts are off by default", "SDK 2.3.0", "2026-07-28 MCP protocol", "Linux location where the client has a Linux setup", "Continue is set up by hand"]) assert(text.toLowerCase().includes(fact.toLowerCase()), `${file}: ${fact}`);
  assert(text.includes(`${PRODUCT_STATUS.mac.visible} Uoink ${VERSION} is free`), `${file}: Windows-only setup and Mac preview line`);
  for (const fact of ["no longer requires", "`match`", "`mode`", '"strict"', '"hybrid"', "find_mentions takes `match`", "passage_verified", "a person", "Uoink Settings", "Gemma terms", "EmbeddingGemma", "about 330 MB", "works offline after setup"]) assert(text.toLowerCase().includes(fact.toLowerCase()), `${file} smarter-search: ${fact}`);
  for (const fact of ["Chrome (tested); other Chromium browsers such as Edge and Brave may work but are not tested", "Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible.", CLAUDE_CODE_COMMAND, "Get-FileHash -Algorithm SHA256", "'/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART'", `${VERSION}/SHA256SUMS.txt`, '"UOINK_MCP_TOOLSET": "core"', "first 40 tools", "Uoink does not connect to the ChatGPT app over MCP"]) assert(text.includes(fact), `${file}: ${fact}`);
  assert(!text.includes("Do not claim"), `${file}: internal writer note`);
  for (const fact of ["uoink connect --list", "48 clients and integrations", "10 of them new in 3.11.0", "uoink connect codex", "uoink connect vscode", "uoink skill install --to <dir>", "Hermes Agent", "OpenClaw", "claude plugin marketplace add ryanbiddy/uoink-agent-kit", "claude plugin install uoink@uoink", 'uoink search "working memory" --limit 5', "uoink recent --limit 10", 'uoink note "A useful thought" --title "Research note"', "Add the uoink command to PATH for AI agents checked by default", "rebuilds the local keyword search index once", "Agent Install 27", "11/11", "Claude Code 2.1.310 (haiku)", "get_schema_version", "91 full / 35 core / 91 modern", "Codex CLI was not re-tested in receipt 27", "installed 3.11.0 build in an isolated profile", "Claude Code 2.1.308 over MCP (all 91 tools listed; a tool called)", "Codex CLI 0.153.4 over MCP (two tools called)", "skill and CLI only", "tool calls were not run end to end", "Not yet tested: Gemini CLI and pi", "https://github.com/ryanbiddy/uoink/blob/main/llms-install.md", `releases/tag/${VERSION}`]) assert(text.includes(fact), `${file}: ${fact}`);
  assert(!text.includes("38 clients"), `${file}: stale client count`);
  assert(!/v3\.(?:10|11)\.0\/|Uoink-Setup-3\.(?:10|11)\.0|uoink-3\.(?:10|11)\.0/.test(text), `${file}: stale download link`);
}
assert(fs.readFileSync("public/llms.txt", "utf8").split(/\r?\n/).includes("Official MCP registry: io.github.ryanbiddy/uoink"));
assert(pages.mcp.html.includes("Official MCP registry: <code>io.github.ryanbiddy/uoink</code>"));
assert(fs.readFileSync("app/developers/page.tsx", "utf8").includes("Official MCP registry: <code>io.github.ryanbiddy/uoink</code>"));
assert(fs.readFileSync("public/llms.txt", "utf8").trimEnd().split(/\r?\n/).length < 80);
// Opt-in usage counts: no page or crawler text may promise "no telemetry".
const telemetryText = [...Object.values(pages).map(page => [page.html, page.description, ...page.keywords].join("\n")), JSON.stringify(features), ...["public/llms.txt", "public/llms-full.txt", "app/compare/notebooklm/page.tsx", "app/developers/page.tsx"].map(file => fs.readFileSync(file, "utf8"))];
for (const text of telemetryText) assert(!/\bno[- ]telemetry\b|none in the app/i.test(text), `"no telemetry" without the opt-in exception: ${text.slice(0, 80)}`);
assert(features.find(feature => feature.slug === "no-cloud").whatItDoes.includes("Anonymous usage counts are off by default"), "no-cloud: opt-in usage counts");
assert(features.find(feature => feature.slug === "memory-search").whatItDoes.includes("Search no longer needs every word"), "memory-search: smarter search");
assert(HOME_MOVED_CONTENT['/changelog'].includes("Smarter search"), "changelog: relocated smarter search");
assert(pages.privacy.faq.some(item => item.question === "Does semantic search send my library anywhere?"), "privacy: semantic search FAQ");
const llmsFull = fs.readFileSync("public/llms-full.txt", "utf8");
for (const fact of ["Uoink-Setup-3.11.1.exe: 390,110,203 bytes (about 390 MB). SHA-256: `a411f413342f7c0d0a1d75d0ffc445f6fa3fbe525de32233d4e4d3670fb98fd1`.", "uoink-3.11.1.mcpb: SHA-256: `4db1dd3d18f594bd72da34586da11499b0df7c95e2d9d3135ae3243c98ae07da`."]) assert(llmsFull.includes(fact), `llms-full.txt checksums: ${fact}`);
assert.equal(release.installerSizeBytes.toLocaleString("en-US"), "390,110,203");
// The tool inventory line names the commit the manifest was generated from.
const manifestCommit = manifest.source.match(/@([0-9a-f]{40}):/)[1];
assert(llmsFull.includes(`Source: ${VERSION}, commit ${manifestCommit}.`), `llms-full.txt: tool inventory commit should be ${manifestCommit}`);
assert(fs.readFileSync("README.md", "utf8").includes(CLAUDE_CODE_COMMAND));
console.log(`PASS: ${VERSION}, ${MCP_TOOL_COUNT} registry schemas, ${MCP_STDIO_TOOL_COUNT} stdio names, discovery cards, config, ${features.length} feature tool lists, Living Library, research, privacy, installer, agent setup, release plus eleven earlier releases, crawler text, and checksums. Windows only; Mac preview coming soon, no Mac downloads.`);

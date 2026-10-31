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
const { PRODUCT_STATUS, MAC_PREVIEW_STATUS, MAC_DMG_NAME, MAC_DMG_URL, MAC_MCPB_NAME, MAC_MCPB_URL, MAC_EXTENSION_PATH } = require("../app/content/product-status.ts");
const manifest = JSON.parse(fs.readFileSync("public/mcp/manifest.json", "utf8"));
const path = require("node:path");
function walk(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }

// Release numbers that are not known until the 3.12.0 release is published use
// __NAME__ placeholders, and content/release.json carries installerSizeBytes 0.
// The Agent Install 30 summary is __RECEIPT30__ until that receipt lands.
// Every other assertion runs first; the check then fails, listing each one.
const PLACEHOLDER = /__(?:EXE_SIZE|EXE_SHA|MCPB_SHA|DMG_SIZE|DMG_SHA|MAC_MCPB_SHA|MACMCPB_SHA|RECEIPT30)__/g;
const pending = [];
const sizeKnown = release.installerSizeBytes > 0;
if (!sizeKnown) pending.push("content/release.json: installerSizeBytes is 0 (3.12.0 installer size in bytes)");
// Static copies say "about N MB". Once the size is known they must match release.json.
const sizeMatches = text => !sizeKnown || text.includes(`about ${INSTALLER_SIZE}`);

// The Mac preview ships from 3.11.2. A Mac download must be this release's DMG
// or its macOS Claude Desktop bundle; file names in prose are fine.
const MAC_DOWNLOADS = [MAC_DMG_URL, MAC_MCPB_URL];
function checkMacDownloads(text, file) {
  for (const [, url] of text.matchAll(/["'(=]((?:https?:)?\/[^"'()\s<>\\]*\.(?:dmg|pkg))(?=[\\"'\s?#<)]|$)/gi)) {
    assert.equal(url, MAC_DMG_URL, `${file}: Mac installer URL ${url}`);
  }
  for (const [link, href, body] of [...text.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(match => [match[0], match[1], match[2]])) {
    const label = body.replace(/<[^>]*>/g, " ");
    const mac = /\bmac\b|macos|darwin|apple silicon/i.test(`${href} ${label}`);
    const download = /\bdownload\b|releases\/download|installer|\.(?:zip|tar|gz)\b/i.test(link);
    assert(!(mac && download) || MAC_DOWNLOADS.includes(href), `${file}: Mac download outside this release: ${href}`);
  }
}
// Guard the guard: reject other installer files, other versions and download
// calls to action, even when a download endpoint has no file extension.
for (const unsafe of ['<a href="/build.dmg">Preview</a>', '<a href="/build.pkg">Preview</a>', '<a href="/download">Download for Mac</a>', '<a href="/mac-preview.zip">Get preview</a>', '<a href="https://github.com/ryanbiddy/uoink/releases/download/v3.11.1/Uoink-3.11.1-macos-arm64.dmg">Download for Mac</a>', '<a href="https://github.com/ryanbiddy/uoink/releases/download/v3.11.2/Uoink-3.11.2-macos-arm64.dmg">Download for Mac</a>']) {
  assert.throws(() => checkMacDownloads(unsafe, "regression fixture"));
}
for (const safe of [`<a href="${MAC_DMG_URL}">Download for Mac</a>`, `<a href="${MAC_MCPB_URL}">${MAC_MCPB_NAME}</a>`, `[${MAC_DMG_NAME}](${MAC_DMG_URL})`, `<code>${MAC_DMG_NAME}</code>`]) {
  assert.doesNotThrow(() => checkMacDownloads(safe, "regression fixture"));
}
const STALE_MAC = /No Mac build scheduled|no scheduled Mac build|no Mac installer or scheduled Mac release|preview coming soon/i;
for (const file of walk("out").filter(file => /\.(?:html|txt|json)$/.test(file))) {
  const text = fs.readFileSync(file, "utf8");
  checkMacDownloads(text, file);
  assert(!STALE_MAC.test(text), `${file}: stale Mac status`);
  for (const [, os] of text.matchAll(/"operatingSystem"\s*:\s*"([^"]+)"/g)) assert.equal(os, PRODUCT_STATUS.mac.operatingSystem, `${file}: supported platforms`);
}
// 3.11.2 adds the Mac preview (Apple Silicon, macOS 15 or later). The removable
// <!-- 3.11: NAME --> blocks are resolved, so no marker may remain.
assert.equal(MAC_PREVIEW_STATUS, "Mac preview for Apple Silicon (macOS 15 or later)");
assert.equal(MAC_DMG_URL, `https://github.com/ryanbiddy/uoink/releases/download/v${release.version}/Uoink-${release.version}-macos-arm64.dmg`);
assert.equal(MAC_MCPB_URL, `https://github.com/ryanbiddy/uoink/releases/download/v${release.version}/uoink-${release.version}-macos.mcpb`);
const contentFiles = ["app/content/pages.ts", "app/content/agent-setup.ts", "app/content/product-status.ts", "app/features/feature-data.ts", "app/compare/notebooklm/page.tsx", "app/developers/page.tsx", "public/llms.txt", "public/llms-full.txt", "public/.well-known/mcp.json", "public/.well-known/mcp/server-card.json"];
for (const file of contentFiles) {
  const text = fs.readFileSync(file, "utf8");
  assert(!/<!-- \/?3\.11:/.test(text), `${file}: leftover 3.11 block marker`);
  assert(!STALE_MAC.test(text), `${file}: stale Mac status`);
}
assert.equal(PRODUCT_STATUS.mac.available, true, "3.12.0 keeps the Mac preview");
assert.equal(release.version, "3.12.0");
assert.equal(release.mcpSourceRef, `v${release.version}`);
assert(Number.isInteger(release.installerSizeBytes) && release.installerSizeBytes >= 0, "installerSizeBytes is a byte count");
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
  assert(sizeMatches(card.install.notes), `${file}: installer size should be about ${INSTALLER_SIZE}`);
  assert.equal(card.tool_count, release.httpToolCount);
  assert.equal(card.stdio_tool_count, release.stdioToolCount);
  assert.deepEqual(card.transports[0].tested_clients, ["Claude Desktop", "Claude Code", "Cursor", "Codex CLI"]);
  assert.deepEqual(JSON.parse(MCP_STDIO_CONFIG).mcpServers.uoink, {command:card.transports[0].command,args:card.transports[0].args,env:card.transports[0].env});
  assert.equal(card.install.mcpb_bundle, `https://github.com/ryanbiddy/uoink/releases/download/${VERSION}/uoink-${release.version}.mcpb`);
  assert.equal(card.install.macos, "https://uoink.app/install#mac", `${file}: Mac install page`);
  assert.equal(card.install.mcpb_bundle_macos, MAC_MCPB_URL, `${file}: macOS Claude Desktop bundle`);
  assert(card.install.notes.includes("Mac preview (Apple Silicon, macOS 15 or later)") && card.install.notes.includes("notarized"), `${file}: Mac install notes`);
  assert(card.transports[0].note.includes("uoink connect <client>"), `${file}: Mac stdio paths`);
}
assert.equal(fs.readFileSync("public/.well-known/mcp.json", "utf8"), fs.readFileSync("public/.well-known/mcp/server-card.json", "utf8"), "Both server cards match");
const cursorServer = JSON.parse(MCP_CURSOR_CONFIG).mcpServers.uoink;
assert.deepEqual(cursorServer, { ...JSON.parse(MCP_STDIO_CONFIG).mcpServers.uoink, env: { PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1", UOINK_MCP_TOOLSET: "core" } });
for (const page of [pages.mcp, pages.developers]) {
  for (const fact of ["Claude Code", "UOINK_MCP_TOOLSET=core", "previous 35-tool set", "first 40 tools", "without the Uoink helper running", "claude mcp add --scope user --transport stdio uoink"]) assert(page.html.includes(fact), `${page.id}: ${fact}`);
  assert(page.html.includes(AGENT_SETUP_HTML), `${page.id}: shared agent setup`);
}
for (const fact of ["official MCP Python SDK 2.3.0", "Claude Desktop, Claude Code, Cursor, and Codex", "2026-07-28 MCP protocol", "No action is needed", "Linux location where the client has a Linux setup", "Continue is set up by hand"]) assert(AGENT_SETUP_HTML.includes(fact), `Agent setup 3.11: ${fact}`);
for (const fact of ["no longer needs every word", "<code>match</code>", "<code>mode</code>", "<code>strict</code>", "<code>hybrid</code>", "Exact words", "A person turns it on in Uoink Settings", "Gemma terms", "about 330 MB", "passage_verified", "The tool list is unchanged"]) assert(AGENT_SETUP_HTML.includes(fact), `Agent setup smarter-search: ${fact}`);
// The Mac preview: facts from the product's docs/mac/INSTALL.md, skills/uoink/SKILL.md and CHANGELOG.md.
assert(AGENT_SETUP_HTML.includes(PRODUCT_STATUS.mac.agentSetup), "Agent setup: Mac section");
for (const fact of ["<h3>On a Mac</h3>", "Apple Silicon with macOS 15 or later", "Uoink.app/Contents/Helpers/uoink", "does not change your shell or PATH", 'ln -s /Applications/Uoink.app/Contents/Helpers/uoink "$HOME/.local/bin/uoink"', "uoink connect &lt;client&gt;", "uoink connect claude-code", "does not edit client files", "~/Library/Application Support/Claude/claude_desktop_config.json", "~/.cursor/mcp.json", "~/.codex/config.toml", `href="${MAC_MCPB_URL}"`, "not the Windows <code>.mcpb</code>", "plugin's MCP entry is still for Windows", "Library mirroring is unavailable on Mac", "91 tools, or 35 in core mode", "On a Mac, Claude Code passed MCP acceptance (3.11.2); other clients are untested there"]) assert(AGENT_SETUP_HTML.includes(fact), `Agent setup Mac: ${fact}`);
// 3.11.2 has no tested claims (receipt 28 never landed). 3.12.0 cites Agent
// Install 30 ahead of the labeled 3.11.1 results.
assert(!AGENT_SETUP_HTML.includes("What was tested for 3.11.2"), "Agent setup: no 3.11.2 test claims");
assert(AGENT_SETUP_HTML.includes("<h3>What was tested for 3.12.0</h3>\n<p>Agent Install 30 tested the installed 3.12.0 build in an isolated profile:"), "Agent setup: 3.12.0 receipt 30");
assert(AGENT_SETUP_HTML.indexOf("What was tested for 3.12.0") < AGENT_SETUP_HTML.indexOf("What was tested for 3.11.1"), "Agent setup: newest receipt first");
assert(pages.install.html.includes(`<h3>${PRODUCT_STATUS.mac.heading}</h3>`) && pages.install.html.includes(`${PRODUCT_STATUS.mac.windowsLabel} / About`), "install: Mac preview heading and Windows support");
for (const fact of [PRODUCT_STATUS.mac.heroLink, `href="${MAC_DMG_URL}"`, "Download the Mac preview", "Apple Silicon Macs with macOS 15 or later", "Intel Macs are not supported", "signed with a Developer ID, notarized by Apple and stapled", "No security override is needed", "drag Uoink to the Applications shortcut", "Eject the mounted disk", "⌘⇧G", "<strong>Get the extension</strong> card copies", `<code>${MAC_EXTENSION_PATH}</code>`, `href="${MAC_MCPB_URL}"`, "not the Windows bundle", "Uoink doesn't update itself", "Library mirroring is unavailable", "macOS still credits Uoink's alerts to Script Editor", "Download for Mac"]) assert(pages.install.html.includes(fact), `install Mac: ${fact}`);
assert(!/Until 3\.12/.test(pages.install.html), "install Mac: 3.12 shipped without its own notifier");
// The install block that moved off home is folded into /install itself, so no
// second copy renders under the FAQ. /install has its own Mac entry and hero link.
assert(pages.home.html.includes(`${PRODUCT_STATUS.mac.visible}</p>`) && !HOME_MOVED_CONTENT['/install'] && pages.install.html.includes('<li id="mac">') && pages.install.html.includes('href="#mac"'), "home platform fact; install page carries the Mac entry");
// Install page: each step said once, with separate Windows and Mac paths.
const count = (text, needle) => text.split(needle).length - 1;
const installHtml = pages.install.html;
for (const [needle, times] of [["SmartScreen will show a warning", 1], ["<strong>Load unpacked</strong>", 2], ["pin Uoink so the Uoink button stays visible", 2], ["%LOCALAPPDATA%\\Uoink\\extension", 1], ["reload the extension once", 1], [`href="${DOWNLOAD_URL}"`, 3]]) {
  assert.equal(count(installHtml, needle), times, `install: "${needle}" appears ${times} time(s)`);
}
for (const id of ["windows", "mac", "extension"]) assert.equal(count(installHtml, `id="${id}"`), 1, `install: one #${id} entry`);
// No command line for the normal install; the terminal check is optional and lives in one callout.
assert(installHtml.includes("No command line needed.") && installHtml.includes("<h3>Optional: check from a terminal.</h3>"), "install: no command line, optional terminal check");
assert.equal(count(installHtml, "uoink status"), 1, "install: uoink status only in the optional check");
assert(installHtml.indexOf("uoink status") > installHtml.indexOf("Optional: check from a terminal."), "install: uoink status sits in the optional check");
// Supported sources match /sources: YouTube, X posts and video, podcasts, Reddit threads, web articles.
assert(installHtml.includes("X posts and videos, podcasts, Reddit threads and web articles") && !/YouTube (?:and|or) Reddit/.test(installHtml), "install: full source list");
assert(pages.home.html.includes("<li>YouTube, podcasts, X posts and videos, Reddit threads and web articles</li>"), "home: Save it lists every shipped source");
// The home hero offers both downloads: this release's Windows installer and the Mac preview DMG.
for (const [kind, href, label] of [["windows", DOWNLOAD_URL, "Download for Windows"], ["mac", MAC_DMG_URL, "Download for Mac (preview)"]]) {
  assert(new RegExp(`<a\\b[^>]*data-download="${kind}"[^>]*href="${href.replace(/[.?*+^$()[\]{}|\\/]/g, "\\$&")}"[^>]*>[\\s\\S]*?${label.replace(/[()]/g, "\\$&")}</a>`).test(pages.home.html), `home: ${label} links to ${href}`);
}
assert(pages.mcp.html.includes(`platform: ${PRODUCT_STATUS.mac.visible}</pre>`) && pages.mcp.html.includes("macos: https://uoink.app/install#mac"), "mcp: Mac preview status and install page");
assert(pages.about.html.includes(`${PRODUCT_STATUS.mac.aboutPlatform}<small>${PRODUCT_STATUS.mac.aboutNote}</small>`), "about: Mac preview status");
assert.equal(PRODUCT_STATUS.mac.visible, `Windows 10/11, plus a ${MAC_PREVIEW_STATUS}.`);
assert(fs.readFileSync("app/developers/page.tsx", "utf8").includes("__html: AGENT_SETUP_HTML"));
for (const fact of ["Use Uoink from any AI agent", "uoink connect --list", "48 clients and integrations", "10 of them new in 3.11.0", "45 recipes are checked", "verification status", "uoink connect claude-code", "uoink connect cursor", "uoink connect codex", "uoink connect vscode", "does not edit client settings", "Add to Cursor", "Add to VS Code", "uoink skill install --to &lt;dir&gt;", "Claude Code, Codex, pi, Hermes Agent, and OpenClaw", "claude plugin marketplace add ryanbiddy/uoink-agent-kit", "claude plugin install uoink@uoink", 'uoink search "working memory" --limit 5', "uoink recent --limit 10", 'uoink note "A useful thought" --title "Research note"', "What was tested for 3.11.1", "Agent Install 27 passed 11/11 checks", "installed 3.11.1 build in an isolated profile", "Claude Code 2.1.310 (haiku)", "get_schema_version", "35 in core", "91 in modern", "migration 32", "no network sends observed in that check", "bundled ffprobe", "1400 and 1100 pixels wide", "Helper writes persisted across a restart", "Codex CLI was not re-tested in receipt 27", "Earlier 3.11.0 testing", "Claude Code 2.1.308 over MCP: all 91 tools listed; a tool called", "Codex CLI 0.153.4 over MCP: two tools called", "with no MCP server", "tool calls were not run end to end", "Not yet tested: Gemini CLI and pi", "every other recipe", "https://github.com/ryanbiddy/uoink/blob/main/llms-install.md", "Uoink does not connect to the ChatGPT app over MCP"]) assert(AGENT_SETUP_HTML.includes(fact), `Agent setup: ${fact}`);
assert(!AGENT_SETUP_HTML.includes("38 clients"), "Agent setup: stale client count");
for (const feature of features) {
  for (const name of feature.mcpTools) assert(mcpTools.some(([tool]) => tool === name), `${feature.slug}: unknown tool ${name}`);
}
for (const text of ["Living Library and research", "Clip search + evidence cards", "Standing capture", "Library reach over MCP", "Cited range export", "Chapter navigation", "Five research playbooks", "ScrapeCreators", "25-credit daily cap", "Caption rate limits", "five-step strip"]) assert(HOME_MOVED_CONTENT['/changelog'].includes(text), `Relocated to changelog: ${text}`);
for (const text of ["unsigned", "SmartScreen will show a warning", "More info → Run anyway", INSTALLER_SIZE, "No admin rights needed", "reload the extension once", "bkcapfidedhfcjpmjabeopfbcjcbmdmi", "reapply your extension preferences", "saved captures are unaffected"]) assert(pages.install.html.includes(text), text);
for (const text of ["Connected agents can start paid Anthropic calls", "even when automatic analysis is off", "ScrapeCreators", "credit confirmation", "separately enabled agent discovery", "typed handle, channel ID, or query", "request identity", "normalized candidates", "credit accounting", "partial and failed runs", "daily purge", "older than 90 days", "up to 30 days old"]) assert(pages.privacy.html.includes(text), text);
// Mac storage and uninstall, as in the product's docs/privacy-policy.md at the release commit.
for (const text of ["On a Mac (the Apple Silicon preview, from 3.11.2)", "<code>_yoink-trash</code> folder, in <code>~/Desktop/Uoink/</code>", "the library index, settings, helper state, discovery runs, optional usage counts and the extension copy in <code>~/Library/Application Support/Uoink/</code>", "the Anthropic and ScrapeCreators keys in the macOS Keychain, under the same service and usernames as on Windows", "login-startup logs in <code>~/Library/Logs/Uoink/</code>", "<h3>Uninstall on a Mac</h3>", "Close AI clients that use Uoink", "<code>bash /Applications/Uoink.app/Contents/Resources/scripts/mac/uninstall.sh /Applications/Uoink.app --remove</code>", "It removes the app and its login item and keeps your data", "the <code>Uoink</code> entries in Keychain Access"]) assert(pages.privacy.html.includes(text), `privacy Mac: ${text}`);
assert(pages.privacy.faq.some(item => item.answer.includes("On a Mac, it is stored in the macOS Keychain.")), "privacy: Mac key storage");
for (const text of ["ship Whisper's base model (OpenAI Whisper, MIT-licensed, in SYSTRAN's faster-whisper conversion)", "with no model download", "A model you downloaded yourself takes precedence", "Other sizes (tiny, small, medium and large) download only when you ask", "Uoink never downloads a model during a capture", "per-request download-approval flag"]) assert(pages.privacy.html.includes(text), `privacy Whisper: ${text}`);
assert(!pages.privacy.html.includes("A missing Whisper model requires"), "privacy: the base model ships with Uoink");
assert(pages.privacy.faq.some(item => item.answer.includes("The model is never bundled with Uoink.")), "privacy: EmbeddingGemma is still never bundled");
assert(HOME_MOVED_CONTENT['/changelog'].includes("Local transcription can fill in with the Whisper base model that ships with Uoink") && !HOME_MOVED_CONTENT['/changelog'].includes("already-downloaded"), "changelog Living Library: bundled Whisper model");
assert(pages.features.html.includes("Base ships with Uoink; other sizes download only when you ask."), "features: Whisper model selector");
const versions = [...pages.changelog.html.matchAll(/<h2>v(\d+\.\d+\.\d+)/g)].map(match => match[1]);
assert.deepEqual(versions, ["3.12.0", "3.11.2", "3.11.1", "3.11.0", "3.10.0", "3.9.3", "3.9.2", "3.9.1", "3.9.0", "3.7.0", "3.6.0", "3.5.0", "3.4.1", "3.4.0"]);
assert.equal(versions[0], release.version);
// The patch dates come from the product changelog. Preserve the undated
// 3.9.0 entry and the five earlier published dates.
assert.deepEqual([...pages.changelog.html.matchAll(/<time datetime="([^"]+)"/g)].map(match => match[1]), ["2026-10-30", "2026-10-25", "2026-10-25", "2026-10-22", "2026-10-19", "2026-10-19", "2026-10-18", "2026-10-18", "2026-07-24", "2026-07-08", "2026-07-08", "2026-07-07", "2026-07-07"]);
const entryList = [...pages.changelog.html.matchAll(/<h2>v(\d+\.\d+\.\d+)([\s\S]*?)(?=<h2>|$)/g)];
const entries = Object.fromEntries(entryList.map(match => [match[1], match[2]]));
const newest = entryList[0][2];
assert(newest.includes('<time datetime="2026-10-30">'), "Newest changelog entry needs its release date");
// 3.12.0: the Whisper base model ships in every download. Facts from the product's CHANGELOG.md [3.12.0].
for (const fact of ["Every download now ships Whisper's base transcription model", "with no download step", "OpenAI Whisper's base model (MIT) in SYSTRAN's faster-whisper conversion", "pinned to one Hugging Face revision and SHA-256 checked", "A model you downloaded yourself still takes precedence", "(tiny, small, medium and large) still download only when you ask", "Uoink never downloads a model during a capture", "Podcast transcription uses the same copy", "<code>No transcript</code>", "<code>Comments failed</code>", "<strong>Re-uoink</strong>", "refreshes the item in place", "X and Reddit posts with a video keep their transcript and screenshot checks", "with no re-capture", "A row reads <strong>Done</strong> only when nothing is outstanding", "<strong>Saved</strong>", "<strong>Done · no speech found</strong>", "<strong>Allow &lt;site&gt;</strong>", "<strong>Appearance</strong>", "Match Windows (Match system on a Mac), Light or Dark", "Esc closes the reader", "Back returns to the same place in the Library", "Screenshots are taken at the times their labels say", "Short clips now get a screenshot", "fetched fresh on every load", "<code>./uoink status</code>", "91 tools, or 35 with <code>UOINK_MCP_TOOLSET=core</code>", "about 519 MB (390 MB in 3.11.2)", "about 711 MB (580 MB)", "Windows installer is still unsigned", "still a preview for Apple Silicon on macOS 15 or later", "<h3>What was tested for 3.12.0</h3>", "Agent Install 30 tested the installed 3.12.0 build in an isolated profile", "reinstall the 3.12.0 bundle"]) assert(newest.includes(fact), `3.12.0: ${fact}`);
assert(!/already[- ]downloaded/.test(newest), "3.12.0: the base model needs no download");
assert(entries["3.11.2"].includes(PRODUCT_STATUS.mac.changelog), "3.11.2: Mac preview paragraphs");
for (const fact of ["Mac preview for Apple Silicon on macOS 15 or later", `href="${MAC_DMG_URL}"`, `href="${MAC_MCPB_URL}"`, "signed with a Developer ID and notarized by Apple", "no security override", "Intel Macs are not supported", 'href="/install#mac"', "⌘⇧G", "<strong>Get the extension</strong>", "Uoink doesn't update itself", "library mirroring is unavailable", "Script Editor", "A failed index write no longer wedges the helper", "the other 22 older write paths now roll back their own failures", "<code>uoink doctor</code>", "64 KiB", "its own request ID", "<code>helper-output.log</code>", "no longer say Windows-only things on a Mac", "youtu.be, mobile.twitter.com and localhost:5179", "91 tools, or 35 with <code>UOINK_MCP_TOOLSET=core</code>", "Windows installer is still unsigned", "Chrome Web Store listing is not live yet", "reinstall the 3.11.2 bundle"]) assert(entries["3.11.2"].includes(fact), `3.11.2: ${fact}`);
// 3.11.2 has no test results; receipt 28 never landed.
assert(!/What was tested for 3\.11\.2|Agent Install 28/.test(entries["3.11.2"]), "3.11.2: no test claims");
assert(entries["3.11.1"].includes('The Mac preview followed in <a href="/changelog/3-11-2">3.11.2</a>'), "3.11.1: Mac preview pointer");
for (const fact of ["Caption-less X videos", "Whisper model you have already downloaded in Settings", "No transcript:", "Paywalls, login walls", "complete, truncated or unknown", "22 helper write paths", "per-user scheduled task", "Quit stays quit", "127.0.0.1:5179", "91 tools over stdio and 91 in the HTTP registry", "35 in core mode", "Agent Install 27 passed 11/11 checks", "Claude Code 2.1.310 (haiku)", "get_schema_version", "migration 32", "91 full, 35 core and 91 modern", "no network sends observed in that check", "bundled ffprobe audio probe", "no isolated startup entries", "1400 and 1100 pixels wide", "clean uninstall", "helper writes persisted across a restart", "Codex CLI was not re-tested in receipt 27"]) assert(entries["3.11.1"].includes(fact), `3.11.1: ${fact}`);
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
  assert(sizeMatches(text), `${file}: installer size should be about ${INSTALLER_SIZE}`);
  for (const fact of [`Mac preview: Apple Silicon, macOS 15 or later; Intel Macs are not supported.`, `(${MAC_DMG_URL})`, `(${MAC_MCPB_URL})`, "notarized by Apple", "drag Uoink to", "eject the disk", "⌘⇧G", "~/Library/Application Support/Uoink/extension", "Get the extension card copies it", "/Applications/Uoink.app/Contents/Helpers/uoink", "uoink connect <client>", "not the Windows bundle", "On a Mac, Claude Code passed MCP acceptance (3.11.2); other clients are untested there", "Claude Desktop on Windows", "on the computer holding the library"]) assert(text.includes(fact), `${file} Mac: ${fact}`);
  for (const fact of [VERSION, `${release.stdioToolCount} tools over stdio`, `${release.httpToolCount} in the HTTP registry`, DOWNLOAD_URL, "Official MCP registry: io.github.ryanbiddy/uoink", "unsigned", "off by default", "five local research playbooks", "25-credit daily cap", "older than 90 days", "reload the extension once", "Anonymous usage counts are off by default", "SDK 2.3.0", "2026-07-28 MCP protocol", "Linux location where the client has a Linux setup", "Continue is set up by hand"]) assert(text.toLowerCase().includes(fact.toLowerCase()), `${file}: ${fact}`);
  assert(text.includes(`${PRODUCT_STATUS.mac.visible} Uoink ${VERSION} is free`), `${file}: Windows setup and Mac preview line`);
  for (const fact of ["no longer requires", "`match`", "`mode`", '"strict"', '"hybrid"', "find_mentions takes `match`", "passage_verified", "a person", "Uoink Settings", "Gemma terms", "EmbeddingGemma", "about 330 MB", "works offline after setup"]) assert(text.toLowerCase().includes(fact.toLowerCase()), `${file} smarter-search: ${fact}`);
  for (const fact of ["Chrome (tested); other Chromium browsers such as Edge and Brave may work but are not tested", "Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible.", CLAUDE_CODE_COMMAND, "Get-FileHash -Algorithm SHA256", "'/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART'", `${VERSION}/SHA256SUMS.txt`, '"UOINK_MCP_TOOLSET": "core"', "first 40 tools", "Uoink does not connect to the ChatGPT app over MCP"]) assert(text.includes(fact), `${file}: ${fact}`);
  assert(!text.includes("Do not claim"), `${file}: internal writer note`);
  for (const fact of ["uoink connect --list", "48 clients and integrations", "10 of them new in 3.11.0", "uoink connect codex", "uoink connect vscode", "uoink skill install --to <dir>", "Hermes Agent", "OpenClaw", "claude plugin marketplace add ryanbiddy/uoink-agent-kit", "claude plugin install uoink@uoink", 'uoink search "working memory" --limit 5', "uoink recent --limit 10", 'uoink note "A useful thought" --title "Research note"', "Add the uoink command to PATH for AI agents checked by default", "rebuilds the local keyword search index once", "Agent Install 27", "11/11", "Claude Code 2.1.310 (haiku)", "get_schema_version", "91 full / 35 core / 91 modern", "Codex CLI was not re-tested in receipt 27", "Agent Install 30", "Uoink never downloads a model during a capture", "installed 3.11.0 build in an isolated profile", "Claude Code 2.1.308 over MCP (all 91 tools listed; a tool called)", "Codex CLI 0.153.4 over MCP (two tools called)", "skill and CLI only", "tool calls were not run end to end", "Not yet tested: Gemini CLI and pi", "https://github.com/ryanbiddy/uoink/blob/main/llms-install.md", `releases/tag/${VERSION}`]) assert(text.includes(fact), `${file}: ${fact}`);
  assert(!text.includes("38 clients"), `${file}: stale client count`);
  assert(!/v3\.(?:10\.0|11\.[012])\/|Uoink-Setup-3\.(?:10\.0|11\.[012])|uoink-3\.(?:10\.0|11\.[012])|Uoink-3\.(?:10\.0|11\.[012])-macos/.test(text), `${file}: stale download link`);
  assert(!/Until 3\.12|can use an already-downloaded model|Missing Whisper-model downloads require/.test(text), `${file}: stale Whisper or Mac notifier claim`);
  assert(text.toLowerCase().includes("whisper's base model"), `${file}: the Whisper base model ships with Uoink`);
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
const [llmsFullUpdated, llmsFullTitle] = llmsFull.split(/\r?\n/);
assert(llmsFullUpdated === `<!-- updated: 2026-10-30 / uoink ${VERSION} -->` && llmsFullTitle.startsWith(`# Uoink ${VERSION_NUMBER}: `) && llmsFull.includes(`## What's new in ${VERSION_NUMBER}`), "llms-full.txt: header and what's new");
for (const text of ["captures (including `_yoink-trash`) are in `~/Desktop/Uoink/`", "`~/Library/Logs/Uoink/`", "uninstall.sh /Applications/Uoink.app --remove", "macOS still credits Uoink's alerts to Script Editor"]) assert(llmsFull.includes(text), `llms-full.txt Mac: ${text}`);
assert(llmsFull.includes("Agent Install 30 tested the installed 3.12.0 build in an isolated profile:") && llmsFull.indexOf("Agent Install 30") < llmsFull.indexOf("Agent Install 27 passed"), "llms-full.txt: receipt 30 ahead of the labeled 3.11.1 receipt");
// Release checksums: the size and SHA-256 of each 3.12.0 download. Placeholders
// are reported below; real values must have the right shape.
const checksumLines = {
  exe: new RegExp(`^- Uoink-Setup-${VERSION_NUMBER.replaceAll(".", "\\.")}\\.exe: (\\S+) bytes \\(about (\\d+) MB\\)\\. SHA-256: \`(\\S+)\`\\.\\r?$`, "m"),
  mcpb: new RegExp(`^- uoink-${VERSION_NUMBER.replaceAll(".", "\\.")}\\.mcpb: SHA-256: \`(\\S+)\`\\.\\r?$`, "m"),
  dmg: new RegExp(`^- ${MAC_DMG_NAME.replaceAll(".", "\\.")} \\(Mac preview\\): (\\S+) bytes\\. SHA-256: \`(\\S+)\`\\.\\r?$`, "m"),
  macMcpb: new RegExp(`^- ${MAC_MCPB_NAME.replaceAll(".", "\\.")}: SHA-256: \`(\\S+)\`\\.\\r?$`, "m"),
};
const sums = Object.fromEntries(Object.entries(checksumLines).map(([key, pattern]) => [key, llmsFull.match(pattern)]));
for (const [key, match] of Object.entries(sums)) assert(match, `llms-full.txt checksums: ${key} line`);
const isPlaceholder = value => /^__[A-Z_]+__$/.test(value);
const checkValue = (value, shape, label) => { if (isPlaceholder(value)) return; assert(shape.test(value), `llms-full.txt checksums: ${label} ${value}`); };
checkValue(sums.exe[1], /^\d{1,3}(?:,\d{3})+$/, "installer bytes");
checkValue(sums.dmg[1], /^\d{1,3}(?:,\d{3})+$/, "DMG bytes");
for (const [value, label] of [[sums.exe[3], "installer SHA-256"], [sums.mcpb[1], "bundle SHA-256"], [sums.dmg[2], "DMG SHA-256"], [sums.macMcpb[1], "macOS bundle SHA-256"]]) checkValue(value, /^[0-9a-f]{64}$/, label);
if (sizeKnown) {
  assert.equal(sums.exe[2], String(Math.round(release.installerSizeBytes / 1_000_000)), "llms-full.txt: installer MB");
  if (!isPlaceholder(sums.exe[1])) assert.equal(sums.exe[1], release.installerSizeBytes.toLocaleString("en-US"), "llms-full.txt: installer bytes match content/release.json");
}
// 3.12.0 release numbers come from the release's SHA256SUMS.txt once it is
// published; pin them here then, as 3.11.2 did. Until then the placeholders
// are reported below.
assert(!llmsFull.includes("3.11.2.exe:") && !llmsFull.includes("3.11.2-macos-arm64.dmg (Mac preview):"), "llms-full.txt checksums: no 3.11.2 lines");
// The tool inventory line names the commit the manifest was generated from.
const manifestCommit = manifest.source.match(/@([0-9a-f]{40}):/)[1];
assert(llmsFull.includes(`Source: ${VERSION}, commit ${manifestCommit}.`), `llms-full.txt: tool inventory commit should be ${manifestCommit}`);
assert(fs.readFileSync("README.md", "utf8").includes(CLAUDE_CODE_COMMAND));
// Report every placeholder that still needs a release number.
for (const file of [...contentFiles, "README.md", ...fs.readdirSync("content/compare").map(name => `content/compare/${name}`)]) {
  fs.readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
    for (const [name] of line.matchAll(PLACEHOLDER)) pending.push(`${file}:${index + 1}: ${name}`);
  });
}
const summary = `${VERSION}, ${MCP_TOOL_COUNT} registry schemas, ${MCP_STDIO_TOOL_COUNT} stdio names, discovery cards, config, ${features.length} feature tool lists, Living Library, research, privacy (with Mac storage and uninstall), installer, agent setup, release plus thirteen earlier releases, crawler text, and checksums. Windows 10/11 plus the Mac preview; Mac downloads point at the ${VERSION} DMG and macOS bundle.`;
if (pending.length) {
  console.error(`PENDING: every other check passed (${summary}) but ${pending.length} release placeholder(s) need real values:\n${pending.map(item => `  - ${item}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${summary}`);
}

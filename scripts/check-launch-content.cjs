const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, file);

const release = require("../content/release.json");
const { pages, VERSION, VERSION_NUMBER, DOWNLOAD_URL } = require("../app/content/pages.ts");
const { mcpTools, mcpStdioToolNames, MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT } = require("../app/content/mcp-tools.ts");
const { MCP_STDIO_CONFIG } = require("../app/content/mcp-config.ts");
const { features } = require("../app/features/feature-data.ts");
const manifest = JSON.parse(fs.readFileSync("public/mcp/manifest.json", "utf8"));
assert.match(release.version, /^\d+\.\d+\.\d+$/);
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
  assert.equal(card.tool_count, release.httpToolCount);
  assert.equal(card.stdio_tool_count, release.stdioToolCount);
  assert.deepEqual(card.transports[0].tested_clients, ["Claude Desktop", "Cursor"]);
  assert.deepEqual(JSON.parse(MCP_STDIO_CONFIG).mcpServers.uoink, {command:card.transports[0].command,args:card.transports[0].args});
}
for (const feature of features) {
  for (const name of feature.mcpTools) assert(mcpTools.some(([tool]) => tool === name), `${feature.slug}: unknown tool ${name}`);
}
for (const text of [`New in ${release.version}: Living Library`, "Clip search + evidence cards", "Standing capture", "Library reach over MCP", "Cited range export", "Chapter navigation", "Five research playbooks", "ScrapeCreators", "25-credit daily cap", "Caption rate limits", "five-step strip"]) assert(pages.home.html.includes(text), text);
for (const text of ["unsigned", "SmartScreen will show a warning", "More info → Run anyway", "390 MB", "No admin rights needed", "reload the extension once", "bkcapfidedhfcjpmjabeopfbcjcbmdmi", "reapply your extension preferences", "saved captures are unaffected"]) assert(pages.install.html.includes(text), text);
for (const text of ["Connected agents can start paid Anthropic calls", "even when automatic analysis is off", "ScrapeCreators", "credit confirmation", "separately enabled agent discovery", "typed handle, channel ID, or query", "request identity", "normalized candidates", "credit accounting", "partial and failed runs", "daily purge", "older than 90 days", "up to 30 days old"]) assert(pages.privacy.html.includes(text), text);
const versions = [...pages.changelog.html.matchAll(/<h2>v(\d+\.\d+\.\d+)/g)].map(match => match[1]);
assert.deepEqual(versions, [release.version, "3.7.0", "3.6.0", "3.5.0", "3.4.1", "3.4.0"]);
// No release date is supplied for the new public release. Keep the five
// published historical dates instead of carrying over the unpublished date.
assert.deepEqual([...pages.changelog.html.matchAll(/<time datetime="([^"]+)"/g)].map(match => match[1]), ["2026-07-24", "2026-07-08", "2026-07-08", "2026-07-07", "2026-07-07"]);
for (const text of ["First public release since v3.7.0", "3.8.x work was not published separately", "five steps", "cancellation request is refused once publication has started", "inside yt-dlp and the browser renderer", "_exports"]) assert(pages.changelog.html.includes(text), text);
for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
  const text = fs.readFileSync(file, "utf8");
  for (const fact of [VERSION, `${release.stdioToolCount} tools over stdio`, `${release.httpToolCount} in the HTTP registry`, DOWNLOAD_URL, "No Mac build scheduled", "unsigned", "off by default", "five local research playbooks", "25-credit daily cap", "older than 90 days", "reload the extension once"]) assert(text.toLowerCase().includes(fact.toLowerCase()), `${file}: ${fact}`);
}
console.log(`PASS: ${VERSION}, ${MCP_TOOL_COUNT} registry schemas, ${MCP_STDIO_TOOL_COUNT} stdio names, discovery cards, config, ${features.length} feature tool lists, Living Library, research, privacy, installer, current release plus five dated releases, and crawler text.`);

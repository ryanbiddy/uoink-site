const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, file);

const { pages, VERSION } = require("../app/content/pages.ts");
const { CANDIDATE_VERSION, PUBLISHED_VERSION, WINDOWS_DOWNLOAD_URL, WINDOWS_DOWNLOAD_BYTES } = require("../app/content/release-status.ts");
const { mcpTools, mcpStdioToolNames, MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT } = require("../app/content/mcp-tools.ts");
const { MCP_STDIO_CONFIG } = require("../app/content/mcp-config.ts");
const { features } = require("../app/features/feature-data.ts");
const manifest = JSON.parse(fs.readFileSync("public/mcp/manifest.json", "utf8"));
const sourceCommit = /@([a-f0-9]{40}):/.exec(manifest.source)?.[1];
assert(sourceCommit, "Tool manifest must identify its source commit");
assert.equal(VERSION, `v${CANDIDATE_VERSION}`);
assert.notEqual(CANDIDATE_VERSION, PUBLISHED_VERSION);
assert.equal(manifest.version, CANDIDATE_VERSION);
assert.equal(manifest.release_status, "candidate");
assert.equal(MCP_TOOL_COUNT, 88);
assert.equal(MCP_STDIO_TOOL_COUNT, 32);
assert.equal(mcpTools.length, 88);
assert.equal(new Set(mcpTools.map(([name]) => name)).size, 88);
assert.deepEqual(manifest.tools.map(t => t.name), mcpTools.map(([name]) => name));
assert.deepEqual(manifest.tools.filter(t => t.transports.includes("stdio")).map(t => t.name).sort(), [...mcpStdioToolNames].sort());
assert(manifest.tools.every(t => t.description && t.inputSchema));
for (const file of ["public/.well-known/mcp.json", "public/.well-known/mcp/server-card.json"]) {
  const card = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(card.version, CANDIDATE_VERSION);
  assert.equal(card.release_status, "candidate");
  assert.equal(card.public_download_version, PUBLISHED_VERSION);
  assert(card.install.mcpb_bundle.endsWith(`/v${PUBLISHED_VERSION}/uoink-${PUBLISHED_VERSION}.mcpb`));
  assert.equal(card.tool_count, 88);
  assert.equal(card.stdio_tool_count, 32);
  assert.deepEqual(card.transports[0].configuration_examples_for, ["Claude Desktop", "Cursor"]);
  assert.equal(card.transports[0].tested_clients, undefined, "Configuration examples must not claim fresh installed-client verification");
  assert.deepEqual(JSON.parse(MCP_STDIO_CONFIG).mcpServers.uoink, {command:card.transports[0].command,args:card.transports[0].args});
}
for (const feature of features) {
  for (const name of feature.mcpTools) assert(mcpTools.some(([tool]) => tool === name), `${feature.slug}: unknown tool ${name}`);
}
for (const text of [`Next release / ${CANDIDATE_VERSION} / in testing`, `Uoink ${PUBLISHED_VERSION}`, "not publicly released", 'href="/install"', 'href="/privacy"']) assert(pages.home.html.includes(text), text);
assert(WINDOWS_DOWNLOAD_URL.endsWith(`/v${PUBLISHED_VERSION}/Uoink-Setup-${PUBLISHED_VERSION}.exe`));
for (const text of [WINDOWS_DOWNLOAD_URL, `Download Windows ${PUBLISHED_VERSION}`, "unsigned", "may show a SmartScreen warning", `${Math.round(WINDOWS_DOWNLOAD_BYTES / 1e6)} MB`, "No admin rights needed", "Load unpacked"]) assert(pages.install.html.includes(text), text);
assert(!pages.install.html.includes(`Uoink-Setup-${CANDIDATE_VERSION}.exe`), "Candidate must not be offered as a public download");
const versions = [...pages.changelog.html.matchAll(/<h2>v(\d+\.\d+\.\d+)/g)].map(match => match[1]);
assert.deepEqual(versions, [PUBLISHED_VERSION, "3.6.0", "3.5.0", "3.4.1", "3.4.0"]);
assert(pages.changelog.html.includes(`${CANDIDATE_VERSION} — Living Library candidate`));
assert(pages.changelog.html.includes("no public release date"));
assert.equal((pages.changelog.html.match(/<time datetime=/g) || []).length, 5);
for (const fact of [CANDIDATE_VERSION, PUBLISHED_VERSION, "pyannote", "claude.ai/new", "Clear key", "topics.json", "Vercel Web Analytics", "still pending"]) assert(pages.privacy.html.includes(fact), `privacy: ${fact}`);
for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
  const text = fs.readFileSync(file, "utf8");
  for (const fact of [`${PUBLISHED_VERSION} is the public download`, `${CANDIDATE_VERSION} is a candidate in testing`, "32 tools over stdio", "88", "No Mac build scheduled", "unsigned", "off by default", "pyannote", "legacy Yoink", "topics.json"]) assert(text.toLowerCase().includes(fact.toLowerCase()), `${file}: ${fact}`);
  assert(text.includes(sourceCommit), `${file}: tool catalog source commit`);
  assert(!text.includes("no required telemetry"), `${file}: unsupported telemetry claim`);
}
console.log(`PASS: public/candidate versions, 88 registry schemas, 32 stdio names, discovery cards, config, ${features.length} feature tool lists, public installer, five dated releases, candidate privacy and crawler text.`);

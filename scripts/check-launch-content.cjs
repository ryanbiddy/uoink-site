const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, file);

const { pages, VERSION } = require("../app/content/pages.ts");
const { mcpTools, mcpStdioToolNames, MCP_TOOL_COUNT, MCP_STDIO_TOOL_COUNT } = require("../app/content/mcp-tools.ts");
const { MCP_STDIO_CONFIG } = require("../app/content/mcp-config.ts");
const { features } = require("../app/features/feature-data.ts");
const manifest = JSON.parse(fs.readFileSync("public/mcp/manifest.json", "utf8"));
assert.equal(VERSION, "v3.8.0");
assert.equal(MCP_TOOL_COUNT, 88);
assert.equal(MCP_STDIO_TOOL_COUNT, 32);
assert.equal(mcpTools.length, 88);
assert.equal(new Set(mcpTools.map(([name]) => name)).size, 88);
assert.deepEqual(manifest.tools.map(t => t.name), mcpTools.map(([name]) => name));
assert.deepEqual(manifest.tools.filter(t => t.transports.includes("stdio")).map(t => t.name).sort(), [...mcpStdioToolNames].sort());
assert(manifest.tools.every(t => t.description && t.inputSchema));
for (const file of ["public/.well-known/mcp.json", "public/.well-known/mcp/server-card.json"]) {
  const card = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(card.version, "3.8.0");
  assert.equal(card.tool_count, 88);
  assert.equal(card.stdio_tool_count, 32);
  assert.deepEqual(card.transports[0].tested_clients, ["Claude Desktop", "Cursor"]);
  assert.deepEqual(JSON.parse(MCP_STDIO_CONFIG).mcpServers.uoink, {command:card.transports[0].command,args:card.transports[0].args});
}
for (const feature of features) {
  for (const name of feature.mcpTools) assert(mcpTools.some(([tool]) => tool === name), `${feature.slug}: unknown tool ${name}`);
}
for (const text of ["New in 3.8.0: Living Library", "Clip search + evidence cards", "Standing capture", "Library reach over MCP", "Cited range export", "Chapter navigation"]) assert(pages.home.html.includes(text), text);
for (const text of ["unsigned", "SmartScreen will show a warning", "More info → Run anyway", "390 MB", "No admin rights needed"]) assert(pages.install.html.includes(text), text);
const versions = [...pages.changelog.html.matchAll(/<h2>v(\d+\.\d+\.\d+)/g)].map(match => match[1]);
assert.deepEqual(versions, ["3.8.0", "3.7.0", "3.6.0", "3.5.0", "3.4.1", "3.4.0"]);
assert.equal((pages.changelog.html.match(/<time datetime=/g) || []).length, 6);
for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
  const text = fs.readFileSync(file, "utf8");
  for (const fact of ["v3.8.0", "32 tools over stdio", "88", "No Mac build scheduled", "unsigned", "off by default"]) assert(text.toLowerCase().includes(fact.toLowerCase()), `${file}: ${fact}`);
}
console.log(`PASS: version, 88 registry schemas, 32 stdio names, discovery cards, config, ${features.length} feature tool lists, Living Library, installer, six dated releases, and crawler text.`);

// Product prose is extracted from llms.txt; the synced registry validates calls only.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync('public/llms.txt', 'utf8');
const registry = JSON.parse(fs.readFileSync('public/mcp/manifest.json', 'utf8'));
function extract(pattern) {
  const match = source.match(pattern);
  assert(match, `Use-case source changed; review llms.txt selector: ${pattern}`);
  return match[1].replaceAll('`', '').trim();
}
const facts = {
  opening: extract(/^- (Let your AI search the library and cite timestamps\.)$/m),
  youtube: extract(/^- (Capture YouTube videos[^\n]+)$/m),
  podcasts: extract(/^- (Save X posts[^\n]+)$/m),
  storage: extract(/^- (Keep everything on your disk[^\n]+)$/m),
  search: extract(/^- Search modes: ([^\n]+)$/m),
  browser: extract(/^- (ChatGPT and claude\.ai:[^\n]+)$/m),
  windows: extract(/^(Windows [^.]+\.)/m),
};
// These examples are instructions with explicit placeholders, never invented results.
const flow = [
  { name: 'search_clips', arguments: { query: 'YOUR_TOPIC' } },
  { name: 'get_evidence_card', arguments: { video_id: 'VIDEO_ID_FROM_SEARCH' } },
];
for (const call of flow) {
  const tool = registry.tools.find(tool => tool.name === call.name);
  assert(tool?.transports.includes('stdio'), `Missing MCP tool: ${call.name}`);
  for (const [key, value] of Object.entries(call.arguments)) {
    assert.equal(tool.inputSchema.properties[key]?.type, typeof value, `${call.name}.${key}`);
  }
  for (const key of tool.inputSchema.required || []) assert(key in call.arguments, `${call.name} requires ${key}`);
}
assert(source.includes('Claude Desktop, Claude Code'), 'Review Claude connection instructions');
const pages = [
  { slug: 'cite-youtube-timestamps-in-claude', title: 'Cite YouTube timestamps in Claude', sourceFact: facts.youtube,
    description: `Cite YouTube timestamps in Claude with Uoink. ${facts.opening}`,
    setup: 'Save a YouTube video, then connect Claude Desktop or Claude Code to Uoink.',
    prompt: 'Find passages about YOUR_TOPIC in my saved YouTube videos. Get an evidence card for the source I choose and cite its timestamps.' },
  { slug: 'search-podcasts-with-ai', title: 'Search podcasts with AI', sourceFact: facts.podcasts,
    description: `Search saved podcasts with Uoink and your AI. ${facts.opening}`,
    setup: 'Save a podcast, then connect your AI to Uoink.',
    prompt: 'Search my saved podcasts for YOUR_TOPIC. Get an evidence card for the source I choose. Quote a passage only when passage_verified is true.' },
].map(page => ({ ...page, route: `/use-cases/${page.slug}` }));
const output = JSON.stringify({ facts, flow, pages }, null, 2) + '\n';
const destination = 'app/content/use-cases.generated.json';
if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8') !== output) fs.writeFileSync(destination, output);
console.log(`use-cases: generated ${pages.length} pages from llms.txt; validated both registry calls`);

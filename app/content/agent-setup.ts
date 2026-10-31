import { PRODUCT_STATUS } from "./product-status";

// Shared by the developer setup page and the MCP reference.
export const AGENT_SETUP_HTML = String.raw`
<h2>Use Uoink from any AI agent</h2>
<p>Choose MCP, the Uoink skill, or the <code>uoink</code> command. The agent needs access to the computer holding your library. A skill copied to a remote agent does not give it access to local files.</p>
<p>Install Uoink with <strong>Add the uoink command to PATH for AI agents</strong> checked. Open a new terminal and run <code>uoink status</code>. An agent doing the install can follow the <a href="https://github.com/ryanbiddy/uoink/blob/main/llms-install.md">agent installation steps</a>.</p>
<h3>1. Connect an MCP client</h3>
<p>Claude Desktop uses the <code>.mcpb</code> bundle below. For Claude Code, Cursor, Codex, or VS Code, print a setup recipe:</p>
<pre class="code-block">uoink connect --list
uoink connect claude-code
uoink connect cursor
uoink connect codex
uoink connect vscode</pre>
<p><code>uoink connect --list</code> prints setup choices for 48 clients and integrations, 10 of them new in 3.11.0. 45 recipes are checked against each client's official documentation, and each recipe prints its verification status. Run <code>uoink connect &lt;client&gt;</code> to print config or instructions. The destination and notes go to stderr; config goes to stdout. It does not edit client settings. Run the printed Claude Code command in PowerShell. For other clients, merge the entry into the location shown, then restart the MCP connection.</p>
<p>Cursor's recipe sets <code>UOINK_MCP_TOOLSET=core</code>. In the dashboard, open <strong>Settings &gt; Agents (MCP) &gt; Agent connection</strong> and choose <strong>Add to Cursor</strong> or <strong>Add to VS Code</strong> to open the client's review flow. Client acceptance of these buttons is not yet tested.</p>
<p>Recipes and the client tables in Connect your agent list a Linux location where the client has a Linux setup. Continue is set up by hand from its recipe; the dashboard shows Continue as connected once its entry launches this install.</p>
<p>Uoink's MCP server uses the official MCP Python SDK 2.3.0. Claude Desktop, Claude Code, Cursor, and Codex connect as before, and apps that speak the 2026-07-28 MCP protocol can also connect. No action is needed.</p>
<h3>2. Install the Uoink skill</h3>
<p>The portable skill teaches Claude Code, Codex, pi, Hermes Agent, and OpenClaw to find evidence, cite sources, and use MCP or the CLI. Run <code>uoink skill path</code> to locate it, or <code>uoink skill install --to &lt;dir&gt;</code> to copy it with its references. The destination is the parent skills directory; Uoink creates a <code>uoink</code> folder inside it. Restart the agent or reload its skills.</p>
<pre class="code-block"># Choose your agent's directory in PowerShell:
# Claude Code
uoink skill install --to "$env:USERPROFILE\.claude\skills"
# Codex
uoink skill install --to "$env:USERPROFILE\.agents\skills"
# pi
uoink skill install --to "$env:USERPROFILE\.pi\agent\skills"
# Hermes Agent
uoink skill install --to "$env:USERPROFILE\.hermes\skills"
# OpenClaw
uoink skill install --to "$env:USERPROFILE\.openclaw\skills"</pre>
<p>For a default Uoink install, the Claude Code plugin bundles the skill and MCP connection:</p>
<pre class="code-block">claude plugin marketplace add ryanbiddy/uoink-agent-kit
claude plugin install uoink@uoink</pre>
<p>Restart Claude Code and enable the plugin's Uoink MCP server when prompted. For a custom install, use <code>uoink connect claude-code</code> and the standalone skill. Avoid adding the same MCP server through both the plugin and a manual entry.</p>
<h3>3. Use the uoink command</h3>
<p>Search saved sources, read evidence, capture URLs, save notes, and call registry tools from a local shell:</p>
<pre class="code-block">uoink search "working memory" --limit 5
uoink recent --limit 10
uoink note "A useful thought" --title "Research note"</pre>
<p>Local reads work without the helper running. Capture and paid tools keep their existing requirements and consent gates. See <a href="https://github.com/ryanbiddy/uoink/blob/main/docs/connect-your-agent.md">Connect your agent</a> for commands and known limits.</p>
<h3>Search options</h3>
<p>Search matches the useful words in a query; it no longer needs every word. <code>search_library</code>, <code>search_uoinks</code>, and <code>search_clips</code> take optional <code>match</code> and <code>mode</code> parameters, and <code>find_mentions</code> takes <code>match</code>:</p>
<ul>
<li><code>match</code>: <code>forgiving</code> (default) or <code>strict</code>, which requires every word, like <strong>Exact words</strong> in the dashboard.</li>
<li><code>mode</code>: <code>auto</code> (default), <code>keyword</code>, <code>semantic</code>, or <code>hybrid</code>. Auto uses hybrid when semantic search is ready and keyword search otherwise. Each response says which mode ran.</li>
</ul>
<p>Semantic search is optional. A person turns it on in Uoink Settings under <strong>Semantic search</strong> and accepts Google's Gemma terms. Uoink then downloads the EmbeddingGemma model once (about 330 MB) and indexes saved sources on this computer. Until it is ready, use <code>keyword</code> or <code>auto</code>. Quote <code>passage.text</code> only when <code>passage_verified</code> is true; otherwise <code>citation_reason</code> explains why no passage was returned. The tool list is unchanged.</p>
${PRODUCT_STATUS.mac.agentSetup}
<h3>What was tested for 3.12.0</h3>
<p>Agent Install 30 tested the installed 3.12.0 build in an isolated profile: __RECEIPT30__</p>
<h3>What was tested for 3.11.1</h3>
<p>Agent Install 27 passed 11/11 checks with the installed 3.11.1 build in an isolated profile:</p>
<ul>
<li>Isolated installation; <code>/health</code> reported 3.11.1 and migration 32. Stdio listed 91 tools in full mode, 35 in core, and 91 in modern.</li>
<li>Claude Code 2.1.310 (haiku) connected with 91 tools and called <code>get_schema_version</code>.</li>
<li>Usage sharing stayed off with no network sends observed in that check; the bundled ffprobe passed the audio probe.</li>
<li>No startup entries were created by the isolated install. The dashboard passed at 1400 and 1100 pixels wide, and uninstall was clean.</li>
<li>Helper writes persisted across a restart, and <code>GET /</code> redirected to <code>/dashboard</code>.</li>
</ul>
<p>Codex CLI was not re-tested in receipt 27. Earlier 3.11.0 testing: Claude Code 2.1.308 over MCP: all 91 tools listed; a tool called. Codex CLI 0.153.4 over MCP: two tools called.</p>
<p>From 3.10.0 testing: Claude Code with the Uoink skill and the <code>uoink</code> command only, with no MCP server, loaded the skill and ran <code>uoink note</code> and <code>uoink recent</code>. The Claude Code plugin loads its skill and starts its MCP server; its tool calls were not run end to end because the test install is isolated from a normal one.</p>
<p>Not yet tested: Gemini CLI and pi (no sign-in on the test machine) and every other recipe in <code>uoink connect</code>. Claude Desktop and Cursor retain their earlier MCP testing status; that does not verify the new recipes.</p>
<p>ChatGPT and claude.ai use copy and paste only. Uoink does not connect to the ChatGPT app over MCP.</p>`;

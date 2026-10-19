// Shared by the developer setup page and the MCP reference.
export const AGENT_SETUP_HTML = String.raw`
<h2>Use Uoink from any AI agent</h2>
<p>Choose MCP, the Uoink skill, or the <code>uoink</code> command. The agent needs access to the Windows machine holding your library. A skill copied to a remote agent does not give it access to local files.</p>
<p>Install Uoink with <strong>Add the uoink command to PATH for AI agents</strong> checked. Open a new terminal and run <code>uoink status</code>. An agent doing the install can follow the <a href="https://github.com/ryanbiddy/uoink/blob/main/llms-install.md">agent installation steps</a>.</p>
<h3>1. Connect an MCP client</h3>
<p>Claude Desktop uses the <code>.mcpb</code> bundle below. For Claude Code, Cursor, Codex, or VS Code, print a setup recipe:</p>
<pre class="code-block">uoink connect --list
uoink connect claude-code
uoink connect cursor
uoink connect codex
uoink connect vscode</pre>
<p><code>uoink connect --list</code> prints setup choices for 38 clients and integrations. Run <code>uoink connect &lt;client&gt;</code> to print config or instructions. The destination and notes go to stderr; config goes to stdout. It does not edit client settings. Run the printed Claude Code command in PowerShell. For other clients, merge the entry into the location shown, then restart the MCP connection.</p>
<p>Cursor's recipe sets <code>UOINK_MCP_TOOLSET=core</code>. In the dashboard, open <strong>Settings &gt; Agents (MCP) &gt; Agent connection</strong> and choose <strong>Add to Cursor</strong> or <strong>Add to VS Code</strong> to open the client's review flow. Client acceptance of these buttons is not yet tested.</p>
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
<h3>What was tested for 3.10.0</h3>
<p>Tested on a clean, isolated install:</p>
<ul>
<li>Claude Code 2.1.302 over MCP: all 91 tools listed; a note saved and listed back.</li>
<li>Claude Code with the Uoink skill and the <code>uoink</code> command only, with no MCP server: the skill loaded, and <code>uoink note</code> and <code>uoink recent</code> ran.</li>
<li>Codex CLI 0.153.4 over MCP: a note saved and listed back.</li>
<li>The <code>uoink</code> command: <code>status</code>, <code>note</code>, <code>recent</code>, and <code>connect</code>.</li>
<li>Claude Code plugin: loads its skill and starts its MCP server. Its tool calls were not run end to end because the test install is isolated from a normal one.</li>
</ul>
<p>Not yet tested: Gemini CLI and pi (no sign-in on the test machine) and every other recipe in <code>uoink connect</code>. Claude Desktop and Cursor retain their earlier MCP testing status; that does not verify the new recipes.</p>
<p>ChatGPT and claude.ai use copy and paste only. Uoink does not connect to the ChatGPT app over MCP.</p>`;

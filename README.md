# Uoink site

Production marketing site for [Uoink](https://uoink.app), the local-first YouTube layer for any AI.

Built with Next.js App Router and deployed to Vercel. The product repo lives at [github.com/ryanbiddy/uoink](https://github.com/ryanbiddy/uoink); this repo is only the marketing site.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

The site uses `output: "export"` for static deployment.

## Release facts

`content/release.json` supplies the product version and verified MCP counts to the site and both release-content scripts. Static discovery cards and crawler text must match it; `check-launch-content.cjs` checks those copies.

```bash
python scripts/sync-mcp-from-release.py E:/AI/projects/uoink/checkouts/Yoink-release-3.11.1 --ref v3.11.1
node scripts/check-launch-content.cjs
```

The sync script reads committed files with `git show`, parses Python ASTs without importing product code, and checks stdio names against `.mcpb/manifest.json`. It defaults to the product ref in `content/release.json`; `--ref <git-ref>` selects another ref. It updates the counts in content/release.json and writes the site's tool catalog and manifest.

For 3.11.1, regenerate the catalog from the release `v3.11.1` tag (the default `mcpSourceRef`). Tool descriptions changed; the inventory remains 91 tools over stdio and 91 in the HTTP registry, with 35 in core mode. Both transports advertise flattened tool schemas; the server still checks the exact schema. The public changelog keeps 3.11.1 and earlier releases separate. Earlier dates are preserved; no 3.9.0 publication date is asserted.

This Windows release fixes 22 helper write paths that could lose successful saves and lock the library. Caption-less X videos can use local Whisper when a model has already been downloaded in Settings; videos with no audio say "No transcript:" and why. Article extraction keeps structure and links and labels paywalls and login walls as failures. X posts keep quote posts, media descriptors, expanded links, real counts and completeness disclosures. A per-user scheduled task restarts a crashed helper; Quit stays quit until the next login or a manual start. The bare helper address opens the dashboard.

Mac (Apple Silicon, macOS 15 or later): preview coming soon.

The tool inventory line in `public/llms-full.txt` names release commit `e306d77af2407bb84c1ba3ca110853c4f00a7d00`. `check-launch-content.cjs` checks it against the generated manifest's source commit. The Windows installer is 390,110,203 bytes; the release checksums are in `public/llms-full.txt`.

## Connect a local Uoink install

For 3.11.1, Agent Install 27 passed 11/11 isolated-install checks, including stdio inventories of 91 full / 35 core / 91 modern tools, Claude Code 2.1.310 (haiku) connecting with 91 tools and calling `get_schema_version`, helper writes surviving a restart, and `GET /` redirecting to `/dashboard`. The full receipt scope is listed on the agent setup and changelog pages. Codex CLI was not re-tested in receipt 27.

Earlier 3.11.0 testing: Claude Code 2.1.308 listed all 91 tools and called one, and Codex CLI 0.153.4 called two tools. In 3.10.0 testing, Claude Code also ran with the skill and CLI only, and the plugin loaded its skill and started MCP, but its tool calls were not run end to end. Claude Desktop and Cursor retain their earlier MCP testing status. Gemini CLI, pi, and the remaining connection recipes are not yet tested. Stdio works without the Uoink helper running. Start Uoink from the Start menu for the dashboard, browser button, and monitored-playlist polling.

For Claude Desktop, download and open [uoink-3.11.1.mcpb](https://github.com/ryanbiddy/uoink/releases/download/v3.11.1/uoink-3.11.1.mcpb). Enter the full path to your Uoink folder when asked; Desktop does not expand `%LOCALAPPDATA%`. Reinstall the bundle and restart Desktop after updating.

For Claude Code, run this in PowerShell. The expanded paths are absolute:

```powershell
claude mcp add --scope user --transport stdio uoink -e PYTHONIOENCODING=utf-8 -e PYTHONUTF8=1 -- "$env:LOCALAPPDATA\Uoink\python\python.exe" "$env:LOCALAPPDATA\Uoink\uoink_mcp.py"
```

For Cursor and other stdio clients, add this server config. Replace `%LOCALAPPDATA%` in both paths with your full local app-data directory, then restart the client:

```json
{
  "mcpServers": {
    "uoink": {
      "command": "%LOCALAPPDATA%\\Uoink\\python\\python.exe",
      "args": [
        "%LOCALAPPDATA%\\Uoink\\uoink_mcp.py"
      ],
      "env": {
        "PYTHONIOENCODING": "utf-8",
        "PYTHONUTF8": "1"
      }
    }
  }
}
```

Cursor is reported to send only the first 40 tools to its agent. Add `"UOINK_MCP_TOOLSET": "core"` to the server `env` to keep the previous 35-tool set and stay under that cap. Omit it for every tool. Consent gates are unchanged.

ChatGPT and claude.ai use copy and paste only. Uoink does not connect to the ChatGPT app over MCP.

## Deploy

Connect this repo to Vercel and let it auto-detect Next.js. Production canonical is `uoink.app`; the legacy video domain redirects there.

## Brand

The family resolutions govern the site: rust #C2410C actions, cream #FFF4EC primary button text and reversed marks, blue #002C9B links on cream, muted #5C4A40, and hairlines #EBD5C5. Every focusable element gets a 2 px rust focus ring with a 2 px offset. Eyebrows use uppercase Inter 700 at 12 px with 0.08em tracking. Wordmarks use the shared SVG paths. The family strip has a 0.8 x cap-height gap and a muted middle dot. The yellow detail is #FFD23F at every size and on every ground. The favicon, dark theme decision, and app-art outline remain unchanged.

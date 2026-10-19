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
python scripts/sync-mcp-from-release.py E:/AI/projects/uoink/checkouts/Yoink-integration
node scripts/check-launch-content.cjs
```

The sync script reads committed files with `git show`, parses Python ASTs without importing product code, and checks stdio names against `.mcpb/manifest.json`. It defaults to the product ref in `content/release.json`; `--ref <git-ref>` selects another ref. It updates the counts in content/release.json and writes the site's tool catalog and manifest.

For 3.9.3, regenerate the catalog from the published `v3.9.3` tag (the default `mcpSourceRef`). The sync reports 91 tools over stdio and 91 in the HTTP registry. Both transports advertise flattened tool schemas; the server still checks the exact schema. The public changelog keeps 3.9.3, 3.9.2, 3.9.1, and 3.9.0 separate. Earlier dates are preserved; no 3.9.0 publication date is asserted.

## Connect a local Uoink install

Claude Desktop, Claude Code, and Cursor are tested clients. Stdio works without the Uoink helper running. Start Uoink from the Start menu for the dashboard, browser button, and monitored-playlist polling.

For Claude Desktop, download and open [uoink-3.9.3.mcpb](https://github.com/ryanbiddy/uoink/releases/download/v3.9.3/uoink-3.9.3.mcpb). Enter the full path to your Uoink folder when asked; Desktop does not expand `%LOCALAPPDATA%`. Reinstall the bundle and restart Desktop after updating.

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

Brand v3.1 is the source of truth: rust primary, vermillion sparse, acid only as solid shapes, Inter-led typography, Bungee wordmark only. See [docs/V3.1-LEGIBILITY-PATCH.md](docs/V3.1-LEGIBILITY-PATCH.md).

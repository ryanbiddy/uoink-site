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
python scripts/sync-mcp-from-release.py <product-checkout> --ref v3.17.0
node scripts/check-launch-content.cjs
```

The sync script reads committed files with `git show`, parses Python ASTs without importing product code, and checks stdio names against `.mcpb/manifest.json`. It defaults to the product ref in `content/release.json`; `--ref <git-ref>` selects another ref. It updates the counts in content/release.json and writes the site's tool catalog and manifest.

For 3.17.0, the catalog was generated with `--ref v3.17.0` (commit e115c9bf69e9efe4b33256db6d626430eb3b9e7e, the release merge). The source and MCP bundle agree on 99 tools over stdio and 99 in the HTTP registry. Core mode has 36 tools, search mode 9 and research mode 7. Both transports advertise flattened tool schemas; the server still checks the exact schema. Historical changelog entries and acceptance receipts keep their original versions and counts.

3.17.0 stops opening a Claude tab after a save. A new **After a save** setting defaults to Stay on the page, with Copy then open Claude, Copy then open ChatGPT and Copy only as the other choices. It adds a Rediscover shelf and Idea starters on the Library (on the computer, with no network or AI calls), podcast suggestions in For You (off by default, and when on, a few topic words go to Apple's podcast search about once a day, never titles, links or transcripts), a three-step phone inbox setup with a QR code and a `/phone` page on the user's own relay, one 300-character title limit for every source, a plain message instead of a freeze when the Keychain or Credential Manager doesn't answer, and ⌘V on a Mac. It adds one database migration (0034, `item_opens`) and no tools. The Windows installer is about 549 MB. The signed and notarized Mac preview DMG is about 513 MB. The release also builds `npx uoink` and a Chrome Web Store package, but neither is live yet, so `content/flags.json` keeps both off. `phoneInbox` is on, so the install page shows the phone inbox steps. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.17.0).

3.16.3 made the Windows installer a one-screen install (Install, progress, done; **Choose the install folder and shortcuts** brings back the folder and options pages; it follows Windows light and dark mode), fixed its Next, Install and Finish buttons that showed `*`, gave the Mac app its icon, opened the Mac DMG to a real install window (Uoink, an arrow, Applications; no Read Me) and made the DMG smaller with tighter compression. One app icon is used everywhere. It added no tools or database migrations. The Windows installer was about 549 MB; the signed and notarized Mac preview DMG was about 513 MB. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.16.3).

3.16.2 put Deno 2.9.8 inside the Mac app so yt-dlp can solve YouTube's player challenges there with nothing to install (signed with one extra permission, allow-jit, and no other file in the app gets any; on Linux it still uses a Deno 2.3 or newer on PATH), made Diagnose check that Deno can run JavaScript, refreshed the Windows installer's bundled libraries for open security alerts (PyJWT 2.15.1, aiohttp 3.14.5, urllib3 2.8.0, setuptools 84.2.1, Mako 1.4.3, multidict 6.9.1, yarl 1.25.1, OpenTelemetry 1.45.1), moved NLTK to upstream 3.10.4 and stopped installing crawl4ai by default in source installs (neither installer ever shipped it). It added no tools or database migrations. The Windows installer was about 549 MB; the signed and notarized Mac preview DMG was about 735 MB. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.16.2).

3.16.1 put Deno in the Windows installer so yt-dlp can solve YouTube's player challenges (sandboxed, no update check, cache in the Uoink folder; on a Mac or Linux it uses a Deno 2.3 or newer on PATH), added Thesis check as the sixth research playbook, paused a capture and retries it after 30 minutes, 1 hour and 4 hours when YouTube asks for a bot check, made Uoink's yt-dlp ignore a personal yt-dlp config file on every platform, updated yt-dlp to 2026.10.21, fixed Make a Short with Zing from a mapped network drive and kept dismissed Library rows dismissed, and removed Retry with cookies. It added no tools or database migrations. The Windows installer was about 549 MB; the signed and notarized Mac preview DMG was about 717 MB. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.16.1).

3.16.0 added Make a Short with Zing (shown only when Zing is installed; it uses kept media, or downloads only after you click Download for that item, with progress), suite capture (`uoink.capture/1`) so a sibling local app can save one link, a plain note when YouTube asks for a bot check, and a 30-minute caption pause after three bot checks in 15 minutes. Uoink never adds browser cookies. It added no tools or database migrations. The Windows installer is about 519 MB; the signed and notarized Mac preview DMG is about 706 MB. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.16.0).

3.15.1 added update notices: an opt-in daily check (off by default; **Check now** always works) and **Update now** on Windows or **Download update** on a Mac, which download the new installer from the GitHub release and check it against `SHA256SUMS.txt` before running it (Windows) or opening the DMG (Mac), only when pressed. It is the first release with the button, so it installs the usual way. It also adds Check now on podcast feeds, Whisper title hints, a fix that keeps Claude Code connected after a large capture reply, and smaller fixes. It adds no tools or database migrations. The Windows installer is about 519 MB; the signed and notarized Mac preview DMG is about 709 MB. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.15.1).

3.15.0 polishes search (all-words matching with the matching line and timestamp), the reader, capture status and failure messages, research sources and podcast names. It adds no tools or database migrations. The Windows installer is about 519 MB; the signed and notarized Mac preview DMG is about 712 MB. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.15.1).

3.14.1 fixes missing research excerpts from videos saved outside a research run, cleans up CLI text output, and corrects report formatting and saves import labels. It adds no tools or database migrations. The Windows installer is about 519 MB; the signed and notarized Mac preview DMG is about 697 MB. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.14.1).

3.14.0 added deep research with checked quotes and timestamps, `get_transcript` (saved copy, captions, then local Whisper), imports for YouTube Watch Later, X bookmarks and Reddit saves, weekly source availability checks with a Gone from the web filter, and headless Linux for agents in Docker, Codespaces and sandboxes. The Windows installer is about 519 MB; the signed and notarized Mac preview DMG is about 695 MB. See the [release notes](https://github.com/ryanbiddy/uoink/releases/tag/v3.14.0), [research guide](https://github.com/ryanbiddy/uoink/blob/v3.14.0/docs/research.md) and [Linux guide](https://github.com/ryanbiddy/uoink/blob/v3.14.0/docs/linux.md).

3.13.0 added Import a list (HackerTube lists, Hacker News and Reddit threads, YouTube playlists) in the dashboard, as `uoink import-list` and as the `import_list` MCP tool, a For You panel for imported videos, mid-video card images, and a silent install or upgrade that restarts Uoink if it was running. The installer stays about 519 MB and the DMG is about 716 MB.

3.12.1 added an optional phone inbox (Uoink Relay), `uoink mcp` to start the stdio MCP server from the PATH command, working Wikipedia capture, page and X video thumbnails, and one button style across the dashboard, popup and setup page. The DMG was about 711 MB.

3.12.0 shipped Whisper's base model (OpenAI Whisper, MIT, in SYSTRAN's faster-whisper conversion) in the Windows installer and the Mac preview DMG, pinned and hash-checked at build, so a video without captions is transcribed locally from the first capture with no model download. A model the user downloaded still takes precedence; other sizes download only when the user asks, and Uoink never downloads a model during a capture. The installer grows from about 390 MB to about 519 MB and the DMG from about 580 MB to about 709 MB. The release also names the problem on needs-attention badges, stops flagging pages, text posts and images for sections they can't have, and adds an Appearance setting. Semantic search's EmbeddingGemma model is still never bundled.

The Mac build is still a preview for Apple Silicon on macOS 15 or later: [Uoink-3.17.0-macos-arm64.dmg](https://github.com/ryanbiddy/uoink/releases/download/v3.17.0/Uoink-3.17.0-macos-arm64.dmg), signed with a Developer ID and notarized by Apple, plus a separate Claude Desktop bundle, [uoink-3.17.0-macos.mcpb](https://github.com/ryanbiddy/uoink/releases/download/v3.17.0/uoink-3.17.0-macos.mcpb). Intel Macs are not supported. `app/content/product-status.ts` holds every Mac string the site renders. The Windows installer is still unsigned, and the Chrome Web Store listing is not live.

The tool inventory line in `public/llms-full.txt` names release commit `e115c9bf69e9efe4b33256db6d626430eb3b9e7e`. `check-launch-content.cjs` checks it against the generated manifest's source commit. The Windows installer is 549,046,889 bytes; the release checksums are in `public/llms-full.txt`. Until the release numbers replace the placeholders here and in `public/llms-full.txt`, and `installerSizeBytes` in `content/release.json` is set, `check-launch-content.cjs` runs every other check and then fails, listing each placeholder.

## Connect a local Uoink install

For 3.17.0, use the `deep-research` prompt and six `research_*` tools, or start with `uoink research "How do teams test agents?"`. Enable network sources in Settings before discovery. File imports are tested; the extension saves collectors have not yet been tried in a real browser. On headless Linux, install with `scripts/linux/install.sh`, then run `uoink mcp`; ffmpeg and ffprobe are required for media capture. YouTube may block cloud IPs even with local transcription available.

For 3.13.0, agent Install 32 tested the installed 3.13.0 build in an isolated profile: 26/26 PASS. Stdio listed 92 full / 35 core / 92 modern tools, and Claude Code 2.1.316 (haiku) connected with 92 tools and called get_schema_version. `uoink import-list --preview` previewed a HackerTube list, paged it with `--offset`, refused a single-video link cleanly and left the library unchanged. The silent restart was checked step by step against the isolated install: a quiet start with no window, splash or toast, and a real Quit that stayed quit. The full silent installer over a running copy was not run, because an isolated install skips that step by design. Receipt 31's checks, including an in-place upgrade over 3.12.1, passed again. Codex CLI was not re-tested, and the Mac build was not part of this receipt.

For 3.12.1, agent Install 31 tested the installed 3.12.1 build in an isolated profile: 24/24 PASS. Stdio listed 91 full / 35 core / 91 modern tools, and Claude Code 2.1.316 (haiku) connected with 91 tools and called get_schema_version. `uoink mcp` started the server through both installed launchers, the phone inbox stayed off with no relay set up, and a Wikipedia article captured once its site was allowed. The bundled Whisper model, YouTube captions and an in-place upgrade over 3.12.0 passed again. Codex CLI was not re-tested, and the Mac build was not part of this receipt.

For 3.12.0, Agent Install 30 tested the installed build in an isolated profile: 21/21 PASS. The Whisper base model came with the install: with an empty Hugging Face cache and downloads blocked, a caption-less X video was transcribed locally, and nothing went to huggingface.co. A music-only X video read Done · no speech found. Stdio listed 91 full / 35 core / 91 modern tools, and Claude Code 2.1.314 (haiku) connected with 91 tools and called get_schema_version. YouTube captures saved English captions, a short X clip got its screenshot, and an in-place upgrade over 3.11.2 kept the library byte-identical. Codex CLI was not re-tested.

For 3.11.1, Agent Install 27 passed 11/11 isolated-install checks, including stdio inventories of 91 full / 35 core / 91 modern tools, Claude Code 2.1.310 (haiku) connecting with 91 tools and calling `get_schema_version`, helper writes surviving a restart, and `GET /` redirecting to `/dashboard`. The full receipt scope is listed on the agent setup and changelog pages. Codex CLI was not re-tested in receipt 27.

Earlier 3.11.0 testing: Claude Code 2.1.308 listed all 91 tools and called one, and Codex CLI 0.153.4 called two tools. In 3.10.0 testing, Claude Code also ran with the skill and CLI only, and the plugin loaded its skill and started MCP, but its tool calls were not run end to end. Claude Desktop and Cursor retain their earlier MCP testing status. Gemini CLI, pi, and the remaining connection recipes are not yet tested. Stdio works without the Uoink helper running. Start Uoink from the Start menu for the dashboard, browser button, and monitored-playlist polling.

For Claude Desktop on Windows, download and open [uoink-3.17.0.mcpb](https://github.com/ryanbiddy/uoink/releases/download/v3.17.0/uoink-3.17.0.mcpb). Enter the full path to your Uoink folder when asked; Desktop does not expand `%LOCALAPPDATA%`. Reinstall the bundle and restart Desktop after updating.

On the Mac preview, open [uoink-3.17.0-macos.mcpb](https://github.com/ryanbiddy/uoink/releases/download/v3.17.0/uoink-3.17.0-macos.mcpb) instead and select the installed Uoink.app. For other clients, link `/Applications/Uoink.app/Contents/Helpers/uoink` into a folder on your PATH and run `uoink connect <client>`, which prints a config with the installed app's paths. On a Mac, Claude Code passed MCP acceptance (3.11.2); other clients are untested there.

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

Cursor is reported to send only the first 40 tools to its agent. Add `"UOINK_MCP_TOOLSET": "core"` to the server `env` to keep the 36-tool core set and stay under that cap. Omit it for every tool. Consent gates are unchanged.

ChatGPT and claude.ai use copy and paste only. Uoink does not connect to the ChatGPT app over MCP.

## Deploy

Connect this repo to Vercel and let it auto-detect Next.js. Production canonical is `uoink.app`; the legacy video domain redirects there.

## Brand

The family resolutions govern the site: rust #C2410C actions, cream #FFF4EC primary button text and reversed marks, blue #002C9B links on cream, muted #5C4A40, and hairlines #EBD5C5. Every focusable element gets a 2 px rust focus ring with a 2 px offset. Eyebrows use uppercase Inter 700 at 12 px with 0.08em tracking. Wordmarks use the shared SVG paths. The family strip has a 0.8 x cap-height gap and a muted middle dot. The yellow detail is #FFD23F at every size and on every ground. The favicon, dark theme decision, and app-art outline remain unchanged.

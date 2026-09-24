# Brief: uoink.app 3.8.0 refresh

Owner: Astra (Codex) builds. Claude (orchestrator) reviews and opens the PR. Ryan merges (merging to main deploys production on Vercel).

Hard rules: no deploys, no pushes, no Vercel CLI, no DNS. Work only inside this repository. Truth source for every product claim is `docs/launch/FACT-SHEET-3.8.0.md`. If a page says something the fact sheet contradicts or does not support, fix the page to match the fact sheet or remove the claim. For MCP tool names/descriptions, the product source of truth is the uoink release checkout at E:\AI\projects\uoink\checkouts\Yoink-release-3.8.0 (read-only for you): stdio tools = the `@mcp.tool` functions in uoink_mcp.py (32), HTTP registry = the registry in uoink_mcp_tools.py.

## Goal

The live site still says v3.3.1, "64 MCP tools", "14 over stdio", and "Mac build queued". Bring every page to the 3.8.0 truth and give 3.8.0 "Living Library" a clear home, without redesigning anything. Keep the existing design system, components and voice.

## Changes

1. `app/content/pages.ts`: `VERSION = "v3.8.0"`. Everywhere the page copy states a version, platform, or count, make it match the fact sheet.
2. `app/content/mcp-tools.ts`: regenerate from the release checkout. `MCP_STDIO_TOOL_COUNT` = the real stdio count (32); `MCP_TOOL_COUNT` = the real HTTP registry count (count it from the code; do not trust prose). Replace the tool list with the real current registry names + one-line descriptions taken from the product docstrings/registry descriptions. Update the header comment with the source commit (`git -C <checkout> rev-parse HEAD`) and today's date.
3. Mac: `app/content/product-status.ts` and every Mac mention: change to an honest "Windows 10/11 only. No Mac build scheduled." (no dates, no "queued"). Keep the Mac logo/ledger card only if it can say that without implying a coming release; otherwise remove the Mac card.
4. Unsigned installer: the install page must say the installer is unsigned and Windows SmartScreen will show a warning, with the one-line "More info → Run anyway" instruction. Installer size about 390 MB. No admin rights needed.
5. Home page: add one short "New in 3.8.0: Living Library" section (reuse an existing section component) covering exactly the 3.8.0 bullets in the fact sheet: clip search + evidence cards, standing capture (YouTube channel, YouTube playlist, podcast RSS), library reach over MCP, cited range export, chapter navigation. Link to the release notes (`https://github.com/ryanbiddy/uoink/releases/tag/v3.8.0`) and /changelog. Obey the fact sheet's "Do NOT claim" list, especially: the library does not organize itself.
6. `/changelog`: add entries for 3.4 through 3.8.0 summarized from the product CHANGELOG.md in the release checkout (one short paragraph per release, newest first, dated). Mark 3.8.0 "Living Library".
7. `/developers` and `/mcp`: stdio setup = the README's config JSON and the `.mcpb` one-click path for Claude Desktop; tested clients = Claude Desktop and Cursor. Update `public/.well-known/mcp.json` and `public/.well-known/mcp/server-card.json` (and `app/api/features-manifest` if it carries counts/version) to 3.8.0 and the real counts.
8. `public/llms.txt` and `public/llms-full.txt` (or wherever they are generated): same truth pass.
9. Download links keep using the `releases/latest` pattern (it will resolve to 3.8.0 once Ryan publishes). Do not hardcode a 3.8.0 asset URL anywhere a `latest` link works.
10. Search the whole repo (app/, content/, public/, docs excluded) for: `3.3`, `3.4`, `3.5`, `3.6`, `3.7`, `64 `, `63 tools`, `14 over`, `queued`, `Mac build`, `macOS`, `signed`, `replayryan.com`. Resolve each hit to the 3.8.0 truth or leave it if it is historical (changelog/blog dates) and say so in the handoff.

## Checks you must run and report

- `npm ci` (if node_modules is stale) then `npm run lint` and `npm run build` (this repo uses static export to `out/`): both must pass.
- Serve `out/` locally (`npx serve out` or `python -m http.server -d out`) and screenshot `/`, `/install`, `/developers`, `/changelog` at 1440x900 and 390x844 with Playwright into `docs/launch/screens/`. Report console errors (must be zero).
- The grep list from change 10: paste the remaining hits with a reason each.
- Write `docs/launch/handoff-astra-3.8.0-refresh.md`: files changed, counts you derived and how, commands run with results, screenshots, open questions.

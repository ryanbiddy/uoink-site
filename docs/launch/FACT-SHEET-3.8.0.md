# Uoink 3.8.0 — fact sheet

The single source of truth for every marketing executor (Grok Bot, Muse, Astra, Hermes, any drafting model). If a claim is not on this sheet, do not make it. Paste this whole file into a task when the executor cannot read local files.

Verified 2026-09-23 against the release branch `release/3.8.0` (README.md, CHANGELOG.md, library_work.py). Items marked ⏳ are true only after Ryan publishes the release.

## Identity

- **Name:** Uoink (the maker writes it lowercase, "uoink", in casual copy). Verb: "uoink that video".
- **Maker:** Ryan Biddy, @replayryan on X. A personal side project, not affiliated with any employer. Never mention his employer in Uoink marketing.
- **Website:** https://uoink.app · **Code:** https://github.com/ryanbiddy/uoink · **Privacy:** https://uoink.app/privacy
- **Release:** ⏳ https://github.com/ryanbiddy/uoink/releases/tag/v3.8.0 ("Uoink v3.8.0 — Living Library")
- **License / price:** MIT, free. No account, no Uoink cloud, no required telemetry.

## What it is (approved one-liners)

- README line: "Uoink keeps the videos, podcasts, and articles creators and AI developers study on their own disk, then hands them to Claude, ChatGPT, Cursor, or a local MCP agent as a cited corpus."
- Short: "A local library for the videos and podcasts you study, that any AI you use can search and cite."
- Problem line (README): paste a YouTube link into a chatbot and it can't watch it; it invents quotes. Uoink gives the model the real transcript, frames and comments, with timestamps.

## What it does

| Area | Fact |
|---|---|
| Capture | YouTube (flagship): timestamped transcript, timestamped screenshots, top comments, channel context, metadata. X video + post text. Podcasts: RSS/Atom watching with optional per-feed auto-ingest (local MP3 + local WhisperX transcription). Web articles. Reddit threads. |
| How you capture | Uoink button under a YouTube video, right-click a link, `Alt+U`, or ask your AI agent ("uoink that video"). |
| Where it goes | Structured Markdown + JSON sidecar on your own disk, indexed in one local library. |
| AI access | 1) Clipboard paste with transcript + frames. 2) Local MCP server: **32 tools over stdio**, plus a larger local HTTP registry. 3) OpenAPI 3.1 bridge for local agents that don't speak MCP. |
| Clients | Tested with **Claude Desktop and Cursor**. One-click Claude Desktop install via a `.mcpb` bundle. Cline/Continue work as standard stdio but weren't individually smoke-tested. |
| Platform | **Windows 10/11 only.** Installer is **unsigned** (Windows SmartScreen will warn). About 390 MB. No admin rights needed; installs to `%LOCALAPPDATA%\Uoink`. The browser extension is sideloaded from the install (Chrome Web Store listing pending). |

## New in 3.8.0 "Living Library"

- **Clip search + evidence cards:** search inside videos at the moment level and get timestamped, deep-linked excerpts an AI can quote and cite. Now on the everyday stdio MCP surface.
- **Standing capture:** follow a YouTube channel, a YouTube playlist, or a podcast RSS feed, and new uploads/episodes land in the library without you re-grabbing them.
- **Library reach:** library search, item reads, resource templates and prompts over MCP, so any MCP client can browse and cite the library.
- **Cited range export:** quote a stretch of a video or episode with speaker labels, chapters and provenance.
- **Chapter navigation** for items that have chapters.
- **Quiet captures:** a toast notification instead of a File Explorer window per capture.
- **Privacy:** entity extraction is now opt-in (off by default); the model-usage meter shows real usage when you add your own Anthropic key; recall hook hardened against prompt injection from captured text.

## Proof points you may use (with their source)

- The maker's own library holds ~144,000 timestamped, deep-linked moments (129,832 transcript chunks + 14,165 screenshots across ~550 items), measured 2026-09-04 on his live index. Say "my library", never "users'".
- 3.8.0 was qualified with a full automated test tree and an isolated clean-install test before release.

## Do NOT claim

- Mac or Linux support, or a date for either.
- That the library organizes, files or re-shelves itself. The Librarian only proposes; applying is off by default and its quality gate has not passed.
- That Uoink "watches" or "understands" video. It captures transcripts, frames, comments and metadata.
- Any user, download, star or revenue number.
- That the installer is signed, or on the Microsoft Store / Chrome Web Store.
- Anything about Ryan's employer, its customers, partners or competitors.
- That it works with ChatGPT's app over MCP (clipboard path yes; MCP clients = Claude Desktop, Cursor tested).
- Superlatives: "first", "only", "best".

## Visual assets

- Product screenshots and video already used on uoink.app (`E:\AI\projects\uoink\site\public\`).
- Needed for launch: a 30-60 s demo (capture a YouTube video → ask Claude a question → cited answer with timestamp link), a 1200x630 card, 3 screenshots (capture button, library/clip search, Claude citing a timestamp). Owner: Astra (screen capture on this PC) — see `executors/ASTRA.md`.

---
title: "Uoink vs Readwise Reader: a local video library or a reading app"
slug: "readwise-reader"
description: "Readwise Reader is a polished reading app on every device. Uoink is a free app for Windows, with a Mac preview, that saves videos and podcasts to your disk for AI to cite."
date: 2026-10-30
---

# Uoink vs Readwise Reader

Pick Readwise Reader if you want a polished reading app on your phone, e-reader and desktop, with sync, highlights and text-to-speech. Pick Uoink if you are on Windows or an Apple Silicon Mac (preview) and want YouTube videos, podcasts and X posts saved as files on your own disk, where your AI can search and cite them without an account.

Both tools now connect to AI assistants over MCP, so that is no longer the dividing line. The real difference is what each is built for and where the library lives. Reader is a reading app, and your library syncs through your Readwise account. Uoink is a research library for video and audio, kept on your own disk.

## Pick Readwise Reader if

- You read on your phone or an e-reader. Reader has iOS and Android apps, Mac and Windows desktop apps, a web app, browser extensions and an e-ink mode. [1]
- You want one library on every device, kept in sync and readable offline. [1]
- Most of what you save is articles, PDFs, EPUBs, newsletters and RSS. [1][2]
- You highlight as you read and want those highlights sent to Obsidian, Notion and other apps (Full Readwise plan). [2][7]
- You want text-to-speech and an AI reading assistant built in. [2][6]
- You want a finished, polished product and are happy to pay a subscription for it. [2]

## Pick Uoink if

- You study YouTube videos and want more than the transcript: timestamps, screenshots, top comments, channel context and metadata.
- You want podcast RSS feeds watched, with new episodes transcribed on your own computer once you turn on auto-ingest.
- You want your library as plain Markdown and JSON files on your disk, with no account.
- You want your AI to search the library and cite timestamps through a local MCP server.
- You want it free and open source (MIT).
- You use Windows 10 or 11, or an Apple Silicon Mac with macOS 15 or later (preview).

## Feature comparison

| Feature | Uoink | Readwise Reader |
|---|---|---|
| What it is | A local library for the videos and podcasts you study, that your AI can search and cite | A reading app for "articles, PDFs, EPUBs, email newsletters, RSS feeds, YouTube videos, X threads, and more" [1] |
| Where the library lives | Markdown and JSON files on your disk, with a local search index | Synced across your devices, and Reader also works offline [1] |
| Account | None | Readwise account; the MCP connection signs in with it [3] |
| Platforms | Windows 10/11, plus a Mac preview for Apple Silicon (macOS 15 or later) | iOS, Android, web, Mac and Windows desktop apps, Chrome, Firefox and Safari extensions, e-ink mode [1] |
| YouTube | Timestamped transcript, screenshots, top comments, channel context and metadata | Watch alongside a time-synced transcript; uses the creator's captions or YouTube's auto-generated ones, with an optional enhanced transcript [4] |
| Podcasts | Watches RSS and Atom feeds; optional auto-ingest downloads new episodes and transcribes them locally with WhisperX | Share an episode from Spotify, Overcast or Apple Podcasts to save a transcript; built as "a podcast companion, rather than a full podcast player" [5] |
| X (Twitter) | Post text and X video | Threads saved as one document, with only the original poster's tweets [5] |
| Articles and files | Web articles. PDF and EPUB import are not among its listed sources. | Web articles through the extension; uploads of PDFs, EPUBs, Markdown and OPML files [5] |
| Reading tools | A Reader view in the dashboard. Highlighting, text-to-speech and spaced review are not among its features. | Highlighting, text-to-speech and Ghostreader AI on the Reader plan; Daily Review with Full Readwise [2] |
| AI assistant access | Local MCP server with 91 tools over stdio, a CLI and an OpenAPI bridge. ChatGPT is copy and paste only. | Hosted Readwise MCP server for Claude, ChatGPT, Cursor and others, plus a CLI and an API [2][3] |
| Built-in AI | Optional; uses your own Anthropic key | Ghostreader; Global Ghostreader searches your whole library and "answers with citations that link to the source" [6] |
| Export | The files are already on your disk; cited range export | CSV of documents, OPML of feeds, a ZIP of uploads and full article text, and highlights as Markdown [7] |
| Price | Free, open source (MIT) | Reader only $7.99/mo billed yearly; Full Readwise $9.99/mo billed yearly; 30-day free trial [2] |

## Privacy and where your data lives

**Uoink.** Captures and indexes stay on your disk. There is no account and no Uoink-hosted copy of your library. Capturing a source contacts that source's site, and X text capture can use FxTwitter. Optional AI features, and connected agents you allow to use them, can send relevant library text to Anthropic with your own key. Anonymous usage counts are off by default; if you turn them on, Uoink sends daily counts and never content, URLs, titles or search text. Some things still reach the network: model downloads from Hugging Face, release checks with GitHub, and telemetry from one model dependency (pyannote-audio), which you can turn off with an environment variable. Exports and synced mirror folders make extra copies that sync software can upload. The full list is in Uoink's disclosures. [U1][U2]

**Readwise Reader.** Your library syncs across your devices, and Reader works offline. [1] AI assistants reach it through Readwise's hosted MCP server at mcp2.readwise.io after you sign in with your Readwise account. [3] Readwise's privacy policy says its "business model has never been to sell data and it never will," that it collects "the content you save," and that you can export your data at any time. It also says data may go to service providers for hosting, analytics and similar work, in "the United States and other jurisdictions." [8]

## Price

- **Uoink:** free and MIT-licensed. Optional AI features use your own Anthropic key, and optional paid discovery uses your own ScrapeCreators key, so those costs bill to your own accounts. [U1][U2]
- **Readwise Reader:** 30-day free trial with no credit card. After that, Reader only costs $7.99 a month billed yearly ($8.99 billed monthly). Full Readwise, which adds Daily Review and highlight export to Notion, Obsidian and more, costs $9.99 a month billed yearly ($12.99 billed monthly). There is a 50% discount for students, educators and some others. [1][2]

## Uoink's honest limits

- **Windows 10 and 11, plus a Mac preview for Apple Silicon (macOS 15 or later).** Intel Macs are not supported, and there are no phone apps.
- **No sync.** There is no Uoink cloud, so there is no built-in sync between devices. Reader keeps every device in step.
- **Rougher install.** The Windows installer is unsigned and about 519 MB, so Windows SmartScreen may warn you (choose More info, then Run anyway). The browser button is sideloaded through Chrome's Developer mode because the Chrome Web Store listing is pending. Chrome is the tested browser.
- **Not a reading app.** Highlighting, text-to-speech, an e-ink mode and spaced review are not among its features. If reading is the main job, Reader is the better tool.
- **Fewer formats.** PDFs and EPUBs are not among Uoink's listed sources.
- **No self-organizing library.** The library does not file or re-shelve itself. The Librarian only proposes changes, and applying them is off by default because its quality gate has not passed.
- **Agents must run on the same computer.** An agent has to be able to run Uoink on the computer that holds the library. The ChatGPT app does not connect over MCP; use copy and paste.
- **A side project.** Uoink is a personal side project by one maker, Ryan Biddy.

## Sources

Competitor pages were opened and read on 2026-10-24.

1. Readwise Reader product page and FAQ: https://readwise.io/read (seen 2026-10-24)
2. Readwise pricing: https://readwise.io/pricing (seen 2026-10-24)
3. Readwise MCP server docs: https://docs.readwise.io/tools/mcp (seen 2026-10-24)
4. Reader docs, Videos FAQ: https://docs.readwise.io/reader/docs/faqs/videos (seen 2026-10-24)
5. Reader docs, Adding new content FAQ: https://docs.readwise.io/reader/docs/faqs/adding-new-content (seen 2026-10-24)
6. Reader docs, Ghostreader overview: https://docs.readwise.io/reader/guides/ghostreader/overview (seen 2026-10-24)
7. Reader docs, Exporting FAQ: https://docs.readwise.io/reader/docs/faqs/exporting (seen 2026-10-24)
8. Readwise privacy policy, last revised December 20, 2024: https://readwise.io/privacy (seen 2026-10-24)

Uoink facts:

- U1. Uoink 3.12.0 summary (updated 2026-10-30): https://uoink.app/llms.txt
- U2. Uoink 3.12.0 full disclosures (updated 2026-10-30): https://uoink.app/llms-full.txt

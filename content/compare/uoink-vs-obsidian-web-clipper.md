---
title: "Uoink vs Obsidian Web Clipper: a research library or a clipper for your vault"
slug: "obsidian-web-clipper"
description: "Obsidian Web Clipper saves pages to your vault from major browsers. Uoink saves videos and podcasts to a local library on Windows or a Mac (preview) that your AI can search and cite."
date: 2026-10-25
---

# Uoink vs Obsidian Web Clipper

Pick Obsidian Web Clipper if you already keep notes in Obsidian and want to clip web pages, highlights and YouTube transcripts into your vault from any major browser, on desktop or phone. Pick Uoink if you are on Windows or an Apple Silicon Mac (preview) and want a searchable library of videos, podcasts and posts, with screenshots, comments and local transcription, that your AI can search and cite over MCP.

Both tools are free, open source under the MIT license, and save Markdown to your own device, so privacy is not the main difference. Web Clipper is a clipping tool that feeds your Obsidian notes. Uoink is a capture tool plus a library and a local MCP server built for research on video and audio.

## Pick Obsidian Web Clipper if

- Your notes already live in Obsidian and you want clips to land right in your vault. [1][2]
- You use Firefox, Safari, Edge or a phone browser. Web Clipper supports Chromium browsers, Firefox and Firefox Mobile, Safari on macOS, iOS and iPadOS, and Edge. [2]
- You want to install from your browser's official extension store. [2]
- You want fine control over how each site is saved, with templates, variables and site rules. [1]
- You highlight passages, images and blocks as you read. [1]
- You want AI prompts run on a page with the model of your choice, including a local model through Ollama. [4]

## Pick Uoink if

- You study YouTube videos and want the timestamped transcript plus screenshots, top comments, channel context and metadata in one capture.
- You want YouTube channels, playlists and podcast RSS feeds watched, with optional automatic capture of new items.
- You want podcast episodes transcribed on your own computer.
- You want X posts and videos and Reddit threads in the same library.
- You want an AI assistant to search the whole library and cite timestamps through a local MCP server, with no account.
- You use Windows 10 or 11, or an Apple Silicon Mac with macOS 15 or later (preview).

## Feature comparison

| Feature | Uoink | Obsidian Web Clipper |
|---|---|---|
| What it is | A desktop app for Windows, with a Mac preview, that captures sources into a local library and serves that library to AI over MCP | "a free browser extension that lets you highlight pages and save web content to your vault" [2] |
| Where saves live | Markdown plus a JSON sidecar on your disk, indexed in one local library | "stored locally in your Obsidian vault" as "durable Markdown files" [1] |
| What else you need | Windows 10/11, or an Apple Silicon Mac with macOS 15 or later for the preview | The Obsidian app. Web Clipper hands each clip to it through the Obsidian URI and the clipboard. [5] Obsidian runs on Windows, macOS, Linux, iOS and Android. [9] |
| Browsers | Chrome (tested). Other Chromium browsers such as Edge and Brave may work but are not tested. | Chrome, Brave, Arc, Orion and other Chromium browsers; Firefox and Firefox Mobile; Safari on macOS, iOS and iPadOS; Edge [2] |
| Install | Unsigned Windows installer, about 390 MB, no admin rights needed; on a Mac, a DMG signed with a Developer ID and notarized by Apple. The browser button is sideloaded in Chrome's Developer mode | From each browser's official extension directory [2] |
| How you capture | YouTube button, right-click, Alt+U, or your AI agent; standing capture for YouTube channels, playlists and podcast feeds | Toolbar icon, hotkeys or the right-click menu, then "Add to Obsidian" [3] |
| Web pages | Web articles and Reddit threads | The main article content by default, or your selection or highlights; templates and rules per site [1][3] |
| YouTube | Timestamped transcript, screenshots, top comments, channel context and metadata | A `{{transcript}}` template variable, "only for YouTube currently" when added in 1.2.0 (March 2026) [7]; an interactive transcript view since 1.4.0 [8] |
| Images | YouTube captures include screenshots; images can be captured too | "Images are not automatically downloaded"; clips link to the web copy, and Obsidian has a command to download them [3] |
| Highlighting | Not a feature | Highlight text, images and blocks; highlights stay visible when you come back to a page [1] |
| AI on the page | Optional; uses your own Anthropic key | Interpreter runs natural-language prompts through a provider you pick, such as Anthropic, OpenAI, Google Gemini or Ollama [4] |
| AI assistant access | Local MCP server with 91 tools over stdio, a CLI and an OpenAPI bridge; local keyword search and optional local semantic search | Through the separate Obsidian CLI, "agentic tools" can read, search and write your vault while the Obsidian app is running [11] |
| Price and license | Free, open source (MIT) | Free and open source under the MIT License [1][6] |

## Privacy and where your data lives

**Uoink.** Captures and indexes stay on your disk. There is no account and no Uoink-hosted copy of your library. Capturing a source contacts that source's site, and X text capture can use FxTwitter. Optional AI features, and connected agents you allow to use them, can send relevant library text to Anthropic with your own key. Anonymous usage counts are off by default; if you turn them on, Uoink sends daily counts and never content, URLs, titles or search text. Some things still reach the network: model downloads from Hugging Face, release checks with GitHub, and telemetry from one model dependency (pyannote-audio), which you can turn off with an environment variable. Exports and synced mirror folders make extra copies that sync software can upload. [U1][U2]

**Obsidian Web Clipper.** Web Clipper "saves content locally to your Obsidian vault," and Obsidian says: "Your data is not collected, and we do not gather any usage metrics." The code is open source. [2] If you use Interpreter with a cloud model, "Interpreter requests are sent directly to the provider you choose," under that provider's terms; Obsidian says it "does not gather or store any data about your requests." Ollama keeps the model on your device. [4] Obsidian itself stores notes on your device; its optional Sync service uses AES-256 end-to-end encryption. [10][12]

## Price

- **Uoink:** free and MIT-licensed. Optional AI features use your own Anthropic key, and optional paid discovery uses your own ScrapeCreators key, so those costs bill to your own accounts. [U1][U2]
- **Obsidian Web Clipper:** free. [1] Obsidian is "Free without limits." A commercial license is optional at $50 per user per year. Sync costs $4 per user per month billed annually ($5 billed monthly), and Publish costs $8 per site per month billed annually ($10 billed monthly). [10] Interpreter with a cloud provider needs your own API key from that provider. [4]

## Uoink's honest limits

- **Windows 10 and 11, plus a Mac preview for Apple Silicon (macOS 15 or later).** Intel Macs are not supported, and there is no mobile app. Web Clipper works in Safari on iPhone and iPad and in Firefox Mobile.
- **Harder install.** The Windows installer is unsigned and about 390 MB, so Windows SmartScreen may warn you (choose More info, then Run anyway). The browser button is sideloaded through Chrome's Developer mode because the Chrome Web Store listing is pending. Web Clipper installs from official stores.
- **One tested browser.** Chrome is tested. Other Chromium browsers such as Edge and Brave may work but are not tested. No Firefox or Safari extension is listed.
- **Not a note-taking tool.** Highlighting is not among its features. If you live in Obsidian, Web Clipper fits that habit better.
- **Less control over page formatting.** Web Clipper's templates, variables and site rules give finer control over how a web page is saved.
- **No self-organizing library.** The library does not file or re-shelve itself. The Librarian only proposes changes, and applying them is off by default because its quality gate has not passed.
- **Agents must run on the same computer.** An agent has to be able to run Uoink on the computer that holds the library. The ChatGPT app does not connect over MCP; use copy and paste.
- **A side project.** Uoink is a personal side project by one maker, Ryan Biddy.

## Sources

Competitor pages were opened and read on 2026-10-24.

1. Obsidian Web Clipper product page: https://obsidian.md/clipper (seen 2026-10-24)
2. Obsidian Help, Introduction to Obsidian Web Clipper: https://obsidian.md/help/web-clipper (seen 2026-10-24)
3. Obsidian Help, Clip web pages: https://obsidian.md/help/web-clipper/capture (seen 2026-10-24)
4. Obsidian Help, Interpreter: https://obsidian.md/help/web-clipper/interpreter (seen 2026-10-24)
5. Obsidian Help, Troubleshoot Web Clipper: https://obsidian.md/help/web-clipper/troubleshoot (seen 2026-10-24)
6. Web Clipper source code and license: https://github.com/obsidianmd/obsidian-clipper (seen 2026-10-24)
7. Web Clipper 1.2.0 release notes, March 13, 2026: https://github.com/obsidianmd/obsidian-clipper/releases/tag/1.2.0 (seen 2026-10-24)
8. Web Clipper 1.4.0 release notes, April 9, 2026: https://github.com/obsidianmd/obsidian-clipper/releases/tag/1.4.0 (seen 2026-10-24)
9. Obsidian downloads: https://obsidian.md/download (seen 2026-10-24)
10. Obsidian pricing: https://obsidian.md/pricing (seen 2026-10-24)
11. Obsidian CLI: https://obsidian.md/cli (seen 2026-10-24)
12. Obsidian home page: https://obsidian.md/ (seen 2026-10-24)

Uoink facts:

- U1. Uoink 3.11.2 summary (updated 2026-10-25): https://uoink.app/llms.txt
- U2. Uoink 3.11.2 full disclosures (updated 2026-10-25): https://uoink.app/llms-full.txt

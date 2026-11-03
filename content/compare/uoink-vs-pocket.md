---
title: "Pocket alternative: Uoink saves videos, podcasts and articles for your AI"
slug: "pocket"
description: "Mozilla shut Pocket down in July 2025. Uoink is a free save-for-later app for Windows and Mac (preview) that keeps full text and transcripts on your disk for your AI to search."
date: 2026-11-03
---

# Uoink as a Pocket alternative

Mozilla shut Pocket down on July 8, 2025. If you mostly saved articles to read later on your phone, a read-later app is the closer replacement. Pick Uoink if you are on Windows or an Apple Silicon Mac (preview) and what you save is mostly YouTube videos, podcasts, X posts and articles that you want your AI to search later, kept as full text and transcripts on your own disk.

Pocket kept your saves in an online account. When Mozilla closed it, users could export their saves until October 8, 2025, "after which their data will be permanently deleted." [1] Uoink takes the other approach: every save is a Markdown file plus a JSON sidecar on your computer, so there is no service that has to stay open for your library to exist. The trade-off is that Uoink is a desktop research library, not a reading app on every device.

## Pick a read-later app if

- You read saved articles on your phone or an e-reader. Instapaper describes itself as "A simple tool for saving web pages to read later on iOS, Android, computer, or eReaders." [2]
- You want bookmarks organized and synced everywhere. Raindrop.io calls itself an "All-in-one bookmark manager," with extensions for Chrome, Firefox, Safari and Edge and apps for Windows, Mac, iPad, iPhone and Android. It also lists an MCP integration to "Search, save, and organize your bookmarks right from Claude, ChatGPT, and other AI apps." [3]
- You use Firefox and want something built in. Mozilla points Pocket users to "Tab Groups and enhanced bookmarks," which it says "provide built-in ways to manage reading lists." [4]
- Most of what you save is articles you plan to read, not videos and podcasts you plan to study.

## Pick Uoink if

- You save YouTube videos and want the timestamped transcript, screenshots, top comments, channel context and metadata kept with each one.
- You follow podcasts and want new episodes from their RSS feeds transcribed on your own computer once you turn on auto-ingest.
- You want web articles, X posts and videos, and Reddit threads in the same library.
- You want your saves as plain files on your disk, so they outlive any service.
- You want your AI to search everything you saved and cite the timestamp through a local MCP server, with no account.
- You use Windows 10 or 11, or an Apple Silicon Mac with macOS 15 or later (preview).

## How Uoink handles what Pocket did

| Job | Uoink |
|---|---|
| Save a link | YouTube button, right-click, Alt+U, or your AI agent |
| Where saves live | Markdown plus a JSON sidecar on your disk, in one local library |
| Articles | Web articles and Reddit threads; paywalls and login walls are labeled as failed captures |
| Videos | Timestamped YouTube transcript, screenshots, top comments, channel context and metadata; X video and post text |
| Videos without captions | Transcribed on your computer with the Whisper base model that ships with Uoink |
| Podcasts | Follow RSS and Atom feeds; per-feed auto-ingest downloads new episodes and transcribes them locally |
| Search | Local keyword search, with optional local semantic search |
| AI access | Local MCP server with 91 tools over stdio, a CLI and an OpenAPI bridge. ChatGPT is copy and paste only. |
| Saving from your phone | No phone app. An optional phone inbox (Uoink Relay), off by default, takes links shared from an iOS Shortcut or an Android share target through a small relay you deploy to your own Render account. |
| Platforms | Windows 10/11, plus a Mac preview for Apple Silicon (macOS 15 or later) |
| Price | Free, open source (MIT) |

## Privacy and where your data lives

**Uoink.** Captures and indexes stay on your disk. There is no account and no Uoink-hosted copy of your library. Capturing a source contacts that source's site, and X text capture can use FxTwitter. The optional phone inbox keeps a link and an optional note on your own relay for up to 7 days, and Uoink deletes each one from the relay after capturing it. Optional AI features, and connected agents you allow to use them, can send relevant library text to Anthropic with your own key. Anonymous usage counts are off by default; if you turn them on, Uoink sends daily counts and never content, URLs, titles or search text. Some things still reach the network: model downloads from Hugging Face, release checks with GitHub, and telemetry from one model dependency (pyannote-audio), which you can turn off with an environment variable. The full list is in Uoink's disclosures. [U1][U2]

**Pocket.** Pocket is closed. Mozilla said users could export saves until October 8, 2025, after which their data would be permanently deleted. [1]

## Price

- **Uoink:** free and MIT-licensed. Optional AI features use your own Anthropic key, and optional paid discovery uses your own ScrapeCreators key, so those costs bill to your own accounts. [U1][U2]
- **Read-later apps:** Raindrop.io says it is free to use with unlimited bookmarks, collections and devices, with paid premium features. [3] Check Instapaper's own site for its current plans. [2]

## Uoink's honest limits

- **Windows 10 and 11, plus a Mac preview for Apple Silicon (macOS 15 or later).** Intel Macs are not supported, and there is no phone app. The phone inbox needs a relay you set up yourself.
- **Not a reading app.** Uoink has a Reader view in its dashboard, but highlighting, text-to-speech and an e-reader mode are not among its features.
- **No Pocket importer.** Uoink does not list one. An agent connected to Uoink can capture URLs, so it can work through a list of links you kept.
- **No sync.** There is no Uoink cloud, so there is no built-in sync between devices.
- **Rougher install.** The Windows installer is unsigned and about 519 MB, so Windows SmartScreen may warn you (choose More info, then Run anyway). The browser button is sideloaded through Chrome's Developer mode because the Chrome Web Store listing is pending. Chrome is the tested browser.
- **Some articles fail.** Uoink labels paywalls and login walls as failed captures.
- **A side project.** Uoink is a personal side project by one maker, Ryan Biddy.

## Sources

Competitor pages were opened and read on 2026-11-03.

1. Mozilla blog, Investing in what moves the internet forward, May 22, 2025: https://blog.mozilla.org/en/mozilla/building-whats-next/ (seen 2026-11-03)
2. Instapaper home page: https://www.instapaper.com/ (seen 2026-11-03)
3. Raindrop.io home page: https://raindrop.io/ (seen 2026-11-03)
4. Pocket farewell page: https://getpocket.com/farewell (seen 2026-11-03)

Uoink facts:

- U1. Uoink 3.12.1 summary (updated 2026-11-01): https://uoink.app/llms.txt
- U2. Uoink 3.12.1 full disclosures (updated 2026-11-01): https://uoink.app/llms-full.txt

---
title: "Uoink vs Recall: full transcripts on your disk or an AI knowledge base in the cloud"
slug: "recall"
description: "Recall saves and summarizes videos, podcasts and articles in its cloud, on every device. Uoink keeps full transcripts on your disk, free, for your own AI to search and cite."
date: 2026-11-04
---

# Uoink vs Recall

Pick Recall if you want an AI knowledge base on your phone, browser and laptop that summarizes what you save, links it into a knowledge graph and lets you chat with it. Pick Uoink if you are on Windows or an Apple Silicon Mac (preview) and want the full transcripts of YouTube videos and podcasts kept as files on your own disk, where Claude, Cursor or Codex can search and cite them over MCP, with no account.

Both tools now connect to AI assistants over MCP, so that is not the dividing line. Recall is a cloud service: it writes summaries for you, keeps your knowledge base in its cloud and serves it to your AI through a hosted MCP server after you sign in. Uoink keeps the source text itself on your computer, and the AI you already use does the summarizing and the asking.

## Pick Recall if

- You want to save from your phone. Recall has iOS and Android apps, a web app, and Chrome, Firefox, Edge and Safari extensions. [2]
- You want summaries written for you. Recall turns "articles, YouTube videos, podcasts, and PDFs" into summaries with timestamps (unlimited on the Plus plan). [2]
- You save PDFs, notes and recipes next to videos and articles. [1][2]
- You want related items linked into a knowledge graph automatically, with quizzes and spaced repetition (Plus). [2]
- You want to chat with your saved knowledge inside Recall, and choose the model on the Max plan. [1][2]
- You want one library that follows you to every device. [1][2]

## Pick Uoink if

- You want the full timestamped transcript of each YouTube video kept, plus screenshots, top comments, channel context and metadata.
- You want YouTube channels, playlists and podcast RSS feeds followed, with new podcast episodes transcribed on your own computer once you turn on auto-ingest.
- You study videos without captions. Uoink ships Whisper's base model and transcribes them on your computer from the first capture.
- You want X posts and videos and Reddit threads in the same library.
- You want your library as plain Markdown and JSON files on your disk, with no account and no subscription.
- You use Windows 10 or 11, or an Apple Silicon Mac with macOS 15 or later (preview).

## Feature comparison

| Feature | Uoink | Recall |
|---|---|---|
| What it is | A desktop app that captures sources into a local library and serves that library to your AI over MCP | An AI knowledge base: save content, write notes and "chat with your knowledge" [1] |
| Where the library lives | Markdown and JSON files on your disk, with a local search index | "your knowledge base is stored safely in the cloud" [1] |
| Account | None | Recall account; free sign-up with no credit card [2] |
| Platforms | Windows 10/11, a Mac preview for Apple Silicon (macOS 15 or later), and headless Linux for agents | Web app; Chrome, Firefox, Edge and Safari extensions; iOS and Android [2] |
| What it saves | YouTube, podcast RSS and Atom feeds, X posts and video, web articles, Reddit threads | Articles, YouTube videos, podcasts and PDFs, plus your own notes [2] |
| YouTube | Timestamped transcript, screenshots, top comments, channel context and metadata | Summaries with timestamps; 10 AI summaries a month on Free, unlimited on Plus [2] |
| Videos without captions | Transcribed on your computer with the Whisper base model that ships with Uoink | Not covered in the Recall pages we read |
| Summaries | Your AI writes them from the saved transcript; optional built-in AI features use your own Anthropic key | Built in [2] |
| AI assistant access | Local MCP server with 99 tools over stdio, a CLI and an OpenAPI bridge. ChatGPT is copy and paste only. | Hosted MCP server with eight tools for Claude, ChatGPT, Cursor, Codex, Perplexity and Gemini CLI. It reads your knowledge base; Recall says write capabilities are "coming soon." [3] API and MCP access are on the Free plan. [2] |
| Built-in chat | Not a feature; you ask in your own AI client | Chat with your saved knowledge, the web or both (Plus); pick the model on Max [2] |
| Export | The files are already on your disk; cited range export | "You can export all your data anytime in Markdown format." [1] |
| Price | Free, open source (MIT) | Free; Plus $10 a month and Max $38 a month, billed yearly [2] |

## Privacy and where your data lives

**Uoink.** Captures and indexes stay on your disk. There is no account and no Uoink-hosted copy of your library. Capturing a source contacts that source's site, and X text capture can use FxTwitter. Optional AI features, and connected agents you allow to use them, can send relevant library text to Anthropic with your own key. Anonymous usage counts are off by default; if you turn them on, Uoink sends daily counts and never content, URLs, titles or search text. Some things still reach the network: model downloads from Hugging Face, release checks with GitHub, and telemetry from one model dependency (pyannote-audio), which you can turn off with an environment variable. Exports and synced mirror folders make extra copies that sync software can upload. The full list is in Uoink's disclosures. [U1][U2]

**Recall.** Recall says augmented browsing "is local first" while "your knowledge base is stored safely in the cloud," and that you can export everything as Markdown at any time. [1] AI assistants reach it through Recall's hosted MCP server, signing in through the browser or with an API key. [3] Recall's privacy policy says: "We do not use your data for advertising, profiling, training any AI models or any purpose beyond serving you," and that it does not sell data. [4]

## Price

- **Uoink:** free and MIT-licensed. Optional AI features use your own Anthropic key, and optional paid discovery uses your own ScrapeCreators key, so those costs bill to your own accounts. [U1][U2]
- **Recall:** the Free plan is "free forever" with no credit card, and includes unlimited saves and notes, 10 AI summaries a month, and API and MCP access. Plus costs $10 a month and Max $38 a month, both billed yearly; yearly billing saves 20%. Recall offers a 30-day refund and a 20% student discount. [2]

## Uoink's honest limits

- **Windows 10 and 11, plus a Mac preview for Apple Silicon (macOS 15 or later).** Intel Macs are not supported, and there are no phone apps. Recall runs on iOS, Android, the web and four browsers.
- **No summaries out of the box.** Uoink keeps the transcript; your AI writes the summary when you ask. Recall writes summaries for you.
- **No sync.** There is no Uoink cloud, so there is no built-in sync between devices.
- **Rougher install.** The Windows installer is unsigned and about 549 MB, so Windows SmartScreen may warn you (choose More info, then Run anyway). The browser button is sideloaded through Chrome's Developer mode because the Chrome Web Store listing is pending. Chrome is the tested browser.
- **Fewer formats.** PDFs and EPUBs are not among Uoink's listed sources. Recall saves PDFs.
- **No knowledge graph or spaced review.** Recall links related items and quizzes you on them; Uoink does neither.
- **No self-organizing library.** The library does not file or re-shelve itself. The Librarian only proposes changes, and applying them is off by default because its quality gate has not passed.
- **Agents must run on the same computer.** An agent has to be able to run Uoink on the computer that holds the library. The ChatGPT app does not connect over MCP; use copy and paste.
- **A side project.** Uoink is a personal side project by one maker, Ryan Biddy.

## Sources

Competitor pages were opened and read on 2026-11-03.

1. Recall home page: https://www.recall.it/ (seen 2026-11-03)
2. Recall pricing and FAQ: https://www.recall.it/pricing (seen 2026-11-03)
3. Recall docs, MCP server: https://docs.recall.it/developer/mcp (seen 2026-11-03)
4. Recall privacy policy, last updated 01/07/2026: https://www.recall.it/legal/privacy-policy (seen 2026-11-03)

Uoink facts:

- U1. Uoink 3.16.2 summary (updated 2026-11-09): https://uoink.app/llms.txt
- U2. Uoink 3.16.2 full disclosures (updated 2026-11-09): https://uoink.app/llms-full.txt

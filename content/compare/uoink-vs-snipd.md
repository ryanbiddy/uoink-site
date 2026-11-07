---
title: "Uoink vs Snipd: a podcast library on your disk or an AI podcast player"
slug: "snipd"
description: "Snipd is an AI podcast player for iPhone and Android with snips, transcripts and chat. Uoink saves podcast transcripts with your YouTube, X and Reddit sources on your disk for your AI."
date: 2026-11-04
---

# Uoink vs Snipd

Pick Snipd if you listen to podcasts on your phone and want a player that saves a moment when you tap your headphones, shows the transcript as you listen and sends your snips to Notion, Obsidian or Readwise. Pick Uoink if you are on Windows or an Apple Silicon Mac (preview) and want podcast transcripts saved as files on your own disk, next to your YouTube videos, X posts and Reddit threads, where Claude, Cursor or Codex can search and cite them.

These are different kinds of tools, and you could use both. Snipd is where you listen. Uoink does not play podcasts. It follows a show's RSS feed, transcribes new episodes on your computer once you turn on auto-ingest, and adds them to one library that your AI searches through a local MCP server.

## Pick Snipd if

- You want a podcast player. The free plan includes "Unlimited listening to all podcasts." [2]
- You listen on the go. Snipd has an iPhone app and an Android app, with CarPlay, Android Auto and Apple Watch support. [2][4][5]
- You want to save a moment by tapping your headphones, with the audio, transcript and summary in one snip. [1]
- You want to read along with transcripts that identify speakers, plus chapters and episode summaries. [1][2]
- You want snips sent to Readwise, Notion, Obsidian or Glasp, or exported as Markdown files. [2][3]
- You want to chat with an episode, or import your own audio files and YouTube videos (Premium). [2][3]

## Pick Uoink if

- You want each episode's transcript made on your own computer and kept as a file, with the audio stored locally too.
- You want podcasts, YouTube videos, X posts, Reddit threads and web articles in one searchable library.
- You want Claude, Cursor or Codex to search every episode you saved and cite the timestamp through a local MCP server.
- You want podcast feeds and YouTube channels watched in the background, with auto-ingest turned on per feed.
- You want it free and open source (MIT), with no account.
- You use Windows 10 or 11, or an Apple Silicon Mac with macOS 15 or later (preview).

## Feature comparison

| Feature | Uoink | Snipd |
|---|---|---|
| What it is | A desktop app that keeps a local library of the podcasts, videos and posts you study, for your AI to search and cite | "The Podcast App for Knowledge Seekers" [1] |
| Listening | Not a podcast player | A full player, with auto downloads and smart downloads [2] |
| Platforms | Windows 10/11, a Mac preview for Apple Silicon (macOS 15 or later), and headless Linux for agents | iPhone and Android apps, with CarPlay, Android Auto and Apple Watch [2][4][5] |
| How podcasts get in | Follow a show's RSS or Atom feed; per-feed auto-ingest downloads new episodes as MP3s and transcribes them locally with WhisperX | Listen in the app. Snipd processes "the most popular shows" itself, and Premium adds 900 minutes a month of AI processing for other episodes [2] |
| Transcripts | Saved as files and added to the searchable library | "Read along and search full episode transcripts with speaker identification." [1] |
| Highlights | Not a feature | Snips by tapping your headphones, each with audio, transcript and summary [1] |
| Other sources | YouTube, X posts and video, web articles, Reddit threads | Your own audio files and YouTube videos, on Premium [2][3] |
| AI assistant access | Local MCP server with 99 tools over stdio, a CLI and an OpenAPI bridge. ChatGPT is copy and paste only. | Chat inside the app ("Chat with episode," Premium) [2] |
| Export | The files are already on your disk; cited range export with speaker labels and chapters | Snips to Readwise, Notion, Obsidian, Glasp and more, or Markdown files for Obsidian, Bear and Logseq [2][3] |
| Price | Free, open source (MIT) | Free plan; Premium listed at $6.99 a month with a one-week free trial [2] |

## Privacy and where your data lives

**Uoink.** Captures and indexes stay on your disk, and podcast audio and transcripts stay in Uoink's local data folder. There is no account and no Uoink-hosted copy of your library. Capturing a source contacts that source's site, and enabled podcast feeds are polled while the helper runs. Optional AI features, and connected agents you allow to use them, can send relevant library text to Anthropic with your own key. Anonymous usage counts are off by default; if you turn them on, Uoink sends daily counts and never content, URLs, titles or search text. Some things still reach the network: model downloads from Hugging Face, release checks with GitHub, and telemetry from one model dependency (pyannote-audio), which you can turn off with an environment variable. The full list is in Uoink's disclosures. [U1][U2]

**Snipd.** Snipd's privacy notice says it collects data such as "search queries, questions, listening behaviour" and content you "create, upload or save, such as snips, notes, questions, conversations." It lists Google Cloud and Amazon Web Services among the providers that host and store data, with processing in the United States. "If you do not want to provide personal user data you can use the anonymous sign up," which covers the Free service. [6]

## Price

- **Uoink:** free and MIT-licensed. Optional AI features use your own Anthropic key, and optional paid discovery uses your own ScrapeCreators key, so those costs bill to your own accounts. [U1][U2]
- **Snipd:** the Free plan has unlimited listening and core features, with AI features for 2 episodes a week. Premium is listed at $6.99 a month with a one-week free trial, and adds unlimited AI features on processed episodes, chat, imports, custom prompts and 900 minutes a month of AI processing. Snipd notes that prices may vary by country. [2]

## Uoink's honest limits

- **Windows 10 and 11, plus a Mac preview for Apple Silicon (macOS 15 or later).** Intel Macs are not supported, and there are no phone apps. Snipd lives on your phone, in your car and on your watch.
- **Not a player.** You listen somewhere else. Uoink has no headphone snips, no playback queue and no smart downloads.
- **Podcasts come in through feeds.** You add a show by its RSS or Atom feed. Episode audio stays off until you turn on auto-ingest for that feed.
- **Transcription takes your computer's time.** Episodes are transcribed locally instead of on a server, so a long backlog takes a while.
- **Rougher install.** The Windows installer is unsigned and about 519 MB, so Windows SmartScreen may warn you (choose More info, then Run anyway). The browser button is sideloaded through Chrome's Developer mode because the Chrome Web Store listing is pending.
- **Agents must run on the same computer.** An agent has to be able to run Uoink on the computer that holds the library. The ChatGPT app does not connect over MCP; use copy and paste.
- **A side project.** Uoink is a personal side project by one maker, Ryan Biddy.

## Sources

Competitor pages were opened and read on 2026-11-03.

1. Snipd home page: https://www.snipd.com/ (seen 2026-11-03)
2. Snipd pricing and plan comparison: https://www.snipd.com/pricing (seen 2026-11-03)
3. Snipd features: https://www.snipd.com/all-features (seen 2026-11-03)
4. Snipd on the App Store: https://apps.apple.com/us/app/id1557206126 (seen 2026-11-03)
5. Snipd on Google Play: https://play.google.com/store/apps/dev?id=7065498750451506956 (seen 2026-11-03)
6. Snipd privacy notice, applicable as of October 8, 2026: https://www.snipd.com/privacy-policy (seen 2026-11-03)

Uoink facts:

- U1. Uoink 3.15.1 summary (updated 2026-11-07): https://uoink.app/llms.txt
- U2. Uoink 3.15.1 full disclosures (updated 2026-11-07): https://uoink.app/llms-full.txt

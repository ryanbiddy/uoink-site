---
title: "Uoink vs YouTube transcript MCP servers: a library that remembers or a one-time fetch"
slug: "youtube-transcript-mcp"
description: "YouTube transcript MCP servers fetch a video's captions with one config line. Uoink keeps every transcript in a local library, uses Whisper when captions are missing, and cites timestamps."
date: 2026-11-03
---

# Uoink vs YouTube transcript MCP servers

Pick a YouTube transcript MCP server if you want your AI to read one video's captions right now, set up with a single config entry and nothing heavier than Node.js, uv or yt-dlp. Pick Uoink if you are on Windows or an Apple Silicon Mac (preview) and want every video you study kept in a library on your disk, transcribed with Whisper when there are no captions, and searchable and citable by your AI weeks later.

Servers such as mcp-server-youtube-transcript, mcp-youtube and mcp-youtube-transcript are free, MIT-licensed and quick to add. Their READMEs describe tools that fetch the transcript of the video you name; none of them describes keeping a library of what it fetched. Uoink is a desktop app with a capture pipeline and a local library behind its MCP server. If you want the small version of that idea, uoink-lite, from the same project, is a one-line MCP server that fetches YouTube captions and keeps every transcript on your computer for later searches. [U3]

## Pick a transcript MCP server if

- You want setup in one config entry. mcp-server-youtube-transcript runs through `npx`, and mcp-youtube-transcript runs through `uvx`. [1][3]
- You are on Linux or an Intel Mac, where Uoink is not supported. These servers run through Node.js, uv or yt-dlp. [1][2][3]
- You need one transcript for one question and do not need it again.
- You want ad and sponsor filtering by chapter markers (mcp-server-youtube-transcript), or automatic paging through long transcripts and proxy support for rate limits (mcp-youtube-transcript). [1][3]
- You want video analysis of what is shown on screen through TwelveLabs, with your own key (mcp-server-youtube-transcript). [1]
- You would rather not install a desktop app of about 519 MB.

## Pick Uoink if

- You want every transcript your AI reads kept in one library on your disk, searchable later with keyword search or optional local semantic search.
- You study videos without captions. Uoink ships Whisper's base model and transcribes them on your computer from the first capture.
- You want YouTube channels and playlists, and podcast RSS feeds, followed in the background, with new items captured once you turn automatic capture on.
- You want timestamped citations. Search returns a quotable passage when the passage contains the match, and cited range export carries speaker labels, chapters and provenance.
- You want screenshots, top comments, channel context and metadata alongside the transcript, plus X posts, Reddit threads and web articles in the same library.
- You use Windows 10 or 11, or an Apple Silicon Mac with macOS 15 or later (preview).

## Feature comparison

| Feature | Uoink | YouTube transcript MCP servers |
|---|---|---|
| What it is | A desktop app with capture, a local library and an MCP server with 92 tools | Small MCP servers built around fetching a video's transcript, with tools such as get_transcript, get_timed_transcript and get_video_info [1][3] |
| Install | Unsigned Windows installer, about 519 MB, no admin rights needed; on a Mac, a DMG signed with a Developer ID and notarized by Apple | One MCP config entry run through `npx` or `uvx` [1][3]; mcp-youtube needs yt-dlp installed first [2] |
| Platforms | Windows 10/11, plus a Mac preview for Apple Silicon (macOS 15 or later) | Wherever their runtime runs: Node.js, uv or yt-dlp [1][2][3] |
| Where transcripts come from | YouTube captions, with local Whisper transcription when captions are missing | The captions and subtitles YouTube already has; mcp-youtube downloads subtitles with yt-dlp [1][2][3] |
| Memory | Every capture saved as Markdown plus a JSON sidecar and indexed in one library | Not described in their READMEs |
| Search across videos | Library search, clip search and evidence cards over everything you saved | Not described in their READMEs |
| Timestamps | Timestamped transcripts and cited range export | Optional timestamps (mcp-server-youtube-transcript); timed segments with start times (mcp-youtube-transcript) [1][3] |
| Long videos | The whole transcript is saved, and search finds passages anywhere in it | mcp-youtube-transcript splits transcripts over 50,000 characters into pages [3] |
| Other sources | Podcasts, X posts and video, Reddit threads, web articles | YouTube |
| Price and license | Free, open source (MIT) | Free and MIT-licensed [1][2][3] |

## Want the small version? uoink-lite

uoink-lite is a separate, lightweight MCP server from the Uoink project. It needs uv and nothing else, fetches YouTube captions, and saves every transcript it fetches on your computer, so its search_saved tool can find a line from a video you looked at last week. It does not transcribe videos without captions or capture other sources; that is what the desktop app is for. There is no account and no API key. [U3]

Add it to Claude Code with `claude mcp add uoink-lite -- uvx --from git+https://github.com/ryanbiddy/uoink-lite uoink-lite`

## Privacy and where your data lives

**Uoink.** Captures and indexes stay on your disk. There is no account and no Uoink-hosted copy of your library. Capturing a source contacts that source's site. Optional AI features, and connected agents you allow to use them, can send relevant library text to Anthropic with your own key. Anonymous usage counts are off by default; if you turn them on, Uoink sends daily counts and never content, URLs, titles or search text. Some things still reach the network: model downloads from Hugging Face, release checks with GitHub, and telemetry from one model dependency (pyannote-audio), which you can turn off with an environment variable. The full list is in Uoink's disclosures. [U1][U2]

**YouTube transcript MCP servers.** They run on your computer and contact YouTube for the captions. mcp-youtube-transcript supports residential and standard HTTP proxies, and mcp-server-youtube-transcript's optional video analysis sends a video URL to TwelveLabs when you add a key. [1][3]

## Uoink's honest limits

- **Windows 10 and 11, plus a Mac preview for Apple Silicon (macOS 15 or later).** Intel Macs and Linux are not supported. The transcript servers run wherever their runtime does.
- **A heavier install.** The Windows installer is unsigned and about 519 MB, so Windows SmartScreen may warn you (choose More info, then Run anyway). A transcript server is one line of config.
- **More than you may need.** If you ask about one video and move on, a transcript server or uoink-lite does that with less to set up.
- **Agents must run on the same computer.** An agent has to be able to run Uoink on the computer that holds the library. The ChatGPT app does not connect over MCP; use copy and paste.
- **No self-organizing library.** The library does not file or re-shelve itself. The Librarian only proposes changes, and applying them is off by default because its quality gate has not passed.
- **A side project.** Uoink is a personal side project by one maker, Ryan Biddy.

## Sources

Competitor pages were opened and read on 2026-11-03.

1. mcp-server-youtube-transcript README (kimtaeyoon83): https://github.com/kimtaeyoon83/mcp-server-youtube-transcript (seen 2026-11-03)
2. mcp-youtube README (anaisbetts): https://github.com/anaisbetts/mcp-youtube (seen 2026-11-03)
3. mcp-youtube-transcript README (jkawamoto): https://github.com/jkawamoto/mcp-youtube-transcript (seen 2026-11-03)

Uoink facts:

- U1. Uoink 3.13.0 summary (updated 2026-11-03): https://uoink.app/llms.txt
- U2. Uoink 3.13.0 full disclosures (updated 2026-11-03): https://uoink.app/llms-full.txt
- U3. uoink-lite README: https://github.com/ryanbiddy/uoink-lite

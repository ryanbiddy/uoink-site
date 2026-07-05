# Surface Map: Uoink Sources Page

This document describes the structure, content, and capabilities of the Uoink supported sources page (`/sources`).

## 1. Overview
The sources page provides a unified inventory of every media and text source type that Uoink supports today. To build trust, it highlights the features of each source and documents its technical limitations honestly.

## 2. Supported Sources Today

### 2.1 YouTube
- **Details**: Captures auto-generated or manual transcripts, descriptions, comments, and frame screenshots (integrated via local clipboard helper).
- **Format**: Local Markdown and JSON metadata sidecars.
- **Limitations**: Age-gated or private videos require browser cookie path configuration. HD downloads are subject to YouTube stream rate throttling.

### 2.2 Podcasts
- **Details**: Captures public RSS podcast audio files and runs local Whisper/WhisperX transcription with speaker diarization.
- **Format**: Diarized speaker text logs.
- **Limitations**: High GPU/CPU utilization; transcribing multi-hour episodes can take several minutes.

### 2.3 Reddit Threads
- **Details**: Captures discussion text and comment hierarchies from Reddit comments URLs.
- **Format**: Nested reply tree flattened to structured markdown.
- **Limitations**: Trimmed comment depths for very long threads to protect LLM context length.

### 2.4 Web Articles & Pages
- **Details**: Universal HTML text extractor that parses clean markdown body text, ignoring sidebar noise, trackers, and advertisements.
- **Format**: Plain text prose markdown.
- **Limitations**: Cloudflare barriers, paywalls, or heavily dynamic SPA web pages can fail or fallback.

### 2.5 X (Twitter) Video
- **Details**: Captures video posts from X/Twitter and transcribes the audio locally.
- **Format**: Local audio Whisper transcript.
- **Limitations**: Video only. Text tweets, threads, and images are not supported due to Twitter API rate/cost limits.

## 3. Page Layout
- **Hero**: Introduces the local-first nature of Uoink's extraction features.
- **Grid Layout**: Responsive grid containing cards for each of the 5 active sources.
- **Styling**: Leverages dark mode styling (`mode-dark`) to match the rest of the application dashboard and site look-and-feel.

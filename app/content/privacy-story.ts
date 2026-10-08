import { CANDIDATE_VERSION, PUBLISHED_VERSION } from "./release-status";

export const privacyStory = `
<section class="section" data-screen-label="privacy / main"><div class="container"><article class="article">
  <div class="meta"><span>privacy</span><span>candidate review</span></div>
  <h1>Local files.<br><em>Real network connections.</em></h1>
  <p class="standfirst">Uoink saves your captures and search index on your computer. It has no Uoink account or hosted library. Capturing, transcription, AI tools and even opening the dashboard can still contact outside services.</p>
  <p><strong>Review preview for ${CANDIDATE_VERSION}.</strong> This page describes the source candidate in testing. The public download is still ${PUBLISHED_VERSION}; these details are not a verified description of that older installer. This preview does not activate a new policy. Installed network checks and final release review remain pending.</p>

  <h2>Where your library lives.</h2>
  <p>Captures go to your chosen output folder, normally under <code>%USERPROFILE%\\Uoink</code>. The local index, settings, jobs and subscription records normally live under <code>%LOCALAPPDATA%\\Uoink</code>. Logs can contain source URLs, paths and capture details. The helper has no dedicated Uoink analytics or crash-report upload endpoint, but its dashboard and model dependencies make the requests below.</p>
  <p>Your Anthropic key is stored through the Windows credential store. Normal settings writes exclude it. Older plaintext settings or a legacy Yoink credential can remain if migration fails; check those locations when removing a key.</p>

  <h2>What connects, and when.</h2>
  <h3>Opening the dashboard or extension</h3>
  <p>The dashboard loads a feature guide from <code>uoink.app</code> when it opens, when you open Features and when you reload that guide. It sends no capture payload. Dashboard and extension pages also request Google Fonts, and some setup screens, saved-item cards and previews load YouTube thumbnails. These requests expose connection metadata such as your IP address; thumbnails also identify the video. They can happen without a new capture.</p>
  <h3>After an extension capture</h3>
  <p>After successfully copying a completed capture to your clipboard, the extension opens <code>claude.ai/new</code>. This happens without an Anthropic API key and with optional AI features off. There is no Uoink setting to disable the automatic tab. Opening it contacts Anthropic’s website; the tab-opening code does not paste the capture or put it in the URL. You decide whether to paste and submit it.</p>
  <h3>Fetching sources</h3>
  <p>Captures request the source page, available transcripts, metadata and media from services such as YouTube, Reddit, X and podcast RSS hosts. Delivery hosts and redirects can receive requests too. X extraction also attempts a full-text supplement through the third-party FxTwitter API, passing the post ID. This is not restricted to already-truncated posts, and there is no separate FxTwitter prompt. Queued work can retry; the default live-video path schedules one retry about ten minutes later.</p>
  <h3>Following feeds and channels</h3>
  <p>Enabled podcast, YouTube channel and playlist subscriptions poll in the background while the helper runs. A connected agent can register a source and start those checks without a dashboard action. Turning automatic capture off does not stop polling. Automatic capture starts off for a new source; enabling it permits eligible captures within that source’s limits. Podcast auto-ingest can download and transcribe episodes, but does not approve downloading a missing Whisper model.</p>

  <h2>Local transcription still has network dependencies.</h2>
  <p>Transcription processes audio locally. Missing Whisper models download when the requesting client passes a download-approval flag. That is a per-request flag, not a saved consent choice: a connected agent can set it without showing you a Uoink prompt. The dashboard and extension do not offer that prompt. The reliability checker has a separate model-download action and can fetch source audio again if it has no local media.</p>
  <p>Supporting transcription, alignment and speaker-labeling models can download from Hugging Face or PyTorch hosts; language data can come from NLTK. Not every supporting download has its own Uoink prompt. A cached Whisper model does not make the complete transcription runtime offline.</p>
  <h3>Model-library telemetry</h3>
  <p>The candidate pins pyannote-audio 4.0.7, whose <a href="https://github.com/pyannote/pyannote-audio/blob/4.0.7/src/pyannote/audio/telemetry/config.yaml">defaults enable metrics</a> to <code>otel.pyannote.ai</code>. Its <a href="https://github.com/pyannote/pyannote-audio/blob/4.0.7/src/pyannote/audio/telemetry/metrics.py">metrics code</a> records model or pipeline origin, library version, a random session identifier and, for pipeline runs, audio duration and speaker-count parameters. WhisperX’s voice-activity step uses pyannote even when optional speaker labeling is off.</p>
  <p>Uoink does not disable those defaults or provide a dashboard switch. The dependency supports <code>PYANNOTE_METRICS_ENABLED=false</code> in the helper’s environment. These are findings from the pinned source code; installed network observations are still pending. They prevent us from describing the candidate as telemetry-free.</p>

  <h2>AI calls and content you share.</h2>
  <p>Automatic comment analysis, hook classification and entity extraction are off by default. Enabling them with your saved Anthropic key permits requests to <code>api.anthropic.com</code>, including during background capture. Requests can contain transcripts, titles, channel details and comments. Hook classification can include up to eight saved corrections: first from the same channel, then the same topic, then the most recent overall. Those corrections can come from other videos.</p>
  <p>Explicit agent analysis, writing generation and key testing are separate actions; the automatic-feature switches do not block them. Writing generation can send source text, your instructions and all active style anchors unless you select particular anchors.</p>
  <p>Connected MCP or local-API clients can read library content and request captures or analysis. If the receiving client uses a cloud AI service, its handling applies to the content it receives. Clipboard copies, exported files and shared captures have the same boundary. Uoink’s corpus export writes under <code>_exports</code> in the active output folder. Optional library and Obsidian mirrors create additional local copies; sync software watching those destinations can upload them. The Obsidian memory mirror includes <code>TASTE.md</code> and <code>USER.md</code>.</p>
  <p>Uoink’s release-check endpoint requests current release information from GitHub when its cache needs refreshing or a caller forces a check. It sends no corpus payload and does not install an update.</p>

  <h2>Controls available in this candidate.</h2>
  <ul>
    <li>Turn automatic AI features off to stop their future automatic calls. <strong>Clear key</strong> removes the Uoink credential only. If a legacy Yoink credential remains, Uoink can still use it for Anthropic calls; remove that entry in Windows Credential Manager too. Disconnect an agent in that client to end its access.</li>
    <li>X text capture is enabled by default. The authenticated local API can set <code>x_text_capture_enabled</code> to <code>false</code> through <code>POST /settings</code>, stopping both the syndication and FxTwitter text requests. There is no dashboard or extension toggle for this setting; video capture is separate.</li>
    <li>Turn automatic capture off to prevent new automatic starts. Already-started work may finish, and subscription polling continues.</li>
    <li><strong>Stop Uoink</strong> in the dashboard stops the helper and polling until it restarts. Disable <strong>Autostart on login</strong> if you do not want it to restart at the next Windows login.</li>
    <li>There is no per-source polling-pause button in the dashboard or extension. The authenticated local API can archive any subscription at <code>POST /sources/archive</code>. Sources with a podcast-feed or legacy playlist record also have reversible <code>/podcasts/feeds/set-enabled</code> and <code>/playlists/monitored/set-enabled</code> controls. Those legacy controls do not cover every channel or playlist subscription.</li>
    <li>Choose your output and mirror folders, and review what you paste, export or give to an agent. The extension’s screenshot-interval preference uses browser sync storage and can sync with your browser account.</li>
  </ul>

  <h2>Deleting captures and uninstalling.</h2>
  <p>Soft-deleted captures remain in the output folder’s trash until purged. The helper attempts cleanup of items older than 30 days at startup and every 24 hours while running. Exported, mirrored or shared copies have separate lifecycles.</p>
  <p>Uninstall removes application files, the helper log and process-state file, and its Windows autostart entry. The installer is designed to leave captures, the library index, <code>settings.json</code>, podcast files and saved credentials. Model caches and the helper token can remain. <strong>Edited topic-routing rules in <code>topics.json</code> are removed with the app; save a separate copy first.</strong> The exact candidate’s upgrade and uninstall checks are still pending.</p>
  <p>Uninstall is not data erasure. To erase retained data, clear credentials, stop and uninstall the helper, then remove its remaining data and your actual output folder, including trash. Check legacy Yoink folders, dependency caches, exports and mirrors separately. Removing local files does not recall copies already sent to another service.</p>

  <h2>Website analytics are separate.</h2>
  <p>This website includes Vercel Web Analytics for page-view information such as visited pages, referrers and browser or device details. The site’s analytics integration does not send your local captures or API keys. See <a href="https://vercel.com/docs/analytics/privacy-policy">Vercel’s description of its data collection</a>. The dashboard’s feature-guide requests are separate visits to Uoink’s host; their server-log retention is not established by this preview.</p>
  <p>Source hosts, model providers, Anthropic, GitHub, browser sync and connected clients each have their own policies and account settings. We do not promise how those services retain data or use it for training.</p>
  <p><a href="https://github.com/ryanbiddy/uoink">Inspect Uoink’s source</a> · <a href="/changelog">Public release and candidate status</a></p>
</article></div></section>
`;

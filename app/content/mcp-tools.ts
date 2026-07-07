// Generated from ryanbiddy/uoink origin/main:uoink_mcp_tools.py on 2026-05-30.
// Re-synced against origin/main on 2026-07-04 (added uoink_reddit_thread).
// Keep this aligned with the product MCP registry for agent-facing pages.

// Full local tool registry (HTTP JSON-RPC exposes all of these).
export const MCP_TOOL_COUNT = 64;
// Curated everyday set exposed over the stdio transport (uoink_mcp.py @mcp.tool
// decorators). The full registry above is available over HTTP.
export const MCP_STDIO_TOOL_COUNT = 14;

export const mcpTools = [
  [
    "uoink_video",
    "Extract a single YouTube video into a Uoink corpus. Returns the saved folder, markdown corpus, and screenshot paths."
  ],
  [
    "uoink_playlist",
    "Start asynchronous extraction for a YouTube playlist."
  ],
  [
    "get_job_status",
    "Return the full status object for an async Uoink job."
  ],
  [
    "cancel_job",
    "Cancel an async Uoink job and leave partial outputs on disk."
  ],
  [
    "list_recent_uoinks",
    "List recent saved Uoink capture corpora."
  ],
  [
    "search_uoinks",
    "Full-text search across saved Uoink capture corpora."
  ],
  [
    "get_uoink_corpus",
    "Return the full markdown corpus for a saved Uoink capture by slug."
  ],
  [
    "analyze_comments",
    "Run Comment Intelligence on an existing Uoink capture and return themes, mentioned products/tools, and disagreements."
  ],
  [
    "classify_hook",
    "Classify the hook type for an existing Uoink capture."
  ],
  [
    "get_taxonomy",
    "Return captured Hook Type taxonomy rows, optionally filtered by channel and hook_type."
  ],
  [
    "get_citation_map",
    "Return the transcript + screenshot citation map for a saved Uoink capture, each entry with a timestamped YouTube deep link."
  ],
  [
    "get_uoink_health",
    "Return the per-section extraction health score for a saved Uoink capture."
  ],
  [
    "find_mentions",
    "Find every place an entity (person, tool, product, company, or topic) is mentioned across saved uoinks, newest first, each with a timestamped YouTube deep link."
  ],
  [
    "analyze_self_channel",
    "v2.5 P3 your-channel mode: aggregate the user's own saved videos (those tagged is_self via channel-name recognition) into hook evolution, format evolution, performance trend by month, and a top-performers list. Pass `handle` to scope to one of the user's registered channels; omit for the union across every registered channel. `limit` caps the top_performers list (default 10, max 100). Pure local read."
  ],
  [
    "get_schema_version",
    "Report the data-shape versions Uoink writes + the supported read-range. v2.5 substrate: cross-version aggregators (Channel Decoder, Niche Corpus) check this before assuming v2 fields are present in older rows/sidecars. Read-only, no arguments."
  ],
  [
    "get_user_role",
    "v3.1 P2: report the user's persisted role (creator | researcher | marketer | mixed) + the dashboard emphasis (primary/secondary chip order + default sort) the helper computes from it. Read-only."
  ],
  [
    "set_user_role",
    "v3.1 P2: persist the user's role choice. Drives Library default sort + filter-chip emphasis on the dashboard. Bounded enum -- one of creator | researcher | marketer | mixed."
  ],
  [
    "check_live_status",
    "v3.1: probe a URL to find out if it is a live broadcast without extracting. Returns one of: not_live | live | upcoming | post_live | was_live. The agent uses this to decide between immediate extraction and 'wait until the broadcast ends' (the helper's live_stream_behavior setting handles the latter for /extract; this tool is the read-only probe path)."
  ],
  [
    "add_podcast_feed",
    "v3.1 podcast: register an RSS feed URL. Idempotent -- existing URL returns the same row. poll_interval_min default 60, range 15-1440."
  ],
  [
    "list_podcast_feeds",
    "v3.1 podcast: list registered RSS feeds newest-first."
  ],
  [
    "remove_podcast_feed",
    "v3.1 podcast: delete a feed + cascade its episodes."
  ],
  [
    "poll_podcast_feed",
    "v3.1 podcast: trigger one feed poll (HTTP GET + RSS/Atom parse + upsert episodes). Conditional GET via ETag/If-Modified-Since on subsequent polls so daily-news podcasts don't re-download an unchanged feed body."
  ],
  [
    "list_podcast_episodes",
    "v3.1 podcast: list episodes. Optional feed_id + status filters (new | queued | downloaded | transcribed | ignored). Newest published first."
  ],
  [
    "download_podcast_episode",
    "v3.1 podcast: download an episode's MP3 via yt-dlp + ffmpeg. Synchronous. Returns when the file lands at <data_root>/Podcasts/<feed-slug>/<episode-slug>.mp3 or yt-dlp errors. Idempotent -- skips re-download when the canonical path already has a non-zero file."
  ],
  [
    "get_whisperx_status",
    "v3.1: report whether the WhisperX runtime is importable + the currently-selected model size + the diarization default. Agents call this before transcribe to decide whether to surface an install prompt to the user."
  ],
  [
    "transcribe_podcast_episode",
    "v3.1 podcast: run WhisperX on a downloaded episode. Synchronous. Reads audio_local_path; writes the JSON transcript next to the MP3. Returns the structured transcript metadata, OR consent_required=True when the first-time model download (200 MB - 2 GB) needs the user to opt in (re-issue with consent_given=True after the dashboard prompt records the opt-in), OR a runtime-not-installed error when whisperx isn't importable."
  ],
  [
    "add_monitored_playlist",
    "v3.1 mobile bridge: register a YouTube playlist URL to monitor for auto-uoinks. Idempotent on UNIQUE playlist_url. poll_interval_min default 5, range 1-1440."
  ],
  [
    "list_monitored_playlists",
    "v3.1 mobile bridge: list registered playlists newest-first."
  ],
  [
    "remove_monitored_playlist",
    "v3.1 mobile bridge: delete a playlist + cascade its discovery events."
  ],
  [
    "poll_monitored_playlist",
    "v3.1 mobile bridge: poll one playlist (yt-dlp --flat-playlist) + diff against last_seen_video_ids + auto-queue new videos via the existing pending_uoinks retry worker. Returns the new[] discovery list so the dashboard can show it under a 'from mobile playlist' label distinct from rate-limit retries."
  ],
  [
    "list_monitored_playlist_events",
    "v3.1 mobile bridge: list per-discovery events. Optional filters: playlist_id, status (discovered | queued | extracted | failed). Newest first."
  ],
  [
    "get_user_taste",
    "v2.5 S4 taste memory: return the consolidated TASTE.md (preferred hooks/formats, avoid list, top performance anchors). Generated from engagement events + persisted taste anchors. Read-only, no arguments."
  ],
  [
    "get_user_memory",
    "v2.5 S4 user memory: return the user's free-form USER.md notes (Channels I admire, My channel(s), Topics, Workflow notes). Hand-edited markdown -- the consolidator never overwrites this file. No arguments."
  ],
  [
    "update_user_taste",
    "v2.5 S4 taste anchors: set one taste anchor section (preferred_hooks | preferred_formats | avoid) and re-consolidate TASTE.md. `content` is markdown that replaces the section body verbatim -- bullets recommended."
  ],
  [
    "get_engagement_signal",
    "v2.5 S2 engagement memory: return the time-decayed value_score for one video plus per-event-type counts and last event timestamp. Events live entirely on the local SQLite index (zero outbound). Weights are documented in index.py (_ENGAGEMENT_WEIGHTS); decay half-life is 30 days."
  ],
  [
    "classify_facets",
    "Persist agent-classified facets + free-form tags for a video. Model-agnostic: the calling agent does the LLM work using its own model; this tool validates against bounded enums and writes to the row. The server fills performance_tier (channel-relative) and length_bucket (from duration) if you don't pass them."
  ],
  [
    "query_by_facets",
    "Filter saved uoinks by facet values (format / performance_tier / hook_type / topic / length_bucket / tag). All filters AND-combined; newest first."
  ],
  [
    "get_facet_taxonomy",
    "Enum lists for the v2.5 facet axes (used for filter chips)."
  ],
  [
    "get_transcript_reliability",
    "Return stored transcript reliability spans for a saved Uoink capture by YouTube video_id. Read-only; computation is triggered by the helper endpoint or the user's auto-check setting."
  ],
  [
    "assemble_workspace",
    "v3 P4 build workspace: pull a corpus slice for planning a video. Ranks uoinks by S1 facets (format match), performance tier (over > average > under), and S2 engagement value_score. Returns the slice + audience questions from comments + optional self-channel snapshot (if your_channel is set) + optional taste anchors (if S4 memory layer is available). Pure local read; the calling agent does any LLM analysis downstream. If `workspace_id` is provided the slice is persisted onto that row."
  ],
  [
    "critique_against_corpus",
    "v3 P4 critique tool. Two-phase: call WITHOUT `findings` to retrieve the assembled context (corpus slice + audience questions + taste anchors) -- the agent does the LLM analysis on that context. Call WITH `findings` (structured JSON object with hook_strength, structural_deviation, pacing_issues, missing_audience_hooks per ROADMAP P4) to persist the analysis to the workspace's critique log. Model-agnostic default; BYO-key mode accepted but not yet implemented on-server."
  ],
  [
    "list_workspaces",
    "v3 P4: list build workspaces newest-first. Read-only."
  ],
  [
    "get_workspace",
    "v3 P4: fetch one workspace + its full critique log (every draft + findings combination the agent has persisted)."
  ],
  [
    "extract_claims",
    "v3 A2 (Loki-inspired): persist agent-extracted claims for a video. LOCKED FRAMING -- the calling agent does the LLM decomposition; this tool validates + writes. Each claim is {claim_text, check_worthiness? (0.0-1.0), context?}. NEVER auto-asserts truth verdicts -- surfaces checkable claims so the user can decide which to verify."
  ],
  [
    "verify_claim",
    "v3 A2: record evidence for one extracted claim. alignment_signal MUST be one of supports / contradicts / mixed / inconclusive. NEVER 'true' / 'false' / 'lie'. The user judges the verdict from the surfaced evidence."
  ],
  [
    "list_claims",
    "v3 A2: list extracted claims. Filter by video_id and/or status (extracted | verified | not-attempted)."
  ],
  [
    "get_claim",
    "v3 A2: fetch one claim by id, with stored evidence."
  ],
  [
    "generate_script",
    "v3 P5 script studio: two-phase generator. Call WITHOUT `script` payload to retrieve grounding context (workspace metadata + assembled corpus slice + audience questions + optional taste anchors + optional self-channel snapshot). The calling agent does the writing using its own model. Call WITH `script` (a structured object with hook + beats + body + cta + source_uoinks citations) to persist as a new versioned row. parent_script_id chains revisions."
  ],
  [
    "revise_script",
    "v3 P5: revise an existing script grounded in critique findings. Two-phase like generate_script -- without `revised_script` returns previous + grounding for the agent to act on; with `revised_script` persists as a new version (parent_script_id auto-set to the prior id)."
  ],
  [
    "get_shot_list",
    "v3 P5: derive (and persist) a default shot list from a script's beats + the parent workspace's S1 format facet. Per-beat row with format-specific cue suggestions. The calling agent can override by supplying shot_list directly in generate_script."
  ],
  [
    "list_scripts",
    "v3 P5: list scripts newest-first. Optional workspace_id filter scopes to one workspace's history."
  ],
  [
    "get_script",
    "v3 P5: fetch one script by id."
  ],
  [
    "write_tweet",
    "v3.2 Writing Studio: two-phase tweet/thread generator. Phase 1 (no `body`) returns grounding (source uoink + creator credit + style anchors + Voice DNA prompt). Phase 2 (`body` present) persists + scans for Voice DNA violations + returns structured warnings (soft warn -- NEVER auto-blocks). Creator credit is required in the body."
  ],
  [
    "write_blog",
    "v3.2 Writing Studio: two-phase blog generator. Same shape as write_tweet but Phase 2 accepts title, dek, tags, and expects markdown body with a Source section. Soft-warn Voice DNA scan; creator credit non-suppressible."
  ],
  [
    "list_writing_pieces",
    "v3.2 Writing Studio: list generated pieces newest-first. Optional `kind` (tweet|thread|blog) + `uoink_id` filters."
  ],
  [
    "get_writing_piece",
    "v3.2 Writing Studio: fetch one piece by id."
  ],
  [
    "add_style_anchor",
    "v3.2 Writing Studio: add a Substack-style voice anchor (URL or raw pasted text). User names each. Cap at 10 -- returns 422-shaped error when exceeded. URL ingestion extracts prose via the helper's page extractor (Universal Site PR); falls back to NULL raw_text when the extractor isn't bound yet."
  ],
  [
    "list_style_anchors",
    "v3.2 Writing Studio: list style anchors + their active flag + the helper's 10-anchor cap."
  ],
  [
    "remove_style_anchor",
    "v3.2 Writing Studio: delete a style anchor."
  ],
  [
    "uoink_page",
    "v3.2 Universal Site Uoinking: capture an allowed page as a uoink. Crawl4AI runs ON-DEVICE when available (JS render + screenshot); stdlib fallback otherwise (static HTML + markdown synthesis, no screenshot). Allowlist-gated -- add the host via add_allowed_site first if it's not in the defaults (youtube.com, youtu.be, x.com, twitter.com). Result auto-persists as a uoink with source_type='page'."
  ],
  [
    "uoink_reddit_thread",
    "Fetch a Reddit thread via its public .json (no API key, no OAuth), flatten the comment tree with a depth limit and a score threshold, and persist it as a uoink with source_type='reddit_thread'. Renders as Post -> Top comments -> nested replies so search and facets work on the conversation. Runs on-device; no allowlist gate."
  ],
  [
    "list_allowed_sites",
    "v3.2 Universal Site: list the user's allowed hostnames. Default seeds (youtube.com, youtu.be, x.com, twitter.com) are pre-added by migration 0015 and removable like any other entry."
  ],
  [
    "add_allowed_site",
    "v3.2 Universal Site: add a hostname or wildcard pattern (`*.docs.example.com` matches all sub.docs.example.com subdomains). Idempotent on UNIQUE url_pattern. Plain hostnames also match their subdomains (so 'example.com' matches 'www.example.com')."
  ],
  [
    "remove_allowed_site",
    "v3.2 Universal Site: remove a hostname or wildcard pattern from the allowlist."
  ]
] as const;

export type McpTool = (typeof mcpTools)[number];

// Generated from ryanbiddy/uoink release/3.8.0 on 2026-09-23.
// Source commit: a311e627330111884e404b92240583afe4514129
// HTTP: TOOL_REGISTRY in uoink_mcp_tools.py; stdio: @mcp.tool in uoink_mcp.py.
// Regenerate with: python scripts/sync-mcp-from-release.py <release-checkout>

export const MCP_TOOL_COUNT = 88;
export const MCP_STDIO_TOOL_COUNT = 32;

export const mcpStdioToolNames = [
  "uoink_video",
  "uoink_playlist",
  "get_job_status",
  "cancel_job",
  "list_recent_uoinks",
  "search_uoinks",
  "search_clips",
  "get_evidence_card",
  "get_uoink_corpus",
  "analyze_comments",
  "classify_hook",
  "get_taxonomy",
  "get_citation_map",
  "get_uoink_health",
  "find_mentions",
  "get_transcript_reliability",
  "add_podcast_feed",
  "list_podcast_feeds",
  "remove_podcast_feed",
  "poll_podcast_feed",
  "list_podcast_episodes",
  "download_podcast_episode",
  "get_whisperx_status",
  "transcribe_podcast_episode",
  "episode_to_corpus",
  "get_library_activity",
  "search_library",
  "get_library_item",
  "read_library_resource",
  "get_library_brief_input",
  "publish_library_brief",
  "export_cited_range"
] as const;

export const mcpTools = [
  [
    "uoink_video",
    "Extract a single YouTube video into a Uoink corpus."
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
    "List recent saved Uoink corpora."
  ],
  [
    "search_uoinks",
    "Full-text search across saved Uoink corpora."
  ],
  [
    "search_clips",
    "Full-text search over transcript windows from saved uoinks."
  ],
  [
    "get_evidence_card",
    "Return an evidence card for one saved uoink: title, channel, platform, topic, source URL, a short summary hint, and its most quotable clips spread across the timeline, each with a deep link."
  ],
  [
    "list_library_work",
    "List Librarian assignment work for a run: counts by work state and manifest disposition, the run revision, one cursor page of items, and whether staged work is waiting for a subscribed client."
  ],
  [
    "claim_library_work",
    "Lease Librarian work for a client (action=claim returns up to twelve single-item packets, each with one evidence card and an attempt token), or renew, release or cancel the client's own current attempt."
  ],
  [
    "submit_library_result",
    "Submit one Librarian result for one leased work row: an assignment of one to three shelf memberships with quoted evidence, or an explicit unmapped, unsupported or error outcome."
  ],
  [
    "apply_reshelving",
    "Preview the exact reshelving delta for a run (mode=preview, the default), or apply a locally approved, unexpired preview by its delta hash and operation key (mode=apply)."
  ],
  [
    "pin_shelf",
    "Pin, unpin or move one item on a shelf as a user decision that the Librarian may not override."
  ],
  [
    "undo_library_apply",
    "Undo one recorded library apply by replaying its stored inverse as a new, itself reversible, journal operation."
  ],
  [
    "list_sources",
    "List standing sources (podcast RSS feeds, YouTube channels and playlists) with consent state, enrollment, today's UTC start allowance and detection health."
  ],
  [
    "register_source",
    "Register a standing source for metadata detection only."
  ],
  [
    "source_status",
    "One source's current summary, one page of observed items with capture and classification state, and every in-flight reservation."
  ],
  [
    "set_source_consent",
    "Turn standing capture on or off for one source."
  ],
  [
    "get_uoink_corpus",
    "Return the full markdown corpus for a saved uoink by slug."
  ],
  [
    "analyze_comments",
    "Run Comment Intelligence on an existing uoink and return themes, mentioned products/tools, and disagreements."
  ],
  [
    "classify_hook",
    "Classify the hook type for an existing uoink."
  ],
  [
    "get_taxonomy",
    "Return captured Hook Type taxonomy rows, optionally filtered by channel and hook_type."
  ],
  [
    "get_citation_map",
    "Return the transcript + screenshot citation map for a saved uoink, each entry with a timestamped YouTube deep link."
  ],
  [
    "get_uoink_health",
    "Return the per-section extraction health score for a saved uoink."
  ],
  [
    "find_mentions",
    "Find every place an entity (person, tool, product, company, or topic) is mentioned across saved uoinks, newest first, each with a timestamped YouTube deep link."
  ],
  [
    "analyze_self_channel",
    "Aggregate the user's own saved videos (those tagged is_self via channel-name recognition) into hook evolution, format evolution, performance trend by month, and a top-performers list."
  ],
  [
    "get_schema_version",
    "Report the data-shape versions Uoink writes + the supported read-range. v2.5 substrate: cross-version aggregators (Channel Decoder, Niche Corpus) check this before assuming v2 fields are present in older rows/sidecars."
  ],
  [
    "get_user_role",
    "Report the user's persisted role (creator | researcher | marketer | mixed) + the dashboard emphasis (primary/secondary chip order + default sort) the helper computes from it."
  ],
  [
    "set_user_role",
    "Persist the user's role choice. Drives Library default sort + filter-chip emphasis on the dashboard."
  ],
  [
    "check_live_status",
    "Probe a URL to find out if it is a live broadcast without extracting."
  ],
  [
    "add_podcast_feed",
    "Register an RSS feed URL. Idempotent -- existing URL returns the same row. poll_interval_min default 60, range 15-1440."
  ],
  [
    "list_podcast_feeds",
    "List registered RSS feeds newest-first."
  ],
  [
    "remove_podcast_feed",
    "Delete a feed + cascade its episodes."
  ],
  [
    "poll_podcast_feed",
    "Trigger one feed poll (HTTP GET + RSS/Atom parse + upsert episodes)."
  ],
  [
    "list_podcast_episodes",
    "List episodes. Optional feed_id + status filters (new | queued | downloaded | transcribed | ignored)."
  ],
  [
    "download_podcast_episode",
    "Download an episode's MP3 via yt-dlp + ffmpeg."
  ],
  [
    "get_whisperx_status",
    "Report whether the WhisperX runtime is importable + the currently-selected model size + the diarization default."
  ],
  [
    "transcribe_podcast_episode",
    "Queue WhisperX for a downloaded episode."
  ],
  [
    "episode_to_corpus",
    "Publish a completed podcast transcript into the local Uoink corpus."
  ],
  [
    "add_monitored_playlist",
    "Register a YouTube playlist URL to monitor for auto-uoinks."
  ],
  [
    "list_monitored_playlists",
    "List registered playlists newest-first."
  ],
  [
    "remove_monitored_playlist",
    "Delete a playlist + cascade its discovery events."
  ],
  [
    "poll_monitored_playlist",
    "Poll one playlist (yt-dlp --flat-playlist) + diff against last_seen_video_ids + auto-queue new videos via the existing pending_yoinks retry worker."
  ],
  [
    "list_monitored_playlist_events",
    "List per-discovery events. Optional filters: playlist_id, status (discovered | queued | extracted | failed)."
  ],
  [
    "get_user_taste",
    "Return the consolidated TASTE.md (preferred hooks/formats, avoid list, top performance anchors)."
  ],
  [
    "get_user_memory",
    "Return the user's free-form USER.md notes (Channels I admire, My channel(s), Topics, Workflow notes)."
  ],
  [
    "update_user_taste",
    "Set one taste anchor section (preferred_hooks | preferred_formats | avoid) and re-consolidate TASTE.md. `content` is markdown that replaces the section body verbatim -- bullets recommended."
  ],
  [
    "get_engagement_signal",
    "Return the time-decayed value_score for one video plus per-event-type counts and last event timestamp."
  ],
  [
    "classify_facets",
    "Persist agent-classified facets + free-form tags for a video."
  ],
  [
    "query_by_facets",
    "Filter saved yoinks by facet values (format / performance_tier / hook_type / topic / length_bucket / tag)."
  ],
  [
    "get_facet_taxonomy",
    "Enum lists for the v2.5 facet axes (used for filter chips)."
  ],
  [
    "get_transcript_reliability",
    "Return stored transcript reliability spans for a saved uoink by YouTube video_id."
  ],
  [
    "assemble_workspace",
    "pull a corpus slice for planning a video."
  ],
  [
    "critique_against_corpus",
    "call WITHOUT `findings` to retrieve the assembled context (corpus slice + audience questions + taste anchors) -- the agent does the LLM analysis on that context."
  ],
  [
    "list_workspaces",
    "list build workspaces newest-first."
  ],
  [
    "get_workspace",
    "fetch one workspace + its full critique log (every draft + findings combination the agent has persisted)."
  ],
  [
    "extract_claims",
    "persist agent-extracted claims for a video."
  ],
  [
    "verify_claim",
    "record evidence for one extracted claim. alignment_signal MUST be one of supports / contradicts / mixed / inconclusive."
  ],
  [
    "list_claims",
    "list extracted claims. Filter by video_id and/or status (extracted | verified | not-attempted)."
  ],
  [
    "get_claim",
    "fetch one claim by id, with stored evidence."
  ],
  [
    "generate_script",
    "two-phase generator. Call WITHOUT `script` payload to retrieve grounding context (workspace metadata + assembled corpus slice + audience questions + optional taste anchors + optional self-channel snapshot)."
  ],
  [
    "revise_script",
    "revise an existing script grounded in critique findings."
  ],
  [
    "get_shot_list",
    "derive (and persist) a default shot list from a script's beats + the parent workspace's S1 format facet."
  ],
  [
    "list_scripts",
    "list scripts newest-first. Optional workspace_id filter scopes to one workspace's history."
  ],
  [
    "get_script",
    "fetch one script by id."
  ],
  [
    "write_tweet",
    "Two-phase tweet/thread generator. Phase 1 (no `body`) returns grounding (source yoink + creator credit + style anchors + Voice DNA prompt)."
  ],
  [
    "write_blog",
    "Two-phase blog generator. Same shape as write_tweet but Phase 2 accepts title, dek, tags, and expects markdown body with a Source section."
  ],
  [
    "list_writing_pieces",
    "List generated pieces newest-first."
  ],
  [
    "get_writing_piece",
    "Fetch one piece by id."
  ],
  [
    "add_style_anchor",
    "Add a Substack-style voice anchor (URL or raw pasted text)."
  ],
  [
    "list_style_anchors",
    "List style anchors + their active flag + the helper's 10-anchor cap."
  ],
  [
    "remove_style_anchor",
    "Delete a style anchor."
  ],
  [
    "uoink_url",
    "Capture any http(s) URL through the helper's universal extractor."
  ],
  [
    "uoink_note",
    "Save a text note as a first-class local corpus item."
  ],
  [
    "uoink_image",
    "Save a base64 PNG, JPEG, or WebP as a local image corpus item."
  ],
  [
    "uoink_x",
    "Capture an X post and the author's earlier chain as a local corpus item."
  ],
  [
    "uoink_page",
    "Capture an allowed page as a yoink."
  ],
  [
    "uoink_reddit_thread",
    "Fetch a thread via its public .json (no API key, no OAuth), flatten the comment tree with a depth limit and a score threshold, and persist it as a yoink with source_type='reddit_thread'."
  ],
  [
    "list_allowed_sites",
    "List the user's allowed hostnames. Default seeds (youtube.com, youtu.be, x.com, twitter.com) are pre-added by migration 0015 and removable like any other entry."
  ],
  [
    "add_allowed_site",
    "Add a hostname or wildcard pattern (`*.docs.example.com` matches all sub.docs.example.com subdomains)."
  ],
  [
    "remove_allowed_site",
    "Remove a hostname or wildcard pattern from the allowlist."
  ],
  [
    "get_library_activity",
    "Report deterministic library activity, shelf churn, and source observations."
  ],
  [
    "search_library",
    "Bounded clip-first search of the saved library (default 5, at most 20 hits) with an item-text fallback for items without clips."
  ],
  [
    "get_library_item",
    "Resolve one saved item by video_id or slug (exactly one) and return its default Librarian evidence card unchanged plus canonical card, excerpt and initial corpus-chunk URIs."
  ],
  [
    "read_library_resource",
    "Read one uoink://library/v1/ resource URI (card, excerpt, corpus chunk, shelf page or brief) with the same validation, contents and refusals as resources/read."
  ],
  [
    "get_library_brief_input",
    "Prepare bounded input for a client-run daily brief: for a UTC date and a Phase 2 run id, return job_key, input_hash, bound queue/run/projection revisions, capture and event counts, coverage, up to 20 work-status rows and up to 5 default Librarian cards (at most 24,576 bytes)."
  ],
  [
    "publish_library_brief",
    "Local write: persist one client-produced brief for a job prepared by get_library_brief_input."
  ],
  [
    "export_cited_range",
    "Read-only cited export of one stored transcript range (exact cue-aligned start/end, at most 120 s and 200 cues) or one current excerpt id from a saved item: verbatim stored text, per-cue speaker labels with provenance, overlapping chapters, safe source and seek links, source/media revisions and evidence refs."
  ]
] as const;

export type McpTool = (typeof mcpTools)[number];

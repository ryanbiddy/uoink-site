// Generated for Uoink 3.11.1 from ryanbiddy/uoink v3.11.1 on 2026-10-25.
// Source commit: e306d77af2407bb84c1ba3ca110853c4f00a7d00
// HTTP: TOOL_REGISTRY; stdio: registry inventory (3.9.2+) or @mcp.tool decorators.
// Regenerate with: python scripts/sync-mcp-from-release.py <product-checkout> [--ref <git-ref>]

import release from "../../content/release.json";

export const MCP_TOOL_COUNT = release.httpToolCount;
export const MCP_STDIO_TOOL_COUNT = release.stdioToolCount;

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
  "get_playbook_input",
  "discover_candidates",
  "queue_discovered",
  "get_library_brief_input",
  "publish_library_brief",
  "export_cited_range",
  "list_library_work",
  "claim_library_work",
  "submit_library_result",
  "apply_reshelving",
  "pin_shelf",
  "undo_library_apply",
  "list_sources",
  "register_source",
  "source_status",
  "set_source_consent",
  "analyze_self_channel",
  "get_schema_version",
  "get_user_role",
  "set_user_role",
  "check_live_status",
  "add_monitored_playlist",
  "list_monitored_playlists",
  "remove_monitored_playlist",
  "poll_monitored_playlist",
  "list_monitored_playlist_events",
  "get_user_taste",
  "get_user_memory",
  "update_user_taste",
  "get_engagement_signal",
  "classify_facets",
  "query_by_facets",
  "get_facet_taxonomy",
  "assemble_workspace",
  "critique_against_corpus",
  "list_workspaces",
  "get_workspace",
  "extract_claims",
  "verify_claim",
  "list_claims",
  "get_claim",
  "generate_script",
  "revise_script",
  "get_shot_list",
  "list_scripts",
  "get_script",
  "write_tweet",
  "write_blog",
  "list_writing_pieces",
  "get_writing_piece",
  "add_style_anchor",
  "list_style_anchors",
  "remove_style_anchor",
  "uoink_url",
  "uoink_note",
  "uoink_image",
  "uoink_x",
  "uoink_page",
  "uoink_reddit_thread",
  "list_allowed_sites",
  "add_allowed_site",
  "remove_allowed_site"
] as const;

export const mcpTools = [
  [
    "uoink_video",
    "Capture one YouTube video into a saved Markdown corpus with screenshots."
  ],
  [
    "uoink_playlist",
    "Start a background capture job for the videos in a YouTube playlist."
  ],
  [
    "get_job_status",
    "Read progress, per-item outcomes and errors for a saved capture or transcription job."
  ],
  [
    "cancel_job",
    "Request cancellation of a capture or transcription job while keeping partial outputs on disk."
  ],
  [
    "list_recent_uoinks",
    "List the newest saved captures from the local index, with their slugs, titles, folders and capture times."
  ],
  [
    "search_uoinks",
    "Find whole saved items by text, with optional channel and hook filters."
  ],
  [
    "search_clips",
    "Find transcript windows in saved items, with timing, source links and ranked snippets."
  ],
  [
    "get_evidence_card",
    "Build a saved item's evidence card with identity, summary hints and clips spread across its timeline."
  ],
  [
    "list_library_work",
    "List Librarian assignment counts and one cursor page of work for a run."
  ],
  [
    "claim_library_work",
    "Lease Librarian evidence packets, or renew, release or cancel your current attempts."
  ],
  [
    "submit_library_result",
    "Store a client's shelf-assignment result for one currently leased Librarian item."
  ],
  [
    "apply_reshelving",
    "Create a reshelving preview or apply an approved preview to current labels."
  ],
  [
    "pin_shelf",
    "Record a user's pin, unpin or move decision for one item's shelf membership."
  ],
  [
    "undo_library_apply",
    "Reverse the latest applicable library apply by replaying its stored inverse as a new journal operation."
  ],
  [
    "list_sources",
    "List standing RSS, YouTube channel and playlist sources with consent, enrollment, daily allowance and detection health."
  ],
  [
    "register_source",
    "Register a standing source for future metadata detection with capture consent off."
  ],
  [
    "source_status",
    "Read one standing source's summary, observed-item page and all in-flight reservations."
  ],
  [
    "set_source_consent",
    "Enable or disable standing capture for a registered source after local confirmation."
  ],
  [
    "get_uoink_corpus",
    "Read a saved item's complete Markdown corpus, citation rows and available source or image pointers by slug."
  ],
  [
    "analyze_comments",
    "Analyze a saved capture's comments with Anthropic and replace its stored comment-intelligence section."
  ],
  [
    "classify_hook",
    "Classify a saved capture's opening with Anthropic and replace its stored hook analysis."
  ],
  [
    "get_taxonomy",
    "Read saved hook-classification rows, optionally restricted to a channel or hook."
  ],
  [
    "get_citation_map",
    "Read all stored transcript and screenshot citations for one saved capture."
  ],
  [
    "get_uoink_health",
    "Read the stored per-section extraction health of a saved capture."
  ],
  [
    "find_mentions",
    "Find recorded entity-name mentions across saved items, with stored spans, timing and source links."
  ],
  [
    "analyze_self_channel",
    "Summarize the user's saved own-channel videos into hook and format history, monthly performance trends and top performers."
  ],
  [
    "get_schema_version",
    "Report the local SQL migration, item and sidecar schema versions and supported read ranges."
  ],
  [
    "get_user_role",
    "Read the saved user role and its resolved dashboard sort and filter emphasis."
  ],
  [
    "set_user_role",
    "Replace the saved user role that controls dashboard sort and filter emphasis."
  ],
  [
    "check_live_status",
    "Fetch video metadata to determine whether a broadcast is live, upcoming or finished."
  ],
  [
    "add_podcast_feed",
    "Register a podcast RSS feed for ongoing metadata monitoring."
  ],
  [
    "list_podcast_feeds",
    "List registered podcast feeds newest first, including their saved polling settings."
  ],
  [
    "remove_podcast_feed",
    "Stop monitoring a registered podcast feed."
  ],
  [
    "poll_podcast_feed",
    "Refresh metadata for one registered podcast feed through the source-aware polling path."
  ],
  [
    "list_podcast_episodes",
    "List tracked podcast episodes newest published first, optionally scoped to a feed or lifecycle state."
  ],
  [
    "download_podcast_episode",
    "Download a tracked podcast episode's audio to its canonical local MP3."
  ],
  [
    "get_whisperx_status",
    "Inspect local WhisperX availability, the selected model and the diarization default."
  ],
  [
    "transcribe_podcast_episode",
    "Queue local WhisperX transcription for a downloaded podcast episode."
  ],
  [
    "episode_to_corpus",
    "Publish a completed podcast transcript as a searchable local corpus with source-aware citations."
  ],
  [
    "add_monitored_playlist",
    "Register a YouTube playlist for ongoing metadata monitoring."
  ],
  [
    "list_monitored_playlists",
    "List registered playlist monitors newest first with saved monitoring settings."
  ],
  [
    "remove_monitored_playlist",
    "Stop monitoring a registered playlist."
  ],
  [
    "poll_monitored_playlist",
    "Refresh observations for a registered playlist through its source-aware polling path."
  ],
  [
    "list_monitored_playlist_events",
    "List recorded playlist-discovery events newest first, optionally filtered by playlist or lifecycle state."
  ],
  [
    "get_user_taste",
    "Read consolidated TASTE.md preferences and performance anchors."
  ],
  [
    "get_user_memory",
    "Read the user's hand-edited USER.md notes about channels, topics and workflow."
  ],
  [
    "update_user_taste",
    "Replace one persisted taste-preference section and regenerate TASTE.md."
  ],
  [
    "get_engagement_signal",
    "Read one saved item's time-decayed local engagement score, event counts and last-event time."
  ],
  [
    "classify_facets",
    "Store your agent's facet classifications and tags on a saved item."
  ],
  [
    "query_by_facets",
    "List saved items matching all supplied facet and tag filters, newest first."
  ],
  [
    "get_facet_taxonomy",
    "Return supported format, performance-tier, length-bucket and hook label lists."
  ],
  [
    "get_transcript_reliability",
    "Read stored transcript-reliability spans for a saved item."
  ],
  [
    "assemble_workspace",
    "Select and rank saved examples for planning a video, with audience questions and available taste or own-channel context."
  ],
  [
    "critique_against_corpus",
    "Prepare workspace grounding for a draft critique, or append your agent's findings to its critique log."
  ],
  [
    "list_workspaces",
    "List saved video-planning workspaces newest first."
  ],
  [
    "get_workspace",
    "Read one saved video-planning workspace and its full critique log."
  ],
  [
    "extract_claims",
    "Store checkable claims that your agent extracted from a saved item."
  ],
  [
    "verify_claim",
    "Record your agent's evidence and alignment signals for an existing claim."
  ],
  [
    "list_claims",
    "List saved checkable claims, optionally filtered by source item or review status."
  ],
  [
    "get_claim",
    "Read one saved claim with its recorded evidence and alignment signals."
  ],
  [
    "generate_script",
    "Prepare workspace grounding for a video script, or save an agent-written script as a new version."
  ],
  [
    "revise_script",
    "Prepare revision context for an existing video script, or save its replacement as a linked new version."
  ],
  [
    "get_shot_list",
    "Derive and save a default shot list from a script's beats and its workspace format."
  ],
  [
    "list_scripts",
    "List saved video-script versions newest first, optionally within one workspace."
  ],
  [
    "get_script",
    "Read a saved video-script version, including beats, shot list and source-item citations."
  ],
  [
    "write_tweet",
    "Prepare grounding for a tweet or thread, or save a credited draft in the local Writing Studio."
  ],
  [
    "write_blog",
    "Prepare grounding for a blog article, or save a credited Markdown draft in the local Writing Studio."
  ],
  [
    "list_writing_pieces",
    "List saved tweet, thread and blog drafts newest first, optionally filtered by kind or source item."
  ],
  [
    "get_writing_piece",
    "Read one saved Writing Studio tweet, thread or blog draft."
  ],
  [
    "add_style_anchor",
    "Save a named writing-style reference from pasted text or a URL."
  ],
  [
    "list_style_anchors",
    "List saved writing-style references with active flags and the configured ten-anchor cap."
  ],
  [
    "remove_style_anchor",
    "Delete a saved writing-style reference."
  ],
  [
    "uoink_url",
    "Capture a supported video URL through platform routing, with metadata/transcript fallback for other yt-dlp sites."
  ],
  [
    "uoink_note",
    "Save user-provided text as a local searchable note with title and attribution."
  ],
  [
    "uoink_image",
    "Save supplied PNG, JPEG or WebP bytes as a local image corpus item with optional caption and attribution."
  ],
  [
    "uoink_x",
    "Capture an X post and its author's earlier chain as a local text corpus item."
  ],
  [
    "uoink_page",
    "Fetch an allowed webpage as Markdown and save it as a local corpus item."
  ],
  [
    "uoink_reddit_thread",
    "Capture a Reddit post and filtered comment tree as a local discussion corpus."
  ],
  [
    "list_allowed_sites",
    "List saved webpage-capture hostname patterns and their active state."
  ],
  [
    "add_allowed_site",
    "Add a hostname pattern to the webpage-capture allowlist."
  ],
  [
    "remove_allowed_site",
    "Remove a hostname pattern from the webpage-capture allowlist."
  ],
  [
    "get_library_activity",
    "Report saved-library capture activity, shelf churn and standing-source observations for a time interval."
  ],
  [
    "search_library",
    "Retrieve a bounded, clip-first selection of saved-library matches with revision-bound card and excerpt URIs."
  ],
  [
    "get_library_item",
    "Resolve one saved item to its bounded default Librarian card and canonical card, excerpt and initial corpus-chunk URIs."
  ],
  [
    "read_library_resource",
    "Read a bounded saved-library card, excerpt, corpus chunk, shelf page or brief from its uoink URI."
  ],
  [
    "get_playbook_input",
    "Prepare cited local evidence and instructions for a client-written research report."
  ],
  [
    "discover_candidates",
    "Plan or run a ScrapeCreators search and save uncaptured candidates."
  ],
  [
    "queue_discovered",
    "Enqueue selected saved discovery candidates for normal capture."
  ],
  [
    "get_library_brief_input",
    "Prepare a dated library-status packet for a brief that the client writes."
  ],
  [
    "publish_library_brief",
    "Save a client-written daily brief as an immutable local artifact."
  ],
  [
    "export_cited_range",
    "Export verbatim stored transcript cues with speaker provenance, overlapping chapters, safe links and evidence references."
  ]
] as const;

export type McpTool = (typeof mcpTools)[number];

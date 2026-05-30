export type FeatureCategory =
  | "Capture"
  | "AI handoff"
  | "Library"
  | "Analysis"
  | "Local and private"
  | "Dashboard";

export type FeatureStatus = "shipped" | "in flight" | "planned";

export type FeatureScreenshot = {
  title: string;
  alt: string;
  src?: string;
};

export type Feature = {
  slug: string;
  title: string;
  category: FeatureCategory;
  status: FeatureStatus;
  summary: string;
  keywords: string[];
  whatItDoes: string;
  gettingStarted: string[];
  behindScenes: string;
  mcpTools: string[];
  related: string[];
  screenshot: FeatureScreenshot;
};

export const featureCategories: { name: FeatureCategory; deck: string }[] = [
  {
    name: "Capture",
    deck: "Get source material out of YouTube, playlists, Shorts, thumbnails, and soon more web video surfaces.",
  },
  {
    name: "AI handoff",
    deck: "Move the corpus into Claude, ChatGPT, Cursor, or any MCP-capable agent without rebuilding the same prompt each time.",
  },
  {
    name: "Library",
    deck: "Every uoink becomes a searchable local asset with folders, citations, and cross-corpus memory.",
  },
  {
    name: "Analysis",
    deck: "Optional BYO-key passes classify hooks, cluster comments, and extract entities from the corpus.",
  },
  {
    name: "Local and private",
    deck: "No Uoink cloud, no account, no telemetry. The helper runs on loopback and stores secrets in the OS vault.",
  },
  {
    name: "Dashboard",
    deck: "The desktop control center makes jobs, settings, recent captures, and helper health visible.",
  },
];

export const features: Feature[] = [
  {
    slug: "youtube-video-capture",
    title: "YouTube video capture",
    category: "Capture",
    status: "shipped",
    summary: "Click the rust U under a YouTube video and get the full corpus on disk and clipboard.",
    keywords: ["youtube to claude", "youtube transcript screenshots comments", "youtube video corpus"],
    whatItDoes:
      "Uoink turns one YouTube watch page into a markdown file with transcript, screenshots, top comments, channel context, metadata, and source links. The output is readable by humans and useful to Claude, ChatGPT, Cursor, and MCP agents.",
    gettingStarted: [
      "Install the Windows helper from GitHub Releases.",
      "Install the browser extension from the release zip while Chrome Web Store review is pending.",
      "Open any YouTube watch page and click the Uoink button under the player.",
    ],
    behindScenes:
      "The extension sends the page URL to the local helper at 127.0.0.1:5179. The helper runs yt-dlp, writes the corpus atomically, updates SQLite, then copies the markdown to your clipboard.",
    mcpTools: ["uoink_video", "get_job_status", "get_uoink_corpus"],
    related: ["transcript-with-timestamps", "screenshot-capture", "top-comments-extraction"],
    screenshot: {
      title: "Uoink button under a YouTube video",
      alt: "The Uoink button inside the YouTube action row below a video.",
    },
  },
  {
    slug: "youtube-shorts",
    title: "YouTube Shorts",
    category: "Capture",
    status: "shipped",
    summary: "Shorts URLs use the same corpus path as standard YouTube watch pages.",
    keywords: ["youtube shorts transcript", "shorts to ai", "shorts research tool"],
    whatItDoes:
      "Short-form videos still carry hooks, captions, comments, and metadata. Uoink normalizes Shorts URLs into the same corpus shape so your library stays one shape across formats.",
    gettingStarted: [
      "Open a YouTube Shorts URL.",
      "Use the extension button or context menu.",
      "Search the saved corpus later from Memory or MCP.",
    ],
    behindScenes:
      "The helper resolves Shorts URLs through the same extraction path, then stores the output with source metadata so citations point back to the original short.",
    mcpTools: ["uoink_video", "search_uoinks"],
    related: ["youtube-video-capture", "hook-type-classification", "memory-page"],
    screenshot: {
      title: "Shorts corpus card",
      alt: "A local corpus card for a YouTube Short with transcript and comment sections.",
    },
  },
  {
    slug: "right-click-thumbnail-uoink",
    title: "Right-click thumbnail Uoink",
    category: "Capture",
    status: "shipped",
    summary: "Capture a video from a thumbnail or link before you open the watch page.",
    keywords: ["right click youtube transcript", "thumbnail youtube capture", "youtube context menu extension"],
    whatItDoes:
      "When a YouTube link is visible on the web, the context menu can start a capture. It keeps research moving when you are scanning search results, channel pages, or a playlist grid.",
    gettingStarted: [
      "Right-click a YouTube thumbnail or link.",
      "Choose Uoink video from the browser context menu.",
      "Watch the extension badge or tray status for completion.",
    ],
    behindScenes:
      "The extension extracts the URL from the clicked element and starts the same local job queue used by the in-page button.",
    mcpTools: ["uoink_video", "get_job_status"],
    related: ["playlist-mode", "system-tray-status", "rate-limit-queue"],
    screenshot: {
      title: "Context menu capture",
      alt: "Browser context menu showing the Uoink video action on a YouTube thumbnail.",
    },
  },
  {
    slug: "playlist-mode",
    title: "Playlist Mode",
    category: "Capture",
    status: "shipped",
    summary: "Extract up to 10 videos from a playlist with async progress and partial-failure tolerance.",
    keywords: ["summarize youtube playlist", "youtube playlist to claude", "playlist transcript extractor"],
    whatItDoes:
      "Playlist Mode builds a multi-video corpus without making you click each video by hand. It is built for channel audits, competitor sweeps, and research passes where patterns only show up across several uploads.",
    gettingStarted: [
      "Copy or open a YouTube playlist URL.",
      "Start a playlist job from the extension or MCP.",
      "Let Uoink continue when one video fails, then read the combined output.",
    ],
    behindScenes:
      "Playlist jobs run async. They track per-video status, allow cancellation, keep successful captures when one item fails, and only fail the whole job when zero videos succeed.",
    mcpTools: ["uoink_playlist", "get_job_status", "cancel_job", "get_uoink_corpus"],
    related: ["rate-limit-queue", "live-activity-stream", "hook-type-classification"],
    screenshot: {
      title: "Playlist progress",
      alt: "A playlist extraction job with multiple videos moving through fetch, transcript, screenshots, classify, and write phases.",
    },
  },
  {
    slug: "screenshot-capture",
    title: "Timestamped screenshots",
    category: "Capture",
    status: "shipped",
    summary: "Frames are saved with timestamps so the model sees visual context, not only words.",
    keywords: ["youtube screenshots transcript", "video frames to ai", "timestamped screenshots"],
    whatItDoes:
      "Video is visual. Uoink captures frames across the runtime and links them to the transcript so a prompt can reference slides, demos, thumbnails, charts, UI screens, and visual proof.",
    gettingStarted: [
      "Capture a video with the default settings.",
      "Open the saved folder to see image files alongside the markdown corpus.",
      "Use the clipboard budget preview before sending images into a chat model.",
    ],
    behindScenes:
      "The helper uses ffmpeg to capture frames, writes them to disk, and embeds a selected set into clipboard markdown when the model context budget allows it.",
    mcpTools: ["uoink_video", "get_uoink_corpus"],
    related: ["smart-screenshot-picker", "clipboard-markdown-corpus", "citation-map"],
    screenshot: {
      title: "Screenshots in a corpus",
      alt: "A markdown corpus showing timestamped screenshots linked to transcript sections.",
    },
  },
  {
    slug: "smart-screenshot-picker",
    title: "Smart Screenshot Picker",
    category: "Capture",
    status: "shipped",
    summary: "Choose which frames embed in the clipboard paste, default 4 and max 12.",
    keywords: ["select youtube screenshots for ai", "ai screenshot picker", "video screenshot prompt"],
    whatItDoes:
      "The picker lets you keep the AI paste tight. You can embed the frames that matter and leave the rest on disk, which keeps large videos from burning context on dull frames.",
    gettingStarted: [
      "Open the capture result or popup screenshot grid.",
      "Select the frames that explain the video best.",
      "Send or paste the corpus with only those selected images embedded.",
    ],
    behindScenes:
      "Uoink tracks a screenshot budget per corpus. The full frame set stays local, while the clipboard version embeds only the selected images as base64 markdown.",
    mcpTools: ["get_uoink_corpus"],
    related: ["screenshot-capture", "clipboard-markdown-corpus", "send-to-claude"],
    screenshot: {
      title: "Screenshot picker grid",
      alt: "A grid of captured video frames with selected screenshots marked for the clipboard paste.",
    },
  },
  {
    slug: "transcript-with-timestamps",
    title: "Timestamped transcript",
    category: "Capture",
    status: "shipped",
    summary: "Full transcript text is saved with timestamps and chapter awareness.",
    keywords: ["youtube transcript with timestamps", "download youtube transcript markdown", "timestamp citations"],
    whatItDoes:
      "The transcript is the spine of the corpus. Uoink keeps timestamps attached so analysis can cite source moments instead of floating as unsupported summary.",
    gettingStarted: [
      "Capture a video.",
      "Open the markdown file in the saved folder.",
      "Ask your AI to cite timestamps when making claims about the video.",
    ],
    behindScenes:
      "The helper prefers platform captions when available, normalizes timing, and preserves timestamps in the markdown output for citation discipline.",
    mcpTools: ["uoink_video", "get_uoink_corpus", "get_citation_map"],
    related: ["citation-map", "clipboard-markdown-corpus", "hook-type-classification"],
    screenshot: {
      title: "Transcript with timestamps",
      alt: "A markdown transcript section where each paragraph begins with a timestamp.",
    },
  },
  {
    slug: "top-comments-extraction",
    title: "Top comments extraction",
    category: "Capture",
    status: "shipped",
    summary: "Uoink saves the top 50 comments with author and like count.",
    keywords: ["extract youtube comments for ai", "youtube comments to claude", "comment analysis youtube"],
    whatItDoes:
      "Comments show the audience's reaction. Uoink includes the top comment set so a model can separate what the creator said from what the audience cared about.",
    gettingStarted: [
      "Capture a public YouTube video.",
      "Find the Comments section in the saved markdown.",
      "Ask for audience themes, objections, tools, products, and disagreements.",
    ],
    behindScenes:
      "Comment capture runs as part of the helper job, then optional Comment Intelligence can cluster the comments with your Anthropic key.",
    mcpTools: ["uoink_video", "analyze_comments", "get_uoink_corpus"],
    related: ["comment-intelligence", "entity-extraction", "channel-context"],
    screenshot: {
      title: "Top comments in corpus",
      alt: "A markdown comments section with top YouTube comments, authors, likes, and extracted themes.",
    },
  },
  {
    slug: "channel-context",
    title: "Channel context",
    category: "Capture",
    status: "shipped",
    summary: "Metadata about the channel and recent videos travels with each capture.",
    keywords: ["youtube channel context ai", "youtube metadata extraction", "channel research ai"],
    whatItDoes:
      "A video makes more sense when the model knows who made it, how the channel frames itself, and what else the channel has been publishing. Uoink keeps that context close to the transcript.",
    gettingStarted: [
      "Capture any YouTube video.",
      "Read the Channel context and Metadata sections.",
      "Ask your model to compare the video against the channel's current direction.",
    ],
    behindScenes:
      "The helper stores channel name, subscriber context when available, recent-video hints, source URL, upload date, and video metadata in the same markdown file.",
    mcpTools: ["uoink_video", "get_uoink_corpus", "search_uoinks"],
    related: ["youtube-video-capture", "playlist-mode", "local-corpus-library"],
    screenshot: {
      title: "Channel metadata section",
      alt: "A corpus metadata section showing channel name, upload date, source URL, and recent context.",
    },
  },
  {
    slug: "clipboard-markdown-corpus",
    title: "Clipboard markdown corpus",
    category: "AI handoff",
    status: "shipped",
    summary: "The full structured markdown lands on your clipboard as soon as the job completes.",
    keywords: ["youtube to markdown", "youtube to chatgpt markdown", "paste youtube transcript into claude"],
    whatItDoes:
      "Uoink is built around the paste. The corpus is formatted as markdown with clear sections so Claude, ChatGPT, local models, and editors can ingest it without a custom UI.",
    gettingStarted: [
      "Capture a video.",
      "Wait for the success notification.",
      "Paste into Claude, ChatGPT, Notion, Obsidian, or a local editor.",
    ],
    behindScenes:
      "The helper writes the durable file first, then builds the clipboard version with the selected screenshot budget and source citations.",
    mcpTools: ["get_uoink_corpus"],
    related: ["send-to-claude", "send-to-chatgpt", "smart-screenshot-picker"],
    screenshot: {
      title: "Paste-ready corpus",
      alt: "A markdown corpus copied to the clipboard with Metadata, Transcript, Screenshots, Comments, and Channel context sections.",
    },
  },
  {
    slug: "send-to-claude",
    title: "Send to Claude",
    category: "AI handoff",
    status: "shipped",
    summary: "Open Claude with the corpus already on your clipboard.",
    keywords: ["youtube to claude", "send youtube transcript to claude", "claude youtube context"],
    whatItDoes:
      "The Claude send path removes the tiny bit of friction after capture. Uoink opens a new Claude conversation while the corpus sits on the clipboard, ready for your next prompt.",
    gettingStarted: [
      "Capture a video.",
      "Click Send to Claude in the popup or result view.",
      "Paste the corpus and ask for the analysis you want.",
    ],
    behindScenes:
      "Uoink skips account access. The browser opens Claude, then you decide what to paste and submit.",
    mcpTools: ["get_uoink_corpus", "classify_hook", "analyze_comments"],
    related: ["clipboard-markdown-corpus", "hook-type-classification", "comment-intelligence"],
    screenshot: {
      title: "Claude handoff",
      alt: "A Send to Claude action with a Uoink corpus ready to paste.",
    },
  },
  {
    slug: "send-to-chatgpt",
    title: "Send to ChatGPT",
    category: "AI handoff",
    status: "shipped",
    summary: "Use the same corpus with ChatGPT or any chat AI that accepts markdown.",
    keywords: ["youtube to chatgpt", "youtube transcript for chatgpt", "chatgpt youtube context"],
    whatItDoes:
      "The ChatGPT path uses the same source material as Claude: transcript, screenshots, comments, channel context, and metadata in one structured paste.",
    gettingStarted: [
      "Capture a video.",
      "Click Send to ChatGPT.",
      "Paste the corpus and ask a grounded question about the source.",
    ],
    behindScenes:
      "The site and extension talk about Claude and ChatGPT side by side because Uoink is model-agnostic. The corpus is plain markdown.",
    mcpTools: ["get_uoink_corpus"],
    related: ["clipboard-markdown-corpus", "send-to-claude", "mcp-server"],
    screenshot: {
      title: "ChatGPT handoff",
      alt: "A Uoink corpus being prepared for ChatGPT in a markdown paste flow.",
    },
  },
  {
    slug: "mcp-server",
    title: "Local MCP server",
    category: "AI handoff",
    status: "shipped",
    summary: "13 local tools let Claude Desktop, Cursor, Cline, Continue, and other clients call Uoink directly.",
    keywords: ["mcp youtube server", "claude desktop youtube mcp", "cursor youtube mcp"],
    whatItDoes:
      "The MCP server lets an agent capture, search, classify, and fetch corpora without the clipboard. You can ask Cursor to uoink a video, classify the hook, and compare it against your local library.",
    gettingStarted: [
      "Install the helper.",
      "Open the Uoink setup page and copy the generated MCP config.",
      "Paste the config into Claude Desktop, Cursor, Cline, Continue, or another MCP client.",
    ],
    behindScenes:
      "The supported transport is stdio. Experimental HTTP JSON-RPC runs on loopback for local integrations that need it.",
    mcpTools: [
      "uoink_video",
      "uoink_playlist",
      "search_uoinks",
      "get_uoink_corpus",
      "classify_hook",
      "analyze_comments",
      "find_mentions",
    ],
    related: ["operator-skill", "local-api-token-gate", "find-mentions"],
    screenshot: {
      title: "MCP tool trace",
      alt: "An MCP client calling Uoink tools to capture a video and fetch the corpus.",
    },
  },
  {
    slug: "operator-skill",
    title: "Operator Skill",
    category: "AI handoff",
    status: "shipped",
    summary: "A portable agentskills.io skill teaches compatible agents how to use Uoink with citations.",
    keywords: ["agentskills uoink", "operator skill youtube", "claude code youtube skill"],
    whatItDoes:
      "The Skill is the instruction layer on top of MCP. It teaches an agent citation discipline, hook autopsy mode, and the Uoink corpus shape so tool calls turn into useful work.",
    gettingStarted: [
      "Install Uoink and confirm MCP works.",
      "Add the Uoink Skill to your agent's skills folder.",
      "Ask for a hook autopsy, channel audit, or corpus search.",
    ],
    behindScenes:
      "The Skill is plain markdown. It travels between agents that support the agentskills.io pattern and keeps the product logic outside any one model vendor.",
    mcpTools: ["uoink_video", "classify_hook", "analyze_comments", "find_mentions"],
    related: ["mcp-server", "hook-type-classification", "citation-map"],
    screenshot: {
      title: "Operator Skill prompt flow",
      alt: "An agent using the Uoink Operator Skill to plan tool calls and cite the source video.",
    },
  },
  {
    slug: "starter-prompts-library",
    title: "Starter prompts library",
    category: "AI handoff",
    status: "shipped",
    summary: "11 prompts in the popup help first-day users ask better questions of the corpus.",
    keywords: ["youtube analysis prompts", "claude youtube prompts", "creator research prompts"],
    whatItDoes:
      "The prompt library gives users useful first moves: hook audit, comment signal, competitor pattern, script inspiration, source summary, and research triage.",
    gettingStarted: [
      "Capture a video.",
      "Open the prompt library in the popup.",
      "Pick a prompt, paste the corpus, and adjust the question to your work.",
    ],
    behindScenes:
      "Prompts stay local and generic. The corpus does the grounding, so the prompt can stay simple.",
    mcpTools: ["get_uoink_corpus", "classify_hook", "analyze_comments"],
    related: ["clipboard-markdown-corpus", "send-to-claude", "hook-type-classification"],
    screenshot: {
      title: "Prompt library",
      alt: "A Uoink popup prompt library with creator research and analysis prompts.",
    },
  },
  {
    slug: "local-corpus-library",
    title: "Local corpus library",
    category: "Library",
    status: "shipped",
    summary: "Every capture becomes a durable markdown file in your Uoink folder.",
    keywords: ["local video corpus", "youtube corpus library", "markdown video archive"],
    whatItDoes:
      "Uoink treats captures as files you own. A capture writes markdown, screenshots, thumbnail, metadata, and index records so your research survives beyond one chat session.",
    gettingStarted: [
      "Capture a few videos.",
      "Open the Uoink output folder from the popup or tray.",
      "Search or move the markdown files into your own vault when needed.",
    ],
    behindScenes:
      "The helper writes to a local library folder and updates SQLite FTS5. File writes use a tmp-then-rename pattern to avoid half-written corpora.",
    mcpTools: ["list_recent_uoinks", "search_uoinks", "get_uoink_corpus"],
    related: ["sqlite-fts-search", "topic-folders", "memory-page"],
    screenshot: {
      title: "Local corpus folder",
      alt: "A local Uoink folder containing markdown corpora and screenshots.",
    },
  },
  {
    slug: "sqlite-fts-search",
    title: "SQLite FTS search",
    category: "Library",
    status: "shipped",
    summary: "Search titles, transcripts, and comments across the library with local FTS5.",
    keywords: ["search youtube transcript library", "sqlite video corpus", "fts5 transcript search"],
    whatItDoes:
      "Search turns saved videos into a working library. You can ask where a term appeared, which creator mentioned a tool, or which past videos share a topic.",
    gettingStarted: [
      "Capture multiple videos.",
      "Open Memory search or call search_uoinks from an MCP client.",
      "Use specific terms, people, tools, products, and topic names.",
    ],
    behindScenes:
      "The helper indexes transcripts, comments, titles, and metadata into SQLite FTS5 on every completed job.",
    mcpTools: ["search_uoinks", "list_recent_uoinks", "get_uoink_corpus"],
    related: ["find-mentions", "memory-page", "local-corpus-library"],
    screenshot: {
      title: "Search results",
      alt: "Search results across a local Uoink library with video titles and matched text.",
    },
  },
  {
    slug: "topic-folders",
    title: "Topic folders",
    category: "Library",
    status: "shipped",
    summary: "Keyword rules route corpora into folders like AI and ML, DevTools, or Career.",
    keywords: ["organize youtube transcripts", "topic folders corpus", "markdown folder automation"],
    whatItDoes:
      "Topic folders keep the disk library readable. Uoink can file a corpus under a topic based on title, metadata, transcript words, and editable rules.",
    gettingStarted: [
      "Capture a video and inspect the saved path.",
      "Edit topics.json when your categories need new keywords.",
      "Use the topic path as a lightweight research map.",
    ],
    behindScenes:
      "The classifier uses local keyword rules first. The rules live in topics.json so the folder system stays inspectable and editable.",
    mcpTools: ["search_uoinks", "get_uoink_corpus"],
    related: ["local-corpus-library", "settings-page", "sqlite-fts-search"],
    screenshot: {
      title: "Topic folder rules",
      alt: "Uoink topic folder rules mapping keywords to local output folders.",
    },
  },
  {
    slug: "memory-page",
    title: "Memory page",
    category: "Library",
    status: "shipped",
    summary: "Browse and search every saved uoink from the extension surface.",
    keywords: ["youtube memory page", "browse transcript library", "uoink memory"],
    whatItDoes:
      "Memory gives the library a face. Instead of digging through folders, you can browse recent captures, search across past work, and reopen the corpus.",
    gettingStarted: [
      "Open the Uoink extension popup.",
      "Choose Memory.",
      "Search a title, transcript phrase, comment term, or creator name.",
    ],
    behindScenes:
      "The page queries the local helper and SQLite index. Results come from your machine, not a hosted Uoink database.",
    mcpTools: ["list_recent_uoinks", "search_uoinks", "get_uoink_corpus"],
    related: ["sqlite-fts-search", "dashboard-library", "local-corpus-library"],
    screenshot: {
      title: "Memory page grid",
      alt: "A Memory page grid showing saved Uoink captures with filters and search.",
    },
  },
  {
    slug: "find-mentions",
    title: "find_mentions entity lookup",
    category: "Library",
    status: "shipped",
    summary: "Ask for every corpus that mentions a person, product, company, tool, or topic.",
    keywords: ["find mentions across youtube videos", "entity search video corpus", "youtube competitive research"],
    whatItDoes:
      "find_mentions answers the cross-corpus question: where did this show up before? It is built for names like Karpathy, tools like Cursor, companies like Anthropic, and topics like RLHF.",
    gettingStarted: [
      "Build a library with several captures.",
      "Connect an MCP client.",
      "Call find_mentions with the entity you want to trace.",
    ],
    behindScenes:
      "Entity Extraction pulls people, tools, products, companies, and topics out of saved corpora. find_mentions queries that local entity layer and returns source citations.",
    mcpTools: ["find_mentions", "get_citation_map", "get_uoink_corpus"],
    related: ["entity-extraction", "sqlite-fts-search", "citation-map"],
    screenshot: {
      title: "Entity lookup",
      alt: "An MCP result showing every saved video that mentions an entity with timestamps.",
    },
  },
  {
    slug: "citation-map",
    title: "Citation map",
    category: "Library",
    status: "shipped",
    summary: "Map saved corpus slugs back to source URLs and timestamp citations.",
    keywords: ["youtube timestamp citations", "video citation map", "mcp citation source map"],
    whatItDoes:
      "The citation map gives agents and humans a clean route from local markdown back to the source moment. It keeps analysis tied to video evidence.",
    gettingStarted: [
      "Capture a video or playlist.",
      "Ask your MCP agent for a citation map.",
      "Use the returned URLs and timestamps in notes, docs, or analysis.",
    ],
    behindScenes:
      "Each corpus carries source URL, slug, video ID, and timestamp-aware transcript structure. get_citation_map exposes that mapping to agents.",
    mcpTools: ["get_citation_map", "get_uoink_corpus", "search_uoinks"],
    related: ["transcript-with-timestamps", "operator-skill", "find-mentions"],
    screenshot: {
      title: "Citation mapping",
      alt: "A citation map linking local corpus sections to source video timestamps.",
    },
  },
  {
    slug: "hook-type-classification",
    title: "Hook Type classification",
    category: "Analysis",
    status: "shipped",
    summary: "Classify openings into 9 hook categories with confidence and reasoning.",
    keywords: ["youtube hook types", "youtube hook classification", "creator hook taxonomy"],
    whatItDoes:
      "Hook Type classification labels the opening move: curiosity_gap, question, contrarian, story_open, promise_list, demo, authority, stakes, or other. It gives creators a shared language for why an opening works.",
    gettingStarted: [
      "Add your Anthropic key in Uoink settings.",
      "Capture a video with Hook Type enabled.",
      "Read the hook category, confidence, and reasoning in the corpus or MCP result.",
    ],
    behindScenes:
      "The local helper sends the relevant opening transcript slice to Anthropic with your key when the feature is enabled. The result is written back into the corpus and index.",
    mcpTools: ["classify_hook", "get_taxonomy", "get_uoink_corpus"],
    related: ["hook-taxonomy", "self-calibrating-classifier", "playlist-mode"],
    screenshot: {
      title: "Hook Type result",
      alt: "A Hook Type classification result showing category, confidence, and source timestamp.",
    },
  },
  {
    slug: "comment-intelligence",
    title: "Comment Intelligence",
    category: "Analysis",
    status: "shipped",
    summary: "Cluster themes, products, and disagreements from the captured comment set.",
    keywords: ["youtube comment intelligence", "analyze youtube comments ai", "youtube audience research"],
    whatItDoes:
      "Comment Intelligence turns top comments into audience signal. It groups themes, pulls out tools and products, and flags where viewers push back.",
    gettingStarted: [
      "Add your Anthropic key in settings.",
      "Capture a video with comments available.",
      "Ask Claude, ChatGPT, or an MCP client what the audience cared about.",
    ],
    behindScenes:
      "The helper sends comment chunks to Anthropic only when enabled. The resulting themes and mentions are stored locally with the corpus.",
    mcpTools: ["analyze_comments", "get_uoink_corpus", "find_mentions"],
    related: ["top-comments-extraction", "entity-extraction", "find-mentions"],
    screenshot: {
      title: "Comment themes",
      alt: "A Comment Intelligence output grouping comment themes, products, and disagreements.",
    },
  },
  {
    slug: "entity-extraction",
    title: "Entity Extraction",
    category: "Analysis",
    status: "shipped",
    summary: "Pull people, tools, products, companies, and topics out of every corpus.",
    keywords: ["entity extraction youtube", "product mentions youtube comments", "cross corpus entity graph"],
    whatItDoes:
      "Entity Extraction makes the local library queryable by named things. It is the substrate behind find_mentions and long-run research across many videos.",
    gettingStarted: [
      "Enable optional AI analysis with your Anthropic key.",
      "Capture videos across a topic.",
      "Ask which tools, people, or companies keep recurring.",
    ],
    behindScenes:
      "Extracted entities are written to the local index with links back to the source corpus. No Uoink server receives the entity graph.",
    mcpTools: ["find_mentions", "search_uoinks", "get_uoink_corpus"],
    related: ["find-mentions", "comment-intelligence", "sqlite-fts-search"],
    screenshot: {
      title: "Entity extraction output",
      alt: "An entity extraction result with people, tools, products, companies, and topics grouped by type.",
    },
  },
  {
    slug: "hook-taxonomy",
    title: "Hook taxonomy",
    category: "Analysis",
    status: "shipped",
    summary: "The 9-category taxonomy gives creator research a stable vocabulary.",
    keywords: ["youtube hook taxonomy", "curiosity gap hook", "contrarian hook youtube"],
    whatItDoes:
      "The taxonomy names the opening structures that show up again and again in high-performing videos. It is useful on one video and sharper across a creator's last 10 uploads.",
    gettingStarted: [
      "Open the Hook Type feature page or docs.",
      "Capture one or more videos with Hook Type enabled.",
      "Compare categories across videos instead of judging each opening by vibes.",
    ],
    behindScenes:
      "get_taxonomy exposes the current taxonomy to MCP clients so agents can explain the categories before using them.",
    mcpTools: ["get_taxonomy", "classify_hook"],
    related: ["hook-type-classification", "playlist-mode", "operator-skill"],
    screenshot: {
      title: "Taxonomy chip strip",
      alt: "A strip of 9 Hook Type chips: curiosity_gap, question, contrarian, story_open, promise_list, demo, authority, stakes, other.",
    },
  },
  {
    slug: "self-calibrating-classifier",
    title: "Self-calibrating classifier",
    category: "Analysis",
    status: "shipped",
    summary: "User corrections become few-shot anchors for future hook classification.",
    keywords: ["self calibrating hook classifier", "creator taxonomy calibration", "hook classifier corrections"],
    whatItDoes:
      "When your read of a hook differs from the classifier, corrections train the local judgment layer toward your taste. The taxonomy stays shared, while your calibration becomes personal.",
    gettingStarted: [
      "Classify hooks across your library.",
      "Correct the category when the output misses your judgment.",
      "Run future classifications with those corrections available as anchors.",
    ],
    behindScenes:
      "Corrections are stored locally and injected into later classification prompts as few-shot examples.",
    mcpTools: ["classify_hook", "get_taxonomy"],
    related: ["hook-type-classification", "hook-taxonomy", "local-corpus-library"],
    screenshot: {
      title: "Hook correction state",
      alt: "A hook classification correction showing the original category, corrected category, and saved local anchor.",
    },
  },
  {
    slug: "windows-helper",
    title: "Windows helper",
    category: "Local and private",
    status: "shipped",
    summary: "A local helper bundles Python, yt-dlp, ffmpeg, SQLite, keyring, and MCP pieces.",
    keywords: ["local youtube helper", "yt-dlp chrome extension", "windows video helper"],
    whatItDoes:
      "The helper does the work a browser extension can't do alone. It runs locally, listens on loopback, starts with Windows, and keeps the corpus on your machine.",
    gettingStarted: [
      "Download the installer from GitHub Releases.",
      "Run the setup wizard.",
      "Confirm the tray status shows the helper running.",
    ],
    behindScenes:
      "The installer places Uoink under %LOCALAPPDATA%\\Uoink, registers current-user autostart, and exposes local endpoints gated by a per-install token.",
    mcpTools: ["get_uoink_health"],
    related: ["system-tray-status", "local-api-token-gate", "install-wizard"],
    screenshot: {
      title: "Helper running",
      alt: "A Windows tray status showing that the Uoink helper is running on localhost.",
    },
  },
  {
    slug: "credential-manager-key-storage",
    title: "Credential Manager key storage",
    category: "Local and private",
    status: "shipped",
    summary: "The optional Anthropic key is stored in Windows Credential Manager.",
    keywords: ["anthropic api key windows credential manager", "local ai key storage", "byo key youtube ai"],
    whatItDoes:
      "Optional AI features use your Anthropic key. Uoink stores that key in the operating system vault and only sends it to Anthropic when you run an enabled AI pass.",
    gettingStarted: [
      "Open Uoink settings.",
      "Paste your Anthropic key and click Test.",
      "Use Clear key whenever you want to remove it from the machine.",
    ],
    behindScenes:
      "Settings on disk avoid secrets. The key lives in Windows Credential Manager and is read only for Anthropic Authorization headers.",
    mcpTools: ["get_uoink_health", "classify_hook", "analyze_comments"],
    related: ["comment-intelligence", "hook-type-classification", "settings-page"],
    screenshot: {
      title: "BYO key settings",
      alt: "A Uoink settings field showing Anthropic key status, Test, Save, and Clear actions.",
    },
  },
  {
    slug: "zero-telemetry",
    title: "Zero telemetry",
    category: "Local and private",
    status: "shipped",
    summary: "No account, no Uoink cloud, no product analytics endpoint.",
    keywords: ["private youtube summarizer", "no telemetry ai tool", "local first video tool"],
    whatItDoes:
      "Uoink is built for private research. The product has no hosted corpus, no account system, and no telemetry pipeline for what you capture.",
    gettingStarted: [
      "Install from GitHub Releases.",
      "Use the product without creating an account.",
      "Audit the MIT-licensed source when you want to verify the claim.",
    ],
    behindScenes:
      "Network calls go to the source you asked to capture and optional Anthropic calls with your key. Uoink has no corpus server to receive your work.",
    mcpTools: ["get_uoink_health"],
    related: ["open-source-mit", "credential-manager-key-storage", "local-api-token-gate"],
    screenshot: {
      title: "Privacy summary",
      alt: "A privacy panel explaining that Uoink stores captures locally and uses no telemetry.",
    },
  },
  {
    slug: "local-api-token-gate",
    title: "Local API token gate",
    category: "Local and private",
    status: "shipped",
    summary: "Non-public helper endpoints require the per-install X-Uoink-Token header.",
    keywords: ["localhost api token", "local helper security", "uoink token gate"],
    whatItDoes:
      "The extension and setup page talk to the helper through loopback. Token gating keeps random local pages from poking private endpoints.",
    gettingStarted: [
      "Install Uoink normally.",
      "Let the setup page generate configs and tokens.",
      "Do not hand-write local API calls unless you are developing against the helper.",
    ],
    behindScenes:
      "The helper generates a random per-install token. Protected endpoints require X-Uoink-Token, while public health checks stay safe for setup diagnostics.",
    mcpTools: ["get_uoink_health"],
    related: ["windows-helper", "mcp-server", "zero-telemetry"],
    screenshot: {
      title: "Token-gated health",
      alt: "A local health diagnostic showing helper status and token-gated endpoint notes.",
    },
  },
  {
    slug: "open-source-mit",
    title: "Open source MIT",
    category: "Local and private",
    status: "shipped",
    summary: "The helper, extension, and site point back to an auditable MIT-licensed repo.",
    keywords: ["open source youtube tool", "mit youtube transcript tool", "uoink github"],
    whatItDoes:
      "Open source is part of the privacy model. If the claim matters, you can inspect the helper, extension, MCP server, and network behavior.",
    gettingStarted: [
      "Open the GitHub repo.",
      "Read the source and releases.",
      "File issues or fork the project under the MIT license.",
    ],
    behindScenes:
      "The public site links to GitHub for source, releases, terms, and download counts so claims are backed by inspectable artifacts.",
    mcpTools: [],
    related: ["zero-telemetry", "windows-helper", "local-corpus-library"],
    screenshot: {
      title: "GitHub release",
      alt: "The Uoink GitHub repository and public release assets.",
    },
  },
  {
    slug: "system-tray-status",
    title: "System tray status",
    category: "Dashboard",
    status: "shipped",
    summary: "Tray status shows Running, Yoinking, or Offline without opening the browser.",
    keywords: ["youtube helper tray icon", "local helper status", "uoink tray"],
    whatItDoes:
      "The tray icon answers the first support question: is the helper running? It gives quick access to the dashboard, folder, recent captures, and stop action.",
    gettingStarted: [
      "Install Uoink.",
      "Look for the tray icon after startup.",
      "Right-click it for dashboard, folder, recent captures, stop helper, and quit.",
    ],
    behindScenes:
      "The tray state mirrors helper activity. Green means running, amber means a job is active, and grey means offline.",
    mcpTools: ["get_uoink_health", "list_recent_uoinks"],
    related: ["windows-helper", "dashboard-library", "live-activity-stream"],
    screenshot: {
      title: "Tray status menu",
      alt: "A Windows tray menu with Open Dashboard, Open Folder, Recent Uoinks, Stop helper, and Quit actions.",
    },
  },
  {
    slug: "dashboard-library",
    title: "Dashboard Library",
    category: "Dashboard",
    status: "in flight",
    summary: "A desktop grid for search, filter, sort, and browse across saved captures.",
    keywords: ["uoink dashboard", "video corpus dashboard", "youtube transcript library dashboard"],
    whatItDoes:
      "The dashboard turns the local library into a cockpit: search box, filters, topic chips, hook chips, thumbnails, titles, channels, and relative time.",
    gettingStarted: [
      "Open Dashboard from the tray.",
      "Use search, filters, and sort controls.",
      "Open a card to read the saved corpus.",
    ],
    behindScenes:
      "The dashboard reads the same local SQLite index and file library as Memory. It is a richer desktop surface for heavier sessions.",
    mcpTools: ["list_recent_uoinks", "search_uoinks", "get_uoink_corpus"],
    related: ["memory-page", "sqlite-fts-search", "topic-folders"],
    screenshot: {
      title: "Dashboard grid",
      alt: "A dark Uoink dashboard grid with saved corpus cards, hook chips, search, filters, and sort controls.",
    },
  },
  {
    slug: "live-activity-stream",
    title: "Live Activity Stream",
    category: "Dashboard",
    status: "in flight",
    summary: "SSE job updates show fetch, transcribe, screenshots, classify, and write phases.",
    keywords: ["live extraction progress", "youtube transcript job status", "server sent events dashboard"],
    whatItDoes:
      "Activity makes long jobs visible. Playlist runs and slower video captures show exactly which phase is active and what is queued next.",
    gettingStarted: [
      "Start a playlist or long video job.",
      "Open the dashboard Activity tab.",
      "Watch phase chips update until the job writes the corpus.",
    ],
    behindScenes:
      "The dashboard, popup, and helper share the same job stream so progress vocabulary stays consistent across surfaces.",
    mcpTools: ["get_job_status", "cancel_job"],
    related: ["playlist-mode", "rate-limit-queue", "system-tray-status"],
    screenshot: {
      title: "Activity stream",
      alt: "A dashboard activity tab showing in-flight Uoink jobs and phase chips.",
    },
  },
  {
    slug: "settings-page",
    title: "Settings page",
    category: "Dashboard",
    status: "in flight",
    summary: "Manage key status, output folder, topics, helper health, MCP config, and updates.",
    keywords: ["uoink settings", "anthropic key settings", "mcp config generator"],
    whatItDoes:
      "Settings keeps setup tasks in one local place: BYO key, feature toggles, output folder, topic rules, helper status, and copy-ready MCP snippets.",
    gettingStarted: [
      "Open setup from the extension or dashboard.",
      "Test and save your optional Anthropic key.",
      "Copy the generated MCP config for your client.",
    ],
    behindScenes:
      "Settings calls local helper endpoints. Secrets go to the OS credential vault, while non-secret preferences write to local settings files.",
    mcpTools: ["get_uoink_health"],
    related: ["credential-manager-key-storage", "mcp-server", "topic-folders"],
    screenshot: {
      title: "Settings screen",
      alt: "A Uoink settings screen with Anthropic key status, output folder, topics, helper status, and MCP config.",
    },
  },
  {
    slug: "install-wizard",
    title: "Install wizard",
    category: "Dashboard",
    status: "in flight",
    summary: "The Windows installer explains the helper, migration, disk use, and running-state confirmation.",
    keywords: ["uoink installer", "windows setup wizard", "local helper installer"],
    whatItDoes:
      "The wizard sets the right expectation before the extension is installed. It tells users a local helper is required, where it lives, and how to confirm it is running.",
    gettingStarted: [
      "Download the installer.",
      "Run through the setup wizard.",
      "Use the final screen to open YouTube or the setup page.",
    ],
    behindScenes:
      "The installer uses user-space install paths, autostart registration, branded screens, and migration checks for legacy Yoink folders.",
    mcpTools: ["get_uoink_health"],
    related: ["windows-helper", "first-run-splash", "system-tray-status"],
    screenshot: {
      title: "Installer finished screen",
      alt: "A Uoink installer finished screen confirming the helper is running.",
    },
  },
  {
    slug: "first-run-splash",
    title: "First-run splash",
    category: "Dashboard",
    status: "in flight",
    summary: "A small confirmation window shows Uoink is running after install or startup.",
    keywords: ["uoink splash screen", "helper running confirmation", "local helper startup"],
    whatItDoes:
      "The splash closes the invisible-helper gap. It confirms the helper is listening, gives quick links, then gets out of the way.",
    gettingStarted: [
      "Install or restart Uoink.",
      "Wait for the splash to confirm helper status.",
      "Open Dashboard, open YouTube, or let it minimize to the tray.",
    ],
    behindScenes:
      "The splash pings the local helper before promising that Uoink is running. Failure states point to setup and diagnostics.",
    mcpTools: ["get_uoink_health"],
    related: ["system-tray-status", "install-wizard", "windows-helper"],
    screenshot: {
      title: "Running splash",
      alt: "A frameless Uoink splash window confirming the local helper is running.",
    },
  },
  {
    slug: "rate-limit-queue",
    title: "Rate-limit queue",
    category: "Dashboard",
    status: "shipped",
    summary: "Rate-limited jobs retry with exponential backoff instead of failing silently.",
    keywords: ["youtube rate limit retry", "yt-dlp retry queue", "playlist extraction queue"],
    whatItDoes:
      "Research jobs should not die quietly because YouTube slowed a request. Uoink retries with a visible queue so playlist and batch work can recover.",
    gettingStarted: [
      "Start a capture or playlist job.",
      "Leave Uoink running if YouTube rate-limits the request.",
      "Check Activity, popup, or tray state for retry progress.",
    ],
    behindScenes:
      "The queue backs off at 60 seconds, 5 minutes, and 15 minutes for up to 3 attempts, then reports a clear failure state.",
    mcpTools: ["get_job_status", "cancel_job", "get_uoink_health"],
    related: ["playlist-mode", "live-activity-stream", "system-tray-status"],
    screenshot: {
      title: "Retry queue",
      alt: "A queued Uoink job showing retry timing and current extraction phase.",
    },
  },
];

export const featureBySlug = new Map(features.map((feature) => [feature.slug, feature]));

export function getRelatedFeatures(feature: Feature): Feature[] {
  return feature.related
    .map((slug) => featureBySlug.get(slug))
    .filter((item): item is Feature => Boolean(item));
}

export function featuresByCategory(category: FeatureCategory): Feature[] {
  return features.filter((feature) => feature.category === category);
}

export type FeatureCategory =
  | "Capture"
  | "Library"
  | "Workspace"
  | "Verification"
  | "Distribution"
  | "Identity";

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
  mcpExample?: string;
  related: string[];
  cta: string;
  screenshot: FeatureScreenshot;
};

export const featureCategories: { name: FeatureCategory; deck: string }[] = [
  {
    "name": "Capture",
    "deck": "Get source material into Uoink: YouTube pages, playlists, Shorts, podcasts, Twitter video, and approved web pages."
  },
  {
    "name": "Library",
    "deck": "Turn captures into memory: search, facets, your channel, taste anchors, and resurfacing."
  },
  {
    "name": "Workspace",
    "deck": "Assemble source sets, critique ideas against evidence, write scripts, and draft posts from the corpus."
  },
  {
    "name": "Verification",
    "deck": "Extract claims and keep the evidence panel close so outputs stay grounded."
  },
  {
    "name": "Distribution",
    "deck": "Give Claude Desktop, Cursor, and other clients a local MCP path into your research library."
  },
  {
    "name": "Identity",
    "deck": "Keep the trust layer visible: BYO keys, local-first processing, and no Uoink cloud."
  }
];

export const features: Feature[] = [
  {
    "slug": "in-page-button",
    "title": "In-page Uoink button",
    "category": "Capture",
    "status": "shipped",
    "summary": "Capture YouTube transcripts and frames directly from your browser.",
    "keywords": [
      "uoink feature",
      "in page button",
      "in-page uoink button",
      "capture",
      "youtube",
      "transcripts",
      "frames"
    ],
    "whatItDoes": "The in-page button inserts a rust-colored U directly into the YouTube action row below the video title. When you click it, the extension pings your local helper to start the download. It pulls the transcript, audience comments, and video frames without making you copy URLs or leave the browser tab. The status updates right inside the page.",
    "gettingStarted": [
      "Open a YouTube video page in Chrome or Brave.",
      "Locate the rust-colored U button next to the Save actions.",
      "Click the button to start the capture job.",
      "Wait for the green success checkmark to show in the action row.",
      "The markdown corpus is now on your clipboard and stored locally."
    ],
    "behindScenes": "The browser extension runs a content script that waits for the video player container to render. It injects a native HTML button styled to match the page theme. Clicking the button posts a payload to the loopback server running on your machine. The helper downloads the audio stream, runs the transcription process, and saves the file directly to your local library without sending your data to external servers.",
    "mcpTools": [
      "uoink_video",
      "get_job_status"
    ],
    "related": [
      "keyboard-shortcut",
      "right-click-any-link",
      "playlist-mode"
    ],
    "cta": "Install the browser extension and start capturing video content with one click.",
    "screenshot": {
      "title": "Rust Uoink button next to YouTube player actions",
      "alt": "Rust Uoink button next to YouTube player actions",
      "src": "/screenshots/features/youtube-video-capture-clean.png",
    }
  },
  {
    "slug": "right-click-any-link",
    "title": "Right-click context capture",
    "category": "Capture",
    "status": "shipped",
    "summary": "Capture YouTube and X videos directly from link context menus.",
    "keywords": [
      "uoink feature",
      "right click any link",
      "right-click context capture",
      "capture",
      "youtube",
      "videos",
      "directly"
    ],
    "whatItDoes": "You can capture videos without opening the watch pages. Right-click any YouTube or X video link, select the capture option from your browser context menu, and the helper starts the job in the background. It extracts the transcript, comments, and frames while you continue reading your feed. Your new corpus lands in your local library as soon as the background extraction finishes.",
    "gettingStarted": [
      "Hover over any video link on YouTube or X.",
      "Right-click the link to open the context menu.",
      "Select Uoink this video from the menu list.",
      "Look for the tray icon notification confirming the job started.",
      "Open the library folder once the process completes."
    ],
    "behindScenes": "The extension registers context menu items via the background script. When triggered, it extracts the URL from the target link and relays it to the local helper. The helper runs the extraction asynchronously, checking your allowlist settings before starting. The background worker communicates status updates to the system tray so you know when the file is ready.",
    "mcpTools": [
      "uoink_video",
      "uoink_page",
      "get_job_status"
    ],
    "related": [
      "in-page-button",
      "keyboard-shortcut",
      "twitter-video"
    ],
    "cta": "Right-click links to build your video library without leaving your current page.",
    "screenshot": {
      "title": "Right-click context menu showing Uoink option",
      "alt": "Right-click context menu showing Uoink option",
      "src": "/screenshots/right-click-any-link/hero-1280x800.png",
    }
  },
  {
    "slug": "keyboard-shortcut",
    "title": "Keyboard capture shortcut",
    "category": "Capture",
    "status": "shipped",
    "summary": "Trigger instant video extraction with customizable keyboard shortcuts.",
    "keywords": [
      "uoink feature",
      "keyboard shortcut",
      "keyboard capture shortcut",
      "trigger",
      "instant",
      "extraction",
      "customizable"
    ],
    "whatItDoes": "Trigger video capture without reaching for your mouse. Pressing the keyboard shortcut sends the URL of the active browser tab to the local helper instantly. The helper starts the extraction, formats the markdown document, and places it onto your clipboard in the background. You can customize the keyboard combination to match your existing window management settings.",
    "gettingStarted": [
      "Open Chrome's extension keyboard settings.",
      "Bind Uoink to your preferred keys.",
      "Open any public video page.",
      "Press your configured keyboard combination.",
      "Check the system tray icon for progress status."
    ],
    "behindScenes": "The extension listens for the global commands API event registered in the manifest. When the shortcut is triggered, the background script queries the active window to retrieve the tab URL. It forwards the request to the local API endpoint on port 5179. The helper processes the URL, creates the directory structure on disk, and populates the database index.",
    "mcpTools": [
      "uoink_video",
      "uoink_page"
    ],
    "related": [
      "in-page-button",
      "right-click-any-link"
    ],
    "cta": "Set up your custom shortcut to extract video content instantly.",
    "screenshot": {
      "title": "Extension settings panel showing keyboard shortcut binds",
      "alt": "Extension settings panel showing keyboard shortcut binds",
    }
  },
  {
    "slug": "mobile-playlist-bridge",
    "title": "Mobile playlist bridge",
    "category": "Capture",
    "status": "in flight",
    "summary": "Save videos on mobile and let Uoink automatically capture them on desktop.",
    "keywords": [
      "uoink feature",
      "mobile playlist bridge",
      "videos",
      "mobile",
      "automatically",
      "capture",
      "desktop"
    ],
    "whatItDoes": "Capture videos from your phone. You save links to a designated YouTube playlist while on mobile, and the desktop helper polls the list when you return to your computer. It extracts every new video, groups them by topic, and adds them to your local index. Your mobile queue becomes a structured library automatically.",
    "gettingStarted": [
      "Create a public or unlisted playlist on YouTube.",
      "Open the desktop settings panel in Uoink.",
      "Paste the playlist URL into the mobile bridge field.",
      "Save videos to this playlist when browsing on your phone.",
      "The desktop helper scans the list on boot and downloads the new entries."
    ],
    "behindScenes": "The local helper schedules a background job that queries the YouTube playlist API at regular intervals. It compares the playlist items against the local SQLite database to identify new URLs. When it detects a new video, it queues the URL for background extraction. The helper downloads the audio streams, runs transcription, and writes the markdown files to your corpus folder.",
    "mcpTools": [
      "uoink_playlist",
      "get_job_status"
    ],
    "related": [
      "playlist-mode",
      "podcast-feeds"
    ],
    "cta": "Configure the mobile bridge to sync your mobile discoveries with your desktop library.",
    "screenshot": {
      "title": "Uoink settings showing mobile bridge config",
      "alt": "Uoink settings showing mobile bridge config",
      "src": "/screenshots/mobile-playlist-bridge/hero-1280x800.png",
    }
  },
  {
    "slug": "universal-page-uoink",
    "title": "Universal page extraction",
    "category": "Capture",
    "status": "in flight",
    "summary": "Extract clean markdown and metadata from any web page using local Crawl4AI.",
    "keywords": [
      "uoink feature",
      "universal page uoink",
      "universal page extraction",
      "extract",
      "markdown",
      "metadata",
      "crawl4ai"
    ],
    "whatItDoes": "Extract clean markdown from general articles and documentation pages. The universal page feature strips ads, cookie banners, and navigation menus to save the core content of any web page. It uses a local Crawl4AI integration to package text, links, and inline images. The generated files share the same layout as your video corpus and land in your local library automatically.",
    "gettingStarted": [
      "Open an article or documentation page in your browser.",
      "Right-click the page background.",
      "Click Uoink this page to run the extraction.",
      "Approve the allowlist prompt if this is a new domain.",
      "Check your library for the clean markdown document."
    ],
    "behindScenes": "The local helper integrates a Crawl4AI parser that fetches and processes the page HTML. It strips script tags, CSS styles, and cookie consent elements to extract the semantic text blocks. The helper formats this output as markdown, preserves external links, and indexes the text in the SQLite database. Everything runs on your machine without third-party cloud crawlers.",
    "mcpTools": [
      "uoink_page",
      "list_allowed_sites",
      "add_allowed_site"
    ],
    "related": [
      "local-first",
      "memory-search",
      "mcp-server"
    ],
    "cta": "Add websites to your allowlist and capture articles as clean local markdown.",
    "screenshot": {
      "title": "Right-click menu on generic webpage showing Uoink action",
      "alt": "Right-click menu on generic webpage showing Uoink action",
      "src": "/screenshots/universal-page-uoink/hero-1280x800.png",
    }
  },
  {
    "slug": "twitter-video",
    "title": "X video transcripts",
    "category": "Capture",
    "status": "in flight",
    "summary": "Extract transcripts and creator citations from videos on X.",
    "keywords": [
      "uoink feature",
      "twitter video",
      "x video transcripts",
      "extract",
      "transcripts",
      "creator",
      "citations"
    ],
    "whatItDoes": "Extract text and metadata from videos posted on X. Right-click any tweet containing a video to send the media URL to your local helper. The helper downloads the audio stream, runs local transcription, and writes the structured markdown file. Every output includes a citation that links back to the original author and tweet so you can credit creators.",
    "gettingStarted": [
      "Find a tweet containing a video on X.",
      "Right-click the video player or the link.",
      "Select Uoink video from the context menu.",
      "Wait for the notification that transcription completed.",
      "Open the markdown file to read the transcript and the author citation."
    ],
    "behindScenes": "The helper uses yt-dlp to download the audio track from the X post. It sends the audio stream to the transcription module to generate the timestamped text. The helper queries the public post metadata to retrieve the creator's handle and post URL. It formats the citation into the header of the markdown file, ensuring compliance with creator credit rules.",
    "mcpTools": [
      "uoink_page",
      "write_tweet"
    ],
    "related": [
      "right-click-any-link",
      "in-page-button"
    ],
    "cta": "Capture X video transcripts directly into your local knowledge base.",
    "screenshot": {
      "title": "X post showing right-click context menu options",
      "alt": "X post showing right-click context menu options",
      "src": "/screenshots/twitter-video/hero-1280x800.png",
    }
  },
  {
    "slug": "podcast-feeds",
    "title": "Podcast RSS ingestion",
    "category": "Capture",
    "status": "shipped",
    "summary": "Poll podcast RSS feeds and transcribe episodes locally using Whisper.",
    "keywords": [
      "uoink feature",
      "podcast feeds",
      "podcast rss ingestion",
      "podcast",
      "transcribe",
      "episodes",
      "locally"
    ],
    "whatItDoes": "Turn podcast feeds into a searchable text library. You add RSS URLs in your settings panel, and the helper polls for new episodes in the background. It downloads the audio files, runs local Whisper transcription, and applies speaker diarization. The final output is formatted as a standard markdown corpus, grouped by show and stored in your library.",
    "gettingStarted": [
      "Open the Uoink desktop settings.",
      "Paste a podcast RSS feed URL into the field.",
      "Click Add to register the feed.",
      "Select your preferred Whisper model size.",
      "Let the helper download and transcribe the latest episodes in the background."
    ],
    "behindScenes": "The helper polls registered feeds periodically using a feedparser client. It checks new episodes against the SQLite index to prevent duplicate downloads. The audio is downloaded locally, and Whisper performs the transcription. If WhisperX is configured, it runs a diarization pass to label speakers before writing the markdown file to your disk.",
    "mcpTools": [
      "add_podcast_feed",
      "transcribe_podcast"
    ],
    "related": [
      "local-first",
      "memory-search",
      "mobile-playlist-bridge"
    ],
    "cta": "Add your favorite podcast RSS feeds to build a local audio transcript archive.",
    "screenshot": {
      "title": "Settings tab showing podcast RSS config section",
      "alt": "Settings tab showing podcast RSS config section",
      "src": "/screenshots/podcast-feeds/hero-1280x800.png",
    }
  },
  {
    "slug": "youtube-shorts",
    "title": "YouTube Shorts transcription",
    "category": "Capture",
    "status": "shipped",
    "summary": "Capture and classify YouTube Shorts to analyze fast-paced video hooks.",
    "keywords": [
      "uoink feature",
      "youtube shorts",
      "youtube shorts transcription",
      "capture",
      "classify",
      "youtube",
      "shorts"
    ],
    "whatItDoes": "Extract transcripts and analyze hooks from YouTube Shorts. The extension adds a capture button onto the Shorts player interface. When clicked, the helper downloads the short audio track, runs transcription, and classifies the opening hook. It packages the text, metadata, and classification type into a compact markdown file that you can use to study creator hooks.",
    "gettingStarted": [
      "Open YouTube Shorts in your browser.",
      "Find the rust-colored U button overlaid on the right control bar.",
      "Click the button to start the capture.",
      "Open the Uoink dashboard to see the hook classification.",
      "Paste the markdown file into Claude to study the script structure."
    ],
    "behindScenes": "The content script matches the YouTube Shorts container and overlays the button next to the native share icons. Clicking it posts the video URL to the local helper API. The helper extracts the media, transcribes the brief audio stream, and passes the first ten seconds of text to the hook classifier. The resulting markdown file is saved to your library.",
    "mcpTools": [
      "uoink_video",
      "search_uoinks"
    ],
    "related": [
      "in-page-button",
      "your-channel",
      "faceted-classification"
    ],
    "cta": "Capture and analyze YouTube Shorts to learn how creators hook their audience.",
    "screenshot": {
      "title": "YouTube Shorts interface showing injected Uoink button",
      "alt": "YouTube Shorts interface showing injected Uoink button",
    }
  },
  {
    "slug": "playlist-mode",
    "title": "Playlist queue extraction",
    "category": "Capture",
    "status": "shipped",
    "summary": "Batch extract up to 10 YouTube videos at once with partial-failure tolerance.",
    "keywords": [
      "uoink feature",
      "playlist mode",
      "playlist queue extraction",
      "extract",
      "youtube",
      "videos",
      "partial"
    ],
    "whatItDoes": "Batch capture video series without manual repetition. Playlist mode lets you queue up to ten video URLs at a time. The local helper processes the queue in the background, transcribing audio and extracting frames sequentially. If one video fails due to a network error, the helper skips it and continues the queue so your batch job finishes.",
    "gettingStarted": [
      "Open a YouTube playlist page.",
      "Click the Uoink extension icon to open the popup.",
      "Select the Playlist tab.",
      "Paste the playlist URL or check the auto-detected link.",
      "Click Uoink Playlist to start the batch download."
    ],
    "behindScenes": "The extension sends the playlist URL to the queue manager endpoint in the helper. The helper resolves the playlist into individual video URLs. It stores these in a SQLite queue table and processes them one by one. The helper uses isolated threads for each extraction task, ensuring that a crash in yt-dlp warns without blocking subsequent videos.",
    "mcpTools": [
      "uoink_playlist",
      "cancel_job",
      "get_job_status"
    ],
    "related": [
      "mobile-playlist-bridge",
      "in-page-button"
    ],
    "cta": "Queue up a playlist to capture a structured course or video sequence automatically.",
    "screenshot": {
      "title": "Extension popup showing single video and playlist tabs",
      "alt": "Extension popup showing single video and playlist tabs",
      "src": "/screenshots/playlist-mode/hero-1280x800.png",
    }
  },
  {
    "slug": "memory-search",
    "title": "Local SQLite FTS5 search",
    "category": "Library",
    "status": "shipped",
    "summary": "Search transcripts, comments, and metadata instantly using local SQLite full-text search.",
    "keywords": [
      "uoink feature",
      "memory search",
      "local sqlite fts5 search",
      "search",
      "transcripts",
      "comments",
      "metadata"
    ],
    "whatItDoes": "Search your entire corpus in milliseconds. The helper indexes every transcript, comment cluster, and metadata block in a local SQLite FTS5 database. You can run keyword, speaker, channel, or hook queries from your dashboard. Your search queries and index files stay on your machine because the database runs entirely on your local drive.",
    "gettingStarted": [
      "Open the Uoink desktop dashboard.",
      "Click the search bar at the top of the interface.",
      "Type your search query, such as a topic, speaker name, or tool.",
      "View the matching corpus cards with highlighted search snippets.",
      "Click any card to open the markdown file."
    ],
    "behindScenes": "The helper uses the SQLite FTS5 extension to build a virtual table of all text content. When a new video is captured, the helper parses the markdown file and inserts the text blocks into the search index. The dashboard queries this index via a local HTTP endpoint, returning results and text match positions without internet access.",
    "mcpTools": [
      "search_uoinks",
      "get_uoink_corpus"
    ],
    "related": [
      "faceted-classification",
      "resurface-for-you",
      "mcp-server"
    ],
    "cta": "Search across your entire captured library instantly without cloud latency.",
    "screenshot": {
      "title": "Uoink dashboard showing the main library search bar",
      "alt": "Uoink dashboard showing the main library search bar",
      "src": "/screenshots/memory-search/hero-1280x800.png",
    }
  },
  {
    "slug": "faceted-classification",
    "title": "Facet and tag organization",
    "category": "Library",
    "status": "shipped",
    "summary": "Organize your video corpus using automatically generated topic folders, hook types, and creator tags.",
    "keywords": [
      "uoink feature",
      "faceted classification",
      "facet and tag organization",
      "organize",
      "corpus",
      "automatically",
      "generated"
    ],
    "whatItDoes": "Sort your captures without manual organization. The helper categorizes your markdown files using keyword rules and metadata attributes. It groups your corpus by channel name, duration, and hook type so you can filter your library in the dashboard. You can customize these sorting rules in your settings to match your folder preferences.",
    "gettingStarted": [
      "Open the Uoink dashboard and navigate to Settings.",
      "Define keyword triggers for your target categories.",
      "Capture a new video.",
      "Check the dashboard Library tab to see the facet filters.",
      "Select a channel or hook type facet to filter your card grid."
    ],
    "behindScenes": "When writing a corpus, the helper runs the metadata through a routing engine. It matches titles and descriptions against the keyword list in your settings. The helper writes the markdown file to the matching directory path. It also writes the tags and attributes to the local SQLite database to populate the sidebar filters in the dashboard UI.",
    "mcpTools": [
      "search_uoinks"
    ],
    "related": [
      "memory-search",
      "your-channel",
      "taste-anchors"
    ],
    "cta": "Configure your topic folders to keep your research library organized.",
    "screenshot": {
      "title": "Settings tab showing topic folder routing rules",
      "alt": "Settings tab showing topic folder routing rules",
      "src": "/screenshots/faceted-classification/hero-1280x800.png",
    }
  },
  {
    "slug": "your-channel",
    "title": "Your channel mode",
    "category": "Library",
    "status": "in flight",
    "summary": "Configure your own YouTube channel to analyze hook performance and audience patterns.",
    "keywords": [
      "uoink feature",
      "your channel",
      "your channel mode",
      "configure",
      "youtube",
      "channel",
      "analyze"
    ],
    "whatItDoes": "Analyze your own content performance. Set up Uoink with your YouTube channel handle to separate your uploads from your research library. The dashboard marks your videos and calculates hook distribution across your top performers. It helps you see which script structures and hook categories drive audience engagement on your channel.",
    "gettingStarted": [
      "Open settings in the Uoink dashboard.",
      "Locate the Your Channel configuration section.",
      "Paste your YouTube channel handle or ID.",
      "Click Verify to connect and fetch public channel metadata.",
      "View your channel analytics dashboard to study your hook performance."
    ],
    "behindScenes": "The helper queries the YouTube API using the verified channel ID to build a list of your uploads. It flags these videos in the local database. When you run a hook classification job, the helper aggregates the classification results for your channel. It renders the data in a local dashboard without transmitting metrics to external platforms.",
    "mcpTools": [
      "search_uoinks",
      "find_mentions"
    ],
    "related": [
      "faceted-classification",
      "resurface-for-you",
      "taste-anchors"
    ],
    "cta": "Connect your own YouTube channel to analyze your performance trends.",
    "screenshot": {
      "title": "Settings showing Your Channel configuration field",
      "alt": "Settings showing Your Channel configuration field",
      "src": "/screenshots/your-channel/hero-1280x800.png",
    }
  },
  {
    "slug": "resurface-for-you",
    "title": "Resurface for you",
    "category": "Library",
    "status": "planned",
    "summary": "Discover forgotten insights in your video library with personalized local resurfacing cards.",
    "keywords": [
      "uoink feature",
      "resurface for you",
      "discover",
      "forgotten",
      "insights",
      "library",
      "personalized"
    ],
    "whatItDoes": "Rediscover forgotten insights in your library. The For You tab displays past captures based on your research habits. It surfaces videos that you saved but have not opened recently, helping you find links between older files and current writing projects. The selection logic runs on your computer without tracking your reading habits.",
    "gettingStarted": [
      "Open the Uoink dashboard and click the For You tab.",
      "Browse the daily selection of resurfaced video cards.",
      "Review the summary of key concepts on each card.",
      "Click Open corpus to view the markdown file.",
      "Tap the shuffle icon to generate a new list."
    ],
    "behindScenes": "The helper executes a local query that examines file modification dates, search frequencies, and open counts in the SQLite database. It selects a mix of older, highly-rated captures and recent unread files. The dashboard renders these selections locally, protecting your research logs from being sent to external analytics tools.",
    "mcpTools": [
      "list_recent_uoinks",
      "search_uoinks"
    ],
    "related": [
      "engagement-memory",
      "taste-anchors",
      "memory-search"
    ],
    "cta": "Open the For You tab to bring older research back into your workflow.",
    "screenshot": {
      "title": "Dashboard showing the For You tab view",
      "alt": "Dashboard showing the For You tab view",
      "src": "/screenshots/resurface-for-you/hero-1280x800.png",
    }
  },
  {
    "slug": "engagement-memory",
    "title": "Engagement memory",
    "category": "Library",
    "status": "planned",
    "summary": "Track which videos you reference most to build a durable local knowledge base.",
    "keywords": [
      "uoink feature",
      "engagement memory",
      "videos",
      "reference",
      "durable",
      "knowledge"
    ],
    "whatItDoes": "Keep track of the research that you use. Uoink monitors when you copy a transcript, export a citation, or search for specific video files. It updates the database to rank your captures by utility. The helper uses these engagement signals to improve your local search results and highlight your most valuable research assets.",
    "gettingStarted": [
      "Use Uoink to copy transcripts and cite videos.",
      "Open the dashboard Activity tab to view your engagement log.",
      "Sort your library by Most referenced in the dashboard.",
      "View the videos that have driven your writing.",
      "Configure retention rules for tracking logs in settings."
    ],
    "behindScenes": "The desktop helper logs actions like clipboard copy events, citation exports, and search clicks into the SQLite database. It calculates a utility score for each video using a decay algorithm. This score influences local search ranking and resurfacing recommendations. Your activity data is stored in the local index file, maintaining privacy.",
    "mcpTools": [
      "analyze_comments",
      "find_mentions"
    ],
    "related": [
      "resurface-for-you",
      "memory-search",
      "taste-anchors"
    ],
    "cta": "Let your research habits organize your most referenced video captures.",
    "screenshot": {
      "title": "Activity tab showing engagement history and action logs",
      "alt": "Activity tab showing engagement history and action logs",
      "src": "/screenshots/engagement-memory/hero-1280x800.png",
    }
  },
  {
    "slug": "taste-anchors",
    "title": "Taste anchors calibration",
    "category": "Library",
    "status": "in flight",
    "summary": "Calibrate your local memory layer by selecting reference videos that define your research taste.",
    "keywords": [
      "uoink feature",
      "taste anchors",
      "taste anchors calibration",
      "calibrate",
      "memory",
      "selecting",
      "reference"
    ],
    "whatItDoes": "Calibrate your local memory layer. You select a set of reference videos that define your research interests or script style. The helper uses these taste anchors to guide search weights and highlight relevant patterns in new captures. It helps align recommendations with your creative style without sharing your personal preferences with external services.",
    "gettingStarted": [
      "Open a video card in the dashboard.",
      "Click the star icon to designate it as a Taste Anchor.",
      "Open your settings to review active Taste Anchors.",
      "Toggle anchors on or off depending on your current project.",
      "Observe how search highlights adapt to your selections."
    ],
    "behindScenes": "The helper stores Taste Anchor selections in a local configurations table. When calculating relevance for search queries and recommendations, it applies a multiplier to documents matching the topic nodes of your anchors. This calculation runs on your GPU or CPU, ensuring your taste profile stays private. No analytics tags or profiles are sent online.",
    "mcpTools": [
      "add_style_anchor",
      "list_style_anchors"
    ],
    "related": [
      "engagement-memory",
      "resurface-for-you",
      "faceted-classification"
    ],
    "cta": "Set your taste anchors to customize your local search weights.",
    "screenshot": {
      "title": "Card view showing star icon highlighted",
      "alt": "Card view showing star icon highlighted",
    }
  },
  {
    "slug": "build-workspace",
    "title": "Workspace assembly",
    "category": "Workspace",
    "status": "in flight",
    "summary": "Assemble a local markdown corpus from multiple video sources for a project workspace.",
    "keywords": [
      "uoink feature",
      "build workspace",
      "workspace assembly",
      "assemble",
      "markdown",
      "corpus",
      "multiple"
    ],
    "whatItDoes": "Build a workspace for your writing projects. You select multiple captures from your library and group them into a workspace folder. The helper compiles transcripts, comments, and citation anchors into one project corpus. This organizes your source material, making it easy to paste into Claude or open in Obsidian.",
    "gettingStarted": [
      "Open the Build Workspace tab in the dashboard.",
      "Select the video cards you want to include.",
      "Click Assemble Workspace to compile the sources.",
      "Name your workspace folder.",
      "Open the folder to view the compiled markdown corpus."
    ],
    "behindScenes": "The helper reads the selected document files from your local storage. It extracts the content blocks and references, merging them into a unified project file. The helper writes the compiled file to a project directory under your Uoink path, updating the SQLite index to track the relationship between source documents and the new workspace.",
    "mcpTools": [
      "build_workspace",
      "search_uoinks"
    ],
    "related": [
      "critique-corpus",
      "script-studio",
      "writing-studio"
    ],
    "cta": "Assemble your references into a clean workspace to start your next project.",
    "screenshot": {
      "title": "Build Workspace tab showing source selection columns",
      "alt": "Build Workspace tab showing source selection columns",
      "src": "/screenshots/build-workspace/hero-1280x800.png",
    }
  },
  {
    "slug": "critique-corpus",
    "title": "Corpus analysis critique",
    "category": "Workspace",
    "status": "in flight",
    "summary": "Run structured critiques on your draft against a local video and article corpus.",
    "keywords": [
      "uoink feature",
      "critique corpus",
      "corpus analysis critique",
      "structured",
      "critiques",
      "against",
      "article"
    ],
    "whatItDoes": "Evaluate your script drafts against your research corpus. You load a draft and compare it against your saved video transcripts. The helper checks your text for factual discrepancies and identifies where you missed key source details. This helps you maintain accuracy and strong evidence before you publish your work.",
    "gettingStarted": [
      "Navigate to the Critique tab in the dashboard.",
      "Paste your draft text into the editor.",
      "Select the reference corpus files from the list.",
      "Click Analyze Draft to run the critique.",
      "Review the highlighted corrections and source links."
    ],
    "behindScenes": "The helper uses your API key to send the draft and selected reference corpus files to the model. It directs the model to perform a factual comparison and return structured annotations. The helper parses the response, highlights discrepancies in the UI, and maps comments back to specific timestamps in the source file.",
    "mcpTools": [
      "critique_corpus",
      "get_citation_map"
    ],
    "related": [
      "build-workspace",
      "evidence-panel",
      "script-studio"
    ],
    "cta": "Compare your draft against your corpus to verify your facts before publishing.",
    "screenshot": {
      "title": "Critique tab showing draft upload field and corpus selector",
      "alt": "Critique tab showing draft upload field and corpus selector",
      "src": "/screenshots/critique-corpus/hero-1280x800.png",
    }
  },
  {
    "slug": "script-studio",
    "title": "Script studio workspace",
    "category": "Workspace",
    "status": "in flight",
    "summary": "Generate, revise, and outline video scripts grounded in your local markdown corpus.",
    "keywords": [
      "uoink feature",
      "script studio",
      "script studio workspace",
      "generate",
      "revise",
      "outline",
      "scripts"
    ],
    "whatItDoes": "Draft scripts backed by your research files. Script Studio helps you outline and write video scripts using your captured library. It pulls outlines, quotes, and formatting templates from your saved corpus files, inserting citation anchors. You write with the support of your reference database, avoiding generic scripts.",
    "gettingStarted": [
      "Open the Script Studio tab in the dashboard.",
      "Select the source files from the sidebar.",
      "Choose a template or paste an outline.",
      "Click Generate Script Draft.",
      "Review the script and the cited source quotes."
    ],
    "behindScenes": "The helper loads the selected corpus files and outline templates. It formats the prompt with the reference text and calls the model via the API. The model generates the script draft, linking quotes to specific source segments. The helper saves the draft to your workspace folder and updates the local project index.",
    "mcpTools": [
      "generate_script",
      "get_uoink_corpus"
    ],
    "related": [
      "build-workspace",
      "writing-studio",
      "style-anchors"
    ],
    "cta": "Open Script Studio to draft scripts directly connected to your research files.",
    "screenshot": {
      "title": "Script Studio showing script editor and source panel",
      "alt": "Script Studio showing script editor and source panel",
      "src": "/screenshots/script-studio/hero-1280x800.png",
    }
  },
  {
    "slug": "writing-studio",
    "title": "Writing studio tool",
    "category": "Workspace",
    "status": "in flight",
    "summary": "Generate tweets, threads, and blog posts grounded in your captured video corpus.",
    "keywords": [
      "uoink feature",
      "writing studio",
      "writing studio tool",
      "generate",
      "tweets",
      "threads",
      "grounded"
    ],
    "whatItDoes": "Turn captured videos into short-form writing. The Writing Studio generates tweets, threads, and blog articles directly from your saved files. It references the source transcript to keep your summaries factual. Every draft includes a citation referencing the creator and the source link, helping you credit authors when sharing.",
    "gettingStarted": [
      "Open the Writing Studio tab in your dashboard.",
      "Select a video from your library to use as the source.",
      "Choose your output mode: Tweet, Thread, or Blog.",
      "Select your style mode and anchors.",
      "Click Generate to write the draft."
    ],
    "behindScenes": "The helper formats a request with the source corpus text and sends it to the model. It directs the model to extract key ideas and write the draft. When Voice DNA checks are enabled, the helper runs a scan across the output, returning warnings in the UI if it spots banned slop patterns before you copy.",
    "mcpTools": [
      "write_tweet",
      "write_blog"
    ],
    "related": [
      "script-studio",
      "style-anchors",
      "byo-anthropic-key"
    ],
    "cta": "Use the Writing Studio to summarize videos and podcasts for your social feed.",
    "screenshot": {
      "title": "Writing Studio tab showing layout and options",
      "alt": "Writing Studio tab showing layout and options",
      "src": "/screenshots/writing-studio/hero-1280x800.png",
    }
  },
  {
    "slug": "style-anchors",
    "title": "Style anchor management",
    "category": "Workspace",
    "status": "in flight",
    "summary": "Import and manage style anchors from Substack or text to guide AI voice tone.",
    "keywords": [
      "uoink feature",
      "style anchors",
      "style anchor management",
      "import",
      "manage",
      "anchors",
      "substack"
    ],
    "whatItDoes": "Train the helper on your voice. You add and manage up to ten style anchors using Substack URLs or raw text files. The helper analyzes these references to guide the tone of your generated scripts and posts. This keeps your output matching your personal writing style, avoiding generic AI marketing phrasing.",
    "gettingStarted": [
      "Open the Writing tab and look for the Style Anchors section.",
      "Click Add Anchor to open the form.",
      "Paste a Substack URL or type a text sample.",
      "View the extracted prose preview and click Save.",
      "Toggle active status for your anchors before generating a draft."
    ],
    "behindScenes": "When you provide a Substack URL, the helper fetches the page content using the local crawler. It strips HTML to extract your prose style and saves it locally. When generating drafts, the helper includes these style anchors in the prompt, directing the model to analyze and match your writing patterns.",
    "mcpTools": [
      "add_style_anchor",
      "list_style_anchors",
      "remove_style_anchor"
    ],
    "related": [
      "writing-studio",
      "taste-anchors",
      "byo-anthropic-key"
    ],
    "cta": "Add your style anchors to ensure your AI assistant matches your tone.",
    "screenshot": {
      "title": "Settings panel showing style anchors management list",
      "alt": "Settings panel showing style anchors management list",
      "src": "/screenshots/style-anchors/hero-1280x800.png",
    }
  },
  {
    "slug": "claim-extraction",
    "title": "Claim extraction tool",
    "category": "Verification",
    "status": "in flight",
    "summary": "Extract factual claims from transcripts to audit evidence and source references.",
    "keywords": [
      "uoink feature",
      "claim extraction",
      "claim extraction tool",
      "extract",
      "factual",
      "claims",
      "transcripts"
    ],
    "whatItDoes": "Extract factual claims from transcripts automatically. The helper scans the video text to isolate assertions, figures, and research references. It lists these claims with timestamp links, making it easy to verify statement accuracy. This helps researchers audit content without reading the entire transcript manually.",
    "gettingStarted": [
      "Open a video in the Uoink dashboard.",
      "Navigate to the Claims tab.",
      "Click Extract Claims to analyze the transcript.",
      "Review the list of isolated assertions and metrics.",
      "Click any claim timestamp to play the video segment."
    ],
    "behindScenes": "The helper uses the API key to send the transcript to the model. It instructs the model to extract and categorize claims into a structured list. The helper parses this output, maps each claim back to its segment offset, and writes the results to the markdown file header, ensuring the facts remain linked.",
    "mcpTools": [
      "extract_claims",
      "get_citation_map"
    ],
    "related": [
      "evidence-panel",
      "critique-corpus",
      "faceted-classification"
    ],
    "cta": "Extract claims from your video library to verify source facts.",
    "screenshot": {
      "title": "Card view showing Claims tab layout",
      "alt": "Card view showing Claims tab layout",
      "src": "/screenshots/claim-extraction/hero-1280x800.png",
    }
  },
  {
    "slug": "evidence-panel",
    "title": "Evidence and citation panel",
    "category": "Verification",
    "status": "in flight",
    "summary": "View supporting evidence and source citations for claims in your corpus.",
    "keywords": [
      "uoink feature",
      "evidence panel",
      "evidence and citation panel",
      "supporting",
      "evidence",
      "source",
      "citations"
    ],
    "whatItDoes": "Trace claims back to their source material. The evidence panel displays the transcripts, comments, and screenshot frames that back up each claim. It helps you verify assertions by linking them to specific timestamps and media files. This keeps your research grounded, making it easy to cite original sources.",
    "gettingStarted": [
      "Open the Evidence panel in your workspace.",
      "Select a claim from the project list.",
      "View the supporting transcript segments and screenshots.",
      "Click the link to open the source video at that moment.",
      "Export the citation to your notes or editor."
    ],
    "behindScenes": "The helper uses the SQLite database to query matches between claims and source transcript segments. It maps the results to media timestamps and writes the output as citation anchors. The dashboard reads these anchors to display the source context and media frames, ensuring that references remain verifiable.",
    "mcpTools": [
      "get_citation_map",
      "get_uoink_corpus"
    ],
    "related": [
      "claim-extraction",
      "critique-corpus",
      "mcp-server"
    ],
    "cta": "Use the evidence panel to review the references supporting your notes.",
    "screenshot": {
      "title": "Workspace view showing Evidence panel sidebar",
      "alt": "Workspace view showing Evidence panel sidebar",
      "src": "/screenshots/evidence-panel/hero-1280x800.png",
    }
  },
  {
    "slug": "mcp-server",
    "title": "Model Context Protocol server",
    "category": "Distribution",
    "status": "shipped",
    "summary": "Turn Uoink into a local MCP server to give Claude and Cursor tools for video capture.",
    "keywords": [
      "uoink feature",
      "mcp server",
      "model context protocol server",
      "server",
      "claude",
      "cursor",
      "capture"
    ],
    "whatItDoes": "Give your AI tools access to video data. The local helper runs an MCP server that exposes the local corpus to your AI clients. Your agent can capture videos, query your library, analyze comments, and pull citations without clipboard steps. The server runs on localhost, keeping your research database private.",
    "gettingStarted": [
      "Install the Uoink helper on your machine.",
      "Open the setup page to get the command path.",
      "Add the server to your AI client configuration.",
      "Start the client and verify the connection.",
      "Ask the agent to capture a video to test the setup."
    ],
    "behindScenes": "The helper runs a loopback server on port 5179 that implements the Model Context Protocol. It handles stdio transport for client connections. When an agent calls a tool, the helper executes the command, reads the local SQLite database, and returns the response in a structured JSON format, keeping everything on your local machine.",
    "mcpTools": [
      "uoink_video",
      "search_uoinks",
      "get_uoink_corpus"
    ],
    "mcpExample": "{\n  \"name\": \"uoink_video\",\n  \"arguments\": {\n    \"url\": \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\"\n  }\n}",
    "related": [
      "claude-desktop-integration",
      "cursor-integration",
      "local-first"
    ],
    "cta": "Connect Uoink to your AI clients to enable video and transcript tools.",
    "screenshot": {
      "title": "Setup page displaying generated MCP command",
      "alt": "Setup page displaying generated MCP command",
      "src": "/screenshots/mcp-server/hero-1280x800.png",
    }
  },
  {
    "slug": "claude-desktop-integration",
    "title": "Claude Desktop MCP integration",
    "category": "Distribution",
    "status": "shipped",
    "summary": "Connect Uoink to Claude Desktop to let Claude capture and search video files.",
    "keywords": [
      "uoink feature",
      "claude desktop integration",
      "claude desktop mcp integration",
      "connect",
      "claude",
      "desktop",
      "capture"
    ],
    "whatItDoes": "Connect Uoink to Claude Desktop. By adding the helper command to your configuration file, you give Claude tools to capture videos and query your local library. Claude can pull transcripts, read comment clusters, and cite timestamps directly in your chat sessions. The connection runs locally on your computer.",
    "gettingStarted": [
      "Open your Claude Desktop configuration file.",
      "Add the Uoink server snippet to the configuration.",
      "Save the file and restart Claude Desktop.",
      "Look for the tool hammer icon in the input bar.",
      "Prompt Claude to summarize a YouTube URL."
    ],
    "behindScenes": "Claude Desktop starts the helper as a background process using the command path in your configuration. It establishes communication via stdio JSON-RPC. When you prompt Claude about a video, the model calls the uoink_video tool, and the helper executes the task locally, returning the text directly to the active chat.",
    "mcpTools": [
      "uoink_video",
      "classify_hook",
      "write_blog"
    ],
    "mcpExample": "{\n  \"mcpServers\": {\n    \"uoink\": {\n      \"command\": \"C:\\\\Users\\\\hello\\\\AppData\\\\Local\\\\Uoink\\\\uoink_mcp.exe\",\n      \"args\": []\n    }\n  }\n}",
    "related": [
      "mcp-server",
      "cursor-integration",
      "local-first"
    ],
    "cta": "Connect Claude Desktop to your local helper to query transcripts directly.",
    "screenshot": {
      "title": "VS Code showing claude_desktop_config.json",
      "alt": "VS Code showing claude_desktop_config.json",
      "src": "/screenshots/claude-desktop-integration/hero-1280x800.png",
    }
  },
  {
    "slug": "cursor-integration",
    "title": "Cursor MCP integration",
    "category": "Distribution",
    "status": "shipped",
    "summary": "Add Uoink to Cursor to search and reference your video corpus inside your editor.",
    "keywords": [
      "uoink feature",
      "cursor integration",
      "cursor mcp integration",
      "cursor",
      "search",
      "reference",
      "corpus"
    ],
    "whatItDoes": "Bring your video corpus into Cursor. Register the helper as an MCP server to reference transcripts and documentation directly in your editor. You can prompt Cursor to write code matching a video walkthrough, citing sources as you write. Everything runs on your machine, protecting your workspace.",
    "gettingStarted": [
      "Open Settings in Cursor.",
      "Navigate to features and select MCP.",
      "Click Add New MCP Server.",
      "Paste the Uoink command path.",
      "Ask Cursor's chat panel to search your library."
    ],
    "behindScenes": "Cursor runs the helper binary as a subprocess and establishes stdio communication. When you prompt Cursor about your code, the editor calls uoink_tools to search your transcripts or read specific corpus files. The helper queries SQLite and returns the markdown text to the editor context, ensuring fast local search.",
    "mcpTools": [
      "search_uoinks",
      "build_workspace",
      "get_uoink_corpus"
    ],
    "mcpExample": "{\n  \"name\": \"search_uoinks\",\n  \"arguments\": {\n    \"query\": \"Model Context Protocol\"\n  }\n}",
    "related": [
      "mcp-server",
      "claude-desktop-integration",
      "local-first"
    ],
    "cta": "Configure Cursor to query your transcript corpus directly from the editor.",
    "screenshot": {
      "title": "Cursor settings panel showing MCP server list",
      "alt": "Cursor settings panel showing MCP server list",
      "src": "/screenshots/cursor-integration/hero-1280x800.png",
    }
  },
  {
    "slug": "byo-anthropic-key",
    "title": "Bring your own API key",
    "category": "Identity",
    "status": "shipped",
    "summary": "Use your own Anthropic API key to run Hook Type and Comment Intelligence passes.",
    "keywords": [
      "uoink feature",
      "byo anthropic key",
      "bring your own api key",
      "anthropic",
      "comment",
      "intelligence",
      "passes"
    ],
    "whatItDoes": "Control your AI costs and data. Uoink uses your own Anthropic API key to run Hook Type, Comment clusters, and Entity extraction passes. Your key is stored in your operating system credential vault, never on our servers. You pay Anthropic for the tokens you use, keeping the helper free of subscriptions.",
    "gettingStarted": [
      "Open your Anthropic developer console.",
      "Generate a new API key.",
      "Open the Uoink dashboard settings.",
      "Paste your API key into the field.",
      "Click Save to store the key in the OS vault."
    ],
    "behindScenes": "The helper uses the python keyring library to store your API key in the OS vault. On Windows, it calls the Credential Manager APIs. When running an AI analysis, the helper retrieves the key, calls the Anthropic endpoint directly, and writes the output. The key never touches Uoink servers.",
    "mcpTools": [
      "classify_hook",
      "analyze_comments",
      "write_blog"
    ],
    "related": [
      "local-first",
      "no-cloud",
      "writing-studio"
    ],
    "cta": "Add your API key to activate local hook and comment analysis.",
    "screenshot": {
      "title": "Settings showing API Key configuration section",
      "alt": "Settings showing API Key configuration section",
      "src": "/screenshots/byo-anthropic-key/hero-1280x800.png",
    }
  },
  {
    "slug": "local-first",
    "title": "Local-first architecture",
    "category": "Identity",
    "status": "shipped",
    "summary": "Save transcripts, comments, and databases to your local drive for private research.",
    "keywords": [
      "uoink feature",
      "local first",
      "local-first architecture",
      "transcripts",
      "comments",
      "databases",
      "private"
    ],
    "whatItDoes": "Your research belongs on your machine. Uoink uses a local-first architecture where transcripts, databases, and configuration files live on your computer. The helper runs on localhost, and your files write to your local drive. You can browse, edit, and back up your library without depending on external web platforms.",
    "gettingStarted": [
      "Install the desktop helper.",
      "Open the dashboard and check the library path.",
      "Open File Explorer to see your corpus folders.",
      "Open any markdown file in your text editor.",
      "Backup your library by copying the folder."
    ],
    "behindScenes": "The desktop helper runs an internal server that reads and writes files on your storage drive. It logs transactions in a local SQLite file. The browser extension speaks to this helper via a loopback port. No external tracking scripts, cloud servers, or remote databases are used, maintaining privacy.",
    "mcpTools": [
      "get_uoink_health",
      "search_uoinks"
    ],
    "related": [
      "no-cloud",
      "byo-anthropic-key",
      "memory-search"
    ],
    "cta": "Install the helper and start building a private local library.",
    "screenshot": {
      "title": "Settings panel showing default library folder path",
      "alt": "Settings panel showing default library folder path",
      "src": "/screenshots/local-first/hero-1280x800.png",
    }
  },
  {
    "slug": "no-cloud",
    "title": "No cloud database",
    "category": "Identity",
    "status": "shipped",
    "summary": "Keep your video corpus and research private with no cloud databases or remote servers.",
    "keywords": [
      "uoink feature",
      "no cloud",
      "no cloud database",
      "corpus",
      "research",
      "private",
      "databases"
    ],
    "whatItDoes": "No Uoink cloud database. The helper runs entirely on your local machine, keeping your captured transcripts and files offline. There is no account sign-up, no server database, and no usage tracking. If our website is breached, your research database is safe because we avoid collect your files.",
    "gettingStarted": [
      "Download the helper without creating an account.",
      "Open the dashboard to see your local files.",
      "Check your network settings to verify loopback connections.",
      "Turn off your internet connection.",
      "Run a search across your library to test the offline index."
    ],
    "behindScenes": "The helper binds to port 5179 on the loopback interface, meaning it only accepts requests from your own machine. It stores all indexed text in a local SQLite database file. Since there is no cloud database or syncing mechanism, your data remains offline and under your direct control.",
    "mcpTools": [
      "get_uoink_health"
    ],
    "related": [
      "local-first",
      "byo-anthropic-key",
      "memory-search"
    ],
    "cta": "Store your transcripts and search databases offline without cloud accounts.",
    "screenshot": {
      "title": "Uoink dashboard Library tab showing offline cards",
      "alt": "Uoink dashboard Library tab showing offline cards",
      "src": "/screenshots/no-cloud/hero-1280x800.png",
    }
  }
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

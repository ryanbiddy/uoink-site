# Surface Map: Developer Documentation Page (`/developers`)

This surface map explains the controls, data flow, and endpoints documented on the `/developers` page.

## Overview
The `/developers` page is the primary integration guide for AI agents, developers, and power users seeking to connect Uoink's local helper to their agent clients (such as Claude Desktop, Cursor, Cline, Continue) or write custom scripts.

## Documented Interfaces & Configurations

### 1. Stdio Transport (Subprocess)
- **Mechanism**: The agent client spawns a Python subprocess executing Uoink's stdio adapter.
- **Config Command**: `C:\Users\YOUR_USERNAME\AppData\Local\Uoink\python\python.exe`
- **Config Args**: `["C:\Users\YOUR_USERNAME\AppData\Local\Uoink\uoink_mcp.py"]`
- **Clients**: Claude Desktop, Cursor, Cline, Continue.

### 2. HTTP (SSE) Transport
- **Mechanism**: Standard Model Context Protocol Server-Sent Events (SSE) loopback transport.
- **Endpoint**: `http://localhost:5179/mcp/v1`
- **Port**: `5179`
- **Headers**:
  - `X-Uoink-Token`: Required for authentication on all HTTP endpoints.
- **Token Storage**: Path `%LOCALAPPDATA%\Uoink\token.txt` (or `~/Library/Application Support/Uoink/token.txt` on macOS).

---

## Tool Catalog Layout
The page houses a categorized accordion listing all **64 tools** exposed by the helper. Each category maps to its underlying helper modules:
1. **Core stdio tools**: Basic capture (`uoink_video`), search, citations, and health.
2. **Library, role, and live status**: local settings and channel filters.
3. **Podcast and mobile bridge**: RSS feeds and background listeners.
4. **Memory, facets, and workspace assembly**: SQLite curation and topic connections.
5. **Claims, scripts, and Writing Studio**: content creation and voice anchors.
6. **Universal page and thread capture**: Reddit and X extraction.

---

## Data Flow & Routes Consumed
- **Client → Local Server**: Client sends JSON-RPC messages (via stdio pipe or HTTP POST).
- **Local Server → Disk/DB**: Helper checks the API token, performs extraction (via `yt-dlp` or scraper modules), queries the local SQLite `index.db`, and persists results to the local workspace folder.

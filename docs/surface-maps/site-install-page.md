# Surface Map: Uoink Install Page

This document describes the structure, styling, layout, and user flows of the Uoink install page (`/install`).

## 1. Overview
The install page guides users through setting up the local desktop helper and browser extension. It emphasizes the primary desktop installer download, displays sideload steps above the fold, and outlines the manual installation process for various Chromium browsers.

## 2. Layout and Sections

### 2.1 Hero Section (`install / hero`)
- **Headline**: Brand-styled title "Install Uoink."
- **Primary CTA**: Windows helper installer download button.
- **SmartScreen Note**: Footnote directly below the download button, warning the user about Windows defender / "More info" flag on unrecognized early builds.
- **Sideload Ledger (Mono CSS box)**: A 3-step action-oriented mono status ledger visible on the right on desktop, outlining:
  1. Helper installer execution.
  2. Browser extension sideloading from the helper folder.
  3. Clicking Uoink to capture threads/videos.

### 2.2 Sideload Steps (`install / steps`)
- Contains detailed cards walking the user through Chromium extension sideloading:
  1. **Helper setup**: Places local loopback helper under `%LOCALAPPDATA%\Uoink`.
  2. **Extension load**: Manual instructions targeting Chrome (`chrome://extensions`), Edge (`edge://extensions`), and Brave (`brave://extensions`) at a minimum. Instructs the user to enable **Developer mode** and click **Load unpacked**, pointing to the `%LOCALAPPDATA%\Uoink\extension` folder.
  3. **Capture**: Details how the button appears on YouTube/Reddit to save to local files.

### 2.3 Platforms (`install / platforms`)
- Displays cards detailing support status:
  - **Windows**: Details the local helper, bundled tools (Python, yt-dlp, ffmpeg, SQLite), and localhost port `5179`.
  - **Extension**: Explains local communication and list of Chromium-supported browsers: Chrome, Edge, Brave, Vivaldi, Arc, and Opera GX. Lists CWS pending review status.
  - **Mac**: Mac development status.

### 2.3b Post-install (`install / post install`)
- After the section head, a framed product screenshot (`/product/hero-library.webp`, the real dashboard library) shows what the local app looks like once the helper is running, followed by the three post-install cards (tray status, local files, AI handoff). The screenshot uses the shared `.feature-visual` / `.product-figure` frame, `loading="lazy"`, and explicit width/height (1440x900) to avoid layout shift.

### 2.4 FAQ (`install / faq`)
- Troubleshooting questions regarding OS support, admin privileges, browsers, and local-first architecture details.

## 3. Responsive Styling
- **Breakpoints**: Collapses to single-column stacking layout at `max-width: 768px` for tablet compatibility.
- **Grid Layout**: Redundant inline styles are removed from `.three-cards` grids to let the global CSS classes drive styling and clean stacking.

## 4. Rendering Notes
- **Full-page capture (IN-09)**: `globals.css` no longer applies `content-visibility: auto` to non-hero sections, big-strips, and the footer. That optimization skipped rendering off-screen sections, which was fine while scrolling but left them blank in any non-interactive rasterization (full-page screenshots, print to PDF, link-preview bots) as long black voids. Full-page captures of `/install` now render the FAQ, CTA, and footer instead of a void. This is a global CSS change; every page benefits.

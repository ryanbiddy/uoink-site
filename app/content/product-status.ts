import release from "../../content/release.json";

// Everything the site says about Mac availability. Pages read PRODUCT_STATUS.mac.
// 3.11.2 is the first release with a Mac build: a preview for Apple Silicon on
// macOS 15 or later. The app and DMG are signed with a Developer ID, notarized and
// stapled. Intel Macs are not supported. Facts come from the product's
// docs/mac/INSTALL.md, docs/privacy-policy.md and CHANGELOG.md.
const RELEASE_DOWNLOADS = `https://github.com/ryanbiddy/uoink/releases/download/v${release.version}`;
export const MAC_DMG_NAME = `Uoink-${release.version}-macos-arm64.dmg`;
export const MAC_DMG_URL = `${RELEASE_DOWNLOADS}/${MAC_DMG_NAME}`;
export const MAC_MCPB_NAME = `uoink-${release.version}-macos.mcpb`;
export const MAC_MCPB_URL = `${RELEASE_DOWNLOADS}/${MAC_MCPB_NAME}`;
export const MAC_EXTENSION_PATH = "~/Library/Application Support/Uoink/extension";
export const MAC_PREVIEW_STATUS = "Mac preview for Apple Silicon (macOS 15 or later)";

export type MacStatus = {
  available: boolean;
  visible: string; // one-line platform summary: home, install FAQ, MCP page, NotebookLM comparison, crawler text
  heading: string;
  windowsLabel: string; // install hero line under the Windows download
  aboutPlatform: string;
  aboutNote: string;
  operatingSystem: string; // schema.org SoftwareApplication.operatingSystem
  heroLink: string; // HTML: install hero
  installSteps: string; // HTML: install page Mac entry
  agentSetup: string; // HTML: shared agent setup (developers and MCP pages)
  changelog: string; // HTML: Mac paragraphs at the top of the 3.11.2 changelog entry, the Mac preview's first release
};

export const PRODUCT_STATUS: { mac: MacStatus } = {
  mac: {
    available: true,
    visible: `Windows 10/11, plus a ${MAC_PREVIEW_STATUS}.`,
    heading: "Mac preview.",
    windowsLabel: "Windows 10/11",
    aboutPlatform: "Windows 10/11 and Mac",
    aboutNote: "Mac preview: Apple Silicon, macOS 15 or later",
    operatingSystem: "Windows 10, Windows 11, macOS 15 or later (Apple Silicon)",
    heroLink: `<p class="footnote">On a Mac? <a href="${MAC_DMG_URL}">Download the Mac preview</a> for Apple Silicon (macOS 15 or later), then follow the <a href="#mac">Mac steps</a>.</p>`,
    installSteps: `<p class="doc-ver">Apple Silicon / macOS 15 or later / ${MAC_DMG_NAME}</p>
          <p>The Mac build runs on Apple Silicon Macs with macOS 15 or later. Intel Macs are not supported. The app and the DMG are signed with a Developer ID, notarized by Apple and stapled, so macOS asks only its standard question about apps downloaded from the internet. No security override is needed.</p>
          <ol class="steps">
            <li>Download <a href="${MAC_DMG_URL}">${MAC_DMG_NAME}</a>. The release page lists its SHA-256.</li>
            <li>Open the DMG and drag Uoink to the Applications shortcut.</li>
            <li>Eject the mounted disk, then open Uoink from Applications and confirm the "downloaded from the internet" prompt.</li>
            <li>Load the extension. Open Uoink once so it creates the extension folder. In Chrome, open <code>chrome://extensions</code>, turn on <strong>Developer mode</strong> and click <strong>Load unpacked</strong>. The picker hides <code>~/Library</code>, so press ⌘⇧G, paste the path that the dashboard's <strong>Get the extension</strong> card copies (<code>${MAC_EXTENSION_PATH}</code>) and press Return.</li>
            <li>Click the puzzle-piece Extensions icon in the toolbar and pin Uoink so the Uoink button stays visible.</li>
          </ol>
          <p>If macOS reports an unidentified developer, a damaged app or malware instead, don't open it. Report it with the DMG's SHA-256.</p>
          <p>For Claude Desktop, open <a href="${MAC_MCPB_URL}">${MAC_MCPB_NAME}</a> from the same release, not the Windows bundle, and select the installed Uoink.app in its Uoink app setting. For other AI clients, run <code>uoink connect &lt;client&gt;</code>; see <a href="/developers">agent setup</a>.</p>
          <p>Not on the Mac yet: Uoink doesn't update itself, so quit Uoink and close MCP clients before replacing the app with a new version. Library mirroring is unavailable. macOS still credits Uoink's alerts to Script Editor.</p>
          <a class="btn primary small" href="${MAC_DMG_URL}">Download for Mac -></a>`,
    agentSetup: `<h3>On a Mac</h3>
<p>The Mac preview runs on Apple Silicon with macOS 15 or later. The <code>uoink</code> command ships inside the app at <code>Uoink.app/Contents/Helpers/uoink</code>, and the app does not change your shell or PATH. To run it from a terminal, link it into a folder on your PATH:</p>
<pre class="code-block">mkdir -p "$HOME/.local/bin"
ln -s /Applications/Uoink.app/Contents/Helpers/uoink "$HOME/.local/bin/uoink"
export PATH="$HOME/.local/bin:$PATH"
uoink status</pre>
<p>Then run <code>uoink connect &lt;client&gt;</code>, for example <code>uoink connect claude-code</code>, <code>uoink connect cursor</code> or <code>uoink connect codex</code>. The recipe uses the app's current location, works with spaces in the path, and does not edit client files. Back up the client's configuration, merge the printed entry and keep unrelated entries: Claude Desktop uses <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>, Cursor <code>~/.cursor/mcp.json</code> and Codex <code>~/.codex/config.toml</code>. Restart the client after editing.</p>
<p>For Claude Desktop's extension flow, open <a href="${MAC_MCPB_URL}">${MAC_MCPB_NAME}</a> and select the installed Uoink.app in its Uoink app setting. The default is <code>/Applications/Uoink.app</code>. Use this Mac bundle, not the Windows <code>.mcpb</code>.</p>
<p>The Claude Code plugin's MCP entry is still for Windows. On a Mac, use <code>uoink connect claude-code</code> and the standalone skill. Library mirroring is unavailable on Mac. The tool inventory matches Windows: 91 tools, or 35 in core mode. On a Mac, Claude Code passed MCP acceptance (3.11.2); other clients are untested there.</p>`,
    changelog: `<p>Uoink now has a Mac preview for Apple Silicon on macOS 15 or later. Download <a href="${MAC_DMG_URL}">${MAC_DMG_NAME}</a>, drag Uoink to Applications, eject the disk and open it. The app and the DMG are signed with a Developer ID and notarized by Apple, with tickets stapled, so Uoink opens after macOS's standard "downloaded from the internet" prompt with no security override. Intel Macs are not supported. See the <a href="/install#mac">Mac install steps</a>.</p>
<p>On a Mac, the dashboard's <strong>Get the extension</strong> card shows the extension folder, and <strong>Open extension folder</strong> reveals it in Finder and copies the path. Chrome's <strong>Load unpacked</strong> picker hides <code>~/Library</code>, so press ⌘⇧G and paste it. Opening Uoink.app while Uoink is running shows the dashboard, and the dashboard and setup splash open on the display under the pointer. Claude Desktop uses the Mac bundle, <a href="${MAC_MCPB_URL}">${MAC_MCPB_NAME}</a>; other clients use <code>uoink connect &lt;client&gt;</code>.</p>
<p>Not on the Mac yet: Uoink doesn't update itself, and library mirroring is unavailable. A notifier app of Uoink's own is planned for 3.12; until then macOS credits Uoink's alerts to Script Editor.</p>`,
  },
};

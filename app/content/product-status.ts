// Everything the site says about Mac availability. Pages read PRODUCT_STATUS.mac;
// the first object is the copy shown when no Mac build ships.
export type MacStatus = {
  available: boolean;
  visible: string; // one-line platform summary: home, install FAQ, MCP page, NotebookLM comparison
  label: string; // status chip on the Mac entries
  heading: string;
  tech: string; // line under the Mac heading
  detail: string;
  footnote: string; // install page Mac entry
  linkLabel: string; // home page link to /install#mac
  windowsLabel: string; // install hero line under the Windows download
  aboutPlatform: string;
  aboutNote: string;
  heroLink: string; // HTML: install hero
  installSteps: string; // HTML: install page Mac entry
  agentSetup: string; // HTML: shared agent setup (developers and MCP pages)
  changelog: string; // HTML: newest changelog entry
};

export const PRODUCT_STATUS: { mac: MacStatus } = {
  mac: {
    available: false,
    visible: "Windows 10/11 only. No Mac build scheduled.",
    label: "not available",
    heading: "No Mac build scheduled.",
    tech: "Windows 10/11 only",
    detail: "There is no Mac installer or scheduled Mac release.",
    footnote: "Windows 10/11 only",
    linkLabel: "Mac status ->",
    windowsLabel: "Windows 10/11 only",
    aboutPlatform: "Windows 10/11 only",
    aboutNote: "no Mac build scheduled",
    heroLink: "",
    installSteps: "",
    agentSetup: "",
    changelog: "",
  },
};

/* <!-- 3.11: mac --> Signed and notarized Apple Silicon preview DMG on the release.
   If the DMG is not attached, delete this block through the closing marker; every page falls back to the copy above. */
PRODUCT_STATUS.mac = {
  available: true,
  visible: "Windows 10/11, plus a Mac preview for Apple Silicon (macOS 15 or later).",
  label: "preview",
  heading: "Apple Silicon preview.",
  tech: "macOS 15 or later / Apple Silicon",
  detail: "A signed and notarized preview of Uoink for Macs with Apple Silicon.",
  footnote: "Intel Macs are not supported",
  linkLabel: "Mac install steps ->",
  windowsLabel: "Windows 10/11",
  aboutPlatform: "Windows 10/11 and Mac",
  aboutNote: "Mac preview for Apple Silicon",
  heroLink: '<p class="footnote">Mac with Apple Silicon: <a href="#mac">install the preview</a>.</p>',
  installSteps: `<ol class="steps">
            <li>Download the Apple Silicon DMG from the <a href="https://github.com/ryanbiddy/uoink/releases/latest">latest release</a>.</li>
            <li>Open the DMG and drag <strong>Uoink</strong> to the <strong>Applications</strong> folder.</li>
            <li>Open Uoink from Applications. The first time, macOS asks you to confirm opening an app downloaded from the internet. Choose <strong>Open</strong>.</li>
          </ol>
          <p>For the browser button, open Uoink once, then load the unpacked folder at <code>~/Library/Application Support/Uoink/extension</code> from <code>chrome://extensions</code>. Login startup is off until you turn it on in Settings. The Mac app does not add the <code>uoink</code> command to your PATH, and library mirroring is not available on Mac yet. See <a href="/developers">agent setup</a> to connect your AI.</p>`,
  agentSetup: `<h3>On a Mac (preview)</h3>
<p><code>uoink connect &lt;client&gt;</code> prints macOS paths for wherever Uoink.app is installed. For Claude Desktop, open the macOS <code>.mcpb</code> bundle from the release and select Uoink.app when asked; the Windows bundle does not work on a Mac. The Claude Code plugin's MCP entry is for Windows, so on a Mac use <code>uoink connect claude-code</code> and the standalone skill. Skill folders are the same paths under your home folder, for example <code>uoink skill install --to ~/.claude/skills</code>.</p>
<p>The Mac app does not add the <code>uoink</code> command to your PATH. Link <code>/Applications/Uoink.app/Contents/Helpers/uoink</code> into a folder on your PATH, then run <code>uoink status</code>.</p>`,
  changelog: `<p>A preview for Macs with Apple Silicon (macOS 15 or later) is on the release page as a signed and notarized DMG. Open it, drag Uoink to Applications, then open Uoink and confirm the first-open prompt. Intel Macs are not supported, and library mirroring is not available on Mac yet. See the <a href="/install#mac">Mac install steps</a>. The Windows installer is still unsigned.</p>`,
};
/* <!-- /3.11: mac --> */

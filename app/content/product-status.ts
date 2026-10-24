// Everything the site says about Mac availability. Pages read PRODUCT_STATUS.mac;
// Windows is the only supported platform until the Mac preview is released.
export const MAC_PREVIEW_STATUS = "Mac (Apple Silicon, macOS 15 or later): preview coming soon.";
export type MacStatus = {
  available: boolean;
  visible: string; // one-line platform summary: home, install FAQ, MCP page, NotebookLM comparison
  heading: string;
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
    visible: `Windows 10/11 only. ${MAC_PREVIEW_STATUS}`,
    heading: MAC_PREVIEW_STATUS,
    linkLabel: "Mac status ->",
    windowsLabel: "Windows 10/11 only",
    aboutPlatform: "Windows 10/11 only",
    aboutNote: MAC_PREVIEW_STATUS,
    heroLink: `<p class="footnote">${MAC_PREVIEW_STATUS}</p>`,
    installSteps: "",
    agentSetup: "",
    changelog: "",
  },
};

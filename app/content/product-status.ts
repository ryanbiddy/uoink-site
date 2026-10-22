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

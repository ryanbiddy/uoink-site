export const PRODUCT_STATUS = {
  mac: {
    visible: "Mac build is queued after Windows stabilizes",
    label: "queued",
    heading: "Mac build queued.",
    tech: "DMG, Keychain, LaunchAgent",
    detail:
      "Mac build is queued after Windows stabilizes. The macOS path will use the same corpus format and MCP surface.",
  },
} as const;

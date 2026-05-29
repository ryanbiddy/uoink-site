(() => {
  const panel = document.querySelector("[data-config-generator]");
  if (!panel) return;

  const commandPath = "%LOCALAPPDATA%\\Uoink\\uoink_mcp.exe";
  const snippets = {
    "Claude Desktop": {
      mcpServers: { uoink: { command: commandPath, args: [] } },
    },
    Cursor: {
      mcpServers: { uoink: { command: commandPath, args: [] } },
    },
    Continue: {
      experimental: {
        modelContextProtocolServers: [{ name: "uoink", command: commandPath, args: [] }],
      },
    },
    Cline: {
      mcpServers: { uoink: { command: commandPath, args: [], disabled: false } },
    },
    "Generic stdio": `"${commandPath}"`,
  };

  const tabs = Array.from(panel.querySelectorAll("[data-config-client]"));
  const snippet = panel.querySelector("[data-config-snippet]");
  const copy = panel.querySelector("[data-config-copy]");

  function render(label) {
    tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.configClient === label)));
    const value = snippets[label] || snippets["Claude Desktop"];
    snippet.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    snippet.setAttribute("aria-label", `${label} config`);
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => render(tab.dataset.configClient)));
  copy?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(snippet.textContent || "");
      copy.textContent = "Copied";
      window.setTimeout(() => {
        copy.textContent = "Copy config";
      }, 1800);
    } catch {
      copy.textContent = "Copy failed";
    }
  });
})();

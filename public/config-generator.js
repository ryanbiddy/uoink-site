(() => {
  const panel = document.querySelector("[data-config-generator]");
  if (!panel) return;

  const commandPath = "%LOCALAPPDATA%\\Uoink\\yoink_mcp.py";
  const snippets = {
    "Claude Desktop": {
      mcpServers: { uoink: { command: "python", args: [commandPath] } },
    },
    Cursor: {
      mcpServers: { uoink: { command: "python", args: [commandPath] } },
    },
    Continue: {
      experimental: {
        modelContextProtocolServers: [{ name: "uoink", command: "python", args: [commandPath] }],
      },
    },
    Cline: {
      mcpServers: { uoink: { command: "python", args: [commandPath], disabled: false } },
    },
    "Generic stdio": `python "${commandPath}"`,
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

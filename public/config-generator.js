(() => {
  const panel = document.querySelector("[data-config-generator]");
  if (!panel) return;

  // Authoritative stdio command: the bundled console python runs the installed
  // uoink_mcp.py. Mirrors server.py::_mcp_stdio_command, the README, the .mcpb
  // bundle, and /.well-known/mcp.json. There is no standalone .exe entrypoint.
  const commandPath = "%LOCALAPPDATA%\\Uoink\\python\\python.exe";
  const commandArgs = ["%LOCALAPPDATA%\\Uoink\\uoink_mcp.py"];
  const snippets = {
    "Claude Desktop": {
      mcpServers: { uoink: { command: commandPath, args: commandArgs } },
    },
    Cursor: {
      mcpServers: { uoink: { command: commandPath, args: commandArgs } },
    },
    Continue: {
      experimental: {
        modelContextProtocolServers: [{ name: "uoink", command: commandPath, args: commandArgs }],
      },
    },
    Cline: {
      mcpServers: { uoink: { command: commandPath, args: commandArgs, disabled: false } },
    },
    "Generic stdio": `"${commandPath}" "${commandArgs[0]}"`,
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

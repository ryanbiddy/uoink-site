const clients = ["Claude Desktop", "Cursor", "Continue", "Cline", "Generic stdio"];

const defaultSnippet = JSON.stringify(
  {
    mcpServers: {
      uoink: {
        command: "python",
        args: ["%LOCALAPPDATA%\\Uoink\\yoink_mcp.py"],
      },
    },
  },
  null,
  2,
);

export function ConfigSnippetGenerator() {
  return (
    <section className="section config-generator" id="config-generator" data-screen-label="agents / config generator">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">§ config generator</span>
          <h2 className="display-l">
            Paste one block. <em>Agent-ready.</em>
          </h2>
          <p className="lede">
            Pick the client you use and copy the local stdio MCP config. Uoink stays on your machine; the client launches the helper tool process when it needs it.
          </p>
        </div>
        <div className="config-panel" data-config-generator>
          <div className="config-tabs" role="tablist" aria-label="MCP client">
            {clients.map((label, index) => (
              <button
                aria-selected={index === 0 ? "true" : "false"}
                className="config-tab"
                data-config-client={label}
                key={label}
                role="tab"
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <pre className="config-snippet" aria-label="Claude Desktop config" data-config-snippet>
            <code>{defaultSnippet}</code>
          </pre>
          <div className="config-actions">
            <button className="btn primary" data-config-copy type="button">
              Copy config
            </button>
            <a className="arr-link" href="/agent-docs#stdio">
              Stdio setup notes →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

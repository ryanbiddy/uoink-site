// Matches the release README. Claude Desktop needs expanded absolute paths.
export const MCP_STDIO_CONFIG = JSON.stringify({
  mcpServers: {
    uoink: {
      command: "%LOCALAPPDATA%\\Uoink\\python\\python.exe",
      args: ["%LOCALAPPDATA%\\Uoink\\uoink_mcp.py"],
    },
  },
}, null, 2);

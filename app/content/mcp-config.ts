// Matches the release README. Claude Desktop needs expanded absolute paths.
export const MCP_STDIO_CONFIG = JSON.stringify({
  mcpServers: {
    uoink: {
      command: "%LOCALAPPDATA%\\Uoink\\python\\python.exe",
      args: ["%LOCALAPPDATA%\\Uoink\\uoink_mcp.py"],
      env: { PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
    },
  },
}, null, 2);

const cursorConfig = JSON.parse(MCP_STDIO_CONFIG);
cursorConfig.mcpServers.uoink.env.UOINK_MCP_TOOLSET = "core";
export const MCP_CURSOR_CONFIG = JSON.stringify(cursorConfig, null, 2);

export const CLAUDE_CODE_COMMAND = String.raw`claude mcp add --scope user --transport stdio uoink -e PYTHONIOENCODING=utf-8 -e PYTHONUTF8=1 -- "$env:LOCALAPPDATA\Uoink\python\python.exe" "$env:LOCALAPPDATA\Uoink\uoink_mcp.py"`;

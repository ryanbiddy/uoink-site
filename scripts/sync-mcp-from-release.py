"""Read release Python ASTs without importing or executing product code."""
import argparse
import ast
import datetime
import json
from pathlib import Path
import re
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("checkout", type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
checkout = args.checkout.resolve()
commit = subprocess.check_output([
    "git", "-c", f"safe.directory={checkout.as_posix()}", "-C", str(checkout),
    "rev-parse", "HEAD",
], text=True).strip()
tree = ast.parse((checkout / "uoink_mcp_tools.py").read_text(encoding="utf-8-sig"))
constants = {}

def literal(node):
    if isinstance(node, ast.Name):
        return constants[node.id]
    if isinstance(node, ast.Subscript):
        return literal(node.value)[literal(node.slice)]
    if isinstance(node, ast.Dict):
        return {literal(key): literal(value) for key, value in zip(node.keys, node.values)}
    if isinstance(node, (ast.List, ast.Tuple)):
        return [literal(item) for item in node.elts]
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "_library_schema":
        return {"$schema": constants["LIBRARY_JSON_SCHEMA_DIALECT"], "$defs": constants["_LIBRARY_DEFS"], **literal(node.args[0])}
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "_tool_schema":
        return {"$schema": constants["JSON_SCHEMA_DIALECT"], **literal(node.args[0])}
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "_sources_tool_schema":
        return constants["TOOL_SCHEMAS"][literal(node.args[0])]
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "_schema":
        value = {"type": "object", "properties": literal(node.args[0]), "additionalProperties": False}
        value["required"] = literal(node.args[1]) if len(node.args) > 1 else []
        return value
    return ast.literal_eval(node)

registry = None
source_tree = ast.parse((checkout / "source_subscriptions.py").read_text(encoding="utf-8-sig"))
for node in [*source_tree.body, *tree.body]:
    if isinstance(node, (ast.Assign, ast.AnnAssign)):
        target = node.targets[0] if isinstance(node, ast.Assign) else node.target
        if not isinstance(target, ast.Name):
            continue
        if target.id == "TOOL_REGISTRY":
            registry = node.value
        else:
            try:
                constants[target.id] = literal(node.value)
            except (ValueError, KeyError, TypeError):
                pass
assert isinstance(registry, ast.Dict)
tools = []
for key, spec in zip(registry.keys, registry.values):
    fields = {kw.arg: kw.value for kw in spec.keywords}
    name = literal(fields["name"])
    assert name == literal(key)
    tools.append({"name": name, "description": literal(fields["description"]),
                  "inputSchema": literal(fields["input_schema"])})
assert len({tool["name"] for tool in tools}) == len(tools)

stdio_tree = ast.parse((checkout / "uoink_mcp.py").read_text(encoding="utf-8-sig"))
stdio = []
for node in ast.walk(stdio_tree):
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        for dec in node.decorator_list:
            if (isinstance(dec, ast.Call) and isinstance(dec.func, ast.Attribute)
                    and isinstance(dec.func.value, ast.Name) and dec.func.value.id == "mcp"
                    and dec.func.attr == "tool"):
                names = [kw.value for kw in dec.keywords if kw.arg == "name"]
                stdio.append(ast.literal_eval(names[0]) if names else node.name)
assert len(stdio) == len(set(stdio)) == 32
assert set(stdio) <= {tool["name"] for tool in tools}

def summary(description):
    text = re.sub(r"^v\d+(?:\.\d+)?(?:\s+[A-Z]\d)?(?:\s+[^:]+)?:\s*", "", description)
    text = re.sub(r"^v\d+(?:\.\d+)?\s+[A-Z]\d\s+", "", text)
    sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z])", text)
    return " ".join(sentences[:2] if len(sentences[0]) < 35 else sentences[:1])

today = datetime.date.today().isoformat()
rows = [[tool["name"], summary(tool["description"])] for tool in tools]
output = f"""// Generated from ryanbiddy/uoink release/3.8.0 on {today}.
// Source commit: {commit}
// HTTP: TOOL_REGISTRY in uoink_mcp_tools.py; stdio: @mcp.tool in uoink_mcp.py.
// Regenerate with: python scripts/sync-mcp-from-release.py <release-checkout>

export const MCP_TOOL_COUNT = {len(tools)};
export const MCP_STDIO_TOOL_COUNT = {len(stdio)};

export const mcpStdioToolNames = {json.dumps(stdio, indent=2)} as const;

export const mcpTools = {json.dumps(rows, indent=2, ensure_ascii=False)} as const;

export type McpTool = (typeof mcpTools)[number];
"""
(root / "app/content/mcp-tools.ts").write_text(output, encoding="utf-8")
manifest = {
    "schema_version": "3.2", "version": "3.8.0", "name": "Uoink MCP Tool Manifest",
    "description": "Local HTTP registry; tools marked stdio also appear on the everyday stdio surface.",
    "source": f"ryanbiddy/uoink@{commit}:uoink_mcp_tools.py",
    "generated": today, "tool_count": len(tools), "stdio_tool_count": len(stdio),
    "tools": [{**tool, "transports": ["stdio", "http"] if tool["name"] in stdio else ["http"]} for tool in tools],
}
(root / "public/mcp/manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"{commit}: {len(stdio)} stdio tools; {len(tools)} HTTP registry tools")

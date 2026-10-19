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
parser.add_argument("--ref", help="Product Git ref to read (defaults to content/release.json).")
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
release = json.loads((root / "content/release.json").read_text(encoding="utf-8"))
version = release["version"]
ref = args.ref or release["mcpSourceRef"]
checkout = args.checkout.resolve()
git = ["git", "-c", f"safe.directory={checkout.as_posix()}", "-C", str(checkout)]
# rev-parse peels annotated tags (git show would print the tag header too).
commit = subprocess.check_output(git + ["rev-parse", "--verify", f"{ref}^{{commit}}"],
                                 text=True, encoding="utf-8").strip()

def source(path):
    return subprocess.check_output(git + ["show", f"{commit}:{path}"],
                                   text=True, encoding="utf-8-sig")

tree = ast.parse(source("uoink_mcp_tools.py"))
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
source_tree = ast.parse(source("source_subscriptions.py"))
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

stdio_tree = ast.parse(source("uoink_mcp.py"))
stdio = []
for node in ast.walk(stdio_tree):
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        for dec in node.decorator_list:
            if (isinstance(dec, ast.Call) and isinstance(dec.func, ast.Attribute)
                    and isinstance(dec.func.value, ast.Name) and dec.func.value.id == "mcp"
                    and dec.func.attr == "tool"):
                names = [kw.value for kw in dec.keywords if kw.arg == "name"]
                stdio.append(ast.literal_eval(names[0]) if names else node.name)
if not stdio:
    # 3.9.2 publishes the shared registry, keeping the old core names first.
    # Check the AST contract rather than importing the product and its backend.
    inventory = next(node for node in tree.body
                     if isinstance(node, ast.FunctionDef) and node.name == "stdio_tool_names")
    expected = ast.parse("CORE_STDIO_TOOLS + tuple(name for name in TOOL_REGISTRY if name not in CORE_STDIO_TOOLS)", mode="eval").body
    assert ast.dump(inventory.body[-1].value) == ast.dump(expected)
    selector = next(node for node in stdio_tree.body
                    if isinstance(node, ast.FunctionDef) and node.name == "_selected_toolset")
    assert any(isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute)
               and ast.unparse(node.func) == "os.environ.get"
               and [literal(arg) for arg in node.args] == ["UOINK_MCP_TOOLSET", "full"]
               for node in ast.walk(selector))
    publisher = next(node for node in ast.walk(stdio_tree)
                     if isinstance(node, ast.AsyncFunctionDef) and node.name == "list_tools")
    assert any(isinstance(node, ast.Call)
               and ast.unparse(node) == "uoink_mcp_tools.stdio_tool_names(STDIO_TOOLSET)"
               for node in ast.walk(publisher))
    core = constants["CORE_STDIO_TOOLS"]
    assert len(core) == len(set(core)) and set(core) <= {tool["name"] for tool in tools}
    stdio = core + [tool["name"] for tool in tools if tool["name"] not in core]
assert len(stdio) == len(set(stdio)) > 0
assert set(stdio) <= {tool["name"] for tool in tools}
bundle_tools = json.loads(source(".mcpb/manifest.json"))["tools"]
assert len(bundle_tools) == len(stdio)
assert {tool["name"] for tool in bundle_tools} == set(stdio)

release["stdioToolCount"] = len(stdio)
release["httpToolCount"] = len(tools)
(root / "content/release.json").write_text(json.dumps(release, indent=2) + "\n", encoding="utf-8")

def summary(description):
    text = re.sub(r"^v\d+(?:\.\d+)?(?:\s+[A-Z]\d)?(?:\s+[^:]+)?:\s*", "", description)
    text = re.sub(r"^v\d+(?:\.\d+)?\s+[A-Z]\d\s+", "", text)
    sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z])", text)
    return " ".join(sentences[:2] if len(sentences[0]) < 35 else sentences[:1])

today = datetime.date.today().isoformat()
rows = [[tool["name"], summary(tool["description"])] for tool in tools]
output = f"""// Generated for Uoink {version} from ryanbiddy/uoink {ref} on {today}.
// Source commit: {commit}
// HTTP: TOOL_REGISTRY; stdio: registry inventory (3.9.2+) or @mcp.tool decorators.
// Regenerate with: python scripts/sync-mcp-from-release.py <product-checkout> [--ref <git-ref>]

import release from "../../content/release.json";

export const MCP_TOOL_COUNT = release.httpToolCount;
export const MCP_STDIO_TOOL_COUNT = release.stdioToolCount;

export const mcpStdioToolNames = {json.dumps(stdio, indent=2)} as const;

export const mcpTools = {json.dumps(rows, indent=2, ensure_ascii=False)} as const;

export type McpTool = (typeof mcpTools)[number];
"""
(root / "app/content/mcp-tools.ts").write_text(output, encoding="utf-8")
manifest = {
    "schema_version": "3.2", "version": version, "name": "Uoink MCP Tool Manifest",
    "description": "Local MCP tool inventory with exact registry schemas and supported transports. Both stdio and HTTP advertise flattened top-level schema variants for client compatibility; the server validates the exact registry schemas.",
    "source": f"ryanbiddy/uoink@{commit}:uoink_mcp_tools.py",
    "generated": today, "tool_count": len(tools), "stdio_tool_count": len(stdio),
    "tools": [{**tool, "transports": ["stdio", "http"] if tool["name"] in stdio else ["http"]} for tool in tools],
}
(root / "public/mcp/manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"{commit}: {len(stdio)} stdio tools; {len(tools)} HTTP registry tools")

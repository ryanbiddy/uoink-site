import manifest from "../../public/mcp/manifest.json";

export type Schema = {
  type?: string | string[];
  description?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  $ref?: string;
  $defs?: Record<string, Schema>;
  items?: Schema;
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  minimum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  pattern?: string;
  [key: string]: unknown;
};

export type Tool = { name: string; description: string; inputSchema: Schema; transports: string[] };
export const toolManifest = manifest;
// JSON inference adds absent properties as optional undefined keys across the
// heterogeneous schemas. Runtime schemas are validated by check-mcp-tool-pages.
export const toolPages = manifest.tools as unknown as Tool[];
export const toolPath = (name: string) => `/mcp/tools/${name}`;
// Preserve source wording, removing only release prefixes and prohibited punctuation.
export const displayText = (text: string) => text.replace(/\u2014/g, "; ");
export function toolAnswer(tool: Tool) {
  const sentences = displayText(tool.description)
    .replace(/^v\d+(?:\.\d+)?(?:\s+[A-Z]\d)?(?:\s+[^:]+)?:\s*/, "")
    .split(/(?<=[.!?])\s+(?=[A-Z])/);
  const answer = /^(two-phase generator|v3 P4 critique tool)\.$/i.test(sentences[0]) ? sentences[1] : sentences[0];
  return answer[0].toUpperCase() + answer.slice(1);
}
export const toolTitle = (tool: Tool) => `${tool.name} MCP tool | Uoink`;
export const toolDescription = (tool: Tool) => {
  const text = `${tool.name}: ${toolAnswer(tool)}`;
  return text.length <= 170 ? text : `${text.slice(0, 166).replace(/\s+\S*$/, "")}...`;
};

export function resolveSchema(schema: Schema, root: Schema): Schema {
  if (!schema.$ref) return schema;
  if (!schema.$ref.startsWith("#/$defs/")) throw new Error(`Unsupported schema reference: ${schema.$ref}`);
  const definition = root.$defs?.[schema.$ref.slice(8)];
  if (!definition) throw new Error(`Missing schema reference: ${schema.$ref}`);
  return { ...definition, ...schema, $ref: undefined };
}

export function inputVariants(schema: Schema): Schema[] {
  if (!schema.oneOf) return [schema];
  return schema.oneOf.map(variant => ({
    ...schema, ...variant, oneOf: undefined,
    properties: { ...schema.properties, ...variant.properties },
    required: [...new Set([...(schema.required || []), ...(variant.required || [])])],
  }));
}

// Illustrative request values, never captured results. Defaults/enums come from
// the registry. Strings and minimum numeric values are replaceable placeholders.
function exampleValue(input: Schema, root: Schema, name: string): unknown {
  const schema = resolveSchema(input, root);
  if ("const" in schema) return schema.const;
  if ("default" in schema) return schema.default;
  if (schema.enum) return schema.enum[0];
  if (schema.oneOf || schema.anyOf) return exampleValue((schema.oneOf || schema.anyOf)![0], root, name);
  if (schema.type === "object" || schema.properties) {
    const properties = schema.properties || {};
    const keys = schema.required || [];
    return Object.fromEntries(keys.map(key => [key, exampleValue(properties[key], root, key)]));
  }
  if (schema.type === "array") return Array.from({ length: schema.minItems ?? 1 }, () => exampleValue(schema.items || {}, root, name));
  if (schema.type === "boolean") return false;
  if (schema.type === "integer" || schema.type === "number") return schema.minimum ?? 0;
  if (schema.type === "null") return null;
  if (schema.pattern === "^src_[a-f0-9]{64}$") return `src_${"0".repeat(64)}`;
  if (schema.pattern === "^[a-f0-9]{64}$") return "0".repeat(64);
  if (schema.pattern === "^[A-Za-z0-9_-]{43,128}$") return "REPLACE_WITH_REAL_TOKEN_".padEnd(43, "_");
  return `YOUR_${name.toUpperCase()}`.padEnd(schema.minLength || 0, "_").slice(0, schema.maxLength);
}

export function exampleCall(tool: Tool, variant = inputVariants(tool.inputSchema)[0]) {
  const properties = variant.properties || {};
  const keys = new Set(variant.required || []);
  // Older registry schemas leave identifiers optional even when a call needs one.
  // Pick a single identifier rather than sending mutually exclusive alternatives.
  if (!keys.size) {
    const identifier = Object.keys(properties).find(key => /^(slug|video_id|id|workspace_id|yoink_id)$/.test(key));
    if (identifier) keys.add(identifier);
  }
  for (const [key, value] of Object.entries(properties)) if ("default" in value || "const" in value) keys.add(key);
  return { name: tool.name, arguments: Object.fromEntries([...keys].map(key => [key, exampleValue(properties[key], tool.inputSchema, key)])) };
}

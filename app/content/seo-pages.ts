import { readFileSync } from "node:fs";
import path from "node:path";
import { pages } from "./pages";

// Read the existing sources at build time. Do not maintain a second release list
// or a second set of product facts here. Fail closed if their format changes.
export const withoutEmDashes = (text: string) => text.replace(/\s*\u2014\s*/g, ": ");
export const plainText = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

export function parseReleases(html: string) {
  const entries = [...html.matchAll(/<h2>v(\d+\.\d+\.\d+)([^<]*)<\/h2>([\s\S]*?)(?=<h2>|<div class="ctas">|$)/g)];
  if (!entries.length) throw new Error("No releases found in pages.changelog.html");
  const releases = entries.map(([, version, heading, body]) => {
    const date = body.match(/<time datetime="([^"]+)"/)?.[1] ?? null;
    const context = date ? null : plainText(body.match(/^\s*<p class="meta">([\s\S]*?)<\/p>/)?.[1] || "");
    if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0, 10) !== date)) {
      throw new Error(`Invalid release date for ${version}`);
    }
    const html = withoutEmDashes(body.replace(/^\s*<p class="meta">[\s\S]*?<\/p>/, "").trim());
    const opening = html.match(/^<p>([\s\S]*?)<\/p>/)?.[1];
    if (!opening || /<\/(?:article|section)>/.test(html)) throw new Error(`Unexpected changelog format for ${version}`);
    const slug = version.replaceAll(".", "-");
    const title = `Uoink ${version} release notes`;
    const summary = plainText(opening).match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || plainText(opening);
    return {
      version, slug, route: `/changelog/${slug}`, date, context, title,
      heading: withoutEmDashes(`Uoink ${version}${heading}`),
      description: `${title}: ${summary}`,
      html: html.replace(/^<p>/, '<p class="standfirst">'),
    };
  });
  if (new Set(releases.map(release => release.slug)).size !== releases.length) throw new Error("Duplicate release version");
  return releases;
}

export function parseFacts(source: string) {
  const take = (pattern: RegExp, label: string) => {
    const value = source.match(pattern)?.[1];
    if (!value) throw new Error(`llms.txt: missing ${label}; update the facts parser to match the source`);
    return value;
  };
  const version = take(/^# Uoink v([^\r\n]+)$/m, "version");
  const platform = take(/^([^\r\n.]+) only\. No Mac build scheduled\./m, "platform");
  const unsupported = take(/only\. (No Mac build scheduled\.)/, "unsupported platform");
  const price = take(/Uoink v[^\s]+ is (\w+) and /, "price");
  const license = take(/ is \w+ and ([\w.-]+)-licensed;/, "license");
  const storage = take(/^- (Keep everything [^\r\n]+)$/m, "storage");
  const registry = take(/^Official MCP registry: ([^\r\n]+)$/m, "MCP registry ID");
  const supported = [
    take(/^- (Capture YouTube [^\r\n]+)$/m, "YouTube sources"),
    take(/^- (Save X [^\r\n]+)$/m, "other sources"),
  ];
  const privacy = take(/^- (Local-first: [^\r\n]+)$/m, "local data and network disclosure");
  return { version, platform, unsupported, price, license, storage, registry, supported, privacy };
}

export const releases = parseReleases(pages.changelog.html);
export const facts = parseFacts(readFileSync(path.join(process.cwd(), "public/llms.txt"), "utf8"));
export const factsTitle = `Uoink ${facts.version} facts: platform, price and local data`;
export const factsOpening = `Uoink ${facts.version} is ${facts.price} and ${facts.license}-licensed for ${facts.platform}.`;
export const factsDescription = `${factsOpening} Check supported sources, data storage, the MCP registry ID and Mac availability.`;

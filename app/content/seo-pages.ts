import { readFileSync } from "node:fs";
import path from "node:path";
import { pages } from "./pages";

// Read the existing sources at build time. Do not maintain a second release list
// or a second set of product facts here. Fail closed if their format changes.
export const withoutEmDashes = (text: string) => text.replace(/\s*\u2014\s*/g, ": ");
export const plainText = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

// Hand-written where the release opening has no complete sentence that fits a search result.
const releaseDescriptions: Record<string, string> = {
  "3.18.0": "Finish old saves. Transcribe saves that showed \u201cNo captions available\u201d, from media still on disk or a fresh download, and keep saving while it runs.",
  "3.16.1": "Deno ships with the Windows installer, so yt-dlp can solve YouTube\u2019s player challenges with nothing else to install.",
  "3.12.1": "A Phone inbox (Uoink Relay), off by default: share a link from your phone and Uoink captures it. Plus the uoink mcp command and cleaner buttons.",
  "3.12.0": "Every download now ships Whisper's base transcription model, so a fresh install transcribes a video that has no captions from the first capture.",
  "3.11.0": "Search no longer requires every word. It skips common words, matches the rest, and ranks sources with every word and exact titles first.",
  "3.10.0": "Use Uoink from any AI agent. The uoink command lets agents search saved sources, read evidence, capture URLs, save notes and call registry tools.",
  "3.9.2": "Every Uoink tool is now available through the standard stdio connection used by Claude Desktop, Claude Code and Cursor.",
};

function releaseDescription(version: string, heading: string, opening: string) {
  if (releaseDescriptions[version]) return releaseDescriptions[version];
  const lead = opening.match(/^<strong>([^<]+[.!?])<\/strong>(?:\s+|$)/);
  const headline = lead ? plainText(lead[1]) : plainText(heading).replace(/^[:\s\u2014]+/, "");
  const prefix = headline ? `${headline.replace(/[.!?]$/, "")}.` : "";
  const releaseLabel = `Release notes for Uoink ${version}.`;
  const summary = plainText(opening.slice(lead?.[0].length ?? 0));
  let excerpt = prefix;
  let whole = "";
  for (const sentence of summary.split(/(?<=[.!?])\s+/)) {
    excerpt = `${excerpt} ${sentence}`.trim();
    // Prefer complete sentences. The page title already identifies the release.
    for (const text of [`${releaseLabel} ${excerpt}`, excerpt]) {
      if (text.length >= 110 && text.length <= 155) return text;
      if (text.length <= 155 && text.length > whole.length) whole = text;
    }
    if (excerpt.length > 155) break;
  }
  // Never cut a sentence at a comma. Fall back to the longest run of whole sentences that fits.
  if (whole.length >= 70) return whole;
  const text = excerpt.length < 110 ? `${releaseLabel} ${excerpt}` : excerpt;
  return text.length <= 155 ? text : text.slice(0, 156).replace(/\s+\S*$/, "").replace(/[,;:]$/, "");
}

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
    return {
      version, slug, route: `/changelog/${slug}`, date, context, title,
      heading: withoutEmDashes(`Uoink ${version}${heading}`),
      description: releaseDescription(version, heading, opening),
      // The index's release heading becomes the h1 on the standalone page.
      html: html.replace(/^<p>/, '<p class="standfirst">')
        .replaceAll("<h3>", '<h2 class="release-subheading">').replaceAll("</h3>", "</h2>"),
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
  // "Windows 10/11, plus a Mac preview for Apple Silicon (macOS 15 or later). Uoink v… is free and …"
  const platform = take(/^([^\r\n.]+)\. Uoink v[^\s]+ is \w+ and /m, "platform");
  // The first line of the Mac setup section: "Mac preview: Apple Silicon, macOS 15 or later; …."
  const mac = take(/^(Mac preview: [^\r\n.]+\.)/m, "Mac support");
  const price = take(/Uoink v[^\s]+ is (\w+) and /, "price");
  const license = take(/ is \w+ and ([\w.-]+)-licensed;/, "license");
  const storage = take(/^- (Keep everything [^\r\n]+)$/m, "storage");
  const registry = take(/^Official MCP registry: ([^\r\n]+)$/m, "MCP registry ID");
  const supported = [
    take(/^- (Capture YouTube [^\r\n]+)$/m, "YouTube sources"),
    take(/^- (Save X [^\r\n]+)$/m, "other sources"),
  ];
  const privacy = take(/^- (Local-first: [^\r\n]+)$/m, "local data and network disclosure");
  // The llmstxt.org summary blockquote under the title.
  const summary = take(/^> ([^\r\n]+)$/m, "summary");
  const chatApps = take(/^- (ChatGPT and claude\.ai: [^\r\n]+)$/m, "chat apps without MCP");
  return { version, summary, platform, mac, price, license, storage, registry, supported, privacy, chatApps };
}

export const releases = parseReleases(pages.changelog.html);
export const facts = parseFacts(readFileSync(path.join(process.cwd(), "public/llms.txt"), "utf8"));
export const factsTitle = `Uoink ${facts.version} facts: platform, price and local data`;
export const factsOpening = `Uoink ${facts.version} is ${facts.price} and ${facts.license}-licensed for ${facts.platform}.`;
export const factsDescription = `Uoink ${facts.version} is ${facts.price} and ${facts.license}-licensed. Check system requirements, the Mac preview, supported sources and where Uoink keeps your files.`;

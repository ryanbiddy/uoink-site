import fs from "node:fs";
import path from "node:path";

export const comparisonSlugs = ["readwise-reader", "obsidian-web-clipper"] as const;

const escape = (text: string): string => text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));

// These checked-in editorial drafts use headings, lists, tables and numbered citations.
// Escape text before adding markup; never accept raw HTML from the draft.
function inline(text: string): string {
  return escape(text)
    .replace(/https:\/\/[^\s<]+/g, url => `<a href="${url}">${url}</a>`)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(U?\d+)\]/g, '<a class="comparison-citation" href="#source-$1" aria-label="Source $1">[$1]</a>')
    .replace(/seen 2026-10-24/g, 'seen <time dateTime="2026-10-24">Oct 24, 2026</time>');
}

function renderBody(body: string): string {
  return body.trim().split(/\n\s*\n/).map(block => {
    if (block.startsWith("## ")) return `<h2>${inline(block.slice(3))}</h2>`;
    if (block.startsWith("|")) {
      const rows = block.split("\n").map(row => row.slice(1, -1).split("|").map(cell => cell.trim()));
      return `<div class="table-wrap" role="region" aria-label="Feature comparison" tabindex="0"><table class="data-table"><thead><tr>${rows[0].map(cell => `<th scope="col">${inline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.slice(2).map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${inline(cell)}</th>` : `<td>${inline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    if (/^(?:- |\d+\. )/.test(block)) {
      const ordered = /^\d/.test(block);
      const tag = ordered ? "ol" : "ul";
      return `<${tag}>${block.split("\n").map(line => {
        const source = line.match(/^(?:- )?(U?\d+)\. .*https:\/\//);
        return `<li${source ? ` id="source-${source[1]}"` : ""}>${inline(line.replace(/^(?:- |\d+\. )/, ""))}</li>`;
      }).join("")}</${tag}>`;
    }
    return `<p>${inline(block)}</p>`;
  }).join("\n");
}

export function getComparison(slug: typeof comparisonSlugs[number]) {
  const source = fs.readFileSync(path.join(process.cwd(), "content/compare", `uoink-vs-${slug}.md`), "utf8").replace(/\r\n/g, "\n");
  const [, frontmatter, body] = source.split(/---\n/);
  const title = frontmatter.match(/^title: "(.+)"$/m)![1];
  const description = frontmatter.match(/^description: "(.+)"$/m)![1];
  const [heading, opening, ...rest] = body.trim().split(/\n\s*\n/);
  return { slug, title, description, heading: heading.replace(/^# /, ""), opening, html: renderBody(rest.join("\n\n")) };
}

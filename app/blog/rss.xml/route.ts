import { CANONICAL_URL } from "../../content/pages";
import { blogArticles } from "../blog-data";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const items = blogArticles
    .map((article) => {
      const url = `${CANONICAL_URL}/blog/${article.slug}`;
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(`${article.publishedAt}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(article.dek)}</description>
      ${article.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Uoink Field Notes</title>
    <link>${CANONICAL_URL}/blog</link>
    <description>Launch essays and how-to guides for Uoink, local corpus work, creator research, and MCP agents.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

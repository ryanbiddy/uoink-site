import fs from "node:fs";
import path from "node:path";
import { CANONICAL_URL } from "../content/pages";

export type BlogArticleMeta = {
  slug: string;
  title: string;
  dek: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  heroTone: string;
};

export type BlogArticle = BlogArticleMeta & {
  body: string;
};

export const blogArticles: BlogArticleMeta[] = [
  {
    slug: "9-hook-types-every-creator-should-recognize",
    title: "The 9 Hook Types Every Creator Should Recognize",
    dek: "Uoink's taxonomy for reading the first seconds of a YouTube video like a system instead of a vibe.",
    publishedAt: "2026-05-30",
    readingMinutes: 8,
    tags: ["creator", "hooks", "how-to", "launch"],
    heroTone: "taxonomy",
  },
  {
    slug: "how-to-find-your-channels-overperformer-pattern",
    title: "How to Find Your Channel's Overperformer Pattern",
    dek: "Use your local Uoink corpus to see why specific uploads beat the channel baseline.",
    publishedAt: "2026-05-29",
    readingMinutes: 7,
    tags: ["creator", "research", "how-to"],
    heroTone: "pattern",
  },
  {
    slug: "why-your-ai-agent-should-have-a-corpus",
    title: "Why Your AI Agent Should Have a Corpus",
    dek: "Generic agents guess. Corpus-grounded agents search your actual sources before they write.",
    publishedAt: "2026-05-28",
    readingMinutes: 7,
    tags: ["agent-dev", "mcp", "corpus"],
    heroTone: "agent",
  },
  {
    slug: "local-first-no-uoink-cloud-what-it-costs-us",
    title: "Local-First, No Uoink Cloud: What It Costs Us",
    dek: "A plain accounting of the privacy choice: less SaaS leverage, more ownership for the user.",
    publishedAt: "2026-05-27",
    readingMinutes: 7,
    tags: ["privacy", "architecture", "launch"],
    heroTone: "local",
  },
  {
    slug: "how-to-write-a-script-grounded-in-your-corpus",
    title: "How to Write a Script Grounded in Your Corpus",
    dek: "Turn saved videos, pages, comments, and style anchors into a script draft with source gravity.",
    publishedAt: "2026-05-26",
    readingMinutes: 8,
    tags: ["writer", "corpus", "how-to"],
    heroTone: "writing",
  },
  {
    slug: "tweet-what-you-learned-from-a-youtube-video",
    title: "Tweet What You Learned from a YouTube Video",
    dek: "A workflow for turning a useful video into a credited, specific thread without link-share mush.",
    publishedAt: "2026-05-25",
    readingMinutes: 7,
    tags: ["writer", "twitter", "how-to"],
    heroTone: "distribution",
  },
  {
    slug: "uoink-any-page-crawl4ai-fork",
    title: "Uoink Any Page: Our Crawl4AI Fork",
    dek: "How universal page capture works inside the local helper, and why allowlists matter.",
    publishedAt: "2026-05-24",
    readingMinutes: 7,
    tags: ["capture", "agent-dev", "launch"],
    heroTone: "capture",
  },
  {
    slug: "voice-dna-how-uoink-writes",
    title: "Voice DNA: How Uoink Writes",
    dek: "The house rules behind Uoink's writing surfaces: short paragraphs, concrete claims, zero AI slop.",
    publishedAt: "2026-05-23",
    readingMinutes: 6,
    tags: ["writer", "voice", "launch"],
    heroTone: "voice",
  },
];

export const blogTags = Array.from(new Set(blogArticles.flatMap((article) => article.tags))).sort();

export function getArticleUrl(slug: string) {
  return `${CANONICAL_URL}/blog/${slug}`;
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  const meta = blogArticles.find((article) => article.slug === slug);
  if (!meta) return undefined;

  const bodyPath = path.join(process.cwd(), "content", "blog", `${slug}.md`);
  const body = fs.readFileSync(bodyPath, "utf8");
  return { ...meta, body };
}

export function getAllArticles(): BlogArticle[] {
  return blogArticles.map((article) => {
    const full = getArticleBySlug(article.slug);
    if (!full) throw new Error(`Missing blog article ${article.slug}`);
    return full;
  });
}

export function getAdjacentArticles(slug: string) {
  const index = blogArticles.findIndex((article) => article.slug === slug);
  return {
    previous: index >= 0 ? blogArticles[index + 1] : undefined,
    next: index > 0 ? blogArticles[index - 1] : undefined,
  };
}

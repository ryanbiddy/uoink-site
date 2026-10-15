"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { BlogArticleMeta } from "./blog-data";

export function BlogIndexClient({ articles, tags }: { articles: BlogArticleMeta[]; tags: string[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (tag && tags.includes(tag)) setActiveTag(tag);
  }, [tags]);

  const filteredArticles = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesTag = activeTag === "all" || article.tags.includes(activeTag);
      const searchable = `${article.title} ${article.dek} ${article.tags.join(" ")}`.toLowerCase();
      const matchesQuery = !cleanQuery || searchable.includes(cleanQuery);
      return matchesTag && matchesQuery;
    });
  }, [activeTag, articles, query]);

  return (
    <section className="section flush" data-screen-label="blog / index">
      <div className="container">
        <div className="doc">
          <div className="blog-tools" aria-label="Blog filters">
            <label className="blog-search">
              <span>Search the field notes</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="hooks, MCP, local-first..."
              />
            </label>
            <div className="blog-tag-row" aria-label="Filter by tag">
              <button type="button" className={activeTag === "all" ? "active" : ""} onClick={() => setActiveTag("all")}>
                All
              </button>
              {tags.map((tag) => (
                <button key={tag} type="button" className={activeTag === tag ? "active" : ""} onClick={() => setActiveTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <ul className="doc-list linked blog-list" aria-live="polite">
            {filteredArticles.map((article) => (
              <li key={article.slug}>
                <Link className="doc-row" href={`/blog/${article.slug}`}>
                  <span className="eyebrow">{article.tags.slice(0, 2).join(" / ")}</span>
                  <h2>{article.title}</h2>
                  <p>{article.dek}</p>
                  <span className="doc-meta">
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    <span>{article.readingMinutes} min read</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {!filteredArticles.length ? (
            <div className="empty-state">
              <span className="eyebrow">no match</span>
              <p>Try another keyword or clear the tag filter.</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

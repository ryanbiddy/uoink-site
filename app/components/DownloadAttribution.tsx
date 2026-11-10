"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Adds where a visitor came from to the tracked download links
// (https://usage.uoink.app/get/<platform>?v=...). The values live in module scope
// only: no cookies, no localStorage, no sessionStorage. Client-side navigation keeps
// the original document.referrer, so this survives page changes.

const GET_PREFIX = "https://usage.uoink.app/get/";
const OWN_HOSTS = ["uoink.app", "www.uoink.app"];
const TAG = /^[a-z0-9._-]{1,48}$/;

type Captured = Record<string, string>;
let captured: Captured | null = null;

function clean(value: string | null): string | null {
  const v = (value ?? "").trim().toLowerCase();
  return TAG.test(v) ? v : null;
}

function capture(): Captured {
  if (captured) return captured;
  const out: Captured = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      const v = clean(params.get(key));
      if (v) out[key] = v;
    }
  } catch {
    // ignore: attribution is optional
  }
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.toLowerCase();
      if (!OWN_HOSTS.includes(host)) {
        const v = clean(host);
        if (v) out.ref = v;
      }
    }
  } catch {
    // ignore: attribution is optional
  }
  captured = out;
  return out;
}

function pageSlug(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "home";
  const slug = parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return slug || "home";
}

function rewrite(anchors: Iterable<HTMLAnchorElement>) {
  const extra = capture();
  const from = pageSlug(window.location.pathname);
  for (const a of anchors) {
    const href = a.getAttribute("href");
    if (!href || !href.startsWith(GET_PREFIX)) continue;
    let url: URL;
    try {
      url = new URL(href);
    } catch {
      continue;
    }
    let changed = false;
    const add = (k: string, v: string) => {
      if (!url.searchParams.has(k)) {
        url.searchParams.set(k, v);
        changed = true;
      }
    };
    add("from", from);
    for (const [k, v] of Object.entries(extra)) add(k, v);
    if (changed) a.setAttribute("href", url.toString());
  }
}

function rewriteAll() {
  rewrite(document.querySelectorAll<HTMLAnchorElement>(`a[href^="${GET_PREFIX}"]`));
}

function onClick(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const a = target.closest<HTMLAnchorElement>(`a[href^="${GET_PREFIX}"]`);
  if (a) rewrite([a]);
}

export function DownloadAttribution() {
  const pathname = usePathname();

  useEffect(() => {
    rewriteAll();
  }, [pathname]);

  useEffect(() => {
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  return null;
}

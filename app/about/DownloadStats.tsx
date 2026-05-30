"use client";

import { useEffect, useState } from "react";

type DownloadAsset = {
  name: string;
  count: number;
  size: number;
  url?: string;
};

type ReleaseDownload = {
  tag: string;
  name?: string;
  url?: string;
  publishedAt?: string;
  downloads: number;
  assets: DownloadAsset[];
};

type DownloadStatsPayload = {
  lifetime: number;
  byRelease: ReleaseDownload[];
  refreshedAt: string;
  source: string;
};

type GitHubAsset = {
  name: string;
  download_count: number;
  size: number;
  browser_download_url?: string;
};

type GitHubRelease = {
  tag_name: string;
  name?: string;
  html_url?: string;
  published_at?: string;
  assets?: GitHubAsset[];
};

const GITHUB_RELEASES_API = "https://api.github.com/repos/ryanbiddy/uoink/releases";
const ONE_HOUR = 60 * 60 * 1000;

let inTabCache: { fetchedAt: number; data: DownloadStatsPayload } | null = null;

export function DownloadStats() {
  const [stats, setStats] = useState<DownloadStatsPayload | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function refresh(preferStaticSnapshot = true) {
      try {
        const data = await loadStats(preferStaticSnapshot);
        if (!cancelled) {
          setStats(data);
          setState("ready");
        }
      } catch {
        if (!cancelled) {
          setState("error");
        }
      }
    }

    refresh();
    const timer = window.setInterval(() => refresh(false), ONE_HOUR);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="section" data-screen-label="about / downloads" id="downloads">
      <div className="container">
        <div className="download-stats">
          <div className="download-copy">
            <span className="eyebrow">downloads</span>
            <h2 className="display-l">
              Total downloads. <em>That&apos;s it.</em>
            </h2>
            <p className="body-l">
              This number comes from GitHub&apos;s public Releases API. We don&apos;t track who downloaded
              Uoink, where they came from, or what they did next.
            </p>
            <p className="download-note">
              Source: <a href="https://github.com/ryanbiddy/uoink/releases">github.com/ryanbiddy/uoink/releases</a> /
              refreshed hourly in this tab / no user tracking
            </p>
          </div>

          <div className="download-ledger" aria-live="polite">
            {state === "loading" && <StatsSkeleton />}
            {state === "error" && (
              <div className="download-error">
                <span className="mini-heading">GitHub is not answering right now.</span>
                <p>The public download counter will retry on the next refresh.</p>
              </div>
            )}
            {state === "ready" && stats && (
              <div className="download-total">
                <span>{formatNumber(stats.lifetime)}</span>
                <small>total downloads</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

async function loadStats(preferStaticSnapshot: boolean): Promise<DownloadStatsPayload> {
  if (inTabCache && Date.now() - inTabCache.fetchedAt < ONE_HOUR) {
    return inTabCache.data;
  }

  if (preferStaticSnapshot) {
    try {
      const snapshot = await fetchJson<DownloadStatsPayload>("/api/stats/downloads");
      if (Date.now() - Date.parse(snapshot.refreshedAt) < ONE_HOUR) {
        inTabCache = { fetchedAt: Date.now(), data: snapshot };
        return snapshot;
      }
    } catch {
      // Static-export builds may not have a live route. Fall through to GitHub's public API.
    }
  }

  const releases = await fetchJson<GitHubRelease[]>(GITHUB_RELEASES_API);
  const data = transformReleases(releases);
  inTabCache = { fetchedAt: Date.now(), data };
  return data;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function transformReleases(releases: GitHubRelease[]): DownloadStatsPayload {
  const byRelease = releases.map((release) => {
    const assets =
      release.assets?.map((asset) => ({
        name: asset.name,
        count: asset.download_count,
        size: asset.size,
        url: asset.browser_download_url,
      })) ?? [];
    const downloads = assets.reduce((sum, asset) => sum + asset.count, 0);

    return {
      tag: release.tag_name,
      name: release.name,
      url: release.html_url,
      publishedAt: release.published_at,
      downloads,
      assets,
    };
  });

  return {
    lifetime: byRelease.reduce((sum, release) => sum + release.downloads, 0),
    byRelease,
    refreshedAt: new Date().toISOString(),
    source: GITHUB_RELEASES_API,
  };
}

function StatsSkeleton() {
  return (
    <div className="download-total is-loading">
      <span>...</span>
      <small>asking GitHub</small>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}


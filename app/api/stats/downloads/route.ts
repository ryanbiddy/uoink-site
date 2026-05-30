import { NextResponse } from "next/server";

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

const RELEASES_URL = "https://api.github.com/repos/ryanbiddy/uoink/releases";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const response = await fetch(RELEASES_URL, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "GitHub releases unavailable", status: response.status },
      { status: 502 },
    );
  }

  const releases = (await response.json()) as GitHubRelease[];
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

  return NextResponse.json(
    {
      lifetime: byRelease.reduce((sum, release) => sum + release.downloads, 0),
      byRelease,
      refreshedAt: new Date().toISOString(),
      source: RELEASES_URL,
    },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}

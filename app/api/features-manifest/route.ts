import { NextResponse } from "next/server";
import { CANONICAL_URL, VERSION } from "../../content/pages";
import { featureCategories, features } from "../../features/feature-data";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  return NextResponse.json({
    product: "Uoink",
    version: VERSION,
    generated: "2026-05-30",
    canonical: `${CANONICAL_URL}/features`,
    featureCount: features.length,
    categories: featureCategories.map((category) => ({
      name: category.name,
      deck: category.deck,
      features: features
        .filter((feature) => feature.category === category.name)
        .map((feature) => ({
          slug: feature.slug,
          name: feature.title,
          status: feature.status,
          category: feature.category,
          summary: feature.summary,
          url: `${CANONICAL_URL}/features/${feature.slug}`,
          embedUrl: `${CANONICAL_URL}/features/${feature.slug}?embed=true`,
          mcpTools: feature.mcpTools,
        })),
    })),
    features: features.map((feature) => ({
      slug: feature.slug,
      name: feature.title,
      status: feature.status,
      category: feature.category,
      summary: feature.summary,
      url: `${CANONICAL_URL}/features/${feature.slug}`,
      embedUrl: `${CANONICAL_URL}/features/${feature.slug}?embed=true`,
      mcpTools: feature.mcpTools,
      related: feature.related,
    })),
  });
}


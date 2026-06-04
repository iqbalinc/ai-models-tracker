/**
 * GET /api/models
 *
 * Fetches AI model data directly from Wikipedia — no database, no secrets,
 * no environment variables required. Cached by Next.js for 1 hour so every
 * visitor gets fresh data without hammering Wikipedia.
 *
 * Cost: $0. Dependencies: none beyond the app itself.
 */

import { NextResponse } from "next/server";
import { fetchAndParseWikipediaTables } from "@/lib/scraper";
import { classifyCategory, inferCountry, buildDescription, normalizeLicense } from "@/lib/classifier";
import { sortByPopularity } from "@/lib/popularity";
import type { AIModel } from "@/lib/types";

// Cache at the CDN edge — revalidate every hour automatically
export const revalidate = 3600;

export async function GET() {
  try {
    const rows = await fetchAndParseWikipediaTables();

    if (!rows.length) {
      return NextResponse.json(
        { error: "Wikipedia returned no data — try again shortly." },
        { status: 503 }
      );
    }

    const models: AIModel[] = rows.map((row, i) => ({
      id:          `wiki-${i}`,
      company:     row.developer,
      country:     inferCountry(row.developer),
      model:       row.name,
      category:    classifyCategory(row),
      description: buildDescription(row),
      year:        row.year,
      open_source: normalizeLicense(row.license),
      created_at:  new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    }));

    return NextResponse.json({
      models: sortByPopularity(models),
      updatedAt:  new Date().toISOString(),
      source:     "Wikipedia — List of large language models",
      totalCount: models.length,
    });
  } catch (err) {
    console.error("[/api/models] Wikipedia fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch models from Wikipedia." },
      { status: 500 }
    );
  }
}

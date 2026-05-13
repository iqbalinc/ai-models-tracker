/**
 * Zero-cost model updater.
 *
 * Replaces the previous OpenAI-based approach with a fully free pipeline:
 *   1. fetchAndParseWikipediaTables()  — Wikipedia MediaWiki API (free)
 *   2. classifyCategory()             — keyword rules (free)
 *   3. inferCountry()                 — lookup table (free)
 *   4. buildDescription()             — template from structured data (free)
 *
 * Total API cost per run: $0.00
 */

import type { AIModelInsert } from "./types";
import { fetchAndParseWikipediaTables } from "./scraper";
import { classifyCategory, inferCountry, buildDescription, normalizeLicense } from "./classifier";

export async function identifyNewModels(
  _unused_content: string,        // kept for API compatibility with route.ts
  existingModelNames: string[]
): Promise<AIModelInsert[]> {
  const existingSet = new Set(
    existingModelNames.map((n) => n.toLowerCase().trim())
  );

  const rows = await fetchAndParseWikipediaTables();
  const results: AIModelInsert[] = [];

  for (const row of rows) {
    const normalized = row.name.toLowerCase().trim();
    if (existingSet.has(normalized)) continue; // already in database

    results.push({
      company:     row.developer,
      country:     inferCountry(row.developer),
      model:       row.name,
      category:    classifyCategory(row),
      description: buildDescription(row),
      year:        row.year,
      open_source: normalizeLicense(row.license),
    });
  }

  return results;
}

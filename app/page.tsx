/**
 * Home page — fetches AI model data directly from Wikipedia at build/request
 * time. No database, no secrets, no environment variables required.
 *
 * Next.js caches this for 1 hour (ISR). Every visitor sees data that is at
 * most 1 hour old without any manual refresh step.
 */

import { fetchAndParseWikipediaTables } from "@/lib/scraper";
import { classifyCategory, inferCountry, buildDescription, normalizeLicense } from "@/lib/classifier";
import { sortByPopularity } from "@/lib/popularity";
import { SEED_MODELS } from "@/lib/seed-data";
import type { AIModel } from "@/lib/types";
import Header from "@/components/Header";
import ModelExplorer from "./ModelExplorer";

// ISR — Next.js rebuilds this page in the background every hour
export const revalidate = 3600;

async function getModels(): Promise<{ models: AIModel[]; updatedAt: string }> {
  try {
    const rows = await fetchAndParseWikipediaTables();

    if (!rows.length) throw new Error("Wikipedia returned no rows");

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

    return { models: sortByPopularity(models), updatedAt: new Date().toISOString() };
  } catch (err) {
    console.warn("[page] Wikipedia fetch failed, using seed data:", err);

    // Fallback: built-in seed data — always works, never needs a database
    const seedAsModels: AIModel[] = SEED_MODELS.map((m, i) => ({
      ...m,
      id:         `seed-${i}`,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    }));

    return {
      models:    seedAsModels,
      updatedAt: "2026-05-12T00:00:00Z",
    };
  }
}

export default async function HomePage() {
  const { models, updatedAt } = await getModels();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header lastUpdated={updatedAt} />
      <ModelExplorer models={models} updatedAt={updatedAt} />
    </div>
  );
}

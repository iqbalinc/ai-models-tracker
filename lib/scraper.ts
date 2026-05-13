/**
 * Fetches and parses the Wikipedia "List of large language models" page.
 *
 * Uses two FREE APIs — no key, no cost, no rate limits worth worrying about:
 *   1. Wikipedia MediaWiki parse API  → returns rendered HTML
 *   2. Cheerio                        → parses HTML tables into structured rows
 *
 * Cost: $0 forever.
 */

import { load } from "cheerio";

const WIKI_PARSE_URL =
  "https://en.wikipedia.org/w/api.php" +
  "?action=parse&page=List_of_large_language_models" +
  "&prop=text&format=json&disableeditsection=1";

export interface WikiRow {
  name: string;        // model name
  developer: string;   // company / org
  releaseDate: string; // raw date string e.g. "Mar 2024"
  year: string;        // 4-digit year extracted
  params: string;      // parameter count e.g. "70B"
  license: string;     // e.g. "MIT", "Proprietary"
  notes: string;       // extra context
}

/** Strip all HTML tags and collapse whitespace */
function cleanText(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse a raw date string like "Mar 2024" or "Jun 11" → 4-digit year */
function extractYear(date: string): string {
  const m = date.match(/\b(20\d{2})\b/);
  return m ? m[1] : "";
}

export async function fetchAndParseWikipediaTables(): Promise<WikiRow[]> {
  try {
    const res = await fetch(WIKI_PARSE_URL, {
      headers: { "User-Agent": "ai-models-tracker/1.0 (open-source project)" },
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);

    const json = await res.json();
    const html: string = json?.parse?.text?.["*"] ?? "";
    if (!html) return [];

    const $ = load(html);
    const rows: WikiRow[] = [];

    // Each wikitable on the page is one year-section of models
    $("table.wikitable").each((_, table) => {
      // Get column headers
      const headers: string[] = $(table)
        .find("tr:first-child th")
        .map((_, th) => cleanText($(th).html() ?? "").toLowerCase())
        .toArray();

      if (!headers.length) return; // skip tables with no header row

      // Column index helpers (columns vary slightly by year section)
      const col = (name: string) =>
        headers.findIndex((h) => h.includes(name));

      const iName      = col("name");
      const iDeveloper = col("developer");
      const iDate      = col("release");
      const iParams    = col("parameter");
      const iLicense   = col("license");
      const iNotes     = col("note");

      if (iName < 0 || iDeveloper < 0) return; // not a model table

      // Parse data rows (skip header row)
      $(table)
        .find("tr")
        .slice(1)
        .each((_, tr) => {
          const cells = $(tr).find("td");
          if (!cells.length) return;

          const cell = (i: number) =>
            i >= 0 ? cleanText($(cells.get(i) ?? "").html() ?? "") : "";

          const rawDate = cell(iDate);
          const year    = extractYear(rawDate);

          rows.push({
            name:        cell(iName),
            developer:   cell(iDeveloper),
            releaseDate: rawDate,
            year:        year || new Date().getFullYear().toString(),
            params:      cell(iParams),
            license:     cell(iLicense),
            notes:       cell(iNotes),
          });
        });
    });

    return rows.filter((r) => r.name && r.developer);
  } catch (err) {
    console.error("[scraper] Wikipedia parse failed:", err);
    return [];
  }
}

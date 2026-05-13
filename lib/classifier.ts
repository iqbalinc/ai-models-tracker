/**
 * Rule-based classifier — assigns category, country, and generates a
 * plain-English description from structured Wikipedia table data.
 *
 * No API calls. No cost. Runs in < 1ms per model.
 */

import type { ModelCategory } from "./types";
import type { WikiRow } from "./scraper";

// ── Developer → Country lookup ────────────────────────────────────────────────
const DEVELOPER_COUNTRY: Record<string, string> = {
  "openai":                        "USA",
  "anthropic":                     "USA",
  "google":                        "USA/UK",
  "google deepmind":               "USA/UK",
  "deepmind":                      "USA/UK",
  "meta":                          "USA",
  "meta ai":                       "USA",
  "meta platforms":                "USA",
  "meta superintelligence":        "USA",
  "microsoft":                     "USA",
  "xai":                           "USA",
  "x.ai":                          "USA",
  "amazon":                        "USA",
  "nvidia":                        "USA",
  "databricks":                    "USA",
  "ibm":                           "USA",
  "bloomberg":                     "USA",
  "eleutherai":                    "USA",
  "allen institute":               "USA",
  "ai2":                           "USA",
  "cerebras":                      "USA",
  "cohere":                        "Canada",
  "deepseek":                      "China",
  "alibaba":                       "China",
  "alibaba cloud":                 "China",
  "qwen":                          "China",
  "baidu":                         "China",
  "huawei":                        "China",
  "moonshot":                      "China",
  "moonshot ai":                   "China",
  "xiaomi":                        "China",
  "stepfun":                       "China",
  "minimax":                       "China",
  "zhipu":                         "China",
  "z.ai":                          "China",
  "01.ai":                         "China",
  "bytedance":                     "China",
  "tencent":                       "China",
  "mistral":                       "France",
  "mistral ai":                    "France",
  "yandex":                        "Russia",
  "sarvam":                        "India",
  "sarvam ai":                     "India",
  "bharatgen":                     "India",
  "tii":                           "UAE",
  "technology innovation institute":"UAE",
  "fujitsu":                       "Japan",
  "riken":                         "Japan",
  "ai21":                          "Israel",
  "ai21 labs":                     "Israel",
  "eth":                           "Switzerland",
  "eth zurich":                    "Switzerland",
  "hugging face":                  "International",
  "laion":                         "International",
  "bigscience":                    "International",
};

/** Look up country from a developer string (case-insensitive, partial match) */
export function inferCountry(developer: string): string {
  const lower = developer.toLowerCase();
  // Exact match first
  if (DEVELOPER_COUNTRY[lower]) return DEVELOPER_COUNTRY[lower];
  // Partial match
  for (const [key, country] of Object.entries(DEVELOPER_COUNTRY)) {
    if (lower.includes(key)) return country;
  }
  return "Unknown";
}

// ── Category rules (order matters — first match wins) ─────────────────────────
const CATEGORY_RULES: Array<{ pattern: RegExp; category: ModelCategory }> = [
  { pattern: /dall-?e|sora|imagen|stable.diffusion|video.gen|text.to.image|text.to.video|veo|wan\b/i, category: "Image/Video" },
  { pattern: /whisper|speech.to.text|text.to.speech|asr\b/i,                                          category: "Multilingual" },
  { pattern: /\bcode\b|codex|\bcoder\b|coding|programming|software.eng|swe.bench|devin/i,             category: "Code" },
  { pattern: /reason|thinking|chain.of.thought|\bo1\b|\bo3\b|\br1\b|deepthink|step.think/i,           category: "Reasoning" },
  { pattern: /mixture.of.experts|moe\b|mixtral|sparse.attention|8x7b|8x22b/i,                         category: "MoE" },
  { pattern: /agentic|agent.swarm|autonomous.task|long.horizon|tool.use.*agent/i,                     category: "Agentic" },
  { pattern: /multimodal|vision|image.understand|audio|omni.modal|text.*image.*audio/i,               category: "Multimodal" },
  { pattern: /bloom\b|multilingual|polyglot|indic|hindi|arabic|japanese.lang|aya\b/i,                 category: "Multilingual" },
  { pattern: /finance|financial|bloomberg|medical|legal|domain.specific|sarvam|param\b|ernie|yalm/i, category: "Domain" },
  { pattern: /bert\b|t5\b|encoder|xlnet|gopher|chinchilla|research.model|pre.train|flan\b/i,          category: "Research" },
  { pattern: /phi-|gemma\b|small.language|slm\b|mobile|on.device|1\.3b|2\.7b|3\.8b|7b\b/i,           category: "Small LLM" },
];

/** Assign a category using rule-based keyword matching */
export function classifyCategory(row: WikiRow): ModelCategory {
  const text = `${row.name} ${row.notes}`.toLowerCase();

  // Check param count for Small LLM
  const paramNum = parseFloat(row.params ?? "");
  if (!isNaN(paramNum) && paramNum > 0 && paramNum <= 14) return "Small LLM";

  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(text)) return rule.category;
  }

  return "Text LLM"; // safe default
}

/** Build a plain-English description from structured table data — no AI */
export function buildDescription(row: WikiRow): string {
  const parts: string[] = [];

  if (row.params && row.params !== "Unknown" && row.params !== "") {
    parts.push(`${row.params}-parameter model from ${row.developer}`);
  } else {
    parts.push(`Language model from ${row.developer}`);
  }

  if (row.notes && row.notes.length > 10) {
    // Truncate notes to a readable length
    const note = row.notes.replace(/\[\d+\]/g, "").trim();
    parts.push(note.slice(0, 180));
  }

  if (
    row.license &&
    row.license !== "Unknown" &&
    !row.license.toLowerCase().includes("proprietary")
  ) {
    parts.push(`Licensed under ${row.license}.`);
  }

  return parts.join(". ").slice(0, 250);
}

/** Normalise a license string */
export function normalizeLicense(raw: string): string {
  if (!raw || raw === "Unknown") return "Unknown";
  const lower = raw.toLowerCase();
  if (lower.includes("proprietary") || lower.includes("commercial")) return "Proprietary";
  if (lower.includes("mit")) return "MIT";
  if (lower.includes("apache")) return "Apache 2.0";
  if (lower.includes("cc-by"))  return raw.replace(/[^A-Za-z0-9. -]/g, "").trim();
  return raw.slice(0, 40);
}

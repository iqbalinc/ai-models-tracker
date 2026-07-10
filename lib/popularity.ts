/**
 * Popularity scoring for AI models.
 *
 * Scores are relative, not absolute — the goal is a reasonable ranked order
 * that puts universally-known models (GPT-4o, Claude, Gemini, Llama) at the
 * top and puts niche / research models near the bottom.
 *
 * Two components:
 *  1. Company score  — how prominent is the org (0–100)
 *  2. Name boost     — extra points if the model name matches a known hit series
 *
 * Within the same final score, ties are broken by year (newest first).
 */

import type { AIModel } from "./types";

// ── Company prominence scores ─────────────────────────────────────────────────
// Based on global media coverage, user-base size, and industry impact.
const COMPANY_SCORES: Record<string, number> = {
  "openai":                         100,
  "google":                          98,
  "google deepmind":                 98,
  "deepmind":                        96,
  "anthropic":                       94,
  "meta":                            92,
  "meta ai":                         92,
  "meta platforms":                  92,
  "meta superintelligence":          90,
  "microsoft":                       88,
  "x.ai":                            82,
  "xai":                             82,
  "amazon":                          78,
  "nvidia":                          76,
  "mistral":                         72,
  "mistral ai":                      72,
  "deepseek":                        70,
  "cohere":                          62,
  "databricks":                      60,
  "alibaba":                         58,
  "alibaba cloud":                   58,
  "qwen":                            56,
  "baidu":                           54,
  "bytedance":                       52,
  "tencent":                         50,
  "huawei":                          48,
  "moonshot ai":                     44,
  "moonshot":                        44,
  "01.ai":                           42,
  "zhipu":                           40,
  "minimax":                         40,
  "stepfun":                         38,
  "z.ai":                            38,
  "xiaomi":                          36,
  "ibm":                             56,
  "bloomberg":                       50,
  "eleutherai":                      45,
  "ai2":                             43,
  "allen institute":                 43,
  "cerebras":                        40,
  "hugging face":                    55,
  "bigscience":                      42,
  "laion":                           38,
  "ai21":                            44,
  "ai21 labs":                       44,
  "yandex":                          40,
  "tii":                             36,
  "technology innovation institute": 36,
  "sarvam":                          28,
  "sarvam ai":                       28,
  "bharatgen":                       22,
  "fujitsu":                         30,
  "riken":                           28,
  "eth":                             32,
  "eth zurich":                      32,
};

// ── Well-known model series — extra points by name substring match ────────────
// Listed roughly in order of public recognition.
const MODEL_BOOSTS: Array<[RegExp, number]> = [
  [/gpt-?4/i,              50],
  [/gpt-?4o/i,             52],  // more specific, higher
  [/gpt-?o/i,              48],
  [/gpt-?3/i,              40],
  [/claude\s*3/i,          48],
  [/claude/i,              44],
  [/gemini\s*(1\.5|2|pro|ultra)/i, 48],
  [/gemini/i,              44],
  [/llama\s*[23]/i,        46],
  [/llama/i,               42],
  [/grok-?[23]/i,          44],
  [/grok/i,                40],
  [/deepseek-?r/i,         42],  // DeepSeek-R1 was huge
  [/deepseek/i,            38],
  [/mistral\s*(large|medium|small|7b|8x)/i, 38],
  [/mixtral/i,             36],
  [/command\s*r/i,         34],  // Cohere Command R
  [/dall-?e/i,             38],
  [/sora/i,                42],
  [/stable\s*diffusion/i,  38],
  [/whisper/i,             36],
  [/codex/i,               32],
  [/copilot/i,             34],
  [/phi-?[234]/i,          34],  // Microsoft Phi
  [/qwen\s*[23]/i,         32],
  [/ernie/i,               28],  // Baidu
  [/falcon/i,              28],
  [/bloom/i,               26],
  [/palm\s*[2e]/i,         32],
  [/palm/i,                28],
  [/bard/i,                30],
  [/galaxy\s*ai/i,         26],
];

/** Look up the company base score (exact then partial match). */
function companyBaseScore(company: string): number {
  const key = company.toLowerCase().trim();
  if (COMPANY_SCORES[key]) return COMPANY_SCORES[key];
  for (const [k, score] of Object.entries(COMPANY_SCORES)) {
    if (key.includes(k)) return score;
  }
  return 0;
}

/** Name boost for a specific model. */
function modelNameBoost(modelName: string): number {
  let best = 0;
  for (const [pattern, boost] of MODEL_BOOSTS) {
    if (pattern.test(modelName)) best = Math.max(best, boost);
  }
  return best;
}

/**
 * Extract a [major, minor, patch] version tuple from a model name.
 *
 * Strategy:
 *  1. Look for X.Y.Z  (e.g. "3.5.1")
 *  2. Look for X.Y    (e.g. "GPT-4.5", "Claude 3.5", "Llama 3.1")
 *  3. Look for a standalone X that isn't a parameter count
 *     — skips numbers immediately followed by B/M/K/T (billions, millions, etc.)
 *       e.g. "70B", "8B" are param counts, not versions
 *  4. No version found → [Infinity, Infinity, Infinity] so it sorts to the end
 *
 * Examples:
 *  "GPT-4.5"           → [4, 5, 0]
 *  "GPT-5.5"           → [5, 5, 0]
 *  "Claude 3.5 Sonnet" → [3, 5, 0]
 *  "Llama 3.1 70B"     → [3, 1, 0]   (70B skipped)
 *  "o1"                → [1, 0, 0]
 *  "o4-mini"           → [4, 0, 0]
 *  "GPT-4o"            → [4, 0, 0]
 *  "BERT"              → [∞, ∞, ∞]  → sorts alphabetically at end
 */
function extractVersion(name: string): [number, number, number] {
  let m: RegExpMatchArray | null;

  // X.Y.Z
  m = name.match(/(\d+)\.(\d+)\.(\d+)/);
  if (m) return [+m[1], +m[2], +m[3]];

  // X.Y
  m = name.match(/(\d+)\.(\d+)/);
  if (m) return [+m[1], +m[2], 0];

  // Standalone integer not followed by a param-count suffix (B/M/K/T)
  m = name.match(/\b(\d+)\b(?![BMKTbmkt])/);
  if (m) return [+m[1], 0, 0];

  return [Infinity, Infinity, Infinity];
}

/**
 * Sort models grouped by company (most popular company first),
 * then within each company by version number ascending
 * (e.g. GPT-4 → GPT-4.5 → GPT-5 → GPT-5.5).
 *
 * Models with no version number sort alphabetically after all versioned ones.
 */
export function sortByPopularity(models: AIModel[]): AIModel[] {
  // Compute the best score for each company so a niche model doesn't bury its org.
  const companyScore = new Map<string, number>();
  for (const m of models) {
    const score = companyBaseScore(m.company);
    const prev  = companyScore.get(m.company) ?? 0;
    if (score > prev) companyScore.set(m.company, score);
  }

  return [...models].sort((a, b) => {
    // 1. Company group — higher company score first
    const companyDiff = (companyScore.get(b.company) ?? 0) - (companyScore.get(a.company) ?? 0);
    if (companyDiff !== 0) return companyDiff;

    // 2. Within same company — version number ascending (4 → 4.5 → 5 → 5.5)
    const [aMaj, aMin, aPat] = extractVersion(a.model);
    const [bMaj, bMin, bPat] = extractVersion(b.model);

    if (aMaj !== bMaj) return aMaj - bMaj;
    if (aMin !== bMin) return aMin - bMin;
    if (aPat !== bPat) return aPat - bPat;

    // 3. Same version tuple (or both unversioned) — alphabetical by model name
    //    This also handles the case where both are unversioned (Infinity ties)
    return a.model.localeCompare(b.model);
  });
}

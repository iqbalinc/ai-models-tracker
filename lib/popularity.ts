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

/** Return a numeric popularity score for a model. Higher = more popular. */
export function popularityScore(model: AIModel): number {
  const devKey = model.company.toLowerCase().trim();

  // Company base score — exact then partial match
  let companyScore = COMPANY_SCORES[devKey] ?? 0;
  if (!companyScore) {
    for (const [key, score] of Object.entries(COMPANY_SCORES)) {
      if (devKey.includes(key)) { companyScore = score; break; }
    }
  }

  // Model name boost
  let nameBoost = 0;
  for (const [pattern, boost] of MODEL_BOOSTS) {
    if (pattern.test(model.model)) {
      nameBoost = Math.max(nameBoost, boost);
    }
  }

  // Recency bonus: +1 per year above 2020 (max +6 for 2026)
  const year = parseInt(model.year, 10) || 2020;
  const recency = Math.max(0, year - 2020);

  return companyScore + nameBoost + recency;
}

/** Sort models by popularity descending; ties broken by year then company. */
export function sortByPopularity(models: AIModel[]): AIModel[] {
  return [...models].sort((a, b) => {
    const diff = popularityScore(b) - popularityScore(a);
    if (diff !== 0) return diff;
    // Tie-break: newer first, then alphabetical company
    if (b.year !== a.year) return b.year.localeCompare(a.year);
    return a.company.localeCompare(b.company);
  });
}

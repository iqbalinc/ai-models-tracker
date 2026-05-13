/**
 * POST /api/refresh
 * Called by the weekly GitHub Actions cron job.
 * 1. Parses Wikipedia tables directly (no AI, no cost)
 * 2. Classifies new models with keyword rules
 * 3. Upserts new models to Supabase
 * 4. Returns a summary of what changed
 *
 * Protected by REFRESH_SECRET header — never expose this endpoint publicly.
 * Cost per run: $0.00
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { identifyNewModels } from "@/lib/ai-updater";

export async function POST(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const secret = req.headers.get("x-refresh-secret");
  if (!secret || secret !== process.env.REFRESH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const supabase = createAdminClient();

  // ── Get existing model names to avoid duplicates ─────────────────────────
  const { data: existing, error: fetchError } = await supabase
    .from("models")
    .select("model, company");

  if (fetchError) {
    return NextResponse.json({ error: "DB read failed", detail: fetchError.message }, { status: 500 });
  }

  const existingNames = (existing ?? []).map((m) => `${m.company} ${m.model}`);

  // ── Parse Wikipedia tables and classify (zero cost) ───────────────────────
  console.log("[refresh] Parsing Wikipedia tables...");
  const newModels = await identifyNewModels("", existingNames);

  if (!newModels.length) {
    return NextResponse.json({
      message: "No new models found",
      added: 0,
      elapsed_ms: Date.now() - startedAt,
    });
  }

  // ── Upsert to Supabase ────────────────────────────────────────────────────
  const { data: upserted, error: upsertError } = await supabase
    .from("models")
    .upsert(newModels, { onConflict: "company,model", ignoreDuplicates: false })
    .select("model, company");

  if (upsertError) {
    return NextResponse.json(
      { error: "DB upsert failed", detail: upsertError.message, newModels },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Refresh complete",
    added: upserted?.length ?? 0,
    models: upserted?.map((m) => `${m.company} ${m.model}`),
    elapsed_ms: Date.now() - startedAt,
  });
}

/**
 * Seed the Supabase database with the initial 90+ models.
 *
 * Usage:
 *   cp .env.local.example .env.local   # fill in your credentials
 *   npm run seed
 */

import { createClient } from "@supabase/supabase-js";
import { SEED_MODELS } from "../lib/seed-data";
import * as dotenv from "node:process";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "❌  Missing env vars. Copy .env.local.example → .env.local and fill in credentials."
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  console.log(`Seeding ${SEED_MODELS.length} models…`);

  const { data, error } = await supabase
    .from("models")
    .upsert(SEED_MODELS, { onConflict: "company,model", ignoreDuplicates: true })
    .select("id");

  if (error) {
    console.error("❌  Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅  Seeded ${data?.length ?? 0} rows (skipped existing duplicates).`);
}

main();

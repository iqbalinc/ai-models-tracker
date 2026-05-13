import { createBrowserClient } from "@/lib/supabase";
import { SEED_MODELS } from "@/lib/seed-data";
import type { AIModel } from "@/lib/types";
import Header from "@/components/Header";
import ModelExplorer from "./ModelExplorer";

export const revalidate = 3600; // ISR — rebuild page every hour

async function getModels(): Promise<{ models: AIModel[]; updatedAt: string }> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .order("year", { ascending: false })
      .order("company", { ascending: true });

    if (error || !data?.length) throw new Error("DB empty or error");

    return {
      models: data as AIModel[],
      updatedAt: new Date().toISOString(),
    };
  } catch {
    // Fallback: serve seed data when DB isn't configured yet
    const seedAsModels: AIModel[] = SEED_MODELS.map((m, i) => ({
      ...m,
      id: `seed-${i}`,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    }));
    return {
      models: seedAsModels,
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

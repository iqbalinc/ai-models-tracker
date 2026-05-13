import { NextResponse } from "next/server";
import { createBrowserClient } from "@/lib/supabase";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .order("year", { ascending: false })
      .order("company", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ models: data ?? [], updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[/api/models] Error:", err);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}

"use client";

import { useState, useMemo } from "react";
import type { AIModel, FilterState } from "@/lib/types";
import FilterBar from "@/components/FilterBar";
import ModelTable from "@/components/ModelTable";
import ModelCard  from "@/components/ModelCard";
import StatsGrid  from "@/components/StatsGrid";
import CategoryChart from "@/components/CategoryChart";

const DEFAULT_FILTERS: FilterState = {
  country: "All", category: "All", company: "All", search: "",
};

export default function ModelExplorer({
  models,
  updatedAt,
}: {
  models: AIModel[];
  updatedAt?: string;
}) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [view, setView]       = useState<"table" | "cards">("table");

  // Derived filter options
  const countries  = useMemo(() => [...new Set(models.map((m) => m.country))].sort(),  [models]);
  const categories = useMemo(() => [...new Set(models.map((m) => m.category))].sort(), [models]);
  const companies  = useMemo(() => [...new Set(models.map((m) => m.company))].sort(),  [models]);

  // Apply filters
  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return models.filter((m) => {
      if (filters.country  !== "All" && m.country  !== filters.country)  return false;
      if (filters.category !== "All" && m.category !== filters.category) return false;
      if (filters.company  !== "All" && m.company  !== filters.company)  return false;
      if (q && !`${m.model} ${m.company} ${m.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [models, filters]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Stats */}
      <StatsGrid models={models} />

      {/* Chart + category legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategoryChart models={models} />
        <div className="md:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Category Guide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {[
              ["Text LLM",    "#4f6bef", "General-purpose chat and text generation"],
              ["Reasoning",   "#f59e0b", "Think step-by-step (slow but accurate)"],
              ["Multimodal",  "#10b981", "Handles images, audio, video + text"],
              ["Code",        "#8b5cf6", "Writes and debugs software"],
              ["Small LLM",   "#06b6d4", "Efficient, <15B params, runs on-device"],
              ["MoE",         "#3b82f6", "Huge total params, tiny active compute"],
              ["Agentic",     "#ef4444", "Autonomous multi-step task execution"],
              ["Domain",      "#64748b", "Finance, science, specific languages"],
              ["Image/Video", "#ec4899", "Creates images or video from text"],
              ["Multilingual","#14b8a6", "Trained across many human languages"],
              ["Research",    "#a1a1aa", "Encoder/decoder NLP infrastructure"],
            ].map(([cat, color, desc]) => (
              <div key={cat} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">{cat}:</span>
                <span className="text-gray-500 dark:text-gray-400 truncate">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        countries={countries}
        categories={categories}
        companies={companies}
        resultCount={filtered.length}
        totalCount={models.length}
      />

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {filtered.length} model{filtered.length !== 1 ? "s" : ""}
        </h2>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["table", "cards"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === v
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {v === "table" ? "Table" : "Cards"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {view === "table" ? (
        <ModelTable models={filtered} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center py-16 text-gray-400 dark:text-gray-600">
              No models match your filters.
            </p>
          ) : (
            filtered.map((m) => <ModelCard key={m.id} model={m} />)
          )}
        </div>
      )}

      {updatedAt && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-600 pb-4">
          Data last refreshed {new Date(updatedAt).toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
          })}. Updates automatically every Monday.
        </p>
      )}
    </main>
  );
}

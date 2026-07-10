"use client";

import { useState, useMemo, useEffect } from "react";
import type { AIModel, FilterState } from "@/lib/types";
import FilterBar from "@/components/FilterBar";
import ModelTable from "@/components/ModelTable";
import ModelCard  from "@/components/ModelCard";
import StatsGrid  from "@/components/StatsGrid";
import CategoryChart from "@/components/CategoryChart";
import WorldMap from "@/components/WorldMap";

const DEFAULT_FILTERS: FilterState = {
  country: "All", category: "All", company: "All", search: "",
};

const CATEGORY_GUIDE = [
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
] as const;

export default function ModelExplorer({
  models,
  updatedAt,
}: {
  models: AIModel[];
  updatedAt?: string;
}) {
  const [tab, setTab]           = useState<"explorer" | "map">("explorer");
  const [filters, setFilters]   = useState<FilterState>(DEFAULT_FILTERS);
  const [showGuide, setGuide]   = useState(true);
  const [view, setView]         = useState<"table" | "cards">("cards");

  useEffect(() => {
    setView(window.innerWidth >= 768 ? "table" : "cards");
  }, []);

  const countries  = useMemo(() => Array.from(new Set(models.map((m) => m.country))).sort(),  [models]);
  const categories = useMemo(() => Array.from(new Set(models.map((m) => m.category))).sort(), [models]);
  const companies  = useMemo(() => Array.from(new Set(models.map((m) => m.company))).sort(),  [models]);

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">

      {/* Toolbar: tab switcher + stats + view toggle — all in one line */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-0.5">
          {([["explorer", "Explorer"], ["map", "World Map"]] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats strip — grows to fill middle */}
        <div className="flex-1 min-w-0">
          <StatsGrid models={models} />
        </div>

        {/* View toggle (only in explorer tab) */}
        {tab === "explorer" && (
          <div className="flex gap-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-0.5 shrink-0">
            {(["table", "cards"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  view === v
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {v === "table" ? "Table" : "Cards"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* World Map tab */}
      {tab === "map" && <WorldMap models={models} />}

      {/* Explorer tab */}
      {tab === "explorer" && (<>

        {/* Chart row + collapsible guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <CategoryChart models={models} />

          {/* Guide — collapsible to save vertical space */}
          <div className="md:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setGuide((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Category Guide
              </span>
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showGuide ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showGuide && (
              <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                {CATEGORY_GUIDE.map(([cat, color, desc]) => (
                  <div key={cat} className="flex items-center gap-2 text-[11px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-medium text-gray-800 dark:text-gray-200 shrink-0">{cat}:</span>
                    <span className="text-gray-400 dark:text-gray-500 truncate">{desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          countries={countries}
          categories={categories}
          companies={companies}
          resultCount={filtered.length}
          totalCount={models.length}
        />

        {/* Results */}
        {view === "table" ? (
          <ModelTable models={filtered} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filtered.length === 0 ? (
              <p className="col-span-full text-center py-12 text-xs text-gray-400 dark:text-gray-600">
                No models match your filters.
              </p>
            ) : (
              filtered.map((m) => <ModelCard key={m.id} model={m} />)
            )}
          </div>
        )}

        {updatedAt && (
          <p className="text-[10px] text-center text-gray-300 dark:text-gray-700 pb-2">
            Sourced live from Wikipedia · refreshes automatically every hour
          </p>
        )}
      </>)}

    </main>
  );
}

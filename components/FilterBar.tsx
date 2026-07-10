"use client";

import type { FilterState } from "@/lib/types";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  countries: string[];
  categories: string[];
  companies: string[];
  resultCount: number;
  totalCount: number;
}

const inputCls =
  "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 " +
  "text-gray-900 dark:text-white text-xs px-3 py-1.5 focus:outline-none focus:ring-2 " +
  "focus:ring-brand-500 focus:border-transparent w-full transition-colors " +
  "placeholder:text-gray-400 dark:placeholder:text-gray-600 min-h-[32px]";

export default function FilterBar({
  filters, onChange, countries, categories, companies, resultCount, totalCount,
}: FilterBarProps) {
  const set = (key: keyof FilterState) => (val: string) =>
    onChange({ ...filters, [key]: val });

  const hasActive =
    filters.country !== "All" ||
    filters.category !== "All" ||
    filters.company !== "All" ||
    filters.search !== "";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3">
      {/* Single row on md+: search | country | category | company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <input
          type="search"
          value={filters.search}
          onChange={(e) => set("search")(e.target.value)}
          placeholder="Search models, companies…"
          className={inputCls}
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
        />
        <select
          value={filters.country}
          onChange={(e) => set("country")(e.target.value)}
          className={inputCls}
        >
          <option value="All">All countries</option>
          {countries.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select
          value={filters.category}
          onChange={(e) => set("category")(e.target.value)}
          className={inputCls}
        >
          <option value="All">All categories</option>
          {categories.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select
          value={filters.company}
          onChange={(e) => set("company")(e.target.value)}
          className={inputCls}
        >
          <option value="All">All companies</option>
          {companies.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Result count + clear — compact, below filters */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-gray-400 dark:text-gray-500">
          <span className="font-medium text-gray-700 dark:text-gray-300">{resultCount}</span>
          {" "}of {totalCount} models
        </span>
        {hasActive && (
          <button
            onClick={() => onChange({ country: "All", category: "All", company: "All", search: "" })}
            className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

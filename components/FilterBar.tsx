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

function SelectField({
  label, value, options, onChange,
}: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="All">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
      {/* Search */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Search
        </label>
        <input
          type="search"
          value={filters.search}
          onChange={(e) => set("search")(e.target.value)}
          placeholder="Search model name, company, or description…"
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
        />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SelectField label="Country"  value={filters.country}  options={countries}  onChange={set("country")} />
        <SelectField label="Category" value={filters.category} options={categories} onChange={set("category")} />
        <SelectField label="Company"  value={filters.company}  options={companies}  onChange={set("company")} />
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-white">{resultCount}</span> of{" "}
          {totalCount} models
        </span>
        {hasActive && (
          <button
            onClick={() => onChange({ country: "All", category: "All", company: "All", search: "" })}
            className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

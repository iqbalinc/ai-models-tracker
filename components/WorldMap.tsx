"use client";

import React, { useMemo, useState } from "react";
import {
  Treemap, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, Cell,
} from "recharts";
import type { AIModel } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  "Text LLM":    "#4f6bef",
  "Reasoning":   "#f59e0b",
  "Multimodal":  "#10b981",
  "Code":        "#8b5cf6",
  "Small LLM":   "#06b6d4",
  "MoE":         "#3b82f6",
  "Agentic":     "#ef4444",
  "Domain":      "#64748b",
  "Image/Video": "#ec4899",
  "Multilingual":"#14b8a6",
  "Research":    "#a1a1aa",
};

const COUNTRY_PALETTE = [
  "#4f6bef","#10b981","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#ec4899","#14b8a6","#3b82f6","#64748b",
  "#a1a1aa","#f97316","#84cc16","#e879f9","#38bdf8",
];

// Custom treemap cell with label
function TreemapCell(props: {
  x?: number; y?: number; width?: number; height?: number;
  name?: string; count?: number; fill?: string;
  onClick?: () => void;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, count, fill, onClick } = props;
  if (width < 20 || height < 20) return null;
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.85} rx={4} />
      <rect x={x} y={y} width={width} height={height} fill="transparent" stroke="#fff" strokeWidth={2} rx={4} />
      {height > 36 && (
        <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" fill="#fff" fontSize={Math.min(14, width / 6)} fontWeight={700}>
          {name}
        </text>
      )}
      {height > 36 && (
        <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={Math.min(12, width / 7)}>
          {count} model{count !== 1 ? "s" : ""}
        </text>
      )}
    </g>
  );
}

export default function WorldMap({ models }: { models: AIModel[] }) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countryData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of models) {
      const key = m.country || "Unknown";
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
      .map(([name, count], i) => ({ name, count, fill: COUNTRY_PALETTE[i % COUNTRY_PALETTE.length] }))
      .sort((a, b) => b.count - a.count);
  }, [models]);

  const categoryData = useMemo(() => {
    const src = selectedCountry ? models.filter((m) => m.country === selectedCountry) : models;
    const map: Record<string, number> = {};
    for (const m of src) map[m.category] = (map[m.category] || 0) + 1;
    return Object.entries(map)
      .map(([cat, count]) => ({ cat, count }))
      .sort((a, b) => b.count - a.count);
  }, [models, selectedCountry]);

  const drillModels = useMemo(
    () => (selectedCountry ? models.filter((m) => m.country === selectedCountry) : []),
    [models, selectedCountry]
  );

  const colorMap = useMemo(() => {
    const m: Record<string, string> = {};
    countryData.forEach((d) => { m[d.name] = d.fill; });
    return m;
  }, [countryData]);

  return (
    <div className="space-y-6">

      {/* Treemap — country tiles sized by model count */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              AI Models by Country
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Tile size = number of models. Click a tile to drill down.
            </p>
          </div>
          {selectedCountry && (
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium"
            >
              ← Show all
            </button>
          )}
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <Treemap
            data={countryData}
            dataKey="count"
            aspectRatio={4 / 3}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            content={((props: any) => (
              <TreemapCell
                {...props}
                fill={selectedCountry === props.name ? "#ef4444" : (props.fill ?? "#4f6bef")}
                onClick={() => setSelectedCountry(selectedCountry === props.name ? null : (props.name ?? null))}
              />
            )) as unknown as React.ReactElement}
          >
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
                    <p className="font-semibold">{d.name}</p>
                    <p>{d.count} model{d.count !== 1 ? "s" : ""}</p>
                  </div>
                );
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard + category breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Country leaderboard */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Country Leaderboard
          </h2>
          <div className="space-y-1.5">
            {countryData.map((d, i) => (
              <button
                key={d.name}
                onClick={() => setSelectedCountry(selectedCountry === d.name ? null : d.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCountry === d.name
                    ? "ring-1 ring-blue-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                style={selectedCountry === d.name ? { backgroundColor: `${d.fill}18` } : {}}
              >
                <span className="text-xs font-bold text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.fill }}
                />
                <span className="font-medium text-gray-900 dark:text-white flex-1 text-left">{d.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 rounded-full" style={{ width: `${(d.count / countryData[0].count) * 80}px`, backgroundColor: d.fill }} />
                  <span className="text-xs text-gray-500 w-6 text-right">{d.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {selectedCountry ? `${selectedCountry} — Categories` : "Global Category Breakdown"}
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="cat" type="category" width={86} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v} models`, "Count"]} contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {categoryData.map((d) => (
                  <Cell key={d.cat} fill={CATEGORY_COLORS[d.cat] ?? "#4f6bef"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drill-down model list */}
      {selectedCountry && drillModels.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {selectedCountry} — {drillModels.length} Models
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                  {["Model", "Company", "Category", "Year"].map((h) => (
                    <th key={h} className="pb-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drillModels.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white">{m.model}</td>
                    <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{m.company}</td>
                    <td className="py-2 pr-4">
                      <span className="px-2 py-0.5 rounded-full text-white text-xs font-medium" style={{ backgroundColor: CATEGORY_COLORS[m.category] ?? "#4f6bef" }}>
                        {m.category}
                      </span>
                    </td>
                    <td className="py-2 text-gray-500 dark:text-gray-400">{m.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Color legend */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Country Color Key</h2>
        <div className="flex flex-wrap gap-3">
          {countryData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: d.fill }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

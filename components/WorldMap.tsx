"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { AIModel } from "@/lib/types";

// Free public topojson — no API key needed
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country name → [longitude, latitude] for marker placement
const COUNTRY_COORDS: Record<string, [number, number]> = {
  "USA":           [-98,  38],
  "China":         [104,  35],
  "France":        [  2,  47],
  "UK":            [ -2,  54],
  "USA/UK":        [-40,  51],
  "Canada":        [-96,  56],
  "Israel":        [ 35,  31],
  "UAE":           [ 54,  24],
  "Russia":        [ 90,  60],
  "India":         [ 78,  22],
  "Japan":         [138,  36],
  "Germany":       [ 10,  51],
  "South Korea":   [128,  36],
  "Switzerland":   [  8,  47],
  "International": [  0,   0],
  "Unknown":       [  0, -60],
};

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

export default function WorldMap({ models }: { models: AIModel[] }) {
  const [tooltip, setTooltip] = useState<{ country: string; count: number; x: number; y: number } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Count models per country
  const countryData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of models) {
      const key = m.country || "Unknown";
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, [models]);

  const maxCount = useMemo(() => Math.max(...countryData.map((d) => d.count), 1), [countryData]);

  // Models for selected country
  const countryModels = useMemo(() => {
    if (!selectedCountry) return [];
    return models.filter((m) => m.country === selectedCountry);
  }, [models, selectedCountry]);

  // Category breakdown for bar chart
  const categoryData = useMemo(() => {
    const src = selectedCountry
      ? models.filter((m) => m.country === selectedCountry)
      : models;
    const map: Record<string, number> = {};
    for (const m of src) map[m.category] = (map[m.category] || 0) + 1;
    return Object.entries(map)
      .map(([cat, count]) => ({ cat, count }))
      .sort((a, b) => b.count - a.count);
  }, [models, selectedCountry]);

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            AI Models by Country
          </h2>
          {selectedCountry && (
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              ← Show all
            </button>
          )}
        </div>

        <div className="relative w-full" style={{ height: 380 }}>
          <ComposableMap
            projectionConfig={{ scale: 140, center: [15, 10] }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#e5e7eb"
                      stroke="#fff"
                      strokeWidth={0.4}
                      style={{
                        default:  { outline: "none" },
                        hover:    { outline: "none", fill: "#d1d5db" },
                        pressed:  { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {countryData
                .filter((d) => COUNTRY_COORDS[d.country])
                .map((d) => {
                  const [lng, lat] = COUNTRY_COORDS[d.country];
                  const r = 6 + (d.count / maxCount) * 28;
                  const isSelected = selectedCountry === d.country;
                  return (
                    <Marker
                      key={d.country}
                      coordinates={[lng, lat]}
                      onClick={() =>
                        setSelectedCountry(
                          isSelected ? null : d.country
                        )
                      }
                      onMouseEnter={(e) => {
                        const rect = (e.target as SVGElement)
                          .closest("svg")
                          ?.getBoundingClientRect();
                        setTooltip({
                          country: d.country,
                          count:   d.count,
                          x:       e.clientX - (rect?.left ?? 0),
                          y:       e.clientY - (rect?.top  ?? 0),
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <circle
                        r={r}
                        fill={isSelected ? "#ef4444" : "#4f6bef"}
                        fillOpacity={0.75}
                        stroke="#fff"
                        strokeWidth={1.5}
                        style={{ cursor: "pointer" }}
                      />
                      <text
                        textAnchor="middle"
                        y={4}
                        style={{
                          fontSize: 10,
                          fill: "#fff",
                          fontWeight: 700,
                          pointerEvents: "none",
                        }}
                      >
                        {d.count}
                      </text>
                    </Marker>
                  );
                })}
            </ZoomableGroup>
          </ComposableMap>

          {tooltip && (
            <div
              className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-xl"
              style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
            >
              <p className="font-semibold">{tooltip.country}</p>
              <p>{tooltip.count} model{tooltip.count !== 1 ? "s" : ""}</p>
              <p className="text-gray-400 mt-0.5">Click to filter</p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-1">
          Bubble size = number of models. Click a bubble to drill down. Scroll to zoom.
        </p>
      </div>

      {/* Country leaderboard + category breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Leaderboard */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Country Leaderboard
          </h2>
          <div className="space-y-2">
            {countryData.slice(0, 10).map((d, i) => (
              <button
                key={d.country}
                onClick={() =>
                  setSelectedCountry(
                    selectedCountry === d.country ? null : d.country
                  )
                }
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCountry === d.country
                    ? "bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-xs font-bold text-gray-400 w-5 text-right shrink-0">
                  {i + 1}
                </span>
                <span className="font-medium text-gray-900 dark:text-white flex-1 text-left">
                  {d.country}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(d.count / maxCount) * 80}px` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">
                    {d.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {selectedCountry
              ? `${selectedCountry} — Category Breakdown`
              : "Global Category Breakdown"}
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
            >
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="cat"
                type="category"
                width={82}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v) => [`${v} models`, "Count"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {categoryData.map((d) => (
                  <Cell
                    key={d.cat}
                    fill={CATEGORY_COLORS[d.cat] ?? "#4f6bef"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drill-down model list */}
      {selectedCountry && countryModels.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {selectedCountry} — All {countryModels.length} Models
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                  <th className="pb-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Model</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Year</th>
                </tr>
              </thead>
              <tbody>
                {countryModels.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white">{m.model}</td>
                    <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{m.company}</td>
                    <td className="py-2 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: CATEGORY_COLORS[m.category] ?? "#4f6bef" }}
                      >
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
    </div>
  );
}

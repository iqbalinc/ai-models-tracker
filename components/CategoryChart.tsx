"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import type { AIModel } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";

export default function CategoryChart({ models }: { models: AIModel[] }) {
  const catCounts = models.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        By Category
      </h2>
      {/* Chart — taller on mobile so there's room for the inline legend */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? "#64748b"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg, #1f2937)",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [value, "models"]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom legend — wraps naturally on any width */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? "#64748b" }}
            />
            <span>{entry.name}</span>
            <span className="text-gray-400 dark:text-gray-600">({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

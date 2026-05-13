import type { AIModel } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";

export default function ModelTable({ models }: { models: AIModel[] }) {
  if (!models.length) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-600">
        No models match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {["Company", "Country", "Model", "Category", "Year", "License", "What It Does"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-100 dark:divide-gray-900">
          {models.map((m) => (
            <tr
              key={m.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {m.company}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {m.country}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {m.model}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[m.category] ?? "#64748b" }}
                >
                  {m.category}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {m.year}
              </td>
              <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap max-w-[120px] truncate">
                {m.open_source}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                {m.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

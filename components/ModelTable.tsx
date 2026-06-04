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
    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-none sm:rounded-xl border-y sm:border border-gray-200 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {/* Always visible */}
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Model
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Category
            </th>
            {/* Hidden on mobile, visible on sm+ */}
            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Company
            </th>
            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Year
            </th>
            {/* Hidden on mobile, visible on md+ */}
            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Country
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              License
            </th>
            {/* Hidden on mobile + tablet, visible on lg+ */}
            <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              What It Does
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-100 dark:divide-gray-900">
          {models.map((m) => (
            <tr
              key={m.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {/* Model — always visible */}
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                <div className="max-w-[140px] sm:max-w-[200px] truncate">{m.model}</div>
                {/* On mobile: show company under model name */}
                <div className="sm:hidden text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  {m.company} · {m.year}
                </div>
              </td>

              {/* Category — always visible */}
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[m.category] ?? "#64748b" }}
                >
                  {m.category}
                </span>
              </td>

              {/* Company — sm+ */}
              <td className="hidden sm:table-cell px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {m.company}
              </td>

              {/* Year — sm+ */}
              <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {m.year}
              </td>

              {/* Country — md+ */}
              <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {m.country}
              </td>

              {/* License — md+ */}
              <td className="hidden md:table-cell px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap max-w-[120px] truncate">
                {m.open_source}
              </td>

              {/* Description — lg+ */}
              <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                {m.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

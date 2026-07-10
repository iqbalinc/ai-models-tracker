import type { AIModel } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";

export default function ModelTable({ models }: { models: AIModel[] }) {
  if (!models.length) {
    return (
      <div className="text-center py-12 text-xs text-gray-400 dark:text-gray-600">
        No models match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-none sm:rounded-xl border-y sm:border border-gray-200 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800/80">
        <thead className="bg-gray-50/80 dark:bg-gray-900/80">
          <tr>
            <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Model
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Category
            </th>
            <th className="hidden sm:table-cell px-3 py-2 text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Company
            </th>
            <th className="hidden sm:table-cell px-3 py-2 text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Year
            </th>
            <th className="hidden md:table-cell px-3 py-2 text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Country
            </th>
            <th className="hidden md:table-cell px-3 py-2 text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
              License
            </th>
            <th className="hidden lg:table-cell px-3 py-2 text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-100/70 dark:divide-gray-900/70">
          {models.map((m) => (
            <tr
              key={m.id}
              className="hover:bg-gray-50/70 dark:hover:bg-gray-900/50 transition-colors"
            >
              <td className="px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white">
                <div className="max-w-[140px] sm:max-w-[200px] truncate">{m.model}</div>
                <div className="sm:hidden text-[10px] text-gray-400 dark:text-gray-600 mt-0.5 truncate">
                  {m.company} · {m.year}
                </div>
              </td>

              <td className="px-3 py-1.5 whitespace-nowrap">
                <span
                  className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[m.category] ?? "#64748b" }}
                >
                  {m.category}
                </span>
              </td>

              <td className="hidden sm:table-cell px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {m.company}
              </td>

              <td className="hidden sm:table-cell px-3 py-1.5 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap tabular-nums">
                {m.year}
              </td>

              <td className="hidden md:table-cell px-3 py-1.5 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {m.country}
              </td>

              <td className="hidden md:table-cell px-3 py-1.5 text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap max-w-[100px] truncate">
                {m.open_source}
              </td>

              <td className="hidden lg:table-cell px-3 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                {m.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

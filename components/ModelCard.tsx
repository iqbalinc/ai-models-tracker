import type { AIModel } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";

const OPEN_SOURCE_BADGE: Record<string, string> = {
  proprietary: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  mit:         "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  apache:      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  open:        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  research:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

function openBadgeClass(license: string) {
  const lower = license.toLowerCase();
  for (const [key, cls] of Object.entries(OPEN_SOURCE_BADGE)) {
    if (lower.includes(key)) return cls;
  }
  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
}

export default function ModelCard({ model }: { model: AIModel }) {
  const catColor = CATEGORY_COLORS[model.category] ?? "#64748b";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">
            {model.model}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {model.company} · {model.country}
          </div>
        </div>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 shrink-0">
          {model.year}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
        {model.description}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap mt-auto pt-1 border-t border-gray-100 dark:border-gray-800">
        {/* Category pill */}
        <span
          className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: catColor }}
        >
          {model.category}
        </span>
        {/* License badge */}
        <span className={`text-xs px-2 py-0.5 rounded-full ${openBadgeClass(model.open_source)}`}>
          {model.open_source.length > 16 ? model.open_source.slice(0, 14) + "…" : model.open_source}
        </span>
      </div>
    </div>
  );
}

import type { AIModel } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";

const OPEN_SOURCE_BADGE: Record<string, string> = {
  proprietary: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-900/40",
  mit:         "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-100 dark:border-green-900/40",
  apache:      "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-100 dark:border-green-900/40",
  open:        "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-100 dark:border-green-900/40",
  research:    "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
};

function openBadgeClass(license: string) {
  const lower = license.toLowerCase();
  for (const [key, cls] of Object.entries(OPEN_SOURCE_BADGE)) {
    if (lower.includes(key)) return cls;
  }
  return "bg-gray-50 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400 border-gray-200 dark:border-gray-700";
}

export default function ModelCard({ model }: { model: AIModel }) {
  const catColor = CATEGORY_COLORS[model.category] ?? "#64748b";

  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 flex flex-col gap-2 hover:border-brand-300 dark:hover:border-brand-800 hover:shadow-sm transition-all duration-150">
      {/* Top row: name + year */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 dark:text-white text-xs leading-snug truncate">
            {model.model}
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
            {model.company} · {model.country}
          </div>
        </div>
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-600 shrink-0 tabular-nums mt-0.5">
          {model.year}
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
        {model.description}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-2 border-t border-gray-100 dark:border-gray-800/80">
        <span
          className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: catColor }}
        >
          {model.category}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${openBadgeClass(model.open_source)}`}>
          {model.open_source.length > 16 ? model.open_source.slice(0, 14) + "…" : model.open_source}
        </span>
      </div>
    </div>
  );
}

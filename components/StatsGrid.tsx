import type { AIModel } from "@/lib/types";

export default function StatsGrid({ models }: { models: AIModel[] }) {
  const countries = new Set(models.map((m) => m.country)).size;
  const companies = new Set(models.map((m) => m.company)).size;
  const openSource = models.filter((m) =>
    !m.open_source.toLowerCase().includes("proprietary")
  ).length;

  const catCounts = models.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: "Models",        value: models.length,   accent: true },
    { label: "Companies",     value: companies },
    { label: "Countries",     value: countries },
    { label: "Open Source",   value: `${Math.round((openSource / models.length) * 100)}%` },
    { label: "Top Type",      value: topCat?.[0] ?? "—" },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {stats.map(({ label, value, accent }) => (
        <div
          key={label}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
            accent
              ? "bg-brand-50 border-brand-200 dark:bg-brand-900/25 dark:border-brand-800/60"
              : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
          }`}
        >
          <span className={`font-bold tabular-nums ${
            accent ? "text-brand-600 dark:text-brand-400" : "text-gray-900 dark:text-white"
          }`}>
            {value}
          </span>
          <span className="text-gray-400 dark:text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

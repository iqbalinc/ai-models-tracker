import type { AIModel } from "@/lib/types";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${
      accent
        ? "bg-brand-50 border-brand-100 dark:bg-brand-900/20 dark:border-brand-800"
        : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800"
    }`}>
      <div className={`text-2xl font-bold ${accent ? "text-brand-600 dark:text-brand-400" : "text-gray-900 dark:text-white"}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatCard label="Total Models"    value={models.length}   accent />
      <StatCard label="Organizations"   value={companies}        sub={`across ${countries} countries`} />
      <StatCard label="Open Source"     value={openSource}       sub={`${Math.round((openSource / models.length) * 100)}% of total`} />
      <StatCard label="Top Category"    value={topCat?.[0] ?? "—"} sub={`${topCat?.[1] ?? 0} models`} />
      <StatCard label="Countries"       value={countries} />
    </div>
  );
}

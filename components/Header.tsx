export default function Header({ lastUpdated }: { lastUpdated?: string }) {
  const date = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            AI Models Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Foundation models by company, country &amp; category
          </p>
        </div>
        {date && (
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Updated {date}
          </span>
        )}
      </div>
    </header>
  );
}

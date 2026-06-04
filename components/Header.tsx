export default function Header({ lastUpdated }: { lastUpdated?: string }) {
  const date = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            AI Models Tracker
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
            Foundation models by company, country &amp; category
          </p>
        </div>
        {date && (
          <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full whitespace-nowrap">
            Updated {date}
          </span>
        )}
      </div>
    </header>
  );
}

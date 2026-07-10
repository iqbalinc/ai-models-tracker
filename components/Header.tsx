export default function Header({ lastUpdated }: { lastUpdated?: string }) {
  const date = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <header className="border-b border-gray-200/70 dark:border-gray-800/70 bg-white/85 dark:bg-gray-950/85 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight leading-none bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              AI Models Tracker
            </h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-none">
              Foundation models · company · country · category
            </p>
          </div>
        </div>
        {date && (
          <span className="shrink-0 text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100/80 dark:bg-gray-800/80 px-2.5 py-1 rounded-full whitespace-nowrap border border-gray-200/60 dark:border-gray-700/60">
            Updated {date}
          </span>
        )}
      </div>
    </header>
  );
}

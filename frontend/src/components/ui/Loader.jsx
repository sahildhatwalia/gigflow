function Loader({
  type = "spinner",
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (type === "spinner") {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <svg
          className={`animate-spin text-brand-500 ${sizes[size]}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  // Skeletons
  if (type === "skeleton-line") {
    return (
      <div className={`h-4 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse ${className}`} />
    );
  }

  if (type === "skeleton-card") {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs animate-pulse space-y-4 ${className}`}>
        <div className="flex justify-between items-start">
          <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
          <div className="h-5 w-12 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-md" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
          <div className="h-9 bg-slate-50 dark:bg-slate-800 rounded-xl" />
          <div className="h-9 bg-slate-50 dark:bg-slate-800 rounded-xl" />
          <div className="h-9 bg-slate-50 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return null;
}

export default Loader;

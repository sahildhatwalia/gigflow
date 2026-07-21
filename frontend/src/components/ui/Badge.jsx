function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const baseStyles = "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors";
  
  const variants = {
    default: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    success: "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    warning: "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    danger: "bg-accent-50 dark:bg-accent-950/20 text-accent-500 dark:text-accent-400 border-accent-100 dark:border-accent-900/30",
    info: "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;

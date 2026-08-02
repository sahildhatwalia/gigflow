function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const baseStyles = "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors";
  
  const variants = {
    default: "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    success: "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200/60 dark:border-green-900/30",
    warning: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/30",
    danger: "bg-accent-50 dark:bg-accent-950/20 text-accent-500 dark:text-accent-400 border-accent-100 dark:border-accent-900/30",
    info: "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-100 dark:border-brand-500/20",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;

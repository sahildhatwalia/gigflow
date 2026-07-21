function Avatar({
  src,
  name = "User",
  size = "md",
  className = "",
}) {
  const getInitials = (userName) => {
    if (!userName) return "U";
    const parts = userName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  const formattedSrc = src
    ? src.startsWith("http")
      ? src
      : `http://localhost:5000/${src.replace(/\\/g, "/")}`
    : "";

  return (
    <div className={`relative flex-shrink-0 inline-flex items-center justify-center rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 ${sizes[size]} ${className}`}>
      {formattedSrc ? (
        <img
          src={formattedSrc}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-brand-50 dark:bg-indigo-950/40 text-brand-500 dark:text-indigo-400 font-bold flex items-center justify-center select-none">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}

export default Avatar;

import { motion } from "framer-motion";

function Card({
  children,
  className = "",
  glass = false,
  hoverLift = false,
  padding = "p-6",
  onClick,
  ...props
}) {
  const cardStyles = `${padding} rounded-xl border ${
    glass
      ? "glass border-slate-200/50 dark:border-slate-700/40"
      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
  } shadow-xs dark:shadow-none transition-all duration-300 ${
    onClick ? "cursor-pointer" : ""
  } ${className}`;

  if (onClick) {
    return (
      <motion.div
        whileHover={hoverLift ? { y: -3, scale: 1.005 } : { scale: 1.002 }}
        whileTap={{ scale: 0.995 }}
        onClick={onClick}
        className={cardStyles}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  if (hoverLift) {
    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, cubicBezier: [0.16, 1, 0.3, 1] }}
        className={cardStyles}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardStyles} {...props}>
      {children}
    </div>
  );
}

export default Card;

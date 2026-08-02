import { motion } from "framer-motion";
import Card from "./Card";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "up", // "up" | "down"
  description,
  className = "",
}) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 block tracking-tight">
            {value}
          </span>
        </div>
        {Icon && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl">
            <Icon size={20} />
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs">
          {trend && (
            <span
              className={`font-semibold flex items-center gap-0.5 text-slate-500 dark:text-slate-400`}
            >
              {trendDirection === "up" ? "↑" : "↓"} {trend}
            </span>
          )}
          {description && (
            <span className="text-slate-400 dark:text-slate-500">
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

export default StatCard;

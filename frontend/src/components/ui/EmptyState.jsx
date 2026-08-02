import { FiInbox, FiSearch, FiLayers, FiBell, FiFileText } from "react-icons/fi";
import Button from "./Button";

function EmptyState({
  type = "default",
  title,
  description,
  actionText,
  onActionClick,
  className = "",
}) {
  // Map type to icons/illustrations and default text
  const configs = {
    default: {
      icon: FiInbox,
      title: title || "No data found",
      description: description || "There is nothing to display here yet.",
      color: "text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700",
    },
    projects: {
      icon: FiLayers,
      title: title || "No Projects Found",
      description: description || "Get started by posting your very first project to find top freelancer talent.",
      color: "text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700",
    },
    applications: {
      icon: FiFileText,
      title: title || "No Applications Yet",
      description: description || "Applications from interested freelancers will appear here once you post a project.",
      color: "text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700",
    },
    search: {
      icon: FiSearch,
      title: title || "No Results Found",
      description: description || "We couldn't find any matches. Try refining your filters or keywords.",
      color: "text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700",
    },
    notifications: {
      icon: FiBell,
      title: title || "All Caught Up!",
      description: description || "You have no new notifications at this time. We'll let you know when things change.",
      color: "text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700",
    },
  };

  const current = configs[type] || configs.default;
  const Icon = current.icon;

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl ${className}`}>
      {/* Dynamic SVG Cues */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${current.color}`}>
        <Icon size={28} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {current.title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
        {current.description}
      </p>
      
      {actionText && onActionClick && (
        <Button onClick={onActionClick} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

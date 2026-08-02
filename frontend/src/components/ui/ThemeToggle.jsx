import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer focus:outline-none ${className}`}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <FiSun className="text-amber-400 text-sm sm:text-base" />
      ) : (
        <FiMoon className="text-indigo-600 text-sm sm:text-base" />
      )}
    </motion.button>
  );
}

export default ThemeToggle;

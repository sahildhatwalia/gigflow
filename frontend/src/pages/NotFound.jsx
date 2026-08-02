import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";
import Button from "../components/ui/Button";

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4 dark:bg-slate-950 dark:text-white text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30 mb-6">
          <FiAlertTriangle size={32} />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Page Not Found
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link to="/">
          <Button variant="outline" size="md" className="flex items-center gap-2">
            <FiArrowLeft />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;

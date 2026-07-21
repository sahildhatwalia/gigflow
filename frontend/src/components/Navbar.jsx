import { Link, useNavigate } from "react-router-dom";
import { FiLayers, FiLogIn, FiUserPlus } from "react-icons/fi";
import ThemeToggle from "./ui/ThemeToggle";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-brand-500 p-2 rounded-xl text-white shadow-xs">
              <FiLayers size={18} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight dark:text-white">
              Gig<span className="text-brand-500">Flow</span>
            </h1>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <FiLogIn />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <FiUserPlus />
                <span>Signup</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
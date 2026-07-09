import { Link, useLocation } from "react-router-dom";
import { FiBox, FiPlus } from "react-icons/fi";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Branding Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-xs group-hover:bg-indigo-700 transition-colors duration-200">
            <FiBox className="text-lg" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Hyper<span className="text-indigo-600">CRUD</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold py-1.5 transition-colors relative ${
              location.pathname === "/"
                ? "text-indigo-600"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Home
            {location.pathname === "/" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 rounded-full" />
            )}
          </Link>

          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus className="text-base stroke-[2.5]" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
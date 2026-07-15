import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiSearch,
  FiLogIn,
  FiUserPlus,
  FiPlus,
  FiLogOut,
  FiUser,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { search, setSearch } = useContext(SearchContext);
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const active =
    "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1";

  const normal =
    "text-slate-600 hover:text-indigo-600 transition";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}

          <Link to="/" className="flex items-center gap-3">

            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <FiBox size={20} />
            </div>

            <h1 className="text-xl font-bold">
              Hyper<span className="text-indigo-600">CRUD</span>
            </h1>

          </Link>

          {/* Center */}

          <div className="hidden lg:flex items-center gap-8 flex-1 mx-10">

            <Link
              to="/"
              className={location.pathname === "/" ? active : normal}
            >
              <div className="flex items-center gap-2">
                <FiHome />
                Home
              </div>
            </Link>

            <Link
              to="/create"
              className={location.pathname === "/create" ? active : normal}
            >
              <div className="flex items-center gap-2">
                <FiPlus />
                Add Product
              </div>
            </Link>

            {/* Search */}

            <div className="relative flex-1 max-w-md">

              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />

            </div>

          </div>

          {/* Right */}

          {!user ? (

            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <FiLogIn />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <FiUserPlus />
                Signup
              </Link>

            </div>

          ) : (

            <div className="relative">

              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg"
              >

                {user.avatar ? (

                  <img
                    src={`http://localhost:5000/${user.avatar.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />

                ) : (

                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">

                    <FiUser className="text-indigo-600" />

                  </div>

                )}

                <div className="text-left">

                  <p className="font-semibold text-sm">

                    {user.name}

                  </p>

                  <p className="text-xs text-gray-500">

                    {user.email}

                  </p>

                </div>

                <FiChevronDown />

              </button>

              {open && (

                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border overflow-hidden">

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                  >
                    <FiUser />
                    Profile
                  </Link>

                  <Link
                    to="/change-password"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                  >
                    <FiSettings />
                    Change Password
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full"
                  >
                    <FiLogOut />
                    Logout
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
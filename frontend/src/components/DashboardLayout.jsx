import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiLayers,
  FiFileText,
  FiFolder,
  FiMessageSquare,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiPlus,
  FiCheckCircle,
  FiInfo,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./ui/ThemeToggle";
import Avatar from "./ui/Avatar";

function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to GigFlow!",
      message: "Your account is ready. Explore active listings or manage your work profile.",
      time: "Just now",
      read: false,
      type: "system",
    },
    {
      id: 2,
      title: user?.role === "Client" ? "New Application Received" : "Project Status Update",
      message: user?.role === "Client"
        ? "A freelancer applied to your project posting."
        : "Your application status was updated by the project owner.",
      time: "45m ago",
      read: false,
      type: "project",
    },
    {
      id: 3,
      title: "Security Verified",
      message: "Email verification and password reset protections are fully active.",
      time: "2h ago",
      read: true,
      type: "security",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Role segregation for sidebar navigation
  const getMenuItems = () => {
    if (user?.role === "Client") {
      return [
        { label: "Dashboard", path: "/dashboard", icon: FiGrid },
        { label: "My Projects", path: "/my-projects", icon: FiLayers },
        { label: "Post a Project", path: "/create", icon: FiPlus },
        { label: "Messages", path: "/messages", icon: FiMessageSquare },
        { label: "Profile", path: "/profile", icon: FiUser },
        { label: "Settings", path: "/settings", icon: FiSettings },
      ];
    }
    // Default / Developer (Freelancer)
    return [
      { label: "Dashboard", path: "/dashboard", icon: FiGrid },
      { label: "Browse Projects", path: "/", icon: FiLayers },
      { label: "Applications", path: "/applications", icon: FiFileText },
      { label: "Portfolio", path: "/portfolio", icon: FiFolder },
      { label: "Messages", path: "/messages", icon: FiMessageSquare },
      { label: "Profile", path: "/profile", icon: FiUser },
      { label: "Settings", path: "/settings", icon: FiSettings },
    ];
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-700">
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-200 dark:border-slate-700">
        <div className="bg-brand-500 p-2 rounded-xl text-white">
          <FiLayers size={18} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight dark:text-white">
          Gig<span className="text-brand-500">Flow</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const ActiveIcon = item.icon;
          const active = isActive(item.path);

          return (
            <div key={idx} className="relative">
              <Link
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold relative ${
                  active
                    ? "text-brand-500 dark:text-white bg-brand-50 dark:bg-brand-500/10"
                    : "text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-6 bg-brand-500 rounded-r-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <ActiveIcon
                  size={18}
                  className={active ? "text-brand-500 dark:text-white" : "text-slate-400"}
                />
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      {user && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3 px-2">
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                {user.name}
              </p>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-950/20 transition-colors cursor-pointer text-left"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:block w-64 h-full flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-30 relative">
          <div className="flex items-center gap-4">
            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Open Sidebar Navigation"
            >
              <FiMenu size={18} />
            </button>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {location.pathname === "/dashboard"
                ? `${user?.role || "User"} Portal`
                : location.pathname === "/"
                ? "Projects Directory"
                : "SaaS Workspace"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors relative cursor-pointer"
                aria-label="View notifications"
              >
                <FiBell className="text-sm sm:text-base" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    {/* Click Outside Overlay */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <span className="bg-brand-500/10 text-brand-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>

                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] font-semibold text-brand-500 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <FiCheck /> Mark all read
                          </button>
                        )}
                      </div>

                      {/* List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center px-4">
                            <FiCheckCircle className="mx-auto text-3xl text-slate-300 dark:text-slate-600 mb-2" />
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              You're all caught up!
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              No new notifications at this time.
                            </p>
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              className={`p-3.5 flex items-start gap-3 transition-colors ${
                                !item.read
                                  ? "bg-brand-50/30 dark:bg-brand-950/10"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                              }`}
                            >
                              <div
                                className={`p-2 rounded-xl text-white text-xs shrink-0 mt-0.5 ${
                                  item.type === "system"
                                    ? "bg-brand-500"
                                    : item.type === "project"
                                    ? "bg-indigo-500"
                                    : "bg-emerald-500"
                                }`}
                              >
                                {item.type === "system" ? (
                                  <FiInfo size={14} />
                                ) : item.type === "project" ? (
                                  <FiLayers size={14} />
                                ) : (
                                  <FiCheckCircle size={14} />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4
                                    onClick={() => markAsRead(item.id)}
                                    className={`text-xs font-bold truncate cursor-pointer ${
                                      !item.read
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-600 dark:text-slate-400"
                                    }`}
                                  >
                                    {item.title}
                                  </h4>
                                  <span className="text-[10px] text-slate-400 shrink-0">
                                    {item.time}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.message}
                                </p>
                              </div>

                              <button
                                onClick={() => deleteNotification(item.id)}
                                className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 p-1 cursor-pointer"
                                title="Remove"
                              >
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {user && (
              <div className="hidden sm:flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-700 pl-3">
                <Avatar src={user.avatar} name={user.name} size="sm" />
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Nested Route Area */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Drawer Slide-out Sidebar Menu */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-xs"
            />
            {/* Sidebar box */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-64 max-w-xs h-full"
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 z-10 cursor-pointer"
                aria-label="Close Sidebar Navigation"
              >
                <FiX size={18} />
              </button>
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DashboardLayout;

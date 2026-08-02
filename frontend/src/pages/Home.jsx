import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBriefcase, FiPlus, FiInbox, FiSearch, FiSliders, FiX, FiCheck } from "react-icons/fi";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import ProjectCard from "../components/ProjectCard";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import SearchBar from "../components/ui/SearchBar";
import Pagination from "../components/ui/Pagination";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { search, setSearch } = useContext(SearchContext);
  
  // Extra filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch Projects with advanced filters
  const getProjects = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", 8);
      
      if (search.trim() !== "") {
        queryParams.append("query", search.trim());
      }
      if (categoryFilter) {
        queryParams.append("category", categoryFilter);
      }
      if (skillsFilter) {
        queryParams.append("skills", skillsFilter);
      }

      const res = await api.get(`/projects?${queryParams.toString()}`);
      
      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalProjects || 0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // Debounced execution of filters
  useEffect(() => {
    const timer = setTimeout(() => {
      getProjects();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search, categoryFilter, skillsFilter]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, skillsFilter]);

  // Delete Project
  const deleteProject = async (id) => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);
      toast.success("Project Deleted Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete project");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setSkillsFilter("");
  };

  const categories = [
    "Web Development",
    "Mobile Apps",
    "UI/UX Design",
    "Writing & Translation",
    "Video & Animation",
    "AI & Data Science",
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero SaaS Banner (Only show to guests or new users without projects) */}
      {!user && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-10 border border-slate-700 relative overflow-hidden shadow-lg shadow-slate-950/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(220,38,38,0.08),transparent)] pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/20">
              Freelancer Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 leading-tight">
              Find the perfect match for your next project.
            </h1>
            <p className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
              GigFlow connects clients looking for quality talent with top-tier freelancers. Simple contracts, safe escrows, and instant collaboration.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/register">
                <Button variant="primary" size="lg" className="shadow-lg shadow-slate-900/20">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Gigs Feed */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Active Projects
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Discover freelance gigs matching your expertise.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "Client" && (
              <Button
                onClick={() => navigate("/create")}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <FiPlus />
                Post Project
              </Button>
            )}
            <Badge variant="success" className="h-8">
              {totalCount} Active Gigs
            </Badge>
          </div>
        </div>

        {/* Search & Advanced Filters Bar */}
        <Card className="mb-8" padding="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                placeholder="Search projects by title, description or keywords..."
                className="w-full"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 cursor-pointer ${
                showFilters || categoryFilter || skillsFilter
                  ? "bg-brand-50 dark:bg-indigo-950/20 border-brand-200 dark:border-indigo-900/40 text-brand-600 dark:text-indigo-400"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:text-slate-400 text-slate-600 bg-transparent"
              }`}
            >
              <FiSliders />
              <span>Filters</span>
              {(categoryFilter || skillsFilter) && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              )}
            </button>
          </div>

          {/* Collapsible Advanced Filters Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/80"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category select filter */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Filter by Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white px-4 py-2.5 rounded-xl text-sm h-11 cursor-pointer focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Skills input filter */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Filter by Skills
                    </label>
                    <input
                      type="text"
                      value={skillsFilter}
                      onChange={(e) => setSkillsFilter(e.target.value)}
                      placeholder="e.g. React, Node, CSS (comma-separated)"
                      className="w-full border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white px-4 py-2.5 rounded-xl text-sm h-11 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                {/* Reset filters button */}
                <div className="flex justify-end gap-3 mt-4">
                  {(search || categoryFilter || skillsFilter) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-red-500 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Quick Category Badges Row */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-2">
            Categories:
          </span>
          <button
            onClick={() => setCategoryFilter("")}
            className={`text-xs px-4 py-2 rounded-full font-semibold border transition-all cursor-pointer ${
              categoryFilter === ""
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent text-slate-650 dark:text-slate-400"
            }`}
          >
            All
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-4 py-2 rounded-full font-semibold border transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-brand-500 text-white border-brand-500"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent text-slate-650 dark:text-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Skeletons vs Empty State vs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Loader key={i} type="skeleton-card" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            type={(search || categoryFilter || skillsFilter) ? "search" : "projects"}
            actionText={(search || categoryFilter || skillsFilter) ? "Clear Filters" : "Post Project"}
            onActionClick={(search || categoryFilter || skillsFilter) ? handleClearFilters : () => navigate("/create")}
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {projects.map((project) => (
              <motion.div
                key={project._id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <ProjectCard project={project} onDelete={deleteProject} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default Home;
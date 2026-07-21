import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiSliders, FiFileText, FiCalendar, FiDollarSign, FiTrash2, FiEye, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import projectsApi from "../api/projects";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import EmptyState from "../components/ui/EmptyState";
import Loader from "../components/ui/Loader";
import SearchBar from "../components/ui/SearchBar";
import Pagination from "../components/ui/Pagination";

function Applications() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "", "pending", "accepted", "rejected"
  const [page, setPage] = useState(1);
  const [cancellingId, setCancellingId] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await projectsApi.getMyProposals();
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = async (projectId) => {
    const result = await Swal.fire({
      title: "Cancel Application?",
      text: "Are you sure you want to withdraw your proposal for this project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Use brand Red accent for delete actions
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Withdraw",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setCancellingId(projectId);
      await projectsApi.cancelProposal(projectId);
      toast.success("Application withdrawn successfully.");
      // Remove from state
      setApplications((prev) => prev.filter((app) => app.project._id !== projectId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to withdraw application.");
    } finally {
      setCancellingId(null);
    }
  };

  const statusVariant = {
    pending: "warning",
    accepted: "success",
    rejected: "danger",
  };

  // Filter & Search Logic
  const filteredApps = applications.filter((app) => {
    const titleMatch = app.project.title.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter ? app.status === statusFilter : true;
    return titleMatch && statusMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;
  const paginatedApps = filteredApps.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Track and manage proposals you've submitted to active projects.
        </p>
      </div>

      {/* Toolbar Search / Filters */}
      {applications.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search applied projects..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 dark:focus:border-white focus:ring-2 focus:ring-brand-500/10 transition text-sm h-10"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden md:inline">
              Filter status:
            </span>
            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["", "pending", "accepted", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`text-xs px-4 py-2 rounded-xl font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === status
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 bg-transparent"
                  }`}
                >
                  {status === "" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid View */}
      {paginatedApps.length === 0 ? (
        <EmptyState
          type={search || statusFilter ? "search" : "projects"}
          title={search || statusFilter ? "No matches found" : "No Applications Yet"}
          description={
            search || statusFilter
              ? "We couldn't find any applications matching your keywords. Try clearing search filters."
              : "You haven't submitted any project proposals yet. Explore projects directory to get started."
          }
          actionText={search || statusFilter ? "Reset Filters" : "Browse Projects"}
          onActionClick={
            search || statusFilter
              ? () => {
                  setSearch("");
                  setStatusFilter("");
                }
              : () => navigate("/")
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedApps.map((app) => (
              <Card key={app._id} className="flex flex-col justify-between h-full group">
                <div>
                  {/* Category Pill and Status */}
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="default" className="text-[10px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                      {app.project.category || "General"}
                    </Badge>
                    <Badge variant={statusVariant[app.status] || "default"} className="text-[10px] uppercase tracking-wider">
                      {app.status}
                    </Badge>
                  </div>

                  {/* Project Title */}
                  <Link to={`/view/${app.project._id}`}>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-accent-500 transition-colors">
                      {app.project.title}
                    </h3>
                  </Link>

                  {/* Metadata fields */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-700/60 pt-4">
                    {/* Client Info */}
                    <div className="flex items-center gap-2">
                      <Avatar src={app.client?.avatar} name={app.client?.name || "Client"} size="xs" />
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block leading-none">Client</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate block">
                          {app.client?.name || "Client"}
                        </span>
                      </div>
                    </div>

                    {/* Applied Date */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <FiCalendar size={14} className="text-slate-400" />
                      <div className="text-xs">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block leading-none">Applied On</span>
                        <span>{new Date(app.appliedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>

                    {/* Budgets */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/40 p-2 rounded-xl text-center">
                        <span className="text-[8px] uppercase font-bold tracking-wider text-slate-400 block">Job Budget</span>
                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                          ₹{Number(app.project.budget).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/40 p-2 rounded-xl text-center">
                        <span className="text-[8px] uppercase font-bold tracking-wider text-slate-400 block">Your Bid</span>
                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                          ₹{Number(app.bidAmount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter excerpt */}
                  {app.coverLetter && (
                    <div className="mt-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-700/30">
                      <span className="text-[8px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Cover Letter excerpt</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed italic">
                        "{app.coverLetter}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <Link to={`/view/${app.project._id}`}>
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1.5">
                      <FiEye size={14} />
                      <span>Details</span>
                    </Button>
                  </Link>

                  <Button
                    onClick={() => handleCancelApplication(app.project._id)}
                    disabled={cancellingId === app.project._id}
                    variant="danger"
                    size="sm"
                    className="w-full flex items-center justify-center gap-1.5"
                  >
                    <FiTrash2 size={14} />
                    <span>{cancellingId === app.project._id ? "Cancelling..." : "Cancel"}</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Applications;

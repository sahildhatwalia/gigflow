import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiLayers, FiFileText, FiCalendar, FiDollarSign, FiTrash2, FiEdit3, FiEye, FiUserCheck, FiXCircle, FiCheckCircle } from "react-icons/fi";
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
import Modal from "../components/ui/Modal";

function MyProjects() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null); // project selected for view proposals
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingProposalId, setUpdatingProposalId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "Client") {
      navigate("/dashboard");
      return;
    }
    fetchMyProjects();
  }, [user]);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      // Fetch all projects and filter by client ID
      const res = await projectsApi.getProjects(1, 100);
      const allProjects = res.data.projects || [];
      const myPostings = allProjects.filter(
        (p) => p.client === user.id || p.client?._id === user.id
      );
      setProjects(myPostings);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your project postings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "Are you sure you want to delete this project? This will remove all proposals and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Danger accent color
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await projectsApi.deleteProject(projectId);
      toast.success("Project deleted successfully.");
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project.");
    }
  };

  const handleUpdateProposal = async (projectId, proposalId, newStatus) => {
    try {
      setUpdatingProposalId(proposalId);
      const res = await projectsApi.updateProposalStatus(projectId, proposalId, newStatus);
      toast.success(`Proposal ${newStatus} successfully!`);
      
      // Update local state to reflect change
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj._id === projectId) {
            const updatedProposals = proj.proposals.map((prop) =>
              prop._id === proposalId ? { ...prop, status: newStatus } : prop
            );
            const updatedProj = { ...proj, proposals: updatedProposals };
            if (newStatus === "accepted") {
              updatedProj.status = "in-progress";
            }
            return updatedProj;
          }
          return proj;
        })
      );

      // Also update currently selected project in proposals modal
      setSelectedProject((prev) => {
        if (!prev) return null;
        const updatedProposals = prev.proposals.map((prop) =>
          prop._id === proposalId ? { ...prop, status: newStatus } : prop
        );
        const updatedProj = { ...prev, proposals: updatedProposals };
        if (newStatus === "accepted") {
          updatedProj.status = "in-progress";
        }
        return updatedProj;
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update proposal.");
    } finally {
      setUpdatingProposalId(null);
    }
  };

  const handleOpenProposals = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariant = {
    open: "success",
    "in-progress": "warning",
    completed: "default",
    cancelled: "danger",
    pending: "warning",
    accepted: "success",
    rejected: "danger",
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
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Manage your posted projects, review developer bids, and award contracts.
          </p>
        </div>
        <Button
          onClick={() => navigate("/create")}
          className="flex items-center gap-2"
        >
          <FiPlus />
          <span>Post a Project</span>
        </Button>
      </div>

      {/* Search toolbar */}
      {projects.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your postings..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition text-sm h-10"
            />
          </div>
        </div>
      )}

      {/* Grid of postings */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          type={search ? "search" : "projects"}
          title={search ? "No matches found" : "No Projects Posted"}
          description={
            search
              ? "Try typing another keyword to locate your active posted project."
              : "Create your first gig listing to receive applications from top engineers."
          }
          actionText={search ? "Reset Search" : "Post a Project"}
          onActionClick={search ? () => setSearch("") : () => navigate("/create")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="flex flex-col justify-between h-full group">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="default" className="text-[10px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                    {project.category || "General"}
                  </Badge>
                  <Badge variant={statusVariant[project.status] || "default"} className="text-[10px] uppercase tracking-wider">
                    {project.status}
                  </Badge>
                </div>

                <Link to={`/view/${project._id}`}>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-brand-500 transition-colors">
                    {project.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Info parameters */}
                <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-700/60 pt-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ₹{project.budget.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-slate-400" />
                    <span>Posted: {new Date(project.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                {/* Bid details indicator count */}
                <div className="mt-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/40 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Bids Received
                  </span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                    {project.proposals?.length || 0}
                  </span>
                </div>
              </div>

              {/* Action Buttons footer */}
              <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <Button
                  onClick={() => handleOpenProposals(project)}
                  variant="primary"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1.5"
                >
                  <FiUserCheck size={14} />
                  <span>Review Bids</span>
                </Button>

                <div className="flex gap-1">
                  <Link to={`/edit/${project._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full h-full p-0 flex items-center justify-center">
                      <FiEdit3 size={14} />
                    </Button>
                  </Link>

                  <Button
                    onClick={() => handleDelete(project._id)}
                    variant="danger"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    <FiTrash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Proposals Modal */}
      <Modal
        title={`Review Bids: ${selectedProject?.title}`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
      >
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {!selectedProject?.proposals || selectedProject.proposals.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No developer has submitted a bid for this project yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60 space-y-4">
              {selectedProject.proposals.map((proposal) => (
                <div key={proposal._id} className="pt-4 first:pt-0 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar src={proposal.freelancer?.avatar} name={proposal.freelancer?.name || "Developer"} size="md" />
                    <div className="space-y-1 flex-1">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {proposal.freelancer?.name || "Developer"}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Bid Submitted: {new Date(proposal.createdAt || Date.now()).toLocaleDateString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/30 leading-relaxed">
                        {proposal.coverLetter}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-end gap-3 justify-between md:justify-start">
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Proposed Bid</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{proposal.bidAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {proposal.status !== "pending" ? (
                        <Badge variant={statusVariant[proposal.status] || "default"} className="uppercase tracking-wider text-[10px]">
                          {proposal.status}
                        </Badge>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleUpdateProposal(selectedProject._id, proposal._id, "accepted")}
                            disabled={updatingProposalId !== null}
                            variant="primary"
                            size="sm"
                            className="flex items-center gap-1 text-xs"
                          >
                            <FiCheckCircle size={13} />
                            <span>Award</span>
                          </Button>
                          <Button
                            onClick={() => handleUpdateProposal(selectedProject._id, proposal._id, "rejected")}
                            disabled={updatingProposalId !== null}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-xs text-accent-500 border-accent-500/20 hover:bg-accent-50"
                          >
                            <FiXCircle size={13} />
                            <span>Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default MyProjects;

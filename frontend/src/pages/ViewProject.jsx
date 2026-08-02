import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiDollarSign,
  FiTag,
  FiCalendar,
  FiUser,
  FiEdit,
  FiTrash2,
  FiLayers,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";
import Swal from "sweetalert2";
import projectsApi from "../api/projects";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Loader from "../components/ui/Loader";

function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposalForm, setProposalForm] = useState({
    bidAmount: "",
    coverLetter: "",
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);

  useEffect(() => {
    getProjectDetails();
  }, [id]);

  const getProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await projectsApi.getProject(id);
      setProject(res.data);
      if (res.data.budget) {
        setProposalForm((prev) => ({
          ...prev,
          bidAmount: res.data.budget.toString(),
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load project details.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "Are you sure you want to delete this project? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111827",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await projectsApi.deleteProject(id);
      toast.success("Project Deleted successfully.");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project.");
    }
  };

  const handleProposalChange = (e) => {
    setProposalForm({
      ...proposalForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to apply.");
      navigate("/login");
      return;
    }

    if (user.role === "Client") {
      toast.error("Clients cannot apply to projects.");
      return;
    }

    try {
      setSubmittingProposal(true);
      await projectsApi.submitProposal(id, proposalForm.bidAmount, proposalForm.coverLetter);
      toast.success("Proposal submitted successfully!");
      setProposalForm({ bidAmount: project?.budget?.toString() || "", coverLetter: "" });
      getProjectDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit proposal.");
    } finally {
      setSubmittingProposal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20 min-h-[calc(100vh-120px)] text-slate-800 dark:text-white">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Link to="/" className="text-brand-500 mt-4 inline-block hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const isOwner = user && project.client && (project.client._id === user.id || project.client === user.id);

  const statusVariant = {
    open: "success",
    "in-progress": "warning",
    completed: "default",
    cancelled: "danger",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 text-sm font-semibold transition-colors w-fit"
      >
        <FiArrowLeft className="text-base" />
        <span>Back to Projects</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Left: 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            {/* Header / Category / Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Badge variant="info" className="uppercase tracking-wider">
                <FiTag className="text-xs" />
                {project.category}
              </Badge>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[project.status] || "default"} className="uppercase tracking-wider">
                  {project.status}
                </Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <FiCalendar />
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              {project.title}
            </h1>

            {/* Project Image */}
            {project.image && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700 max-h-96 bg-slate-50 dark:bg-slate-950">
                <img
                  src={
                    project.image.startsWith("http")
                      ? project.image
                      : `http://localhost:5000/${project.image}`
                  }
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Budget Display */}
            <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/80 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Project Budget</span>
                <div className="flex items-center gap-0.5 mt-1">
                  <span className="text-base font-semibold text-slate-400">₹</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {Number(project.budget).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Job Type</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  Fixed-Price Contract
                </span>
              </div>
            </div>

            {/* Description */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Project Description</h2>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line mb-8 text-sm">
              {project.description}
            </div>

            {/* Skills */}
            {project.skills && project.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 px-3.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions for owner */}
            {isOwner && (
              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                <Link to={`/edit/${project._id}`}>
                  <Button variant="outline" size="md" className="flex items-center gap-2">
                    <FiEdit />
                    <span>Edit Project</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  size="md"
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-650"
                >
                  <FiTrash2 />
                  <span>Delete Project</span>
                </Button>
              </div>
            )}
          </Card>

          {/* Proposal Submission Form (Visible to Freelancers / Logged out) */}
          {!isOwner && (
            <Card>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <FiLayers className="text-brand-500" />
                <span>Submit a Proposal</span>
              </h2>

              <form onSubmit={handleProposalSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Your Bid Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="bidAmount"
                      value={proposalForm.bidAmount}
                      onChange={handleProposalChange}
                      required
                      min={1}
                      className="w-full border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white pl-8 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={proposalForm.coverLetter}
                    onChange={handleProposalChange}
                    placeholder="Introduce yourself, describe your experience related to this job, and how you plan to complete it..."
                    required
                    rows={4}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submittingProposal}
                  className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 text-white font-semibold py-3.5 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {submittingProposal ? "Submitting..." : "Submit Proposal"}
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Sidebar Info (Right: 1 Column) */}
        <div className="space-y-6">
          {/* Client profile card */}
          {project.client && (
            <Card>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">About the Client</h3>

              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={typeof project.client === "object" ? project.client.avatar : ""}
                  name={typeof project.client === "object" ? project.client.name : "Client"}
                  size="md"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {typeof project.client === "object" ? project.client.name : "Client"}
                  </h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <FiMail />
                    {typeof project.client === "object" ? project.client.email : ""}
                  </span>
                </div>
              </div>

              {typeof project.client === "object" && project.client.bio && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 border-t border-slate-50 dark:border-slate-800 pt-3">
                  {project.client.bio}
                </p>
              )}

              {/* Client links */}
              {typeof project.client === "object" && (
                <div className="flex gap-3 text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-slate-700 pt-4">
                  {project.client.website && (
                    <a
                      href={project.client.website}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-brand-500 transition-colors"
                    >
                      <FiGlobe size={18} />
                    </a>
                  )}
                  {project.client.github && (
                    <a
                      href={project.client.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-brand-500 transition-colors"
                    >
                      <FiGithub size={18} />
                    </a>
                  )}
                  {project.client.linkedin && (
                    <a
                      href={project.client.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-brand-500 transition-colors"
                    >
                      <FiLinkedin size={18} />
                    </a>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Secure details card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-700 shadow-md">
            <h3 className="font-extrabold text-lg mb-3 flex items-center gap-2 text-brand-400">
              <FiCheckCircle />
              <span>GigFlow Escrow</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Funds are deposited in secure escrows before work starts, ensuring guaranteed payment upon completion of agreed milestones.
            </p>
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20 w-fit">
              Payment Method Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProject;

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiGithub, FiExternalLink, FiEdit3, FiTrash2, FiFolderPlus, FiFolder, FiGlobe, FiCode, FiLayers } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import portfolioApi from "../api/portfolio";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import EmptyState from "../components/ui/EmptyState";
import Loader from "../components/ui/Loader";
import FileUpload from "../components/ui/FileUpload";
import Modal from "../components/ui/Modal";

function Portfolio() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null when adding
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveLink: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPortfolios();
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await portfolioApi.getPortfolios();
      setPortfolios(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load portfolio items.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setForm({
      title: "",
      description: "",
      techStack: "",
      githubLink: "",
      liveLink: "",
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      description: item.description,
      techStack: item.techStack ? item.techStack.join(", ") : "",
      githubLink: item.githubLink || "",
      liveLink: item.liveLink || "",
    });
    setImageFile(null); // reset file input preview
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      return toast.error("Title and description are required.");
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("techStack", form.techStack);
      formData.append("githubLink", form.githubLink);
      formData.append("liveLink", form.liveLink);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingItem) {
        // Edit portfolio
        const res = await portfolioApi.updatePortfolio(editingItem._id, formData);
        toast.success("Portfolio item updated successfully!");
        setPortfolios((prev) =>
          prev.map((item) => (item._id === editingItem._id ? res.data : item))
        );
      } else {
        // Add portfolio
        const res = await portfolioApi.createPortfolio(formData);
        toast.success("Portfolio item created successfully!");
        setPortfolios((prev) => [res.data.portfolio, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save portfolio item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: "Delete Portfolio Item?",
      text: "Are you sure you want to delete this portfolio project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // brand Red accent
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await portfolioApi.deletePortfolio(itemId);
      toast.success("Portfolio item deleted successfully.");
      setPortfolios((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete portfolio item.");
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
      {/* Header section with add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Portfolio
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Showcase your best engineering and design projects to potential clients.
          </p>
        </div>
        {user && (user.role === "Freelancer" || user.role === "Client") && (
          <Button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2"
          >
            <FiPlus />
            <span>Add Project</span>
          </Button>
        )}
      </div>

      {/* Main Grid Card explorer */}
      {portfolios.length === 0 ? (
        <EmptyState
          type="projects"
          title="No Portfolio Items"
          description="Your portfolio is currently empty. Add dynamic projects to stand out and build trust with clients."
          actionText="Add First Project"
          onActionClick={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((item) => (
            <Card key={item._id} className="flex flex-col justify-between h-full relative overflow-hidden group">
              <div>
                {/* Project Image */}
                {item.image ? (
                  <div className="mb-4 overflow-hidden rounded-xl h-44 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <img
                      src={`http://localhost:5000/${item.image.replace(/\\/g, "/")}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl h-44 bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700/80 text-slate-400">
                    <FiFolder size={48} className="stroke-1" />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Tech Stack */}
                {item.techStack && item.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold uppercase tracking-wide bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons footer */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex gap-2">
                  {item.githubLink && (
                    <a
                      href={item.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                      title="GitHub Repository"
                    >
                      <FiGithub size={16} />
                    </a>
                  )}
                  {item.liveLink && (
                    <a
                      href={item.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                      title="Live Demo Link"
                    >
                      <FiExternalLink size={16} />
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-xs font-semibold cursor-pointer"
                    title="Edit Item"
                  >
                    <FiEdit3 size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-950/20 rounded-xl transition text-xs font-semibold cursor-pointer"
                    title="Delete Item"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Portfolio Item Modal */}
      <Modal
        title={editingItem ? "Edit Portfolio Project" : "Add Portfolio Project"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5 p-2">
          {/* Project Title */}
          <Input
            label="Project Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. GigFlow SaaS Marketplace"
            icon={FiCode}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Project Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detail your contributions, the problems solved, and engineering choices..."
              required
              rows={4}
              className="w-full border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-white/10 focus:border-brand-500 transition-all text-sm resize-none"
            />
          </div>

          {/* Tech Stack */}
          <Input
            label="Tech Stack (comma-separated)"
            name="techStack"
            value={form.techStack}
            onChange={handleChange}
            placeholder="React, Node.js, Express, MongoDB, TailwindCSS"
            icon={FiLayers}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Github Link */}
            <Input
              label="GitHub Link"
              name="githubLink"
              value={form.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/..."
              icon={FiGithub}
            />

            {/* Live Link */}
            <Input
              label="Live Demo Link"
              name="liveLink"
              value={form.liveLink}
              onChange={handleChange}
              placeholder="https://..."
              icon={FiGlobe}
            />
          </div>

          {/* File Upload screenshot */}
          <FileUpload
            label={editingItem ? "Replace Project Screenshot" : "Project Screenshot"}
            onFileSelect={setImageFile}
            accept="image/*"
            initialPreview={editingItem?.image ? `http://localhost:5000/${editingItem.image}` : null}
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Portfolio;

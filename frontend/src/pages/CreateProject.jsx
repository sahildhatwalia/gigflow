import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiPlusCircle,
  FiDollarSign,
  FiTag,
  FiBriefcase,
  FiFileText,
  FiLayers,
} from "react-icons/fi";
import projectsApi from "../api/projects";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FileUpload from "../components/ui/FileUpload";

function CreateProject() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user && user.role !== "Client") {
      toast.error("Only Clients can post new projects!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("budget", form.budget);
      formData.append("category", form.category);
      formData.append("skills", form.skills);

      if (image) {
        formData.append("image", image);
      }

      await projectsApi.createProject(formData);

      toast.success("Project Posted Successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-6 max-w-3xl mx-auto">
      <div className="w-full flex flex-col">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 text-sm font-semibold w-fit transition-colors"
        >
          <FiArrowLeft className="text-base" />
          <span>Back to Projects</span>
        </Link>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand-500 to-indigo-600"></div>

          <h2 className="text-2xl font-extrabold mb-8 text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiPlusCircle className="text-brand-500 text-3xl" />
            <span>Post a New Project</span>
          </h2>

          {user && user.role !== "Client" && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
              <strong>Notice:</strong> Your current role is <strong>{user.role}</strong>. You need to be a <strong>Client</strong> to submit this form.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Project Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Build a Responsive React Dashboard"
              icon={FiBriefcase}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                <FiFileText className="inline mr-2" />
                Project Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the project requirements, deliverables, and goals..."
                required
                rows={5}
                className="w-full border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <Input
                label="Budget (INR)"
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="5000"
                icon={FiDollarSign}
                required
              />

              {/* Category */}
              <Input
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Web Development, Design"
                icon={FiTag}
                required
              />
            </div>

            {/* Skills */}
            <Input
              label="Required Skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node.js, Tailwind CSS (separated by commas)"
              icon={FiLayers}
            />

            {form.skills && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            )}

            {/* Project Image/Attachment */}
            <FileUpload
              label="Project Image / Attachment (Optional)"
              onFileSelect={setImage}
              accept="image/*"
            />

            <Button
              type="submit"
              disabled={loading || (user && user.role !== "Client")}
              className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 shadow-brand-500/10 text-white font-semibold py-3.5 rounded-xl cursor-pointer disabled:opacity-50"
            >
              {loading ? "Publishing Project..." : "Publish Project"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default CreateProject;

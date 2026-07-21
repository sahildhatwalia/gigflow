import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiEdit,
  FiDollarSign,
  FiTag,
  FiBriefcase,
  FiFileText,
  FiLayers,
  FiActivity,
} from "react-icons/fi";
import projectsApi from "../api/projects";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FileUpload from "../components/ui/FileUpload";
import Loader from "../components/ui/Loader";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    skills: "",
    status: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProjectDetails();
  }, [id]);

  const getProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await projectsApi.getProject(id);
      const project = res.data;

      // Check authorization
      const isOwner = user && project.client && (project.client._id === user.id || project.client === user.id);
      if (user && !isOwner) {
        toast.error("You are not authorized to edit this project.");
        navigate("/");
        return;
      }

      setForm({
        title: project.title || "",
        description: project.description || "",
        budget: project.budget || "",
        category: project.category || "",
        skills: Array.isArray(project.skills) ? project.skills.join(", ") : "",
        status: project.status || "open",
        image: project.image || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load project details.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("budget", form.budget);
      formData.append("category", form.category);
      formData.append("skills", form.skills);
      formData.append("status", form.status);

      if (image) {
        formData.append("image", image);
      }

      await projectsApi.updateProject(id, formData);
      toast.success("Project Updated Successfully!");
      navigate(`/view/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update project.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-6 max-w-3xl mx-auto">
      <div className="w-full flex flex-col">
        <Link
          to={`/view/${id}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 text-sm font-semibold w-fit transition-colors"
        >
          <FiArrowLeft className="text-base" />
          <span>Back to Details</span>
        </Link>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand-500 to-indigo-600"></div>

          <h2 className="text-2xl font-extrabold mb-8 text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiEdit className="text-brand-500 text-2xl" />
            <span>Edit Project Details</span>
          </h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Title */}
            <Input
              label="Project Title"
              name="title"
              value={form.title}
              onChange={handleChange}
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
                required
                rows={5}
                className="w-full border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Budget */}
              <Input
                label="Budget (INR)"
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                icon={FiDollarSign}
                required
              />

              {/* Category */}
              <Input
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                icon={FiTag}
                required
              />

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  <FiActivity className="inline mr-2" />
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm h-[46px] cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <Input
              label="Required Skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
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
                      className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md border dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            )}

            {/* File Upload image */}
            <FileUpload
              label="Change Project Image"
              onFileSelect={setImage}
              accept="image/*"
              initialPreview={form.image}
            />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 text-white font-semibold py-3.5 rounded-xl cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default EditProject;

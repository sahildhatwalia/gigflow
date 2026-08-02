import { Link } from "react-router-dom";
import { FiEye, FiEdit3, FiTrash2, FiTag, FiDollarSign, FiUser, FiLayers } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";

function ProjectCard({ project, onDelete }) {
  const { user } = useContext(AuthContext);

  // Check if current user is the owner client
  const isOwner = user && project.client && (project.client._id === user.id || project.client === user.id);

  const statusVariant = {
    open: "success",
    "in-progress": "warning",
    completed: "default",
    cancelled: "danger",
  };

  return (
    <Card hoverLift className="flex flex-col justify-between h-full relative overflow-hidden group">
      <div>
        {/* Category & Status */}
        <div className="flex justify-between items-center mb-4">
          <Badge variant="info" className="text-[10px] uppercase tracking-wider">
            <FiTag className="text-[10px]" />
            {project.category || "General"}
          </Badge>
          <Badge variant={statusVariant[project.status] || "default"} className="text-[10px] uppercase tracking-wider">
            {project.status}
          </Badge>
        </div>

        {/* Project Image (Optional Attachment) */}
        {project.image && (
          <div className="mb-4 overflow-hidden rounded-xl h-36 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-700">
            <img
              src={
                project.image.startsWith("http")
                  ? project.image
                  : `http://localhost:5000/${project.image}`
              }
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-brand-500 transition-colors">
          {project.title}
        </h2>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Skills Required */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.skills.map((skill, index) => (
              <span
                key={index}
                className="text-[9px] font-bold uppercase tracking-wide bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700/80"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Budget & Client */}
        <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Budget</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              <span className="text-xs font-semibold text-slate-400">₹</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {Number(project.budget).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Client Details */}
          {project.client && (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[8px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">Posted By</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block truncate max-w-[80px]">
                  {typeof project.client === "object" ? project.client.name : "Client"}
                </span>
              </div>
              <Avatar
                src={typeof project.client === "object" ? project.client.avatar : ""}
                name={typeof project.client === "object" ? project.client.name : "Client"}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Button Actions */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
        <Link
          to={`/view/${project._id}`}
          className="col-span-1"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-1.5 py-2"
            title="View Details"
          >
            <FiEye size={13} />
            <span>View</span>
          </Button>
        </Link>

        {isOwner ? (
          <>
            <Link
              to={`/edit/${project._id}`}
              className="col-span-1"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5 py-2"
                title="Edit Project"
              >
                <FiEdit3 size={13} />
                <span>Edit</span>
              </Button>
            </Link>

            <Button
              onClick={() => onDelete(project._id)}
              variant="danger"
              size="sm"
              className="col-span-1 flex items-center justify-center gap-1.5 py-2"
              title="Delete Project"
            >
              <FiTrash2 size={13} />
              <span>Delete</span>
            </Button>
          </>
        ) : (
          <Link
            to={`/view/${project._id}`}
            className="col-span-2"
          >
            <Button
              variant="primary"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 py-2 shadow-brand-500/10"
              title="Apply to Project"
            >
              <FiLayers size={13} />
              <span>Apply Now</span>
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}

export default ProjectCard;

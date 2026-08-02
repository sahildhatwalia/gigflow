import { useState, useRef } from "react";
import { FiUploadCloud, FiTrash2, FiFile } from "react-icons/fi";
import Button from "./Button";

function FileUpload({
  onFileSelect,
  accept = "image/*",
  maxSizeMb = 5,
  initialPreview = "",
  label = "Upload File",
  className = "",
}) {
  const [preview, setPreview] = useState(initialPreview);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;

    // Size check
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMb}MB limit.`);
      return;
    }

    onFileSelect(file);

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("document");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
        {label}
      </label>
      
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            dragActive
              ? "border-brand-500 bg-brand-50/10 dark:bg-brand-950/10"
              : "border-slate-200 dark:border-slate-700 hover:border-brand-500/60 dark:hover:border-brand-500/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <FiUploadCloud size={28} className="text-slate-400 dark:text-slate-500 mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-400 mt-1">
            PNG, JPG, GIF up to {maxSizeMb}MB
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900">
          {preview === "document" ? (
            <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
              <FiFile size={24} />
            </div>
          ) : (
            <img
              src={preview.startsWith("blob:") || preview.startsWith("http") ? preview : `http://localhost:5000/${preview}`}
              alt="Uploaded thumbnail"
              className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
            />
          )}

          <div className="flex-1">
            <span className="text-xs font-semibold text-slate-500 block">File attached</span>
            <button
              type="button"
              onClick={handleRemove}
              className="mt-1 text-xs text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-bold"
            >
              <FiTrash2 size={12} />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;

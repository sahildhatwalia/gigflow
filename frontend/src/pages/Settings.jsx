import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiSliders, FiTrash2, FiCamera, FiCheck, FiSave, FiLayers } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import profileApi from "../api/profile";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import FileUpload from "../components/ui/FileUpload";

function Settings() {
  const { user, fetchProfile, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile"); // "profile", "password", "theme", "account"
  const [loading, setLoading] = useState(false);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    github: "",
    linkedin: "",
    website: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Password Form States
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setProfileForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      bio: user.bio || "",
      address: user.address || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      website: user.website || "",
    });
  }, [user]);

  // Handle avatar preview
  const handleAvatarSelect = (file) => {
    setAvatarFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(profileForm).forEach((key) => {
        formData.append(key, profileForm[key]);
      });
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await profileApi.updateProfile(formData);
      await fetchProfile();
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    try {
      setLoading(true);
      await profileApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    const result = await Swal.fire({
      title: "Reset Account Settings?",
      text: "This will log you out, purge your localStorage token, and reset your user preferences. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Red accent
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, Reset",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      logout();
      localStorage.clear();
      toast.success("Account cache cleared. Redirecting...");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to reset account parameters.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Customize your profile, account preferences, and security settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700/60 shrink-0">
          {[
            { id: "profile", label: "Profile Information", icon: FiUser },
            { id: "password", label: "Change Password", icon: FiLock },
            { id: "theme", label: "Theme Preferences", icon: FiSliders },
            { id: "account", label: "Danger Zone", icon: FiTrash2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tabs Content Details */}
        <div className="flex-1 w-full">
          {activeTab === "profile" && (
            <Card>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
                Profile Details
              </h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Avatar Loader */}
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-6">
                  <div className="relative">
                    <Avatar
                      src={avatarFile ? preview : user?.avatar}
                      name={profileForm.name}
                      size="xl"
                      className="border border-slate-200 dark:border-slate-700"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-slate-900 dark:bg-white text-white dark:text-slate-950 p-2 rounded-full cursor-pointer hover:scale-105 shadow-md border border-slate-100 dark:border-slate-800 transition"
                      title="Upload Avatar"
                    >
                      <FiCamera size={14} />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarSelect(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Profile Photo</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      JPG, JPEG or PNG formats supported. Max size 5MB.
                    </p>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    icon={FiUser}
                    required
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="e.g. +91 9876543210"
                    icon={FiCheck}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Biography / Short Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    placeholder="Describe your expertise, background, or business services..."
                    rows={4}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
                  />
                </div>

                <Input
                  label="Contact Address"
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  placeholder="e.g. San Francisco, California"
                  icon={FiSave}
                />

                {/* Social links */}
                <div className="border-t border-slate-100 dark:border-slate-700/60 pt-6 space-y-6">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Social Portfolios</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="GitHub Handle"
                      name="github"
                      value={profileForm.github}
                      onChange={handleProfileChange}
                      placeholder="username"
                    />
                    <Input
                      label="LinkedIn Handle"
                      name="linkedin"
                      value={profileForm.linkedin}
                      onChange={handleProfileChange}
                      placeholder="username"
                    />
                    <Input
                      label="Personal Website"
                      name="website"
                      value={profileForm.website}
                      onChange={handleProfileChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    <FiSave />
                    <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "password" && (
            <Card>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
                Change Password
              </h2>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  icon={FiLock}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  icon={FiLock}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  icon={FiLock}
                  required
                />

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    <FiSave />
                    <span>{loading ? "Updating..." : "Update Password"}</span>
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "theme" && (
            <Card>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
                Theme Preferences
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 p-4 rounded-2xl">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Interface Style</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Choose between light mode and dark mode preferences.
                    </p>
                  </div>
                  <Button
                    onClick={toggleTheme}
                    variant="outline"
                    className="capitalize shrink-0"
                  >
                    Switch to {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </Button>
                </div>

                <div className="p-4 border border-slate-100 dark:border-slate-700/30 rounded-2xl bg-slate-50 dark:bg-slate-900/10 text-xs text-slate-500 leading-relaxed">
                  <strong>Notice:</strong> Your preferences will be saved immediately to the local browser storage cache and synchronized upon page refresh.
                </div>
              </div>
            </Card>
          )}

          {activeTab === "account" && (
            <Card className="border-accent-500/30 dark:border-accent-500/20 bg-accent-50/10">
              <h2 className="text-xl font-extrabold text-accent-500 mb-6">
                Danger Zone
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-accent-500/20 bg-white dark:bg-slate-800 p-5 rounded-2xl">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Reset Account Parameters</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Withdraws all proposals, signs you out, and purges local application parameters.
                    </p>
                  </div>
                  <Button
                    onClick={handleClearCache}
                    variant="danger"
                    className="shrink-0"
                  >
                    Reset & Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;

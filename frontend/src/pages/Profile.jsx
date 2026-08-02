import { useContext, useEffect, useState } from "react";
import {
  FiCamera,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiSave,
} from "react-icons/fi";
import toast from "react-hot-toast";
import profileApi from "../api/profile";
import { HOST } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import Loader from "../components/ui/Loader";

function Profile() {
  const { user, fetchProfile } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    github: "",
    linkedin: "",
    website: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      bio: user.bio || "",
      address: user.address || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      website: user.website || "",
    });

    if (user.avatar) {
      setPreview(`${HOST}/${user.avatar}`);
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (avatar) {
        formData.append("avatar", avatar);
      }

      await profileApi.updateProfile(formData);
      await fetchProfile();

      toast.success("Profile Updated Successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Profile Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  // Fields count for profile completion progress bar
  const completionFields = [
    form.name,
    form.email,
    form.phone,
    form.bio,
    form.address,
    form.github,
    form.linkedin,
    form.website,
    preview,
  ];

  const completed = completionFields.filter(
    (item) => item && item.trim() !== ""
  ).length;

  const percentage = Math.round(
    (completed / completionFields.length) * 100
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Manage your personal information, workspace roles, and account settings.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Avatar Card */}
          <div className="space-y-6">
            <Card className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar
                  src={avatar ? preview : user.avatar}
                  name={form.name}
                  size="xl"
                  className="w-32 h-32 md:w-36 md:h-36 object-cover border-4 border-slate-100 dark:border-slate-700"
                />

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 bg-brand-500 hover:bg-brand-600 text-white p-2.5 rounded-full cursor-pointer transition shadow-md shadow-brand-500/10 border border-white dark:border-slate-900"
                >
                  <FiCamera size={16} />
                </label>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatar}
                  className="hidden"
                />
              </div>

              <h2 className="text-xl font-bold mt-5 text-slate-900 dark:text-white">
                {form.name || "Your Name"}
              </h2>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
                {user.role || "Freelancer"}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 break-all">
                {form.email}
              </p>

              <div className="mt-6 w-full text-left bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                <h3 className="font-bold text-brand-500 mb-2 text-xs uppercase tracking-wider">
                  Profile Tips
                </h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <li>✔ Upload a clean avatar photo</li>
                  <li>✔ Detail your workspace background in bio</li>
                  <li>✔ Complete social portfolio links</li>
                  <li>✔ Add a contact telephone number</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Profile details form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Personal Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  icon={FiUser}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  icon={FiMail}
                  required
                  disabled
                  className="opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-950"
                />

                <Input
                  label="Phone"
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  icon={FiPhone}
                />

                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  icon={FiMapPin}
                />
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Biography
                </label>
                <textarea
                  rows="4"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white p-3 rounded-xl resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition text-sm"
                  placeholder="Tell something about yourself..."
                />
              </div>

              {/* Social links */}
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                  Social Portfolios
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Github"
                    type="text"
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    icon={FiGithub}
                  />

                  <Input
                    label="LinkedIn"
                    type="text"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    icon={FiLinkedin}
                  />

                  <Input
                    label="Website"
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    icon={FiGlobe}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              {/* Profile Completion meters */}
              <div className="mt-8 bg-gradient-to-r from-brand-50/50 to-indigo-50/50 dark:from-indigo-950/10 dark:to-indigo-900/10 rounded-xl p-5 border border-brand-100/50 dark:border-indigo-900/20">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Profile Completeness
                  </h3>
                  <span className="font-bold text-brand-500 text-sm">
                    {percentage}%
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-brand-500 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <FiSave />
                  <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </form>
    </div>
  );
}

export default Profile;
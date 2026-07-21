import { useState } from "react";
import { FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import profileApi from "../api/profile";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
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

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await profileApi.changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password changed successfully!");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand-500 to-indigo-600"></div>

        <h1 className="text-2xl font-extrabold mb-8 text-slate-900 dark:text-white flex items-center gap-2.5">
          <FiLock className="text-brand-500" />
          <span>Change Password</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Current Password"
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            placeholder="Current Password"
            icon={FiLock}
            required
          />

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            icon={FiLock}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            icon={FiLock}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 text-white font-semibold py-3.5 rounded-xl cursor-pointer"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ChangePassword;
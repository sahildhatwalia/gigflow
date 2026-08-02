import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiBriefcase, FiMail, FiLock, FiCheck } from "react-icons/fi";
import authApi from "../api/auth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Freelancer", // Default role
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const selectRole = (role) => {
    setForm({
      ...form,
      role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await authApi.register(form);
      toast.success(res.data.message || "OTP sent successfully!");

      navigate("/verify-email", {
        state: {
          email: res.data.email,
        },
      });
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] bg-[#F8FAFC]/50 dark:bg-[#0F172A] px-4 py-12">
      <div className="w-full max-w-lg">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand-500 to-indigo-600"></div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Join GigFlow
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Create an account and start collaborating today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector Cards */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Choose account type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => selectRole("Freelancer")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                    form.role === "Freelancer"
                      ? "border-brand-500 bg-brand-50/20 dark:bg-indigo-950/20 text-brand-600 dark:text-indigo-400 ring-2 ring-brand-500/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 bg-transparent text-slate-650 dark:text-slate-400"
                  }`}
                >
                  <div className="relative">
                    <FiUser className="text-2xl mb-2" />
                    {form.role === "Freelancer" && (
                      <span className="absolute -top-1 -right-2 bg-brand-500 text-white rounded-full p-0.5 text-[8px]">
                        <FiCheck />
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-sm">Freelancer</span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    Find work & build projects
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => selectRole("Client")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                    form.role === "Client"
                      ? "border-brand-500 bg-brand-50/20 dark:bg-indigo-950/20 text-brand-600 dark:text-indigo-400 ring-2 ring-brand-500/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 bg-transparent text-slate-650 dark:text-slate-400"
                  }`}
                >
                  <div className="relative">
                    <FiBriefcase className="text-2xl mb-2" />
                    {form.role === "Client" && (
                      <span className="absolute -top-1 -right-2 bg-brand-500 text-white rounded-full p-0.5 text-[8px]">
                        <FiCheck />
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-sm">Client</span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    Hire talent & post projects
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={FiUser}
                required
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                icon={FiMail}
                required
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={FiLock}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 shadow-brand-500/10 text-white font-semibold py-3.5 rounded-xl cursor-pointer"
            >
              {loading ? "Creating Account..." : "Register Now"}
            </Button>

            <p className="text-center mt-5 text-sm text-slate-500 dark:text-slate-400">
              Already have an account?
              <Link
                to="/login"
                className="text-brand-500 hover:underline ml-1.5 font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Register;
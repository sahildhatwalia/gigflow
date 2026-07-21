import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock } from "react-icons/fi";
import authApi from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Login() {
  const navigate = useNavigate();
  const { fetchProfile } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    try {
      setLoading(true);
      const res = await authApi.login(form);

      // Save JWT
      localStorage.setItem("token", res.data.token);

      // Load logged in user
      await fetchProfile();

      toast.success("Welcome to GigFlow!");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] bg-[#F8FAFC]/50 dark:bg-[#0F172A] px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand-500 to-indigo-600"></div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Welcome back! Please enter your details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 shadow-brand-500/10 text-white font-semibold py-3 rounded-xl cursor-pointer"
            >
              {loading ? "Logging In..." : "Sign In"}
            </Button>

            <p className="text-center mt-5 text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?
              <Link
                to="/register"
                className="text-brand-500 hover:underline ml-1.5 font-semibold"
              >
                Register
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Login;
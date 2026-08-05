import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiKey, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import authApi from "../api/auth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function ForgotPassword() {
  const navigate = useNavigate();

  // Step 1: Email, Step 2: 6-digit Code, Step 3: New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // Step 1 Submission: Send Reset Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return toast.error("Please enter your email address");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return toast.error("Please enter a valid email address");
    }

    try {
      setLoading(true);
      const res = await authApi.forgotPassword({ email: email.trim() });
      toast.success(res.data.message || "Reset code sent to your email!");
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 OTP Handlers
  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const updated = [...code];
        updated[index] = "";
        setCode(updated);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const updated = [...code];
    pasted.split("").forEach((char, i) => {
      updated[i] = char;
    });
    setCode(updated);
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const codeValue = code.join("");

  // Step 2 Submission: Verify Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (codeValue.length !== 6) {
      return toast.error("Please enter all 6 digits of the code");
    }

    try {
      setLoading(true);
      const res = await authApi.verifyResetCode({
        email: email.trim(),
        code: codeValue,
      });
      setResetToken(res.data.resetToken || "");
      toast.success("Code verified! Set your new password.");
      setStep(3);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Submission: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwords.newPassword) {
      return toast.error("Please enter a new password");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await authApi.resetPassword({
        resetToken,
        email: email.trim(),
        code: codeValue,
        newPassword: passwords.newPassword,
      });
      toast.success(res.data.message || "Password reset successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] bg-[#F8FAFC]/50 dark:bg-[#0F172A] px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand-500 to-indigo-600"></div>

          {/* Stepper Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 1
                  ? "bg-brand-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              1
            </span>
            <div className={`w-8 h-0.5 ${step >= 2 ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-700"}`}></div>
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 2
                  ? "bg-brand-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              2
            </span>
            <div className={`w-8 h-0.5 ${step >= 3 ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-700"}`}></div>
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 3
                  ? "bg-brand-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              3
            </span>
          </div>

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-indigo-950/30 flex items-center justify-center mx-auto mb-3 text-brand-500 border border-brand-100 dark:border-indigo-900/30">
                  <FiKey className="text-2xl" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs">
                  Enter your registered email address and we'll send you a 6-digit verification code.
                </p>
              </div>

              <form onSubmit={handleRequestCode} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  icon={FiMail}
                  required
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 text-white font-semibold py-3 rounded-xl cursor-pointer"
                >
                  {loading ? "Sending Code..." : "Send Verification Code"}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-500 transition-colors font-medium"
                  >
                    <FiArrowLeft /> Back to Sign In
                  </Link>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Enter 6-Digit Code */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-indigo-950/30 flex items-center justify-center mx-auto mb-3 text-brand-500 border border-brand-100 dark:border-indigo-900/30">
                  <FiMail className="text-2xl" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Check Your Email
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs">
                  We've sent a 6-digit code to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl font-bold border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={codeValue.length !== 6 || loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 text-white font-semibold py-3 rounded-xl cursor-pointer"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="flex justify-between items-center text-xs mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <FiArrowLeft /> Change email
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestCode}
                    disabled={loading}
                    className="text-brand-500 hover:underline font-semibold cursor-pointer"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Enter New Password */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-3 text-emerald-500 border border-emerald-100 dark:border-emerald-900/30">
                  <FiCheckCircle className="text-2xl" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Reset Your Password
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs">
                  Create a strong new password for your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  icon={FiLock}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  icon={FiLock}
                  required
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 text-white font-semibold py-3 rounded-xl cursor-pointer"
                >
                  {loading ? "Resetting Password..." : "Set New Password"}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-500 transition-colors font-medium"
                  >
                    <FiArrowLeft /> Back to Sign In
                  </Link>
                </div>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;

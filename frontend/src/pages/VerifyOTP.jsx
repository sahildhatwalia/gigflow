import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import verifyApi from "../api/verify";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchProfile } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle typing
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updated = [...otp];
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Arrow navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting full OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const updated = [...otp];
    pasted.split("").forEach((char, i) => {
      updated[i] = char;
    });

    setOtp(updated);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const otpValue = otp.join("");
  
  const handleVerify = async () => {
    if (otpValue.length !== 6) {
      return toast.error("Enter complete OTP");
    }

    try {
      setLoading(true);
      const res = await verifyApi.verifyEmail({
        email,
        otp: otpValue,
      });

      localStorage.setItem("token", res.data.token);
      await fetchProfile();

      toast.success("Email Verified Successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC]/50 dark:bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand-500 to-indigo-600"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-indigo-950/20 flex items-center justify-center mx-auto mb-4 border border-brand-100 dark:border-indigo-900/30 text-brand-500">
              <FiMail className="text-3xl" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Verify Email
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              We've sent a 6-digit verification code to
            </p>

            <p className="font-semibold text-slate-700 dark:text-slate-400 mt-1 break-all text-xs">
              {email}
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={otpValue.length !== 6 || loading}
            className="w-full bg-brand-500 hover:bg-brand-600 focus:ring-brand-500 text-white font-semibold py-3.5 rounded-xl cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

          {/* Resend Placeholder */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-xs">
              Didn't receive the code?
            </p>
            <button
              type="button"
              className="text-brand-500 hover:underline font-bold mt-1 text-xs cursor-pointer"
            >
              Resend OTP
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default VerifyOTP;
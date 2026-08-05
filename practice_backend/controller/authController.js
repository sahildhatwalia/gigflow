import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import generateOTP from "../utils/generateOTP.js";
import sendOTP from "../utils/sendOTP.js";
import sendEmail from "../utils/sendEmail.js";

// ==============================
// REGISTER
// ==============================

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password) are required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Password minimum length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (role && !["Client", "Freelancer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      // If user exists but is NOT verified, update account with new details & new OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();

      existingUser.name = name.trim();
      existingUser.password = hashedPassword;
      existingUser.role = role || "Freelancer";
      existingUser.emailOtp = otp;
      existingUser.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await existingUser.save();

      try {
        await sendOTP(existingUser.email, otp);
      } catch (mailErr) {
        console.error("Failed to send OTP email:", mailErr);
      }

      return res.status(200).json({
        success: true,
        message: "Registration updated. OTP sent to your email.",
        email: existingUser.email,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || "Freelancer",
      isVerified: false,
      emailOtp: otp,
      emailOtpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      twoFactorEnabled: false,
    });

    try {
      await sendOTP(user.email, otp);
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
      email: user.email,
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error during registration",
    });
  }
};

// ==============================
// LOGIN
// ==============================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Email Verification Check
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error during login",
    });
  }
};

// ==============================
// FORGOT PASSWORD
// ==============================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    // Generic response to avoid revealing email existence for security
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset code has been sent.",
      });
    }

    const resetCode = generateOTP();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await user.save();

    const html = `
      <div style="font-family:Arial,sans-serif;padding:30px;background:#f8fafc">
        <div style="max-width:500px;margin:auto;background:white;border-radius:12px;padding:30px">
          <h2 style="color:#4f46e5;margin-bottom:20px">GigFlow Password Reset</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Use the 6-digit code below to set a new password:</p>
          <div style="margin:30px 0;text-align:center;font-size:34px;font-weight:bold;letter-spacing:8px;color:#4f46e5;">
            ${resetCode}
          </div>
          <p>This code is valid for <strong>10 minutes</strong>.</p>
          <p style="color:#64748b;font-size:14px">If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="margin:25px 0">
          <p style="font-size:13px;color:#94a3b8">© GigFlow Platform</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "GigFlow - Password Reset Code",
        html,
      });
    } catch (mailErr) {
      console.error("Failed to send password reset email:", mailErr);
    }

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset code has been sent.",
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

// ==============================
// VERIFY RESET CODE
// ==============================

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and 6-digit code are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !user.resetPasswordCode || user.resetPasswordCode !== code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    if (user.resetPasswordExpiry && user.resetPasswordExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Reset code has expired. Please request a new code.",
      });
    }

    // Short-lived reset token (15 mins)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email, purpose: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "Reset code verified successfully",
      resetToken,
    });

  } catch (err) {
    console.error("Verify Reset Code Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

// ==============================
// RESET PASSWORD
// ==============================

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, email, code, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    let userId = null;

    if (resetToken) {
      try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (decoded.purpose !== "password_reset") {
          return res.status(400).json({
            success: false,
            message: "Invalid reset token",
          });
        }
        userId = decoded.id;
      } catch (jwtErr) {
        return res.status(400).json({
          success: false,
          message: "Reset token has expired or is invalid. Please request a new code.",
        });
      }
    } else if (email && code) {
      const cleanEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: cleanEmail });
      if (!user || user.resetPasswordCode !== code.trim() || user.resetPasswordExpiry < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset code",
        });
      }
      userId = user._id;
    } else {
      return res.status(400).json({
        success: false,
        message: "Reset token or email/code verification required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordCode = "";
    user.resetPasswordExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in with your new password.",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};
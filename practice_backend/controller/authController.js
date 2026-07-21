import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import generateOTP from "../utils/generateOTP.js";
import sendOTP from "../utils/sendOTP.js";

// ==============================
// REGISTER
// ==============================

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (role && !["Client", "Freelancer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Freelancer",
      isVerified: false,

      emailOtp: otp,

      emailOtpExpiry: new Date(
        Date.now() + 10 * 60 * 1000
      ),

      twoFactorEnabled: false,
    });

    await sendOTP(user.email, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
      email: user.email,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // Email Verification Check

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
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

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
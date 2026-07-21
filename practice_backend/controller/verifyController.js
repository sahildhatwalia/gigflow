import User from "../models/user.js";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOTP.js";
import sendOTP from "../utils/sendOTP.js";

// ===============================
// VERIFY EMAIL OTP
// ===============================

export const verifyEmail = async (req, res) => {
  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.emailOtpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    user.isVerified = true;

    user.emailOtp = "";

    user.emailOtpExpiry = null;

    await user.save();

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
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
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

// ===============================
// RESEND OTP
// ===============================

export const resendOTP = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otp = generateOTP();

    user.emailOtp = otp;

    user.emailOtpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    await sendOTP(user.email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};
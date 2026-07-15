import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;

    user.email = req.body.email || user.email;

    user.phone = req.body.phone || user.phone;

    user.bio = req.body.bio || user.bio;

    user.address = req.body.address || user.address;

    user.github = req.body.github || user.github;

    user.linkedin = req.body.linkedin || user.linkedin;

    user.website = req.body.website || user.website;

    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const changePassword = async (req, res) => {
  try {

    const {
      oldPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.json({
      message: "Password changed successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
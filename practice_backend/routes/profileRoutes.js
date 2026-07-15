import express from "express";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controller/profileController.js";

import verifyToken from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", verifyToken, getProfile);

router.put(
  "/",
  verifyToken,
  upload.single("avatar"),
  updateProfile
);

router.put(
  "/password",
  verifyToken,
  changePassword
);

export default router;
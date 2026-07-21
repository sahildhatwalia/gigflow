import express from "express";

import {
  verifyEmail,
  resendOTP,
} from "../controller/verifyController.js";

const router = express.Router();

router.post("/email", verifyEmail);

router.post("/resend", resendOTP);

export default router;
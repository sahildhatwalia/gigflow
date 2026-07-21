import express from "express";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controller/portfolioController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All routes are protected for freelancers/clients
router.get("/", auth, getPortfolios);
router.post("/", auth, upload.single("image"), createPortfolio);
router.put("/:id", auth, upload.single("image"), updatePortfolio);
router.delete("/:id", auth, deletePortfolio);

export default router;

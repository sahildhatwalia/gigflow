import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  searchProjects,
  uploadImage,
  submitProposal,
  cancelProposal,
  getMyProposals,
  updateProposalStatus,
} from "../controller/projectController.js";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public Routes
router.get("/", getProjects);
router.get("/search", searchProjects);

// Protected Proposals / My Applications Route (must be before :id)
router.get("/my-proposals", auth, getMyProposals);

router.get("/:id", getProject);

// Protected Routes
router.post("/", auth, upload.single("image"), createProject);
router.put("/:id", auth, upload.single("image"), updateProject);
router.put("/upload/:id", auth, upload.single("image"), uploadImage);
router.delete("/:id", auth, deleteProject);

// Protected Proposal actions
router.post("/:id/proposal", auth, submitProposal);
router.delete("/:id/proposal", auth, cancelProposal);
router.put("/:projectId/proposal/:proposalId", auth, updateProposalStatus);

export default router;

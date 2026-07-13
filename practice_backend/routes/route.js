import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  searchProducts,
  deleteProduct,
  uploadImage
} from "../controller/controller.js";

import upload from "../middleware/upload.js";

const router = express.Router();
console.log("Routes loaded");



router.post("/", upload.single("image"), createProduct);
router.get("/search", searchProducts);
router.get("/", getProducts);
router.get("/:id", getProduct);

// router.put("/:id", updateProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);



export default router;
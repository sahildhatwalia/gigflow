import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  uploadImage,
} from "../controller/productController.js";

import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProduct);

// Protected Routes
router.post("/", auth, upload.single("image"), createProduct);

router.put('/:id', auth, upload.single('image'), updateProduct);

router.put("/upload/:id", auth, upload.single("image"), uploadImage);

router.delete("/:id", auth, deleteProduct);

export default router;



  

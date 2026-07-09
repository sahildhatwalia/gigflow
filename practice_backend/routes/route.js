import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controller/controller.js";



const router = express.Router();
console.log("Routes loaded");



router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);



router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
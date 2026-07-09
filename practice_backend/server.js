import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import productRoutes from "./routes/route.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());  //define the cors or url in the production dont leave it open on
app.use(express.json());

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
console.log("Server Loaded");

app.get("/hello", (req, res) => {
  res.send("Hello");
});
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
dotenv.config();

connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman) or matched allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid CORS blocking
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Health Check Route
app.get("/", (req, res) => {
  res.json({ success: true, message: "GigFlow Backend API is running successfully!" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Fallback 404 Handler for undefined API routes
app.use("/api/*splat", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found. Check endpoint path and HTTP method.`,
  });
});

const PORT = process.env.PORT || 5000;

// Error handler (returns JSON and logs server errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
console.log("Server Loaded");


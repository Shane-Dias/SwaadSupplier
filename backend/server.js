import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import creditRoutes from "./routes/credit.js";

// Configure dotenv
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Dev (Vite)
  "http://localhost:5174", // Fallback Dev
  "http://localhost:5175", // Current Dev
  "https://swaad-supplier.vercel.app", // Prod
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Create uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/credit", creditRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import jobRoutes from "./src/routes/job.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6999;

connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("Job Portal API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

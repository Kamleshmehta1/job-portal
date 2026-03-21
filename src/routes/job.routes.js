import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJob,
} from "../controllers/job.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import proposalRoutes from "../routes/proposal.routes.js";

const router = express.Router();

router.use("/:jobId/proposals", proposalRoutes);

router.get("/", getAllJobs);
router.get("/:id", getJob);
router.post("/", protect, createJob);
router.delete("/:id", protect, deleteJob);

export default router;

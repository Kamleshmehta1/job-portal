import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJob,
  updateJob,
} from "../controllers/job.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import proposalRoutes from "./proposal.routes.js";

const router = express.Router();

router.use(
  "/:jobId/proposals",
  protect,
  authorize("freelancer"),
  proposalRoutes,
);

router.get("/", getAllJobs);
router.get("/:id", getJob);
router.post("/", protect, authorize("client"), createJob);
router.delete("/:id", protect, authorize("client"), deleteJob);
router.patch("/:id", protect, authorize("client"), updateJob);

export default router;

import express from "express";
import {
  createProposal,
  getJobProposals,
} from "../controllers/proposal.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, createProposal);

router.get("/", protect, getJobProposals);

export default router;

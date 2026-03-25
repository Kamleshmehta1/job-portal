import express from "express";
import {
  createProposal,
  getJobProposals,
  updateProposalStatus,
} from "../controllers/proposal.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, createProposal);

router.get("/", protect, getJobProposals);

router.patch(
  "/:proposalId",
  // #swagger.parameters['body'] = {
  //   in: 'body',
  //   required: true,
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       status: { type: 'string', example: 'accepted', enum: ['accepted', 'rejected', 'withdrawn'] }
  //     }
  //   }
  // }
  protect,
  authorize("client"),
  updateProposalStatus,
);
export default router;

import { type NextFunction, type Request, type Response } from "express";
import Job from "../models/Job.js";
import Proposal from "../models/Proposal.js";
import type { MongoError } from "../types/mongo.types.js";
import { ApiError } from "../utils/ApiError.js";

export const createProposal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { coverLetter, bidAmount, deliveryDays } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) throw new ApiError(404, "Job not found");

    if (job.status !== "open")
      throw new ApiError(400, "Job is not open for proposals");

    const proposal = await Proposal.create({
      job: jobId as string,
      freelancer: req.user!._id,
      coverLetter,
      bidAmount,
      deliveryDays,
    });

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      data: proposal,
    });
  } catch (error) {
    const mongoError = error as MongoError;
    if (mongoError.code === 11000) {
      return next(new ApiError(400, "You have already applied for this job"));
    }
    next(error);
  }
};

export const getJobProposals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) throw new ApiError(404, "Job not found");

    if (job.client.toString() !== req.user!._id.toString()) {
      throw new ApiError(403, "Not authorized");
    }

    const proposals = await Proposal.find({
      job: req.params.jobId as string,
    }).populate("freelancer", "name email");

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    next(error);
  }
};

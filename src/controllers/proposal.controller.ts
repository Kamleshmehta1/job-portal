import { type Request, type Response } from "express";
import Job from "../models/Job.js";
import Proposal from "../models/Proposal.js";

export const createProposal = async (req: Request, res: Response) => {
  try {
    const { coverLetter, bidAmount, deliveryDays } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Job is not open for proposals",
      });
    }

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
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobProposals = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.client.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const proposals = await Proposal.find({
      job: req.params.jobId as string,
    }).populate("freelancer", "name email");

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

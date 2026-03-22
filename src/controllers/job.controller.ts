import { type Request, type Response } from "express";
import Job from "../models/Job.js";
import type { CreateJobBody, JobParams } from "../types/job.types.js";

export const createJob = async (
  req: Request<{}, {}, CreateJobBody>,
  res: Response,
) => {
  try {
    const { title, description, skillsRequired, budget, deadline } = req.body;

    const job = await Job.create({
      title,
      description,
      skillsRequired,
      budget: budget,
      deadline,
      client: req.user!._id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJob = async (req: Request<JobParams>, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "client",
      "name email",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteJob = async (req: Request<JobParams>, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.client.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

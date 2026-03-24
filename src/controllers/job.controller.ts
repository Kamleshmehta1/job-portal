import { type NextFunction, type Request, type Response } from "express";
import Job from "../models/Job.js";
import { ApiError } from "../utils/ApiError.js";

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, skillsRequired, budget, deadline } = req.body;

    const job = await Job.create({
      title,
      description,
      skillsRequired,
      budget,
      deadline,
      client: req.user!._id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "client",
      "name email",
    );

    if (!job) throw new ApiError(404, "Job not found");

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page = 1, limit = 10, skills, status = "open" } = req.query;

    const filter: Record<string, unknown> = { status };

    if (skills) {
      filter.skillsRequired = { $in: (skills as string).split(",") };
    }

    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate("client", "name email")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) throw new ApiError(404, "Job not found");

    if (job.client.toString() !== req.user!._id.toString()) {
      throw new ApiError(403, "Not authorized to delete this job");
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) throw new ApiError(404, "Job not found");

    if (job.client.toString() !== req.user!._id.toString()) {
      throw new ApiError(403, "Not authorized to update this job");
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

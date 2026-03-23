import { type NextFunction, type Request, type Response } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

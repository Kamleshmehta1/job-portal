import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. You do not have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};

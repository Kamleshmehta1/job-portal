import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import User from "../models/User.js";
import type { LoginBody, RegisterBody } from "../types/auth.types.js";

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

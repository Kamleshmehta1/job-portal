import express from "express";
import {
  getMe,
  login,
  logOut,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// #swagger.security = [{ "bearerAuth": [] }]
router.get("/me", protect, getMe);
router.post("/refresh", refreshToken);
router.post("/logout", logOut);

export default router;

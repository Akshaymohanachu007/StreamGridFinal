import express from "express";
import { loginUser, registerUser, getMe } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import {verifyOTP}
from "../controllers/authController.js";

const router = express.Router();
router.post("/verify-otp",verifyOTP);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
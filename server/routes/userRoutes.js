import express from "express";
import { getAllUsers, createUser } from "../controllers/userControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getAllUsers).post(protect, admin, createUser);

export default router;

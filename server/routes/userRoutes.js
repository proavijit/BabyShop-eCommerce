import express from "express";
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/userControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getAllUsers).post(protect, admin, createUser);
router.route("/:id")
    .get(protect, getUserById)
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);

export default router;

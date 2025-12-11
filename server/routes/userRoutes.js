import express from "express";
import { getAllUsers, createUser, getUserById, updateUser, deleteUser, addAddress, updateAddress, deleteAddress } from "../controllers/userControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getAllUsers).post(protect, admin, createUser);
router.route("/:id")
    .get(protect, getUserById)
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);



router.route("/:id/address").post(protect, addAddress);

router.route("/:id/address/:addressId")
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);


export default router;

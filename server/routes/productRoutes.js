import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import {
    getProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStats,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/slug/:slug", getProductBySlug);
router.get("/stats", protect, admin, getProductStats);

router
    .route("/:id")
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;

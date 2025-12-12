import asyncHandler from "express-async-handler";
import Product from "../models/productModels.js";
import cloudinary from "../config/cloudinary.js";

// createProduct

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, images } = req.body;
    if (!name || !description || !price || !category || !images) {
        res.status(400);
        throw new Error("Please fill all fields");
    }
    const product = await Product.create({
        name,
        description,
        price,
        category,
        images,
        user: req.user._id,
    });
    res.status(201).json(product);
});


import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.perPage) || 20;
  const page = Number(req.query.page) || 1;
  const sortOrder = req.query.sortOrder || "desc";

  const keyword = req.query.search
    ? {
      name: {
        $regex: req.query.search,
        $options: "i",
      },
    }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .populate("category", "name")
    .populate("brand", "name")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: sortOrder === "asc" ? 1 : -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("brand", "name");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    images,
    stock,
    ageGroup,
    isFeatured,
  } = req.body;

  const productExists = await Product.findOne({ name });
  if (productExists) {
    res.status(400);
    throw new Error("Product with this name already exists");
  }

  let uploadedImages = [];
  if (images && Array.isArray(images)) {
    for (const img of images) {
      if (img.startsWith("data:image")) {
        const result = await cloudinary.uploader.upload(img, {
          folder: "admin-dashboard/products",
        });
        uploadedImages.push(result.secure_url);
      } else {
        uploadedImages.push(img);
      }
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice: discountPrice || 0,
    category,
    brand,
    images: uploadedImages,
    stock: stock || 0,
    ageGroup,
    isFeatured: isFeatured || false,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    images,
    stock,
    ageGroup,
    isFeatured,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    let uploadedImages = [];
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.startsWith("data:image")) {
          const result = await cloudinary.uploader.upload(img, {
            folder: "admin-dashboard/products",
          });
          uploadedImages.push(result.secure_url);
        } else {
          uploadedImages.push(img);
        }
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.images = images ? uploadedImages : product.images;
    product.stock = stock !== undefined ? stock : product.stock;
    product.ageGroup = ageGroup || product.ageGroup;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get product stats
// @route   GET /api/products/stats
// @access  Private/Admin
const getProductStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lt: 10 } });
  const outOfStock = await Product.countDocuments({ stock: 0 });
  const featured = await Product.countDocuments({ isFeatured: true });

  res.json({
    totalProducts,
    lowStock,
    outOfStock,
    featured,
  });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
};

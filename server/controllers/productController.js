import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || Number(req.query.perPage) || 20;
  const page = Number(req.query.page) || 1;

  // Build query
  const query = {};

  // Search by name
  if (req.query.search) {
    query.name = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  // Filter by category (ID)
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by brands (comma-separated IDs)
  if (req.query.brands) {
    const brandIds = req.query.brands.split(",").filter(Boolean);
    if (brandIds.length > 0) {
      query.brand = { $in: brandIds };
    }
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) {
      query.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      query.price.$lte = Number(req.query.maxPrice);
    }
  }

  // Feature flags
  if (req.query.featured) {
    query.isFeatured = req.query.featured === "true";
  }

  if (req.query.trending) {
    query.isTrending = req.query.trending === "true";
  }

  if (req.query.isBestDeal) {
    query.isBestDeal = req.query.isBestDeal === "true";
  }

  if (req.query.ageGroup) {
    query.ageGroup = req.query.ageGroup;
  }

  if (req.query.onSale) {
    query.discountPrice = { $gt: 0 };
  }

  // Build sort object
  let sortOption = { createdAt: -1 }; // Default: newest first

  if (req.query.sort) {
    const sortBy = req.query.sort;
    switch (sortBy) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "name-asc":
        sortOption = { name: 1 };
        break;
      case "name-desc":
        sortOption = { name: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  } else if (req.query.sortOrder) {
    // Backward compatibility
    sortOption = { createdAt: req.query.sortOrder === "asc" ? 1 : -1 };
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(sortOption);

  res.json({
    products,
    page,
    limit: pageSize,
    pages: Math.ceil(count / pageSize),
    total: count,
    totalPages: Math.ceil(count / pageSize)
  });
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
    isTrending,
    isBestDeal,
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
    isTrending: isTrending || false,
    isBestDeal: isBestDeal || false,
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
    isTrending,
    isBestDeal,
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
    product.ageGroup = ageGroup || product.ageGroup;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;
    product.isBestDeal = isBestDeal !== undefined ? isBestDeal : product.isBestDeal;

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
  const trending = await Product.countDocuments({ isTrending: true });
  const bestDeals = await Product.countDocuments({ isBestDeal: true });

  res.json({
    totalProducts,
    lowStock,
    outOfStock,
    featured,
    trending,
    bestDeals,
  });
});

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category", "name slug")
    .populate("brand", "name");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
};

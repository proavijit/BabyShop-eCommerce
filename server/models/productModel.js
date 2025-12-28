// models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true, index: true },
        brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        description: { type: String },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        stock: { type: Number, required: true },
        images: [{ type: String }],
        ageGroup: { type: String }, // example: "0-3 years", "3-6 years"
        isFeatured: { type: Boolean, default: false },
        isTrending: { type: Boolean, default: false },
        isBestDeal: { type: Boolean, default: false },
        // SEO Fields
        metaTitle: { type: String },
        metaDescription: { type: String },
        keywords: [{ type: String }],
    },
    { timestamps: true }
);

// Slugify function
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

// Pre-save hook to generate slug
productSchema.pre("save", async function (next) {
    if (!this.isModified("name") && this.slug) {
        return next();
    }

    this.slug = slugify(this.name);

    // Ensure uniqueness handled by DB, but we could add more logic here if needed
    next();
});

export default mongoose.model("Product", productSchema);

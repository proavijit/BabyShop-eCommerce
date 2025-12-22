// models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
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
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);

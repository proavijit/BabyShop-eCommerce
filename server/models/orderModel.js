// models/orderModel.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        shippingAddress: {
            name: String,
            phone: String,
            address: String,
            city: String,
            zipcode: String,
            country: String,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

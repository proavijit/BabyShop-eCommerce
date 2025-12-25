"use client";

import { useState } from "react";
import { Product } from "@/types/type";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import WishListButton from "./WishListButton";

interface ProductActionProps {
    product: Product;
}

export default function ProductAction({ product }: ProductActionProps) {
    const [quantity, setQuantity] = useState(1);

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const finalPrice = hasDiscount ? product.discountPrice! : product.price;

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="space-y-8 pt-6">
            {/* Price */}
            <div className="space-y-1">
                <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        ${finalPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xl text-gray-400 line-through font-medium">
                            ${product.price.toFixed(2)}
                        </span>
                    )}
                </div>
                {hasDiscount && (
                    <span className="inline-block px-3 py-1 bg-red-50 text-babyshopRed text-xs font-bold rounded-full animate-pulse">
                        Save ${(product.price - product.discountPrice!).toFixed(2)}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="space-y-6 pt-2">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Quantity - Playful & Round */}
                    <div className="flex items-center justify-between px-2 w-full sm:w-40 h-14 bg-gray-50 rounded-2xl border border-gray-100">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-gray-500 transition-all disabled:opacity-30"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-bold text-gray-900">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= product.stock}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-gray-500 transition-all disabled:opacity-30"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add to Cart - Brand Gradient */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={product.stock === 0}
                        className="flex-1 h-14 bg-gradient-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-babyshopSky/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </motion.button>

                    <button className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-100 hover:border-babyshopSky/30 hover:bg-red-50 group transition-all duration-300">
                        <WishListButton productId={product._id} className="w-full h-full rounded-2xl group-hover:text-red-500" />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-teal-50/50 py-3 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                    Free shipping on orders over <span className="font-bold text-teal-600">$50</span>
                </div>
            </div>
        </div>
    );
}
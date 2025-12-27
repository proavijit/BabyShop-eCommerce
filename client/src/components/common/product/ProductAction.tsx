"use client";

import { useState } from "react";
import { Product } from "@/types/type";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart, Heart, Loader2 } from "lucide-react";
import WishListButton from "./WishListButton";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface ProductActionProps {
    product: Product;
}

export default function ProductAction({ product }: ProductActionProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, isLoading, isInCart } = useCart();
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const finalPrice = hasDiscount ? product.discountPrice! : product.price;

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart", {
                description: "Redirecting you to the login page...",
            });
            router.push("/auth/signin");
            return;
        }

        if (isInCart(product._id)) {
            toast.info(`${product.name} is already in your cart`, {
                description: "You can update the quantity from this page or the cart summary.",
            });
            return;
        }

        try {
            await addToCart(product, quantity);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error("Failed to add to cart");
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
                            disabled={quantity <= 1 || isLoading}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-gray-500 transition-all disabled:opacity-30"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-bold text-gray-900">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= product.stock || isLoading}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-gray-500 transition-all disabled:opacity-30"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add to Cart - Brand Gradient */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={product.stock === 0 || isLoading}
                        onClick={handleAddToCart}
                        className="flex-1 h-14 bg-gradient-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-babyshopSky/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <ShoppingCart className="w-5 h-5" />
                        )}
                        {product.stock > 0 ? (isLoading ? "Adding..." : "Add to Cart") : "Out of Stock"}
                    </motion.button>

                    <div className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-100 hover:border-babyshopSky/30 hover:bg-red-50 group transition-all duration-300">
                        <WishListButton
                            productId={product._id}
                            product={product}
                            className="w-full h-full rounded-2xl group-hover:text-red-500"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-teal-50/50 py-3 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                    Free shipping on orders over <span className="font-bold text-teal-600">$50</span>
                </div>
            </div>
        </div>
    );
}
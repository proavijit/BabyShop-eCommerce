"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Zap, Star, Package } from "lucide-react";
import { Product } from "@/types/type";

interface ProductActionProps {
    product: Product;
}

export default function ProductAction({ product }: ProductActionProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Calculate prices
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const finalPrice = hasDiscount ? product.discountPrice! : product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
        : 0;

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        // TODO: Add API call to add to cart
        console.log(`Adding ${quantity} of product ${product._id} to cart`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsAddingToCart(false);

        // Show success message (you can add a toast notification here)
        alert(`Added ${quantity} item(s) to cart!`);
    };

    const handleBuyNow = () => {
        console.log(`Buy now: ${quantity} of product ${product._id}`);
        // TODO: Navigate to checkout
        alert('Redirecting to checkout...');
    };

    return (
        <div className="space-y-6">
            {/* Price Section */}
            <div className="bg-gradient-to-br from-teal-50/60 via-cyan-50/60 to-white rounded-2xl p-6 border border-gray-200">
                {hasDiscount ? (
                    <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-babyshopRed">
                                ${finalPrice.toFixed(2)}
                            </span>
                            <span className="text-2xl text-gray-400 line-through">
                                ${product.price.toFixed(2)}
                            </span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-babyshopRed/10 rounded-full">
                            <Zap className="w-4 h-4 text-babyshopRed" />
                            <span className="text-sm font-bold text-babyshopRed">
                                Save {discountPercentage}% OFF
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-4xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </div>
                )}

                {/* Stock Status */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    {product.stock > 0 ? (
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-babyshopSky" />
                            <span className="text-sm font-medium text-gray-700">
                                {product.stock > 10 ? (
                                    <span className="text-babyshopSky">In Stock</span>
                                ) : (
                                    <span className="text-orange-500">Only {product.stock} left!</span>
                                )}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-babyshopRed" />
                            <span className="text-sm font-medium text-babyshopRed">Out of Stock</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Quantity Selector */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Quantity
                </label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-babyshopSky flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                    >
                        <Minus className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex-1 max-w-[100px]">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                if (val >= 1 && val <= product.stock) {
                                    setQuantity(val);
                                }
                            }}
                            className="w-full h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-babyshopSky focus:outline-none"
                            min="1"
                            max={product.stock}
                        />
                    </div>
                    <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-babyshopSky flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                    >
                        <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAddingToCart}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="w-full h-14 rounded-xl bg-white border-2 border-babyshopSky text-babyshopSky hover:bg-babyshopSky hover:text-white font-bold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Buy Now
                </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                        <Star className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Fast Delivery</span>
                </div>
            </div>
        </div>
    );
}
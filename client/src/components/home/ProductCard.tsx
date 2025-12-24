"use client";

import { Product } from "@/types/type";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
    product: Product & { images?: string[]; discountPrice?: number };
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const imageUrl = product.images?.[0] || product.image || "/placeholder.png";

    const price = product.price;
    const discountPrice = product.discountPrice;

    let discountPercentage = product.discountPercentage;
    // Calculate percentage if missing but we have both prices
    if (!discountPercentage && discountPrice && discountPrice < price) {
        discountPercentage = Math.round(((price - discountPrice) / price) * 100);
    }

    const brandName = product.brand
        ? (typeof product.brand === 'object' ? (product.brand as any).name : product.brand)
        : null;
    const categoryName = product.category
        ? (typeof product.category === 'object' ? (product.category as any).name : product.category)
        : null;

    // Determine final price to show
    const finalPrice = discountPrice && discountPrice < price ? discountPrice : price;
    const hasDiscount = discountPrice && discountPrice < price;

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-babyshopSky/30 transition-all duration-500 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white p-6">
                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="absolute left-3 top-3 z-10 bg-gradient-to-r from-babyshopRed to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{discountPercentage}% OFF
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute right-3 top-3 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-babyshopSky hover:scale-110 transition-all duration-300 group/heart"
                >
                    <Heart
                        className={`w-4 h-4 transition-all duration-300 ${isWishlisted
                            ? 'fill-babyshopRed text-babyshopRed'
                            : 'text-gray-400 group-hover/heart:text-white'
                            }`}
                    />
                </button>

                {/* Product Image */}
                <Link href={`/product/${product._id}`} className="block w-full h-full relative">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                    />
                </Link>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                {/* Brand / Category Label */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-babyshopTextLight uppercase tracking-wider font-semibold truncate">
                        {brandName || categoryName || "Product"}
                    </span>
                    {product.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-600">{product.averageRating}</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <Link href={`/product/${product._id}`} className="hover:text-babyshopSky transition-colors block mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>
                </Link>

                {/* Pricing */}
                <div className="mb-3">
                    {hasDiscount ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-babyshopRed font-bold text-xl">
                                ${discountPrice?.toFixed(2)}
                            </span>
                            <span className="text-gray-400 line-through text-sm">
                                ${price.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <div className="text-gray-900 font-bold text-xl">
                            ${price.toFixed(2)}
                        </div>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                    {product.stock > 0 ? (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-babyshopSky animate-pulse" />
                            <span className="text-xs text-babyshopSky font-medium">
                                {product.stock} in stock
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-babyshopRed" />
                            <span className="text-xs text-babyshopRed font-medium">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <div className="mt-auto">
                    <Button
                        disabled={product.stock === 0}
                        className="w-full rounded-full bg-transparent border-2 border-babyshopSky text-babyshopSky hover:bg-gradient-to-r hover:from-babyshopSky hover:to-teal-400 hover:text-white hover:border-transparent font-semibold h-11 gap-2 shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}

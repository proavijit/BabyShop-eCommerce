"use client";

import { Product } from "@/types/type";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "../common/AddToCartButton";
import WishListButton from "../common/product/WishListButton";

interface ProductCardProps {
    product: Product & { images?: string[]; discountPrice?: number };
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.images?.[0] || product.image || "/placeholder.png";
    const price = product.price;
    const discountPrice = product.discountPrice;

    const hasDiscount = discountPrice && discountPrice < price;
    const discountPercentage = hasDiscount
        ? Math.round(((price - discountPrice) / price) * 100)
        : null;

    const brandName = product.brand
        ? (typeof product.brand === 'object' ? (product.brand as any).name : product.brand)
        : "Baby Care";

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                {hasDiscount && (
                    <div className="absolute left-2 top-2 z-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                        {discountPercentage}% OFF
                    </div>
                )}

                <div className="absolute right-2 top-2 z-10">
                    <WishListButton productId={product._id} product={product} />
                </div>

                <Link href={`/product/${product._id}`} className="block h-full w-full">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            </div>

            {/* Details Section */}
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {brandName}
                </span>

                <Link href={`/product/${product._id}`} className="flex-grow">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex flex-col gap-3 mt-auto">
                    {/* Price Area */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            ${(hasDiscount ? discountPrice : price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                                ${price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Footer: Stock & Add to Cart */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-[11px] text-gray-500 font-medium">
                                {product.stock} left
                            </span>
                        </div>

                        {/* Button fix: container control */}
                        <div className="max-w-[120px]">
                            <AddToCartButton
                                product={product}
                                className="!py-2 !px-3 text-xs bg-babyshopSky text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
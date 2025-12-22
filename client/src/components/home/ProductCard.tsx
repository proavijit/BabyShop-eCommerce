"use client";

import { Product } from "@/types/type";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product & { images?: string[]; discountPrice?: number };
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.images?.[0] || product.image || "/placeholder.png";

    const price = product.price;
    const discountPrice = product.discountPrice;

    let discountPercentage = product.discountPercentage;
    // Calculate percentage if missing but we have both prices
    if (!discountPercentage && discountPrice && discountPrice < price) {
        discountPercentage = Math.round(((price - discountPrice) / price) * 100);
    }

    const brandName = typeof product.brand === 'object' ? (product.brand as any).name : product.brand;
    const categoryName = typeof product.category === 'object' ? (product.category as any).name : product.category;

    // Determine final price to show
    const finalPrice = discountPrice && discountPrice < price ? discountPrice : price;
    const hasDiscount = discountPrice && discountPrice < price;

    return (
        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-white p-4">
                {hasDiscount && (
                    <span className="absolute left-4 top-4 z-10 bg-[#FF3B30] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{discountPercentage}%
                    </span>
                )}

                <Link href={`/product/${product._id}`} className="block w-full h-full relative">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>
            </div>

            {/* Separator line like in the image */}
            <div className="h-px bg-gray-100 w-full" />

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
                {/* Brand / Category Label */}
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1 truncate">
                    {brandName || categoryName || "Product"}
                </p>

                {/* Title */}
                <Link href={`/product/${product._id}`} className="hover:text-primary transition-colors block mb-3">
                    <h3 className="font-medium text-gray-900 text-base line-clamp-2 min-h-12">
                        {product.name}
                    </h3>
                </Link>

                {/* Pricing */}
                <div className="mb-2">
                    {hasDiscount ? (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">
                                ${price.toFixed(2)}
                            </span>
                            <span className="text-[#FF3B30] font-bold text-lg">
                                ${discountPrice.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <div className="text-gray-900 font-bold text-lg">
                            ${price.toFixed(2)}
                        </div>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mb-4 text-sm">
                    {product.stock > 0 ? (
                        <p className="text-gray-500">
                            In Stock: <span className="text-[#00BFA5] font-medium">{product.stock}</span>
                        </p>
                    ) : (
                        <p className="text-red-500 font-medium">Out of Stock</p>
                    )}
                </div>

                {/* Add to Cart Button */}
                <div className="mt-auto">
                    <Button
                        variant="outline"
                        className="w-full rounded-full border-[#00BFA5] text-[#00BFA5] hover:bg-[#00BFA5] hover:text-white transition-all duration-300 font-medium h-10 gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to cart
                    </Button>
                </div>
            </div>
        </div>
    );
}

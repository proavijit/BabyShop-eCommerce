import Link from "next/link";
import { Star } from "lucide-react";
import { Product } from "@/types/type";

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const brandName = typeof product.brand === 'object' ? product.brand.name : product.brand;

    return (
        <div className="space-y-4">
            {/* Brand Link */}
            {brandName && (
                <Link
                    href={`/brand/${brandName.toLowerCase()}`}
                    className="text-babyshopSky font-bold text-sm tracking-widest uppercase hover:underline inline-block"
                >
                    {brandName}
                </Link>
            )}

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-3">
                <div
                    className="flex bg-yellow-50 px-2 py-1 rounded-lg"
                    role="img"
                    aria-label={`Rated ${product.averageRating} out of 5 stars`}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-4 h-4 ${star <= Math.round(product.averageRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-200"
                                }`}
                        />
                    ))}
                </div>
                {product.averageRating > 0 && (
                    <span className="text-sm font-bold text-gray-900">
                        {product.averageRating.toFixed(1)}
                    </span>
                )}
                <span className="text-sm text-gray-500 font-medium">
                    (0 reviews)
                </span>
            </div>
        </div>
    );
}

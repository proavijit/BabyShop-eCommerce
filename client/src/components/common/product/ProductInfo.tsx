import Link from "next/link";
import { Star } from "lucide-react";
import { Product } from "@/types/type";

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const brandName = typeof product.brand === 'object' ? product.brand.name : product.brand;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
        : 0;

    return (
        <div className="space-y-4">
            {/* Discount Badge - Top (from image) */}
            {hasDiscount && (
                <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-tighter shadow-sm shadow-red-500/20">
                        -{discountPercentage}%
                    </span>
                </div>
            )}

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                {product.name}
            </h1>

            {/* Brand Link (Subtle) */}
            {brandName && (
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Brand:</span>
                    <Link
                        href={`/brand/${brandName.toLowerCase()}`}
                        className="text-babyshopSky font-bold text-xs hover:underline"
                    >
                        {brandName}
                    </Link>
                </div>
            )}
        </div>
    );
}

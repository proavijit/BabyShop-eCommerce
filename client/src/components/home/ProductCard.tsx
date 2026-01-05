import { Product } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../common/AddToCartButton";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
    product: Product & { images?: string[]; discountPrice?: number };
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.images?.[0] || product.image || "/placeholder.png";
    const price = product.price;
    const discountPrice = product.discountPrice;
    const hasDiscount = !!(discountPrice && discountPrice < price);

    const discountPercentage = hasDiscount
        ? Math.round(((price - discountPrice) / price) * 100)
        : null;

    const brandName =
        typeof product.brand === "object"
            ? product.brand?.name
            : product.brand || "BABY DEALS";

    return (
        <div className="
      group
      relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white
      transition-all duration-300 ease-in-out
      hover:border-gray-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
    ">
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-white">
                {/* Discount Badge */}
                {hasDiscount && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-[#FF3B30] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                        -{discountPercentage}%
                    </span>
                )}

                {/* Wishlist Button (Professional Hover) */}
                <button className="
          absolute right-2 top-2 z-10 
          flex h-8 w-8 items-center justify-center 
          rounded-full bg-white/80 text-gray-600 backdrop-blur-sm
          transition-all duration-300
          opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
          hover:bg-white hover:text-red-500 hover:shadow-md
        ">
                    <Heart className="h-4 w-4" />
                </button>

                <Link href={`/product/${product.slug}`} className="block h-full w-full">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="
              object-cover
              transition-transform duration-500 ease-out
              group-hover:scale-105
            "
                    />
                </Link>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-3 pt-4">
                <span className="mb-1 text-[10px] font-bold uppercase tracking-tight text-gray-400">
                    {brandName}
                </span>

                <Link href={`/product/${product.slug}`}>
                    <h3 className="mb-2 line-clamp-2 min-h-[36px] text-[13px] font-medium leading-tight text-gray-800 transition-colors group-hover:text-[#00B5A5]">
                        {product.name}
                    </h3>
                </Link>

                {/* Pricing */}
                <div className="mb-4 flex items-center gap-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-[12px] text-gray-400 line-through">
                                ${price.toFixed(2)}
                            </span>
                            <span className="text-[14px] font-bold text-[#FF3B30]">
                                ${discountPrice?.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span className="text-[14px] font-bold text-gray-900">
                            ${price.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Button – Minimal, Fixed Hover State */}
                <AddToCartButton
                    product={product}
                    className="
            flex w-full items-center justify-center gap-2
            rounded-full border border-[#00B5A5]
            bg-white py-1.5
            text-[12px] font-bold text-gray-700
            transition-all duration-200
            hover:bg-[#00B5A5] hover:text-white
            active:scale-95
            shadow-none
          "
                >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to cart
                </AddToCartButton>
            </div>
        </div>
    );
}
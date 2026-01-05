import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/type";
import AddToCartButton from "../../common/AddToCartButton";
import WishListButton from "../../common/product/WishListButton";

export default function ProductCard({ product }: { product: Product }) {
    const imageUrl = product.images?.[0] || product.image || "/placeholder.png";
    const hasDiscount = !!(product.discountPrice && product.discountPrice < product.price);

    return (
        <div className="group relative flex flex-col bg-white transition-all duration-500">
            {/* Media Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F3F4F6]">
                {hasDiscount && (
                    <div className="absolute left-3 top-3 z-10 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                        SALE
                    </div>
                )}

                {/* Wishlist Toggle - Functionally Integrated */}
                <WishListButton
                    productId={product._id}
                    product={product}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-400 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hover:text-rose-500 hover:bg-white shadow-sm backdrop-blur-sm"
                />

                <Link href={`/product/${product.slug}`} className="block h-full w-full">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                </Link>

                {/* Quick Cart Slide-up */}
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                    <AddToCartButton
                        product={product}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 py-2.5 text-[12px] font-bold text-slate-900 shadow-xl backdrop-blur-md transition-all hover:bg-white active:scale-95"
                    />
                </div>
            </div>

            {/* Info Container */}
            <div className="mt-4 flex flex-col space-y-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    {typeof product.brand === "object" ? product.brand?.name : product.brand || "Premium"}
                </span>
                <Link href={`/product/${product.slug}`}>
                    <h3 className="line-clamp-1 text-sm font-medium text-slate-800 transition-colors group-hover:text-[#00B5A5]">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-2 pt-0.5">
                    {hasDiscount ? (
                        <>
                            <span className="text-base font-bold text-slate-900">${product.discountPrice}</span>
                            <span className="text-xs text-slate-400 line-through">${product.price}</span>
                        </>
                    ) : (
                        <span className="text-base font-bold text-slate-900">${product.price}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
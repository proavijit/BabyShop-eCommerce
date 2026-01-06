import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/type";
// Keep buttons as small, isolated client components to minimize hydration impact
import AddToCartButton from "../../common/AddToCartButton";
import WishListButton from "../../common/product/WishListButton";

// Move constant styles or logic outside the component to prevent re-creation
const PLACEHOLDER_IMAGE = "/placeholder.png";

export default function ProductCard({
    product,
    priority = false // New prop to handle LCP (First few products in the grid)
}: {
    product: Product;
    priority?: boolean
}) {
    const imageUrl = product.images?.[0] || product.image || PLACEHOLDER_IMAGE;
    const hasDiscount = !!(product.discountPrice && product.discountPrice < product.price);
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - (product.discountPrice ?? 0)) / product.price) * 100)
        : 0;

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md h-full">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f7f7f7]">
                {hasDiscount && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-[#FF3B00] px-2 py-1 text-[10px] font-bold text-white">
                        -{discountPercentage}%
                    </span>
                )}

                <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <WishListButton
                        productId={product._id}
                        product={product}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:text-rose-500"
                    />
                </div>

                <Link href={`/product/${product.slug}`} className="relative block h-full w-full">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        priority={priority} // Optimization: Prioritize first few images
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        // Add quality for better mobile performance
                        quality={75}
                    />
                </Link>
            </div>

            <div className="flex flex-1 flex-col p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {typeof product.brand === "object" ? product.brand?.name : product.brand || "Baby Deals"}
                </span>

                <Link href={`/product/${product.slug}`} className="mt-1 flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium text-slate-800 hover:text-[#00B5A5] min-h-[40px]">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-2 flex items-center gap-2">
                    <span className={`text-base font-bold ${hasDiscount ? 'text-[#FF3B00]' : 'text-slate-900'}`}>
                        ${hasDiscount ? product.discountPrice : product.price}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">${product.price}</span>
                    )}
                </div>

                <div className="mt-3">
                    <AddToCartButton
                        product={product}
                        className="w-full rounded-full border border-[#00B5A5] bg-transparent py-1.5 text-xs font-semibold text-[#003B65] transition-all hover:bg-[#00B5A5] hover:text-white"
                    />
                </div>
            </div>
        </div>
    );
}
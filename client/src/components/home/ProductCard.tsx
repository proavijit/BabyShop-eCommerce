import { Product } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../common/AddToCartButton";
import WishListButton from "../common/product/WishListButton";

/**
 * ARCHITECTURE: Server Component
 * 
 * RENDERING STRATEGY: SSR/SSG (Server-Side Rendering / Static Site Generation)
 * 
 * JUSTIFICATION:
 * - No client-side state or interactivity in this component
 * - Renders static product information (name, price, image)
 * - Interactive children (AddToCartButton, WishListButton) are Client Components
 * - Maximum SEO benefit (server-rendered HTML)
 * 
 * PERFORMANCE IMPACT:
 * - Zero hydration cost (Server Component)
 * - Minimal JS payload (only child Client Components hydrate)
 * - Excellent SEO (fully server-rendered)
 * - Fast TTFB with ISR caching
 * 
 * ECOMMERCE CONSIDERATIONS:
 * - Critical for SEO (product listings, search results)
 * - Used in: Home page, Shop page, Category pages
 * - Must be fast and lightweight for conversion
 */

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
        ? (typeof product.brand === 'object' ? (product.brand as Record<string, unknown>).name as string : product.brand)
        : "Baby Care";

    return (
        <div className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {hasDiscount && (
                    <div className="absolute left-2 top-2 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                        {discountPercentage}% OFF
                    </div>
                )}

                <div className="absolute right-2 top-2 z-10">
                    <WishListButton productId={product._id} product={product} />
                </div>

                <Link href={`/product/${product.slug}`} className="block h-full w-full">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        quality={85}
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            </div>

            {/* Details Section */}
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    {brandName}
                </span>

                <Link href={`/product/${product.slug}`} className="flex-grow">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 min-h-[40px]">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex flex-col gap-3 mt-auto">
                    {/* Price Area */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-foreground">
                            ${(hasDiscount ? discountPrice : price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                                ${price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Footer: Stock & Add to Cart */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
                            <span className="text-[11px] text-muted-foreground font-medium">
                                {product.stock} left
                            </span>
                        </div>

                        {/* Button fix: container control */}
                        <div className="max-w-[120px]">
                            <AddToCartButton
                                product={product}
                                className="!py-2 !px-3 text-xs"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
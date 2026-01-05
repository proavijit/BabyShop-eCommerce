"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import Container from "@/components/common/Container";
import { Trash2, ShoppingCart, Heart, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/type";
import { useUserStore } from "@/lib/store";
import { toast } from "sonner";

export default function WishlistPage() {
    const { wishlistProducts, isLoading: wishlistLoading, toggleWishlist } = useWishlist();
    const { addToCart, isLoading: cartLoading } = useCart();
    const { isAuthenticated } = useUserStore();

    if (!isAuthenticated) {
        return (
            <Container className="py-20 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="bg-gray-50 p-8 rounded-full">
                        <Heart className="w-16 h-16 text-gray-300" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Please Sign In</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        You need to be logged in to view your wishlist.
                    </p>
                    <Link href="/auth/signin">
                        <Button className="rounded-full px-8 bg-babyshopSky hover:bg-babyshopSky/90 font-bold">
                            Login Now
                        </Button>
                    </Link>
                </div>
            </Container>
        );
    }

    if (wishlistProducts.length === 0 && !wishlistLoading) {
        return (
            <Container className="py-20 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="bg-gray-50 p-8 rounded-full">
                        <Heart className="w-16 h-16 text-gray-300" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Your wishlist is empty</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        You haven&apos;t saved any items yet. Start exploring our cute collections!
                    </p>
                    <Link href="/">
                        <Button className="rounded-full px-8 bg-babyshopSky hover:bg-babyshopSky/90 font-bold">
                            Go Shopping
                        </Button>
                    </Link>
                </div>
            </Container>
        );
    }

    const handleAddToCart = async (product: Product) => {
        try {
            await addToCart(product, 1);
            // Optionally remove from wishlist after adding to cart
            await toggleWishlist(product);
            toast.success(`${product.name} added to cart!`);
        } catch {
            toast.error("Failed to add to cart");
        }
    };

    return (
        <Container className="py-12 md:py-20">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist ({wishlistProducts.length})</h1>
                <Link href="/" className="text-sm font-semibold text-babyshopSky hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shop
                </Link>
            </div>

            {wishlistLoading && wishlistProducts.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-babyshopSky" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlistProducts.map((product) => (
                        <div key={product._id} className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                            {/* Product Image */}
                            <div className="aspect-square relative bg-gray-50 overflow-hidden">
                                <Image
                                    src={product.images?.[0] || product.image || "/placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                                />
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-babyshopRed hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                                </h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl font-extrabold text-babyshopSky">
                                        ${(product.discountPrice || product.price).toFixed(2)}
                                    </span>
                                    {product.discountPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full h-12 rounded-2xl bg-babyshopSky hover:bg-babyshopSky/90 text-white font-bold flex items-center justify-center gap-2 mt-auto"
                                    disabled={cartLoading || product.stock === 0}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}

"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/type";
import { useCart } from "@/hooks/useCart";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * STRATEGY: Client-Side Rendering (CSR)
 * 
 * WHY: This component manages real-time user-specific state (Cart). 
 * It depends on browser-side persistence (Zustand/Cookies) and 
 * handles complex interactivity that cannot be performed on the server.
 * 
 * PERFORMANCE: By keeping this as a leaf Client Component, we allow 
 * parent pages (like Product Detail) to remain as Server Components (SSR/ISR), 
 * maximizing SEO benefit while maintaining a snappy, app-like UI.
 */

interface AddToCartButtonProps {
    product: Product;
    showQuantityControls?: boolean;
    className?: string;
    variant?: "default" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export default function AddToCartButton({
    product,
    showQuantityControls = false,
    className,
    variant = "default",
    size = "default"
}: AddToCartButtonProps) {
    const { addToCart, updateQuantity, getItemQuantity, isLoading: globalLoading, isInCart } = useCart();
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    const quantity = getItemQuantity(product._id);
    const [localLoading, setLocalLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLoading = globalLoading || localLoading;

    // --- Helpers ---
    const displayQuantity = mounted ? quantity : 0;
    const isProductInCart = mounted ? isInCart(product._id) : false;

    // --- Event Handlers ---

    const handleAdd = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Authentication Required", {
                description: "Please login to add items to your cart.",
            });
            router.push("/auth/signin");
            return;
        }

        if (isProductInCart) {
            toast.info(`${product.name} is already in your cart`, {
                description: "You can manage quantities in the cart page.",
            });
            return;
        }

        setLocalLoading(true);
        try {
            await addToCart(product, 1);
            toast.success("Added to Cart!", {
                description: `${product.name} has been added successfuly.`,
            });
        } catch (error) {
            toast.error("Action Failed", {
                description: "Failed to add item to cart. Please try again.",
            });
        } finally {
            setLocalLoading(false);
        }
    }, [isAuthenticated, isInCart, product, addToCart, router]);

    const handleUpdate = useCallback(async (e: React.MouseEvent, newQty: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (newQty < 1) return;
        if (newQty > product.stock) {
            toast.warning("Stock Limit", {
                description: `Only ${product.stock} items available in stock.`,
            });
            return;
        }

        setLocalLoading(true);
        try {
            await updateQuantity(product._id, newQty);
            // The store handles the optimistic update, so we just provide feedback
        } catch (error) {
            toast.error("Update Failed", {
                description: "Failed to update quantity. Please try again.",
            });
        } finally {
            setLocalLoading(false);
        }
    }, [product._id, product.stock, updateQuantity]);

    // --- Render Logic ---

    if (product.stock === 0) {
        return (
            <Button
                disabled
                variant="outline"
                className={cn("rounded-full opacity-60 cursor-not-allowed font-medium", className)}
                size={size}
            >
                Out of Stock
            </Button>
        );
    }

    if (displayQuantity > 0 && showQuantityControls) {
        return (
            <div className={cn(
                "flex items-center gap-3 bg-white rounded-full px-2 py-1 border border-gray-200 shadow-sm transition-all duration-300",
                className
            )}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    onClick={(e) => handleUpdate(e, quantity - 1)}
                    disabled={isLoading}
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <span className="font-bold text-gray-900 min-w-[1.5rem] text-center">
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin mx-auto text-babyshopSky" /> : displayQuantity}
                </span>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-green-50 hover:text-green-500 transition-colors"
                    onClick={(e) => handleUpdate(e, quantity + 1)}
                    disabled={isLoading || quantity >= product.stock}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            className={cn(
                "rounded-full transition-all duration-500 font-semibold gap-2 active:scale-95 group relative overflow-hidden",
                variant === "default" && "bg-babyshopSky hover:bg-babyshopSky/90 text-white shadow-lg shadow-babyshopSky/30",
                displayQuantity > 0 && "bg-green-500 hover:bg-green-600 shadow-green-500/30",
                className
            )}
            variant={variant}
            size={size}
            onClick={handleAdd}
            disabled={isLoading}
        >
            <div className="flex items-center gap-2">
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : displayQuantity > 0 ? (
                    <Check className="h-4 w-4 animate-in zoom-in duration-300" />
                ) : (
                    <ShoppingCart className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                )}

                <span>
                    {displayQuantity > 0 ? `In Cart (${displayQuantity})` : "Add to Cart"}
                </span>
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
    );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { ShoppingCart, Plus, Minus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedCallback } from 'use-debounce';
import { Product } from "@/types/type";
import { useCart } from "@/hooks/useCart";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
    product: Product;
    showQuantityControls?: boolean;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
}

export default function AddToCartButton({
    product,
    showQuantityControls = false,
    className,
    size = "default"
}: AddToCartButtonProps) {
    const { addToCart, updateQuantity, getItemQuantity, isLoading, isInCart } = useCart();
    const { isAuthenticated } = useUserStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const quantity = useMemo(() => getItemQuantity(product._id), [getItemQuantity, product._id]);
    const isProductInCart = useMemo(() => isInCart(product._id), [isInCart, product._id]);

    const debouncedUpdate = useDebouncedCallback((newQty: number) => {
        updateQuantity(product._id, newQty).catch(() => toast.error("Failed to update"));
    }, 300);

    const handleAction = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) return toast.error("Please login first");
        if (isProductInCart && !showQuantityControls) return toast.info("Already in cart");

        try {
            await addToCart(product, 1);
        } catch (err) {
            toast.error("Error adding to cart");
        }
    };

    if (!mounted) return <Button disabled size={size} className={cn("rounded-full", className)}>Loading...</Button>;

    if (product.stock === 0) {
        return <Button disabled variant="outline" size={size} className={cn("rounded-full", className)}>Out of Stock</Button>;
    }

    // Minimal Quantity Controls
    if (quantity > 0 && showQuantityControls) {
        return (
            <div className={cn("flex items-center gap-2 border rounded-full p-1", className)}>
                <Button
                    variant="ghost" size="icon" className="h-7 w-7 rounded-full"
                    onClick={(e) => { e.stopPropagation(); if (quantity > 1) debouncedUpdate(quantity - 1); }}
                    disabled={isLoading}
                >
                    <Minus className="h-3 w-3" />
                </Button>

                <span className="text-sm font-medium w-4 text-center">
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : quantity}
                </span>

                <Button
                    variant="ghost" size="icon" className="h-7 w-7 rounded-full"
                    onClick={(e) => { e.stopPropagation(); if (quantity < product.stock) debouncedUpdate(quantity + 1); }}
                    disabled={isLoading || quantity >= product.stock}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        );
    }

    // Minimal Add Button
    return (
        <Button
            className={cn(
                "rounded-full font-medium transition-all active:scale-95",
                quantity > 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900",
                className
            )}
            size={size}
            onClick={handleAction}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : quantity > 0 ? (
                <Check className="h-4 w-4 mr-2" />
            ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
            )}
            {quantity > 0 ? `In Cart (${quantity})` : "Add to Cart"}
        </Button>
    );
}
"use client";

import { Product } from "@/types/type";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";

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
    const { addToCart, updateQuantity, getItemQuantity, isLoading, isInCart } = useCart();
    const { isAuthenticated } = useUserStore();
    const router = useRouter();
    const quantity = getItemQuantity(product._id);
    const [localLoading, setLocalLoading] = useState(false);

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to add items to cart", {
                description: "Redirecting you to the login page...",
            });
            router.push("/auth/signin");
            return;
        }

        if (isInCart(product._id)) {
            toast.info(`${product.name} is already in your cart`, {
                description: "You can update the quantity in the cart page.",
            });
            return;
        }

        setLocalLoading(true);
        try {
            await addToCart(product, 1);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleUpdate = async (e: React.MouseEvent, newQty: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (newQty < 1) return;
        setLocalLoading(true);
        try {
            await updateQuantity(product._id, newQty);
            if (newQty > quantity) {
                toast.success(`Updated ${product.name} quantity to ${newQty}`);
            } else if (newQty < quantity) {
                toast.success(`Removed one ${product.name} from cart`);
            } else {
                toast.success(`Updated ${product.name} quantity to ${newQty}`);
            }
        } catch (error) {
            toast.error("Failed to update quantity");
        } finally {
            setLocalLoading(false);
        }
    };

    if (quantity > 0 && showQuantityControls) {
        return (
            <div className={cn("flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-100", className)}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white shadow-sm"
                    onClick={(e) => handleUpdate(e, quantity - 1)}
                    disabled={isLoading || localLoading}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-gray-900 min-w-[1rem] text-center">
                    {quantity}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white shadow-sm"
                    onClick={(e) => handleUpdate(e, quantity + 1)}
                    disabled={isLoading || localLoading || quantity >= product.stock}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            className={cn(
                "rounded-full transition-all duration-300 font-semibold gap-2",
                variant === "default" && "bg-babyshopSky hover:bg-babyshopSky/90 shadow-lg shadow-babyshopSky/20",
                className
            )}
            variant={variant}
            size={size}
            onClick={handleAdd}
            disabled={isLoading || localLoading || product.stock === 0}
        >
            {localLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <ShoppingCart className="h-4 w-4" />
            )}
            {product.stock === 0 ? "Out of Stock" : quantity > 0 ? `In Cart (${quantity})` : "Add to Cart"}
        </Button>
    );
}
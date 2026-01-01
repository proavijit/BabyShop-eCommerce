"use client";

import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product } from "@/types/type";
import { useEffect, useState } from "react";

interface WishListButtonProps {
    productId: string;
    product?: Product; // Full product object if available
    className?: string;
}

export default function WishListButton({ productId, product, className = "" }: WishListButtonProps) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { isAuthenticated } = useUserStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isWishlisted = mounted ? isInWishlist(productId) : false;

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to save favorites", {
                description: "Redirecting you to the login page...",
            });
            router.push("/auth/signin");
            return;
        }

        try {
            // If product details aren't provided, we create a minimal product object
            // for the store, but ideally the store should handle productId logic.
            // For now, toggleWishlist expects a Product object.
            const productToToggle = product || { _id: productId } as Product;
            await toggleWishlist(productToToggle);

            if (!isWishlisted) {
                toast.success("Added to wishlist!");
            } else {
                toast.success("Removed from wishlist");
            }
        } catch {
            toast.error("Failed to update wishlist");
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white transition-all duration-300 group relative ${className}`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <AnimatePresence mode="wait">
                {isWishlisted ? (
                    <motion.div
                        key="filled"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <Heart className="w-5 h-5 fill-babyshopRed text-babyshopRed" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="outline"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <Heart className="w-5 h-5 text-gray-400 group-hover:text-babyshopRed transition-colors" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle glow effect when wishlisted */}
            {isWishlisted && (
                <motion.div
                    layoutId="glow"
                    className="absolute inset-0 rounded-full bg-babyshopRed/10 -z-10"
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1.4, opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                />
            )}
        </motion.button>
    );
}
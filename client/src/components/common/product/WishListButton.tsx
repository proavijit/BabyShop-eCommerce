"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WishListButtonProps {
    productId: string;
    className?: string;
}

export default function WishListButton({ productId, className = "" }: WishListButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleToggle = () => {
        setIsWishlisted(!isWishlisted);
        // Simulate API call
        console.log(`Product ${productId} ${!isWishlisted ? 'added to' : 'removed from'} wishlist`);
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
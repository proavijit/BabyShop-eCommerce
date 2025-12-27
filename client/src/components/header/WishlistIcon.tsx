"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistIcon() {
    const { totalItems } = useWishlist();

    return (
        <Link href="/wishlist" className="relative p-2 group">
            <div className="relative">
                <Heart className="w-6 h-6 text-gray-700 group-hover:text-babyshopRed transition-colors duration-300" />

                <AnimatePresence mode="wait">
                    {totalItems > 0 && (
                        <motion.span
                            key="wishlist-badge"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 bg-babyshopSky text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white"
                        >
                            {totalItems}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
            <span className="sr-only">Wishlist ({totalItems} items)</span>
        </Link>
    );
}
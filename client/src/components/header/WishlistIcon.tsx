"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { m, AnimatePresence } from "framer-motion";

import { useEffect, useState } from "react";

export default function WishlistIcon() {
    const { totalItems } = useWishlist();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const count = mounted ? totalItems : 0;

    return (
        <Link href="/wishlist" className="relative p-2 group">
            <div className="relative">
                <Heart className="w-6 h-6 text-gray-700 group-hover:text-babyshopRed transition-colors duration-300" />

                <AnimatePresence mode="wait">
                    {count > 0 && (
                        <m.span
                            key="wishlist-badge"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 bg-babyshopSky text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white"
                        >
                            {count}
                        </m.span>
                    )}
                </AnimatePresence>
            </div>
            <span className="sr-only">Wishlist ({count} items)</span>
        </Link>
    );
}
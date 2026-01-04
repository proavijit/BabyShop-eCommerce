"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function WishlistIcon() {
    const { totalItems } = useWishlist();
    const [mounted, setMounted] = useState(false);

    // Hydration mismatch রোধ করতে mounted চেক
    useEffect(() => {
        setMounted(true);
    }, []);

    // যদি মাউন্ট না হয়, তবে শুধু আইকন দেখাবে (skeleton-এর মতো)
    if (!mounted) {
        return (
            <div className="p-2">
                <Heart className="w-6 h-6 text-gray-400" />
            </div>
        );
    }

    return (
        <Link
            href="/wishlist"
            className="relative p-2 group transition-transform active:scale-90"
            aria-label={`Wishlist with ${totalItems} items`}
        >
            <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500 transition-colors duration-300" />

            <AnimatePresence>
                {totalItems > 0 && (
                    <m.span
                        key="wishlist-badge"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white pointer-events-none"
                    >
                        {totalItems}
                    </m.span>
                )}
            </AnimatePresence>
        </Link>
    );
}
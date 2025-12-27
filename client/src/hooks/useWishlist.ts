"use client";

import { useWishlistStore } from "@/lib/store";

export const useWishlist = () => {
    const {
        wishlist,
        wishlistProducts,
        isLoading,
        toggleWishlist,
        clearWishlist,
        isInWishlist
    } = useWishlistStore();

    return {
        wishlist,
        wishlistProducts,
        isLoading,
        totalItems: wishlist.length,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
    };
};

"use client";

import { useEffect } from "react";
import { useCartStore, useWishlistStore, useOrderStore, useUserStore } from "@/lib/store";

export default function StoreInitializer() {
    const { isAuthenticated } = useUserStore();
    const fetchCart = useCartStore((state) => state.fetchCart);
    const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
    const fetchOrders = useOrderStore((state) => state.fetchOrders);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
            fetchWishlist();
            fetchOrders();
        }
    }, [isAuthenticated, fetchCart, fetchWishlist, fetchOrders]);

    return null;
}

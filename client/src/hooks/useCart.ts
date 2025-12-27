"use client";

import { useCartStore } from "@/lib/store";
import { Product } from "@/types/type";

export const useCart = () => {
    const {
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal
    } = useCartStore();

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const getItemQuantity = (productId: string) => {
        return cartItems.find((item) => item.product._id === productId)?.quantity || 0;
    };

    const isInCart = (productId: string) => {
        return cartItems.some((item) => item.product._id === productId);
    };

    return {
        cartItems,
        isLoading,
        totalItems,
        totalPrice: getCartTotal(),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
    };
};

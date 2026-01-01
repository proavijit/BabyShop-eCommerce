"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "../cart/CartDrawer";
import { useEffect, useState } from "react";

export default function CartIcon() {
    const { totalItems } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const count = mounted ? totalItems : 0;

    return (
        <CartDrawer>
            <button className="relative p-2 group outline-none">
                <div className="relative">
                    <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-babyshopSky transition-colors duration-300" />

                    <AnimatePresence mode="wait">
                        {count > 0 && (
                            <motion.span
                                key="cart-badge"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -top-2 -right-2 bg-babyshopRed text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white"
                            >
                                {count > 99 ? "99+" : count}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                <span className="sr-only">Shopping Cart ({count} items)</span>
            </button>
        </CartDrawer>
    );
}
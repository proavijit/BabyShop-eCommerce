"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import { useOrderStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersIcon() {
    const { orders } = useOrderStore();
    const totalOrders = orders.length;

    return (
        <Link href="/orders" className="relative p-2 group">
            <div className="relative">
                <Package className="w-6 h-6 text-gray-700 group-hover:text-babyshopSky transition-colors duration-300" />

                <AnimatePresence mode="wait">
                    {totalOrders > 0 && (
                        <motion.span
                            key="orders-badge"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white"
                        >
                            {totalOrders}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
            <span className="sr-only">Orders ({totalOrders} orders)</span>
        </Link>
    );
}
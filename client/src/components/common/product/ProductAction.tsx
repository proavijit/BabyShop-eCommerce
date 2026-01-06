"use client";

import { useState } from "react";
import { Product } from "@/types/type";
import { m } from "framer-motion";
import { Plus, Minus, ShoppingCart, Loader2, Eye, HelpCircle, Share2, Truck, RotateCcw } from "lucide-react";
import WishListButton from "./WishListButton";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface ProductActionProps {
    product: Product;
}

export default function ProductAction({ product }: ProductActionProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, isLoading } = useCart();
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            router.push("/auth/signin");
            return;
        }
        try {
            await addToCart(product, quantity);
            toast.success(`${product.name} added to cart!`);
        } catch {
            toast.error("Failed to add to cart");
        }
    };

    return (
        <div className="space-y-6">
            {/* Quantity & Add to Cart Row */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center h-12 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-200"
                    >
                        <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-200"
                    >
                        <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className="flex-1 min-w-[150px] h-12 bg-white border border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                    Add to cart
                </button>

                <div className="w-12 h-12">
                    <WishListButton
                        productId={product._id}
                        product={product}
                        className="w-full h-full border border-gray-200 rounded-lg flex items-center justify-center hover:bg-red-50 group transition-colors"
                    />
                </div>
            </div>

            {/* Social Proof & Buy Now */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span><span className="font-bold text-gray-900">29 people</span> are viewing this right now</span>
                </div>

                <button
                    className="w-full h-14 bg-[#26B3A8] hover:bg-[#1f968c] text-white font-bold text-lg rounded-lg transition-colors shadow-lg shadow-teal-500/10"
                >
                    Buy now
                </button>
            </div>

            {/* Questions & Share */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-babyshopSky transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    Ask a Question
                </button>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-babyshopSky transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share Product
                </div>
            </div>

            {/* Shipping & Returns Layer */}
            <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-900 mt-0.5" />
                    <div>
                        <div className="text-sm font-bold text-gray-900">Estimated Delivery: <span className="text-gray-500 font-medium">08 - 15 Jun, 2025</span></div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <RotateCcw className="w-5 h-5 text-gray-900 mt-0.5" />
                    <div>
                        <div className="text-sm font-bold text-gray-900">Free Shipping & Returns: <span className="text-gray-500 font-medium">On all orders over $200.00</span></div>
                    </div>
                </div>
            </div>

            {/* Payment Icons Placeholder */}
            <div className="bg-[#f8f8f8] p-4 rounded-lg flex flex-col items-center gap-3">
                <div className="flex flex-wrap justify-center gap-3 opacity-70">
                    <div className="w-10 h-6 bg-gray-300 rounded"></div>
                    <div className="w-10 h-6 bg-gray-300 rounded"></div>
                    <div className="w-10 h-6 bg-gray-300 rounded"></div>
                    <div className="w-10 h-6 bg-gray-300 rounded"></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guaranteed safe & secure checkout</span>
            </div>
        </div>
    );
}

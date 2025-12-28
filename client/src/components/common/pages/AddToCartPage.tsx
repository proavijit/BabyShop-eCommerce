"use client";

import { useCart } from "@/hooks/useCart";
import Container from "@/components/common/Container";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AddToCartPage() {
    const {
        cartItems,
        totalPrice,
        totalItems,
        updateQuantity,
        removeFromCart,
        isLoading
    } = useCart();

    if (cartItems.length === 0) {
        return (
            <Container className="py-20 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="bg-gray-50 p-8 rounded-full">
                        <ShoppingBag className="w-16 h-16 text-gray-300" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Looks like you haven't added anything to your cart yet.
                        Explore our collections and find something you love!
                    </p>
                    <Link href="/">
                        <Button className="rounded-full px-8 bg-babyshopSky hover:bg-babyshopSky/90 font-bold">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-12 md:py-20">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items List */}
                <div className="flex-1 space-y-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Your Cart ({totalItems})</h1>
                        <Link href="/" className="text-sm font-semibold text-babyshopSky hover:underline flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="flex gap-6 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                {/* Product Image */}
                                <div className="h-32 w-32 relative bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.product.images?.[0] || item.product.image || "/placeholder.png"}
                                        alt={item.product.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-gray-900 text-lg hover:text-babyshopSky transition-colors">
                                                <Link href={`/product/${item.product.slug}`}>{item.product.name}</Link>
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.product.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4 bg-gray-50 rounded-full px-3 py-1.5">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                className="p-1 hover:bg-white rounded-full transition-colors disabled:opacity-30"
                                                disabled={item.quantity <= 1 || isLoading}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold text-gray-900 min-w-[1.5rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                className="p-1 hover:bg-white rounded-full transition-colors disabled:opacity-30"
                                                disabled={item.quantity >= item.product.stock || isLoading}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-xl font-bold text-gray-900">
                                                ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary Checkout Card */}
                <div className="w-full lg:w-96">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>

                        <div className="space-y-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({totalItems} items)</span>
                                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-teal-600 font-semibold">{totalPrice > 50 ? "FREE" : "$10.00"}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center py-2">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-extrabold text-babyshopSky">
                                    ${(totalPrice > 50 ? totalPrice : totalPrice + 10).toFixed(2)}
                                </span>
                            </div>

                            <Button
                                className="w-full h-14 rounded-2xl bg-babyshopSky hover:bg-babyshopSky/90 text-white font-bold text-lg shadow-lg shadow-babyshopSky/30"
                                disabled={isLoading}
                            >
                                Go to Checkout
                            </Button>

                            <div className="pt-4 flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                    Secure SSL Checkout
                                </div>
                                {/* Credit Card Icons Placeholder */}
                                <div className="flex gap-2 opacity-50 grayscale">
                                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
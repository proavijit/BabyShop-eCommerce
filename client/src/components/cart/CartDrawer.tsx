"use client";

import { Drawer } from "vaul";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartDrawer({ children }: { children: React.ReactNode }) {
    const {
        cartItems,
        totalPrice,
        totalItems,
        updateQuantity,
        removeFromCart,
        isLoading
    } = useCart();

    return (
        <Drawer.Root direction="right">
            <Drawer.Trigger asChild>
                {children}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-full max-w-md fixed bottom-0 right-0 z-[70] outline-none">
                    <div className="p-6 bg-white flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-6 h-6 text-babyshopSky" />
                                <Drawer.Title className="text-2xl font-bold text-gray-900">Your Cart</Drawer.Title>
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {totalItems}
                                </span>
                            </div>
                            <Drawer.Description className="sr-only">
                                View and manage the items in your shopping cart.
                            </Drawer.Description>
                            <Drawer.Close asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </Drawer.Close>
                        </div>

                        <Separator className="mb-6" />

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                                    <div className="bg-gray-50 p-6 rounded-full">
                                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Your cart is feeling a bit light!</p>
                                    <Drawer.Close asChild>
                                        <Button variant="outline" className="rounded-full">Start Shopping</Button>
                                    </Drawer.Close>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={item.product._id} className="flex gap-4 group">
                                            <div className="h-24 w-24 relative bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 transition-colors group-hover:border-babyshopSky/30">
                                                <Image
                                                    src={item.product.images?.[0] || item.product.image || "/placeholder.png"}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 hover:text-babyshopSky transition-colors">
                                                            <Link href={`/product/${item.product.slug}`}>{item.product.name}</Link>
                                                        </h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.product._id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-babyshopSky font-bold mt-1">
                                                        ${(item.product.discountPrice || item.product.price).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-100 scale-90 -ml-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                            className="p-1 hover:bg-white rounded-full transition-colors disabled:opacity-30"
                                                            disabled={item.quantity <= 1 || isLoading}
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="font-bold text-gray-900 min-w-[1rem] text-center text-sm">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                            className="p-1 hover:bg-white rounded-full transition-colors disabled:opacity-30"
                                                            disabled={item.quantity >= item.product.stock || isLoading}
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-sm">
                                                        ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Summary */}
                        {cartItems.length > 0 && (
                            <div className="mt-8 space-y-4 pt-6 bg-white border-t border-gray-100">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-2xl font-extrabold text-gray-900">${totalPrice.toFixed(2)}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                                    Shipping & taxes calculated at checkout
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Drawer.Close asChild>
                                        <Link href="/cart" className="w-full">
                                            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold text-gray-700">
                                                Full View
                                            </Button>
                                        </Link>
                                    </Drawer.Close>
                                    <Button className="h-12 rounded-2xl bg-babyshopSky hover:bg-babyshopSky/90 text-white font-bold group shadow-lg shadow-babyshopSky/20">
                                        Checkout <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

"use client";

import Container from "../common/Container";
import Logo from "./Logo";
import SearchInput from "./SearchInput";
import OrdersIcon from "./OrdersIcon";
import WishlistIcon from "./WishlistIcon";
import UserButton from "./UserButton";
import CartIcon from "./CartIcon";
import TopHeader from "./TopHeader";

export default function Header() {
    return (
        <>
            <TopHeader />
            {/* Main Header with Modern Floating Feel */}
            <header className="sticky top-0 z-50 w-full transition-all duration-300">
                {/* Background Layer with Glassmorphism */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]" />

                <Container className="relative">
                    <div className="flex items-center justify-between gap-6 py-3 lg:py-4">

                        {/* Left: Brand Logo */}
                        <div className="flex-shrink-0 group cursor-pointer">
                            <Logo />
                        </div>

                        {/* Center: Search Bar (Redesigned for better focus) */}
                        <div className="hidden md:flex flex-1 max-w-[600px] mx-auto group">
                            <div className="w-full transition-all duration-300 focus-within:ring-2 focus-within:ring-babyshopSky/20 rounded-2xl">
                                <SearchInput />
                            </div>
                        </div>

                        {/* Right: User Actions */}
                        <div className="flex items-center gap-2 lg:gap-4">

                            {/* Desktop Exclusive: Orders */}
                            <div className="hidden lg:block hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer">
                                <OrdersIcon />
                            </div>

                            {/* Wishlist */}
                            <div className="hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer relative">
                                <WishlistIcon />
                            </div>

                            {/* Cart - More prominent like in your screenshots */}
                            <div className="bg-babyshopSky/5 hover:bg-babyshopSky/10 p-2 rounded-xl transition-all cursor-pointer">
                                <CartIcon />
                            </div>

                            {/* User Profile - Rounded Style */}
                            <div className="pl-2 ml-2 border-l border-slate-100">
                                <div className="p-0.5 rounded-full border-2 border-transparent hover:border-babyshopSky transition-all">
                                    <UserButton />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search - Bottom padding adjusted */}
                    <div className="md:hidden pb-3 px-1">
                        <div className="bg-slate-50 rounded-2xl border border-slate-100 focus-within:bg-white transition-all shadow-sm">
                            <SearchInput />
                        </div>
                    </div>
                </Container>
            </header>
        </>
    );
}
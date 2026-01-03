"use client";

import Container from "../common/Container";
import Logo from "./Logo";
import SearchInput from "./SearchInput";
import OrdersIcon from "./OrdersIcon";
import WishlistIcon from "./WishlistIcon";
import UserButton from "./UserButton";
import CartIcon from "./CartIcon";
import TopHeader from "./TopHeader";



/**
 * ARCHITECTURE: Client Component
 * 
 * JUSTIFICATION:
 * - Contains interactive child components (SearchInput, CartIcon, etc.)
 * - Manages sticky header behavior
 * - Requires client-side state for user session
 * 
 * NOTE: This component MUST be a Client Component because it contains
 * interactive elements and session-dependent UI (UserButton, CartIcon).
 */

export default function Header() {
    return (
        <>
            <TopHeader />
            {/* Main Header with Modern Floating Feel */}
            <header
                className="sticky top-0 z-50 w-full transition-all duration-300"
                suppressHydrationWarning={true}
            >
                {/* Background Layer with Glassmorphism */}
                <div
                    className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]"
                    suppressHydrationWarning={true}
                />

                <Container className="relative" suppressHydrationWarning={true}>
                    <div className="flex items-center justify-between gap-6 py-3 lg:py-4" suppressHydrationWarning={true}>

                        {/* Left: Brand Logo */}
                        <div className="flex-shrink-0 group cursor-pointer" suppressHydrationWarning={true}>
                            <Logo />
                        </div>

                        {/* Center: Search Bar (Redesigned for better focus) */}
                        <div className="hidden md:flex flex-1 max-w-[600px] mx-auto group" suppressHydrationWarning={true}>
                            <div className="w-full transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 rounded-2xl" suppressHydrationWarning={true}>
                                <SearchInput />
                            </div>
                        </div>

                        {/* Right: User Actions */}
                        <div className="flex items-center gap-2 lg:gap-4" suppressHydrationWarning={true}>

                            {/* Desktop Exclusive: Orders */}
                            <div className="hidden lg:block hover:bg-muted p-2 rounded-xl transition-colors cursor-pointer" suppressHydrationWarning={true}>
                                <OrdersIcon />
                            </div>

                            {/* Wishlist */}
                            <div className="hover:bg-muted p-2 rounded-xl transition-colors cursor-pointer relative" suppressHydrationWarning={true}>
                                <WishlistIcon />
                            </div>

                            {/* Cart - More prominent like in your screenshots */}
                            <div className="bg-primary/5 hover:bg-primary/10 p-2 rounded-xl transition-all cursor-pointer" suppressHydrationWarning={true}>
                                <CartIcon />
                            </div>

                            {/* User Profile - Rounded Style */}
                            <div className="pl-2 ml-2 border-l border-border" suppressHydrationWarning={true}>
                                <div className="p-0.5 rounded-full border-2 border-transparent hover:border-primary transition-all" suppressHydrationWarning={true}>
                                    <UserButton />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search - Bottom padding adjusted */}
                    <div className="md:hidden pb-3 px-1" suppressHydrationWarning={true}>
                        <div className="bg-muted rounded-2xl border border-border focus-within:bg-background transition-all shadow-sm" suppressHydrationWarning={true}>
                            <SearchInput />
                        </div>
                    </div>
                </Container>
            </header>
        </>
    );
}
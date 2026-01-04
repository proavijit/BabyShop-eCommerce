"use client";

import dynamic from "next/dynamic";
import Container from "../common/Container";
import Logo from "./Logo";
import TopHeader from "./TopHeader";

// Skeleton Components 
const IconSkeleton = () => <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />;
const UserSkeleton = () => (
    <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
        <div className="hidden sm:flex flex-col gap-1">
            <div className="w-10 h-2 bg-gray-100 rounded animate-pulse" />
            <div className="w-14 h-3 bg-gray-100 rounded animate-pulse" />
        </div>
    </div>
);

// Dynamic Imports with Loading Skeletons
const UserButton = dynamic(() => import("./UserButton"), {
    ssr: false,
    loading: () => <UserSkeleton />
});

const CartIcon = dynamic(() => import("./CartIcon"), {
    ssr: false,
    loading: () => <IconSkeleton />
});

const SearchInput = dynamic(() => import("./SearchInput"), {
    ssr: false,
    loading: () => (
        <div className="relative w-full h-10 bg-white border border-gray-100 rounded-md flex items-center px-4">
            <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
            <div className="ml-auto h-5 w-5 bg-gray-100 animate-pulse rounded-full" />
        </div>
    )
});

const OrdersIcon = dynamic(() => import("./OrdersIcon"), {
    ssr: false,
    loading: () => <IconSkeleton />
});

const WishlistIcon = dynamic(() => import("./WishlistIcon"), {
    ssr: false,
    loading: () => <IconSkeleton />
});

export default function Header() {
    return (
        <>
            <TopHeader />
            <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
                <Container>
                    <div className="flex items-center justify-between gap-4 h-16 md:h-20">

                        {/* 1. Static Logo */}
                        <div className="flex-shrink-0">
                            <Logo />
                        </div>

                        {/* 2. Search Bar - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-[650px] mx-6">
                            <div className="w-full border border-gray-300 rounded-lg bg-white overflow-hidden min-h-[42px]">
                                <SearchInput />
                            </div>
                        </div>

                        {/* 3. Icons & Actions */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            <div className="hidden lg:flex items-center gap-5 border-r border-gray-200 pr-5">
                                <OrdersIcon />
                                <WishlistIcon />
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <UserButton />
                                <CartIcon />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden pb-4 px-1">
                        <div className="border border-gray-300 rounded-lg bg-white min-h-[40px]">
                            <SearchInput />
                        </div>
                    </div>
                </Container>
            </header>
        </>
    );
}
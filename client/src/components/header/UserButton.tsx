"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    User as UserIcon,
    LogOut,
    ShoppingBag,
    Heart,
    UserCircle,
    ChevronDown
} from "lucide-react";
import { useUserStore } from "@/lib/store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function UserButton() {
    const { authUser, isAuthenticated, logout } = useUserStore();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!mounted || !isAuthenticated || !authUser) {
        return (
            <Link href="/auth/signin">
                <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-full px-4 border border-transparent hover:border-primary/20 transition-all duration-300">
                    <UserCircle className="w-5 h-5 text-primary/70" />
                    <span className="hidden sm:inline font-semibold">Sign In</span>
                </Button>
            </Link>
        );
    }

    const initials = authUser.name
        ? authUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 outline-none group cursor-pointer">
                    <Avatar className="w-9 h-9 border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-300 ring-offset-2 ring-primary/0 group-hover:ring-2 group-hover:ring-primary/20">
                        <AvatarImage src={authUser.avatar} alt={authUser.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start">
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider leading-none">Account</span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-gray-800 truncate max-w-[100px]">
                                {authUser.name.split(" ")[0]}
                            </span>
                            <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-64 p-2 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-primary/5 animate-in fade-in zoom-in-95 duration-200"
                align="end"
                sideOffset={12}
            >
                <DropdownMenuLabel className="px-3 py-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-primary/5">
                            <AvatarImage src={authUser.avatar} alt={authUser.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5">
                            <p className="text-sm font-bold leading-none text-gray-900">{authUser.name}</p>
                            <p className="text-[11px] leading-none text-gray-400 font-medium">{authUser.email}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2 bg-gray-100" />

                <div className="p-1 space-y-0.5">
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-primary/5 focus:text-primary transition-all duration-200">
                        <Link href="/profile" className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-gray-700 group-focus:text-primary">Profile Details</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-primary/5 focus:text-primary transition-all duration-200">
                        <Link href="/orders" className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-gray-700 group-focus:text-primary">Track Orders</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-primary/5 focus:text-primary transition-all duration-200">
                        <Link href="/wishlist" className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                                <Heart className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-gray-700 group-focus:text-primary">My Wishlist</span>
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="mx-2 bg-gray-100" />

                <div className="p-1">
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-red-50 focus:text-red-600 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-focus:bg-red-100">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-700 group-focus:text-red-600">Secure Logout</span>
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
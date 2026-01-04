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
            <Link href="/auth/signin" className="flex items-center gap-2.5 group transition-all">
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 group-hover:border-gray-200 transition-all">
                    <UserCircle className="w-5 h-5 text-gray-500 group-hover:text-black" />
                </div>
                <div className="hidden sm:flex flex-col -space-y-0.5 leading-tight">
                    <span className="text-[10px] text-gray-400 font-medium tracking-wide">Account</span>
                    <span className="text-[13px] font-bold text-gray-800">Login / Join</span>
                </div>
            </Link>
        );
    }

    const initials = authUser.name
        ? authUser.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "U";

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 outline-none group cursor-pointer py-1">
                    <Avatar className="w-9 h-9 border border-gray-200 group-hover:border-gray-400 transition-all">
                        <AvatarImage src={authUser.avatar} alt={authUser.name} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-[11px] font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start -space-y-0.5 leading-tight">
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">My Account</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[13px] font-bold text-gray-800 truncate max-w-[90px]">
                                {authUser.name.split(" ")[0]}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-data-[state=open]:rotate-180 transition-transform duration-200" />
                        </div>
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-60 p-1.5 rounded-xl shadow-xl border-gray-100 animate-in slide-in-from-top-2 duration-200"
                align="end"
                sideOffset={15} // হেডারের বর্ডার থেকে একটু নিচে গ্যাপ রাখার জন্য
                alignOffset={-5}
            >
                <DropdownMenuLabel className="px-3 py-3 font-normal">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-gray-100">
                            <AvatarImage src={authUser.avatar} />
                            <AvatarFallback className="bg-gray-50 text-gray-500 text-xs font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden leading-tight">
                            <p className="text-sm font-bold text-gray-900 truncate">{authUser.name}</p>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">{authUser.email}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-50 mx-1" />

                <div className="py-1.5">
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg focus:bg-gray-50 py-2.5 px-3">
                        <Link href="/profile" className="flex items-center gap-3 w-full">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Profile Details</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg focus:bg-gray-50 py-2.5 px-3">
                        <Link href="/orders" className="flex items-center gap-3 w-full">
                            <ShoppingBag className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Track Orders</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg focus:bg-gray-50 py-2.5 px-3">
                        <Link href="/wishlist" className="flex items-center gap-3 w-full">
                            <Heart className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">My Wishlist</span>
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-gray-50 mx-1" />

                <div className="p-1">
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer rounded-lg focus:bg-red-50 focus:text-red-600 py-2.5 px-3 transition-colors"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-bold">Sign Out</span>
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
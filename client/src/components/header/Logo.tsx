"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-2 group"
            suppressHydrationWarning={true}
        >
            <Image
                src="/logo.png"
                alt="logo"
                width={100}
                height={100}
                priority
                suppressHydrationWarning={true}
                className="transition-transform duration-300 group-hover:scale-105"
            />
        </Link>
    );
}
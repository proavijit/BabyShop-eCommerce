"use client";

import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFoundPageClient() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6 animate-bounce">
                <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                404
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                Page Not Found
            </h2>

            <p className="text-gray-600 max-w-md mb-8 text-lg">
                Oops! The page you are looking for doesn&apos;t exist or has been moved.
                Let&apos;s get you back to shopping.
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#9c059c] hover:bg-[#800480] text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
            >
                <Home className="w-5 h-5" />
                Back to Home
            </Link>
        </div>
    );
}
"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface WishListButtonProps {
    productId: string;
    className?: string;
}

export default function WishListButton({ productId, className = "" }: WishListButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleToggle = () => {
        setIsWishlisted(!isWishlisted);
        // TODO: Add API call to save wishlist state
        console.log(`Product ${productId} ${!isWishlisted ? 'added to' : 'removed from'} wishlist`);
    };

    return (
        <button
            onClick={handleToggle}
            className={`w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-babyshopSky hover:scale-110 transition-all duration-300 group ${className}`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={`w-5 h-5 transition-all duration-300 ${isWishlisted
                        ? 'fill-babyshopRed text-babyshopRed'
                        : 'text-gray-400 group-hover:text-white'
                    }`}
            />
        </button>
    );
}
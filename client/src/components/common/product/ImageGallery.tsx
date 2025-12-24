"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, TrendingUp, Tag } from "lucide-react";

interface ImageGalleryProps {
    name: string;
    images: string[];
    isFeatured?: boolean;
    isTrending?: boolean;
    isBestDeal?: boolean;
}

export default function ImageGallery({
    name,
    images,
    isFeatured,
    isTrending,
    isBestDeal
}: ImageGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border-2 border-gray-200 group">
                <Image
                    src={images[activeImage]}
                    alt={name}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                    priority
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isFeatured && (
                        <div className="px-3 py-1.5 bg-babyshopPurple text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-white" />
                            Featured
                        </div>
                    )}
                    {isTrending && (
                        <div className="px-3 py-1.5 bg-babyshopSky text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                        </div>
                    )}
                    {isBestDeal && (
                        <div className="px-3 py-1.5 bg-babyshopRed text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                            <Tag className="w-3 h-3" />
                            Best Deal
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`relative aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all ${activeImage === index
                                    ? 'border-babyshopSky ring-2 ring-babyshopSky/20'
                                    : 'border-gray-200 hover:border-babyshopSky'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${name} - Thumbnail ${index + 1}`}
                                fill
                                className="object-contain p-2"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

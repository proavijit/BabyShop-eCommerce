// components/sections/banner/banner-slider.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Banner } from "@/types/type";

interface BannerSliderProps {
    mainBanners: Banner[];
    sideBanners: Banner[];
}

export default function BannerSlider({ mainBanners, sideBanners }: BannerSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        if (mainBanners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % mainBanners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [mainBanners.length]);

    if (mainBanners.length === 0 && sideBanners.length === 0) {
        return (
            <div className="w-full h-[300px] lg:h-[400px] bg-white rounded-md flex flex-col items-center justify-center text-gray-400 border border-gray-100 mb-6">
                <Sparkles className="w-8 h-8 text-gray-200 mb-3" />
                <p className="text-sm font-semibold">No offers available</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-3 h-auto lg:h-[380px] mb-6">
            {/* MAIN BANNER SLIDER */}
            <div className={`relative w-full ${sideBanners.length > 0 ? 'lg:w-[75%]' : 'lg:w-full'} h-[300px] lg:h-full overflow-hidden rounded-md border border-gray-100`}>
                <div
                    className="w-full h-full flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {mainBanners.map((banner, index) => (
                        <div key={banner._id} className="w-full h-full shrink-0 relative">
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 75vw"
                                className="object-cover"
                            />
                            {/* Professional Centered Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/5 px-4">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-1">
                                    Best Deals Today
                                </span>
                                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-6 max-w-lg">
                                    {banner.title}
                                </h2>
                                <button className="bg-white text-gray-900 px-8 py-2.5 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SIDE BANNER */}
            {sideBanners.length > 0 && (
                <div className="w-full lg:w-[25%] min-h-[220px] lg:h-full relative rounded-md overflow-hidden border border-gray-100 group cursor-pointer">
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={sideBanners[0].image}
                            alt="Promo"
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    {/* Content Layer floating over the covered image */}
                    <div className="relative z-10 h-full w-full flex flex-col items-center justify-start pt-8 text-center bg-gradient-to-b from-white/30 via-transparent to-transparent">
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">
                            Hot this week
                        </p>
                        <h3 className="text-xl font-extrabold text-white leading-tight mb-4">
                            Baby Deals
                        </h3>
                        <button className="bg-white text-gray-900 px-6 py-2 rounded-full text-[11px] font-bold shadow-md active:scale-95 transition-all">
                            Shop Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
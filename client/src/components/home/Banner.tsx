"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Banner } from "@/types/type";
import { API_ENDPOINTS, fetchData } from "@/lib/api";

export default function BannerComponent() {
    const [loading, setLoading] = useState(true);
    const [mainBanners, setMainBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sideBanners, setSideBanners] = useState<Banner[]>([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetchData<Banner[] | { banners: Banner[] }>(API_ENDPOINTS.BANNERS);
                let allBanners: Banner[] = [];
                if (Array.isArray(response)) { allBanners = response; }
                else if (response && 'banners' in response) { allBanners = response.banners; }

                const sliders = allBanners.filter(b => b.bannerType === 'slider');
                const statics = allBanners.filter(b => b.bannerType === 'static' || b.bannerType === 'popup');

                setMainBanners(sliders.length > 0 ? sliders : allBanners);
                setSideBanners(statics);
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Auto-slide logic
    useEffect(() => {
        if (mainBanners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % mainBanners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [mainBanners.length]);

    // 1. PERFECT MINIMALIST LOADING STATE
    if (loading) {
        return (
            <div className="w-full flex flex-col lg:flex-row gap-3 h-auto lg:h-[400px] mb-6">
                <div className="w-full lg:w-[75%] h-[300px] lg:h-full bg-gray-100 animate-pulse rounded-md border border-gray-50 flex flex-col items-center justify-center space-y-4">
                    <div className="w-48 h-3 bg-gray-200 rounded-full" />
                    <div className="w-64 h-8 bg-gray-200 rounded-md" />
                </div>
                <div className="hidden lg:flex lg:w-[25%] h-full bg-gray-50 animate-pulse rounded-md border border-gray-50 flex-col items-center pt-10 space-y-4">
                    <div className="w-20 h-3 bg-gray-100 rounded-full" />
                    <div className="w-32 h-6 bg-gray-100 rounded-md" />
                </div>
            </div>
        );
    }

    // 2. EMPTY STATE
    if (mainBanners.length === 0 && sideBanners.length === 0) {
        return (
            <div className="w-full h-[300px] lg:h-[400px] bg-white rounded-md flex flex-col items-center justify-center text-gray-400 border border-gray-100 mb-6">
                <Sparkles className="w-8 h-8 text-gray-200 mb-3" />
                <p className="text-sm font-semibold">No offers available</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-3 h-auto lg:h-[380px] mb-6" suppressHydrationWarning>

            {/* MAIN BANNER SLIDER - Full Cover & Thin Corners */}
            <div className={`relative w-full ${sideBanners.length > 0 ? 'lg:w-[75%]' : 'lg:w-full'} h-[280px] lg:h-full overflow-hidden rounded-md border border-gray-100`}>
                <div
                    className="w-full h-full flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {mainBanners.map((banner) => (
                        <div key={banner._id} className="w-full h-full shrink-0 relative">
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                priority
                                className="object-cover"
                            />
                            {/* Professional Centered Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/5 px-4">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-1">
                                    Best Deals Today
                                </span>
                                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight mb-6 max-w-lg">
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

            {/* SIDE BANNER - Tight Spacing & Professionally Aligned */}
            {sideBanners.length > 0 && (
                <div className="w-full lg:w-[25%] h-[220px] lg:h-full relative rounded-md overflow-hidden border border-gray-100 group cursor-pointer">
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={sideBanners[0].image}
                            alt="Promo"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    {/* Content Layer floating over the covered image */}
                    <div className="relative z-10 h-full w-full flex flex-col items-center justify-start pt-8 text-center bg-gradient-to-b from-white/30 via-transparent to-transparent">
                        <p className="text-[#7C5CFC] text-[10px] font-bold uppercase tracking-widest mb-1">
                            Hot this week
                        </p>
                        <h3 className="text-xl font-extrabold text-gray-800 leading-tight mb-4">
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
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Banner } from "@/types/type";
import { API_ENDPOINTS, fetchData } from "@/lib/api";

export default function BannerComponent() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    // Main Slider State
    const [mainBanners, setMainBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Side Banner State
    const [sideBanners, setSideBanners] = useState<Banner[]>([]);
    const [sideCurrentIndex, setSideCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // The server returns Banner[] directly, not { banners: Banner[] }
                const response = await fetchData<Banner[] | { banners: Banner[] }>(API_ENDPOINTS.BANNERS);
                let allBanners: Banner[] = [];

                if (Array.isArray(response)) {
                    allBanners = response;
                } else if (response && 'banners' in response && Array.isArray(response.banners)) {
                    allBanners = response.banners;
                }

                setBanners(allBanners);

                // Filter banners
                const sliders = allBanners.filter(b => b.bannerType === 'slider');
                const statics = allBanners.filter(b => b.bannerType === 'static' || b.bannerType === 'popup');

                if (sliders.length > 0) {
                    setMainBanners(sliders);
                } else if (allBanners.length > 0 && statics.length === 0) {
                    // Fallback: Use all if only mixed types without explicit static/slider differentiation
                    setMainBanners(allBanners);
                }

                if (statics.length > 0) {
                    setSideBanners(statics);
                } else {
                    // Fallback logic if needed, or leave empty
                }

            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // Main Slider Interval (5s)
    useEffect(() => {
        if (mainBanners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % mainBanners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [mainBanners.length]);

    // Side Slider Interval (10s)
    useEffect(() => {
        if (sideBanners.length <= 1) return;

        const interval = setInterval(() => {
            setSideCurrentIndex((prevIndex) => (prevIndex + 1) % sideBanners.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [sideBanners.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mainBanners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? mainBanners.length - 1 : prevIndex - 1
        );
    };

    if (loading) {
        return (
            <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl flex items-center justify-center shadow-lg">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-babyshopSky animate-spin" />
                    <p className="text-gray-500 font-medium">Loading amazing offers...</p>
                </div>
            </div>
        );
    }

    if (mainBanners.length === 0 && sideBanners.length === 0) {
        return (
            <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 shadow-lg border border-gray-200">
                <Sparkles className="w-12 h-12 mb-3 text-gray-300" />
                <p className="font-medium">No offers available at the moment</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-5 h-auto lg:h-[420px] mb-6">
            {/* Main Slider - 75% width on desktop (if side banners exist) */}
            {mainBanners.length > 0 ? (
                <div className={`relative w-full ${sideBanners.length > 0 ? 'lg:w-[75%]' : 'lg:w-full'} h-[320px] lg:h-full group overflow-hidden rounded-2xl shadow-xl border border-gray-200`}>
                    {/* Slides */}
                    <div
                        className="w-full h-full flex transition-transform duration-700 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {mainBanners.map((banner) => (
                            <div
                                key={banner._id}
                                className="w-full h-full shrink-0 relative bg-gradient-to-br from-gray-100 to-gray-200"
                            >
                                <img
                                    src={banner.image}
                                    alt={banner.name || banner.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                                    <div className="px-8 md:px-16 max-w-[650px] space-y-5 animate-in slide-in-from-left-6 duration-700">
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-babyshopSky to-teal-400 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {banner.bannerType || 'Special Offer'}
                                        </span>
                                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                                            {banner.title}
                                        </h2>
                                        <p className="text-gray-100 text-lg md:text-xl font-semibold">
                                            Starting at <span className="text-yellow-300 font-bold text-2xl md:text-3xl">${banner.startFrom}</span>
                                        </p>
                                        <div className="pt-2">
                                            <button className="bg-gradient-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white px-8 py-3.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 group/btn">
                                                Shop Now
                                                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    {mainBanners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-babyshopSky text-white backdrop-blur-md p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0 border border-white/30 hover:scale-110"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-babyshopSky text-white backdrop-blur-md p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 border border-white/30 hover:scale-110"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                                {mainBanners.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? "bg-babyshopSky w-10 shadow-lg"
                                            : "bg-white/60 w-2 hover:bg-white hover:w-4"
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : null}

            {/* Static/Side Banner Slider - 25% width on desktop */}
            {sideBanners.length > 0 ? (
                <div className="w-full lg:w-[25%] h-[220px] lg:h-full relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                    <div
                        className="w-full h-full flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${sideCurrentIndex * 100}%)` }}
                    >
                        {sideBanners.map((banner) => (
                            <div
                                key={banner._id}
                                className="w-full h-full shrink-0 relative"
                            >
                                <img
                                    src={banner.image}
                                    alt={banner.name || banner.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80 flex flex-col justify-end p-6">
                                    <span className="inline-flex items-center gap-1.5 text-yellow-300 font-bold text-xs uppercase tracking-wider mb-2">
                                        <Sparkles className="w-3 h-3" />
                                        {banner.bannerType || 'Exclusive'}
                                    </span>
                                    <h3 className="text-white text-xl font-bold mb-2 leading-tight">{banner.title}</h3>
                                    <p className="text-gray-200 text-sm mb-3">
                                        Starting from <span className="font-bold text-white text-base">${banner.startFrom}</span>
                                    </p>
                                    <span className="text-white text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Explore <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Fallback static banner if no API data found for side slot
                <div className="w-full lg:w-[25%] h-[220px] lg:h-full relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Sparkles className="w-10 h-10 mb-2 text-gray-300" />
                        <span className="text-sm font-medium">Side Banner</span>
                    </div>
                </div>
            )}
        </div>
    );
}
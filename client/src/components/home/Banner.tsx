"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
            <div className="w-full h-[300px] md:h-[400px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Loading offers...</p>
            </div>
        );
    }

    if (mainBanners.length === 0 && sideBanners.length === 0) {
        return (
            <div className="w-full h-[300px] md:h-[400px] bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <p>No offers available at the moment</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-4 h-auto lg:h-[400px]">
            {/* Main Slider - 75% width on desktop (if side banners exist) */}
            {mainBanners.length > 0 ? (
                <div className={`relative w-full ${sideBanners.length > 0 ? 'lg:w-[75%]' : 'lg:w-full'} h-[300px] lg:h-full group overflow-hidden rounded-xl shadow-sm border border-gray-100`}>
                    {/* Slides */}
                    <div
                        className="w-full h-full flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {mainBanners.map((banner) => (
                            <div
                                key={banner._id}
                                className="w-full h-full shrink-0 relative bg-gray-100"
                            >
                                <img
                                    src={banner.image}
                                    alt={banner.name || banner.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                    <div className="px-8 md:px-16 max-w-[600px] space-y-4 animate-in slide-in-from-left-6 duration-700">
                                        <span className="inline-block px-3 py-1 bg-[#9c059c] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                                            {banner.bannerType || 'Special Offer'}
                                        </span>
                                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                            {banner.title}
                                        </h2>
                                        <p className="text-gray-200 text-lg md:text-xl font-medium">
                                            Starting at <span className="text-yellow-400 font-bold text-2xl">${banner.startFrom}</span>
                                        </p>
                                        <div className="pt-4">
                                            <button className="bg-white text-gray-900 hover:bg-[#9c059c] hover:text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
                                                Shop Now
                                                <ChevronRight className="w-4 h-4" />
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
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0 border border-white/20"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 border border-white/20"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {mainBanners.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? "bg-[#9c059c] w-8"
                                            : "bg-white/50 w-2 hover:bg-white"
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
                <div className="w-full lg:w-[25%] h-[200px] lg:h-full relative rounded-xl overflow-hidden shadow-sm group cursor-pointer border border-gray-100">
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
                                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70 flex flex-col justify-end p-6">
                                    <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">{banner.bannerType || 'Exclusive'}</span>
                                    <h3 className="text-white text-xl font-bold mb-2">{banner.title}</h3>
                                    <p className="text-gray-300 text-sm mb-3">
                                        Starting from <span className="font-bold text-white">${banner.startFrom}</span>
                                    </p>
                                    <span className="text-white text-sm font-semibold flex items-center gap-1 group-hover:underline">
                                        Explore <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Fallback static banner if no API data found for side slot
                <div className="w-full lg:w-[25%] h-[200px] lg:h-full relative rounded-xl overflow-hidden shadow-sm group cursor-pointer bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        <span>Side Banner</span>
                    </div>
                </div>
            )}
        </div>
    );
}
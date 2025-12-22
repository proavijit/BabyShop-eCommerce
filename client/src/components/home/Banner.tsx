"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "../../../types/type";
import { API_ENDPOINTS, fetchData } from "@/lib/api";

export default function BannerComponent() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Determine URL based on environment (fetching client-side here)
                // Note: fetchData uses config which handles baseUrl.
                // However, we are in a client component ("use client").
                // The server returns Banner[] directly, not { banners: Banner[] }
                const response = await fetchData<Banner[] | { banners: Banner[] }>(API_ENDPOINTS.BANNERS);

                if (Array.isArray(response)) {
                    setBanners(response);
                } else if (response && 'banners' in response && Array.isArray(response.banners)) {
                    setBanners(response.banners);
                }
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        );
    };

    if (loading) {
        return (
            <div className="w-full h-[300px] md:h-[400px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Loading offers...</p>
            </div>
        );
    }

    if (banners.length === 0) {
        // Fallback or hide if no banners
        return (
            <div className="w-full h-[300px] md:h-[400px] bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <p>No offers available at the moment</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-4 h-auto lg:h-[400px]">
            {/* Main Slider - 75% width on desktop */}
            <div className="relative w-full lg:w-[75%] h-[300px] lg:h-full group overflow-hidden rounded-xl shadow-sm border border-gray-100">
                {/* Slides */}
                <div
                    className="w-full h-full flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {banners.map((banner) => (
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
                {banners.length > 1 && (
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
                            {banners.map((_, index) => (
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

            {/* Static Side Banner - 25% width on desktop */}
            <div className="w-full lg:w-[25%] h-[200px] lg:h-full relative rounded-xl overflow-hidden shadow-sm group cursor-pointer">
                <img
                    src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop"
                    alt="New Arrivals"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70 flex flex-col justify-end p-6">
                    <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">New Season</span>
                    <h3 className="text-white text-xl font-bold mb-2">Summer Collection</h3>
                    <p className="text-gray-300 text-sm mb-3">Get up to 30% off on new arrivals</p>
                    <span className="text-white text-sm font-semibold flex items-center gap-1 group-hover:underline">
                        Explore <ChevronRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </div>
    );
}
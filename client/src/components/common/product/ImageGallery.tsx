"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Pagination, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

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
}: ImageGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Main Image Slider - Clean, Large, Minimal Border */}
            <div className="relative group bg-white">
                <Swiper
                    loop={true}
                    spaceBetween={0}
                    effect={'fade'}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs, EffectFade]}
                    className="w-full aspect-[4/5] md:aspect-square bg-[#fafafa]/50 rounded-xl overflow-hidden"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center p-8 bg-white">
                            <div className="relative w-full h-full max-w-xl mx-auto">
                                <Image
                                    src={img}
                                    alt={`${name} - ${index + 1}`}
                                    fill
                                    className="object-contain hover:scale-105 transition-transform duration-700 ease-out"
                                    priority={index === 0}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Minimal Custom Navigation */}
                <button className="swiper-button-prev-custom absolute top-1/2 left-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-sm cursor-pointer text-gray-800">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button className="swiper-button-next-custom absolute top-1/2 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-sm cursor-pointer text-gray-800">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
            </div>

            {/* Thumbnail Slider - Minimalist Strip */}
            {images.length > 1 && (
                <div className="">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={false}
                        spaceBetween={10}
                        slidesPerView={5}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="thumbs-swiper"
                        breakpoints={{
                            640: { slidesPerView: 6 },
                            1024: { slidesPerView: 6 },
                        }}
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index} className="cursor-pointer group">
                                <div className="aspect-square relative rounded-lg overflow-hidden border border-transparent transition-all group-[.swiper-slide-thumb-active]:border-gray-900 group-[.swiper-slide-thumb-active]:ring-1 group-[.swiper-slide-thumb-active]:ring-gray-900 opacity-60 group-[.swiper-slide-thumb-active]:opacity-100 hover:opacity-100">
                                    <Image
                                        src={img}
                                        alt={`${name} thumb - ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
}

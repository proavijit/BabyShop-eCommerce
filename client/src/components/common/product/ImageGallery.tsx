"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { m, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

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
}

export default function ImageGallery({
    name,
    images,
}: ImageGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setActiveImageIndex(index);
        setIsLightboxOpen(true);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Main Image Slider */}
            <div className="relative group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <Swiper
                    loop={true}
                    spaceBetween={0}
                    effect={'fade'}
                    navigation={{
                        prevEl: ".swiper-button-prev-custom",
                        nextEl: ".swiper-button-next-custom",
                    }}
                    onSlideChange={(swiper) => setActiveImageIndex(swiper.realIndex)}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs, EffectFade]}
                    className="w-full aspect-square md:aspect-square bg-white"
                    aria-label="Product image gallery"
                >
                    {images.map((img: string, index: number) => (
                        <SwiperSlide key={index} className="flex items-center justify-center p-0 sm:p-0 hover:cursor-zoom-in" onClick={() => openLightbox(index)}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={img}
                                    alt={`${name} - Image ${index + 1} of ${images.length}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 58vw, 700px"
                                    quality={100}
                                />
                                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="w-5 h-5 text-gray-900" />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Buttons */}
                <button className="swiper-button-prev-custom absolute top-1/2 left-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 shadow-sm text-gray-900">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="swiper-button-next-custom absolute top-1/2 right-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 shadow-sm text-gray-900">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div role="region" aria-label="Product thumbnail images">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={false}
                        spaceBetween={10}
                        slidesPerView={5}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="thumbs-swiper"
                    >
                        {images.map((img: string, index: number) => (
                            <SwiperSlide key={index} className="cursor-pointer">
                                <div className="aspect-square relative rounded-xl overflow-hidden border-2 border-transparent transition-all group-[.swiper-slide-thumb-active]:border-gray-900 hover:border-gray-300">
                                    <Image
                                        src={img}
                                        alt={`${name} thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="100px"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* Lightbox Backdrop/Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
                    >
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <m.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                                <Image
                                    src={images[activeImageIndex]}
                                    alt={name}
                                    fill
                                    className="object-contain"
                                    quality={100}
                                />
                            </div>
                        </m.div>

                        {/* Lightbox Navigation */}
                        {images.length > 1 && (
                            <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-6 pointer-events-none">
                                <button
                                    onClick={() => setActiveImageIndex((prev: number) => (prev === 0 ? images.length - 1 : prev - 1))}
                                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white pointer-events-auto"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={() => setActiveImageIndex((prev: number) => (prev === images.length - 1 ? 0 : prev + 1))}
                                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white pointer-events-auto"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </div>
                        )}

                        {/* Lightbox Counter */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 font-medium tracking-widest text-sm uppercase">
                            {activeImageIndex + 1} / {images.length}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

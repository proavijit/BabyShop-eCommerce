"use client"; // ক্লায়েন্ট সাইড রেন্ডারিং নিশ্চিত করতে

import { Plane, Car, Baby, ShoppingBag, Shield, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BabyTravelSection() {
    const travelCategories = [
        {
            id: "stroller-01",
            name: "Strollers & Prams",
            image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=500&auto=format&fit=crop",
            description: "Comfortable rides",
            brand: "CUDDLE & CO",
            link: "/category/strollers"
        },
        {
            id: "carseat-02",
            name: "Car Seats",
            image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=500&auto=format&fit=crop",
            description: "Safety first journey",
            brand: "HAPPY BABY",
            link: "/category/car-seats"
        },
        {
            id: "bags-03",
            name: "Travel Bags",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop",
            description: "Organized travel",
            brand: "BABY CARE",
            link: "/category/travel-bags"
        },
        {
            id: "acc-04",
            name: "Travel Accessories",
            image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=500&auto=format&fit=crop",
            description: "Smooth travels",
            brand: "CUDDLE & CO",
            link: "/category/travel-accessories"
        }
    ];

    return (
        <section className="py-10 px-4 md:px-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-gray-100/50 shadow-sm transition-all duration-500 hover:shadow-md mt-10 mx-auto max-w-[1440px]">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <Plane className="w-6 h-6 text-babyshopSky" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                                Travel Essentials
                            </h2>
                            <p className="text-slate-500 text-sm font-medium mt-0.5">
                                Adventures with your little explorer
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/travel"
                        className="group flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-slate-600 font-bold text-sm shadow-sm hover:shadow-md transition-all border border-slate-100 active:scale-95"
                    >
                        Explore More
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-babyshopSky" />
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {travelCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.link}
                            className="group bg-white rounded-[1.5rem] p-3 shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-slate-100"
                        >
                            <div className="relative aspect-square rounded-[1.2rem] overflow-hidden bg-slate-50">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                />

                                <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <ChevronRight className="w-4 h-4 text-babyshopSky" />
                                </div>
                            </div>

                            <div className="mt-4 px-2 pb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                                    {category.brand}
                                </span>
                                <h3 className="mt-1 text-[16px] font-bold text-slate-800 group-hover:text-babyshopSky transition-colors line-clamp-1">
                                    {category.name}
                                </h3>
                                <p className="text-slate-400 text-xs mt-1 font-medium line-clamp-1">
                                    {category.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Safety Feature Bar */}
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Safety Certified Products</h4>
                            <p className="text-[11px] text-slate-500 font-medium">International safety standards guaranteed</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-slate-700">4.8 Rating</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 hidden md:block" />
                        <div className="text-sm font-bold text-slate-700 uppercase tracking-tighter">2K+ Happy Parents</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
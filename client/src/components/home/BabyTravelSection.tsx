"use client";

import { Baby, Car, ShoppingBag, Plane, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BabyTravelSection() {
    const travelCategories = [
        {
            id: 1,
            name: "Strollers & Prams",
            icon: Baby,
            description: "Comfortable rides for your little one",
            link: "/category/strollers",
            // আপনি চাইলে এখানে real image URL দিতে পারেন, না দিলে আইকন দেখাবে
            image: null
        },
        {
            id: 2,
            name: "Car Seats",
            icon: Car,
            description: "Safety first on every journey",
            link: "/category/car-seats",
            image: null
        },
        {
            id: 3,
            name: "Travel Bags",
            icon: ShoppingBag,
            description: "Organized travel made simple",
            link: "/category/travel-bags",
            image: null
        },
        {
            id: 4,
            name: "Travel Accessories",
            icon: Plane,
            description: "Everything for smooth adventures",
            link: "/category/travel-accessories",
            image: null
        }
    ];

    return (
        <section className="py-16 px-4 md:px-8 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative">

                {/* Section Header - Styled like HomeBrand */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-100 pb-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Travel <span className="text-babyshopSky">Essentials</span>
                        </h2>
                        <p className="text-slate-500 text-sm">
                            Premium gear designed for comfort and safety on every trip.
                        </p>
                    </div>

                    <Link
                        href="/travel"
                        className="group flex items-center gap-2 text-slate-900 font-bold hover:text-babyshopSky transition-all duration-300 text-sm"
                    >
                        View All
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Categories Grid - Same as Brand Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {travelCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.id}
                                href={category.link}
                                className="group flex flex-col items-center"
                            >
                                {/* Fixed Aspect Ratio Container (Same as Brands) */}
                                <div className="relative w-full aspect-square rounded-2xl bg-slate-50 border border-transparent overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:border-slate-100 group-hover:-translate-y-2">

                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:text-babyshopSky transition-colors">
                                                <Icon className="w-8 h-8 stroke-[1.5]" />
                                            </div>
                                            <p className="text-[11px] uppercase tracking-widest text-slate-400 font-medium px-4">
                                                {category.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Label (Same as Brands) */}
                                <span className="mt-5 text-[16px] font-bold text-slate-800 group-hover:text-babyshopSky transition-colors duration-300">
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Optional: Simple Clean Trust Bar */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
                    <div className="flex items-center gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-babyshopSky" />
                        <span className="text-xs font-bold uppercase tracking-wider">Safety Tested</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-babyshopSky" />
                        <span className="text-xs font-bold uppercase tracking-wider">Premium Brands</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-babyshopSky" />
                        <span className="text-xs font-bold uppercase tracking-wider">Global Support</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
import { Plane, Car, Baby, ShoppingBag, Shield, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BabyTravelSection() {
    // Sample travel categories - in production, these could come from an API
    const travelCategories = [
        {
            id: 1,
            name: "Strollers & Prams",
            icon: Baby,
            description: "Comfortable rides for your little one",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            link: "/category/strollers"
        },
        {
            id: 2,
            name: "Car Seats",
            icon: Car,
            description: "Safety first on every journey",
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            link: "/category/car-seats"
        },
        {
            id: 3,
            name: "Travel Bags",
            icon: ShoppingBag,
            description: "Organized travel made easy",
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            link: "/category/travel-bags"
        },
        {
            id: 4,
            name: "Travel Accessories",
            icon: Plane,
            description: "Everything for smooth travels",
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50",
            link: "/category/travel-accessories"
        }
    ];

    return (
        <section className="py-12 px-6 rounded-3xl bg-gradient-to-br from-teal-50/60 via-cyan-50/60 to-white border border-gray-100 mt-9">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-babyshopSky">
                        <Plane className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-1 flex items-center gap-2">
                            Baby Travel Essentials
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Everything you need for adventures with your little explorer!
                        </p>
                    </div>
                </div>
                <Link
                    href="/travel"
                    className="group flex items-center gap-2 text-babyshopSky font-semibold hover:gap-3 transition-all duration-300 text-sm"
                >
                    Explore All
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Travel Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {travelCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                        <Link
                            key={category.id}
                            href={category.link}
                            className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-babyshopSky/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />

                            {/* Content */}
                            <div className="relative">
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-babyshopSky transition-colors">
                                    {category.name}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4">
                                    {category.description}
                                </p>

                                {/* Arrow */}
                                <div className="flex items-center gap-2 text-babyshopSky font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Shop Now
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Bottom Accent Line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                        </Link>
                    );
                })}
            </div>

            {/* Featured Banner */}
            <div className="relative bg-gradient-to-r from-babyshopSky to-teal-400 rounded-2xl p-8 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                {/* Content */}
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-1">
                                Safety Certified Products
                            </h3>
                            <p className="text-white/90 text-sm">
                                All our travel products meet international safety standards
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-white">
                        <div className="text-center">
                            <div className="flex items-center gap-1 justify-center mb-1">
                                <Star className="w-5 h-5 fill-white" />
                                <span className="text-3xl font-bold">4.8</span>
                            </div>
                            <p className="text-sm text-white/90">Average Rating</p>
                        </div>
                        <div className="h-12 w-px bg-white/30" />
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">2K+</div>
                            <p className="text-sm text-white/90">Happy Parents</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
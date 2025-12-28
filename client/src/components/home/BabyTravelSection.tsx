import { Plane, Car, Baby, ShoppingBag, Shield, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BabyTravelSection() {
    const travelCategories = [
        {
            id: 1,
            name: "Strollers & Prams",
            icon: Baby,
            description: "Comfortable rides for your little one",
            color: "text-blue-500",
            borderColor: "hover:border-blue-200",
            link: "/category/strollers"
        },
        {
            id: 2,
            name: "Car Seats",
            icon: Car,
            description: "Safety first on every journey",
            color: "text-emerald-500",
            borderColor: "hover:border-emerald-200",
            link: "/category/car-seats"
        },
        {
            id: 3,
            name: "Travel Bags",
            icon: ShoppingBag,
            description: "Organized travel made easy",
            color: "text-purple-500",
            borderColor: "hover:border-purple-200",
            link: "/category/travel-bags"
        },
        {
            id: 4,
            name: "Travel Accessories",
            icon: Plane,
            description: "Everything for smooth travels",
            color: "text-orange-500",
            borderColor: "hover:border-orange-200",
            link: "/category/travel-accessories"
        }
    ];

    return (
        <section className="py-14 px-4 md:px-8 rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white border border-gray-100/50 shadow-sm transition-all duration-500 hover:shadow-md mt-12">
            <div className="max-w-7xl mx-auto relative">

                {/* Section Header - Styled to match "Trusted Brands" */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-100 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-babyshopSky/10 text-babyshopSky text-[10px] font-black uppercase tracking-widest">
                                On the go
                            </span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Travel <span className="text-babyshopSky">Essentials</span>
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Premium gear for adventures with your little explorer.
                        </p>
                    </div>

                    <Link
                        href="/travel"
                        className="group flex items-center gap-2 text-slate-900 font-bold hover:text-babyshopSky transition-all duration-300 text-sm bg-white px-5 py-2.5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md"
                    >
                        Explore All Gear
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {travelCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <Link
                                key={category.id}
                                href={category.link}
                                className={`group bg-white/50 backdrop-blur-sm rounded-3xl p-7 border border-slate-100 ${category.borderColor} transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 flex flex-col items-start`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <IconComponent className={`w-7 h-7 ${category.color}`} />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {category.name}
                                </h3>

                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                    {category.description}
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-[12px] font-black uppercase tracking-wider text-babyshopSky opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    View Collection <ArrowRight className="w-3 h-3" />
                                </div>
                            </Link>
                        );
                    })}
                </div>


            </div>
        </section>
    );
}
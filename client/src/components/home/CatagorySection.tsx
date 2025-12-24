import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Category, CategoryResponse } from "@/types/type";
import {
    ChevronRight,
    Star,
    Zap,
    HeadphonesIcon,
    Gift,
    Baby,
    List as ListIcon,
    HelpCircle,
    Truck,
    ShieldCheck,
    Tag,
    Sparkles
} from "lucide-react";
import Link from "next/link";

export default async function CatagorySection() {
    let categories: Category[] = [];
    try {
        const response = await fetchData<CategoryResponse>(API_ENDPOINTS.CATEGORIES);
        categories = response.categories;
    } catch (error) {
        console.error("Failed to fetch categories inside CatagorySection:", error);
    }

    return (
        <div className="hidden md:flex flex-col bg-white h-full border border-gray-200 rounded-2xl shadow-lg min-w-[280px] overflow-hidden">
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar divide-y divide-gray-100">

                {/* Header */}
                <div className="bg-gradient-to-r from-babyshopSky to-teal-400 p-5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-white" />
                        <h2 className="text-base font-bold text-white uppercase tracking-wide">Shop Categories</h2>
                    </div>
                </div>

                {/* Features Section */}
                <div className="p-5">
                    <h3 className="text-xs font-bold text-babyshopTextLight uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Star className="w-3.5 h-3.5" />
                        Features
                    </h3>
                    <ul className="space-y-2.5">
                        <li>
                            <Link href="/new-arrivals" className="flex items-center gap-3 text-gray-700 hover:text-babyshopSky hover:bg-teal-50 px-3 py-2 rounded-lg transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                </div>
                                <span className="text-sm font-semibold">New Arrivals</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        </li>
                        <li>
                            <Link href="/best-sellers" className="flex items-center gap-3 text-gray-700 hover:text-babyshopPurple hover:bg-purple-50 px-3 py-2 rounded-lg transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="w-4 h-4 text-babyshopPurple" />
                                </div>
                                <span className="text-sm font-semibold">Best Sellers</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        </li>
                        <li>
                            <Link href="/features" className="flex items-center gap-3 text-gray-700 hover:text-babyshopSky hover:bg-teal-50 px-3 py-2 rounded-lg transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Truck className="w-4 h-4 text-babyshopSky" />
                                </div>
                                <span className="text-sm font-semibold">Free Shipping</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Hot Categories */}
                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-babyshopTextLight uppercase tracking-wider flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5" />
                            Hot Categories
                        </h3>
                        <Link href="/categories" className="text-xs text-babyshopSky hover:text-babyshopPurple font-semibold hover:underline transition-colors">View All</Link>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {categories && categories.length > 0 ? (
                            categories.slice(0, 8).map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/category/${category.slug}`}
                                    className="flex items-center justify-between text-gray-700 hover:text-babyshopSky hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 px-3 py-2 rounded-lg transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-babyshopSky/30 group-hover:bg-babyshopSky group-hover:scale-125 transition-all"></div>
                                        <span className="text-sm font-medium truncate max-w-[160px]">{category.name}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-babyshopSky opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 px-3">Loading...</p>
                        )}
                    </div>
                </div>

                {/* Shop By Age */}
                <div className="p-5">
                    <h3 className="text-xs font-bold text-babyshopTextLight uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Baby className="w-3.5 h-3.5" />
                        Shop By Age
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {["0-6 M", "6-12 M", "1-2 Y", "2-4 Y", "4-6 Y", "6+ Y"].map((age) => (
                            <Link
                                key={age}
                                href={`/shop-by-age?age=${age.replace(' ', '-')}`}
                                className="text-center text-xs font-semibold text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-babyshopSky hover:to-teal-400 hover:text-white py-2.5 rounded-lg transition-all border border-gray-200 hover:border-transparent hover:shadow-md hover:scale-105"
                            >
                                {age}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Special Offers */}
                <div className="p-5">
                    <h3 className="text-xs font-bold text-babyshopTextLight uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" />
                        Special Offers
                    </h3>
                    <ul className="space-y-2.5">
                        <li>
                            <Link href="/offers/coupons" className="flex items-center gap-3 text-gray-700 hover:text-babyshopPurple hover:bg-pink-50 px-3 py-2 rounded-lg transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Gift className="w-4 h-4 text-pink-500" />
                                </div>
                                <span className="text-sm font-semibold">Coupons</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        </li>
                        <li>
                            <Link href="/offers/bundles" className="flex items-center gap-3 text-gray-700 hover:text-babyshopSky hover:bg-teal-50 px-3 py-2 rounded-lg transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Tag className="w-4 h-4 text-babyshopSky" />
                                </div>
                                <span className="text-sm font-semibold">Bundle Deals</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Customer Support & List */}
                <div className="p-5">
                    <h3 className="text-xs font-bold text-babyshopTextLight uppercase tracking-wider mb-4 flex items-center gap-2">
                        <HeadphonesIcon className="w-3.5 h-3.5" />
                        Support & Lists
                    </h3>
                    <ul className="space-y-2.5">
                        <li>
                            <Link href="/support" className="flex items-center gap-3 text-gray-700 hover:text-babyshopSky hover:bg-teal-50 px-3 py-2 rounded-lg transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <HeadphonesIcon className="w-4 h-4 text-indigo-500" />
                                </div>
                                <span className="text-sm font-semibold">Customer Support</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        </li>
                        <li>
                            <Link href="/wishlist" className="flex items-center gap-3 text-gray-700 hover:text-babyshopPurple hover:bg-purple-50 px-3 py-2 rounded-lg transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ListIcon className="w-4 h-4 text-orange-500" />
                                </div>
                                <span className="text-sm font-semibold">My Wishlist</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
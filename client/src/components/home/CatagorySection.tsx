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
    Tag
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
        <div className="hidden md:flex flex-col bg-white h-full border border-gray-100 rounded-lg shadow-sm min-w-[260px] overflow-hidden">
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar divide-y divide-gray-50">

                {/* Features Section */}
                <div className="p-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Features</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/new-arrivals" className="flex items-center gap-3 text-gray-600 hover:text-[#9c059c] transition-colors group">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-medium">New Arrivals</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/best-sellers" className="flex items-center gap-3 text-gray-600 hover:text-[#9c059c] transition-colors group">
                                <Zap className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-medium">Best Sellers</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/features" className="flex items-center gap-3 text-gray-600 hover:text-[#9c059c] transition-colors group">
                                <Truck className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium">Free Shipping</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Hot Categories */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hot Categories</h2>
                        <Link href="/categories" className="text-[10px] items-center text-[#9c059c] hover:underline hidden lg:flex">View All</Link>
                    </div>

                    <div className="flex flex-col gap-1">
                        {categories && categories.length > 0 ? (
                            categories.slice(0, 8).map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/category/${category.slug}`}
                                    className="flex items-center justify-between text-gray-600 hover:text-[#9c059c] hover:bg-purple-50 px-2 py-1.5 rounded-md transition-all group"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#9c059c] transition-colors"></div>
                                        <span className="text-sm font-medium truncate max-w-[140px]">{category.name}</span>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#9c059c] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 px-2">Loading...</p>
                        )}
                    </div>
                </div>

                {/* Shop By Age */}
                <div className="p-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shop By Age</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {["0-6 M", "6-12 M", "1-2 Y", "2-4 Y", "4-6 Y", "6+ Y"].map((age) => (
                            <Link
                                key={age}
                                href={`/shop-by-age?age=${age.replace(' ', '-')}`}
                                className="text-center text-xs font-medium text-gray-600 bg-gray-50 hover:bg-[#9c059c] hover:text-white py-1.5 rounded transition-all border border-gray-100"
                            >
                                {age}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Special Offers */}
                <div className="p-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Special Offers</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/offers/coupons" className="flex items-center gap-3 text-gray-600 hover:text-[#9c059c] transition-colors group">
                                <Gift className="w-4 h-4 text-pink-400" />
                                <span className="text-sm font-medium">Coupons</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/offers/bundles" className="flex items-center gap-3 text-gray-600 hover:text-[#9c059c] transition-colors group">
                                <Tag className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium">Bundle Deals</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Customer Support & List */}
                <div className="p-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Support & Lists</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/support" className="flex items-center gap-3 text-gray-600 hover:text-[#9c059c] transition-colors group">
                                <HeadphonesIcon className="w-4 h-4 text-indigo-400" />
                                <span className="text-sm font-medium">Customer Support</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/wishlist" className="flex items-center gap-3 text-gray-600 hover:text-[#9c059c] transition-colors group">
                                <ListIcon className="w-4 h-4 text-orange-400" />
                                <span className="text-sm font-medium">My Wishlist</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
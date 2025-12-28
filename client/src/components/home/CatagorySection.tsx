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
    Truck,
    Tag,
    Sparkles,
    Heart
} from "lucide-react"; // Or lucide-react
import Link from "next/link";

export default async function CategorySection() {
    let categories: Category[] = [];
    try {
        const response = await fetchData<CategoryResponse>(API_ENDPOINTS.CATEGORIES);
        categories = response.categories;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    return (
        <aside className="hidden lg:flex flex-col w-[300px] h-fit bg-white/70 backdrop-blur-md border border-gray-100 rounded-[2rem] shadow-sm sticky top-24 overflow-hidden">
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6 space-y-8">

                {/* 1. Brand Header */}
                <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-babyshopSky to-cyan-500 p-4 shadow-md shadow-blue-100">
                    <Sparkles className="absolute -right-2 -top-2 w-16 h-16 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                    <div className="relative flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <ListIcon className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Explore</h2>
                    </div>
                </div>

                {/* 2. Curated Discovery Section */}
                <section>
                    <h3 className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Discovery</h3>
                    <nav className="space-y-1">
                        <FeatureLink
                            href="/shop?sort=newest"
                            icon={<Star className="w-4 h-4" />}
                            label="New Arrivals"
                            color="text-amber-500"
                            bg="bg-amber-50"
                        />
                        <FeatureLink
                            href="/shop?trending=true"
                            icon={<Zap className="w-4 h-4" />}
                            label="Best Sellers"
                            color="text-purple-500"
                            bg="bg-purple-50"
                        />
                        <FeatureLink
                            href="/shop?shipping=free"
                            icon={<Truck className="w-4 h-4" />}
                            label="Free Shipping"
                            color="text-emerald-500"
                            bg="bg-emerald-50"
                        />
                    </nav>
                </section>

                {/* 3. Dynamic Categories Section */}
                <section>
                    <div className="flex items-center justify-between px-2 mb-4">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Categories</h3>
                        <Link href="/shop" className="text-[11px] font-bold text-babyshopSky hover:underline">See All</Link>
                    </div>
                    <div className="space-y-1">
                        {categories && categories.length > 0 ? (
                            categories.slice(0, 7).map((cat) => (
                                <Link
                                    key={cat._id}
                                    href={`/shop?category=${cat._id}`}
                                    className="flex items-center group px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-babyshopSky group-hover:scale-150 transition-all mr-3" />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{cat.name}</span>
                                    <ChevronRight className="w-4 h-4 ml-auto text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))
                        ) : (
                            <div className="space-y-2 animate-pulse px-2">
                                {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-100 rounded w-full" />)}
                            </div>
                        )}
                    </div>
                </section>

                {/* 4. Shop By Age Section (Modern Chips) */}
                <section>
                    <h3 className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Baby className="w-3 h-3" /> Age Group
                    </h3>
                    <div className="grid grid-cols-2 gap-2 px-1">
                        {["0-6 M", "6-12 M", "1-2 Y", "2-4 Y", "4-6 Y", "6+ Y"].map((age) => (
                            <Link
                                key={age}
                                href={`/shop?ageGroup=${age}`}
                                className="text-center text-[11px] font-bold text-gray-500 bg-gray-50/50 border border-gray-100 py-2 rounded-xl hover:bg-white hover:border-babyshopSky hover:text-babyshopSky hover:shadow-sm transition-all"
                            >
                                {age}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 5. Support & Utility */}
                <section className="pt-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-2xl p-2 space-y-1">
                        <FeatureLink
                            href="/wishlist"
                            icon={<Heart className="w-4 h-4" />}
                            label="Wishlist"
                            color="text-rose-500"
                        />
                        <FeatureLink
                            href="/support"
                            icon={<HeadphonesIcon className="w-4 h-4" />}
                            label="Help Center"
                            color="text-indigo-500"
                        />
                    </div>
                </section>
            </div>
        </aside>
    );
}

// Reusable Sub-component for clean code
function FeatureLink({ href, icon, label, color, bg = "transparent" }: { href: string, icon: React.ReactNode, label: string, color: string, bg?: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{label}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
        </Link>
    );
}
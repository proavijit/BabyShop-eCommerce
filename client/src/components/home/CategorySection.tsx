import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Category, CategoryResponse } from "@/types/type";
import {
    ChevronRight,
    HeadphonesIcon,
    Baby,
    Heart,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function CategorySection() {
    let categories: Category[] = [];
    try {
        const response = await fetchData<CategoryResponse>(API_ENDPOINTS.CATEGORIES);
        categories = response.categories;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    const featuredItems = [
        { label: "Baby Deals", icon: "🔥", color: "text-rose-500", bg: "bg-rose-500/10", hover: "hover:bg-rose-500/[0.08]", href: "/shop?deals=true" },
        { label: "Today's Best", icon: "🎯", color: "text-blue-500", bg: "bg-blue-500/10", hover: "hover:bg-blue-500/[0.08]", href: "/shop?sort=discount" },
        { label: "Best Sellers", icon: "💰", color: "text-amber-500", bg: "bg-amber-500/10", hover: "hover:bg-amber-500/[0.08]", href: "/shop?sort=popular" },
        { label: "Gift Ideas", icon: "🎁", color: "text-orange-500", bg: "bg-orange-500/10", hover: "hover:bg-orange-500/[0.08]", href: "/shop?tag=gifts" },
    ];

    return (
        <aside
            className="hidden lg:flex flex-col w-[260px] h-fit bg-white border border-gray-100 rounded-sm sticky top-24 overflow-hidden"
            suppressHydrationWarning={true}
        >
            <div className="flex flex-col h-full p-4 space-y-7" suppressHydrationWarning={true}>

                {/* 1. Featured - Opacity Hover UI */}
                <section>
                    <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Discovery</h3>
                    <nav className="flex flex-col gap-1">
                        {featuredItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-2 py-1.5 rounded-sm transition-all duration-200 ${item.hover} group`}
                            >
                                <div className={`w-7 h-7 rounded-sm ${item.bg} ${item.color} flex items-center justify-center text-sm transition-transform group-hover:scale-110`}>
                                    {item.icon}
                                </div>
                                <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </section>

                {/* 2. Hot Categories - Minimal Cover with Overlay Hover */}
                <section>
                    <div className="flex items-center justify-between px-2 mb-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Categories</h3>
                        <Link href="/shop" className="text-[10px] font-bold text-babyshopSky hover:underline flex items-center gap-0.5">
                            VIEW ALL <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-1">
                        {categories?.slice(0, 8).map((cat) => (
                            <Link
                                key={cat._id}
                                href={`/shop?category=${cat._id}`}
                                className="flex items-center gap-3 px-2 py-1.5 rounded-sm transition-all duration-200 hover:bg-[#29beb3]/[0.12] group"
                            >
                                {/* Cover Image with Thin Radius */}
                                <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-sm border border-gray-100 bg-gray-50">
                                    <Image
                                        src={cat.image || "/icons/placeholder.png"}
                                        alt={cat.name}
                                        fill
                                        sizes="36px"
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Subtle Opacity Overlay on Image Hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                </div>
                                <span className="text-[13px] font-medium text-gray-600 group-hover:text-black">
                                    {cat.name}
                                </span>
                                <ChevronRight className="ml-auto w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 3. Age Group - Thin Minimalist Chips */}
                <section>
                    <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Age Group</h3>
                    <div className="grid grid-cols-2 gap-1.5 px-1">
                        {["0-6 M", "6-12 M", "1-2 Y", "2-4 Y", "4-6 Y", "6+ Y"].map((age) => (
                            <Link
                                key={age}
                                href={`/shop?ageGroup=${age}`}
                                className="text-center text-[10px] font-bold text-gray-500 border border-gray-100 py-2 rounded-sm hover:bg-black hover:text-white transition-all duration-200"
                            >
                                {age}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 4. Minimal Support */}
                <section className="pt-4 border-t border-gray-50">
                    <div className="flex flex-col gap-1">
                        <FeatureLink href="/wishlist" icon={<Heart className="w-3.5 h-3.5" />} label="Wishlist" hoverColor="hover:bg-rose-500/[0.05]" iconColor="text-rose-500" />
                        <FeatureLink href="/support" icon={<HeadphonesIcon className="w-3.5 h-3.5" />} label="Support" hoverColor="hover:bg-indigo-500/[0.05]" iconColor="text-indigo-500" />
                    </div>
                </section>
            </div>
        </aside>
    );
}

function FeatureLink({ href, icon, label, hoverColor, iconColor }: { href: string, icon: React.ReactNode, label: string, hoverColor: string, iconColor: string }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 ${hoverColor} group`}>
            <div className={`${iconColor} transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <span className="text-[13px] font-medium text-gray-600 group-hover:text-black">{label}</span>
        </Link>
    );
}
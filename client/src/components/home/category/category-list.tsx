// components/sections/category/category-list.tsx
import { Category } from "@/types/type";
import { ChevronRight, HeadphonesIcon, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CategoryListProps {
    categories: Category[];
}

const featuredItems = [
    { label: "Baby Deals", icon: "🔥", color: "text-rose-500", bg: "bg-rose-500/10", hover: "hover:bg-rose-500/[0.08]", href: "/shop?deals=true" },
    { label: "Today's Best", icon: "🎯", color: "text-blue-500", bg: "bg-blue-500/10", hover: "hover:bg-blue-500/[0.08]", href: "/shop?sort=discount" },
    { label: "Best Sellers", icon: "💰", color: "text-amber-500", bg: "bg-amber-500/10", hover: "hover:bg-amber-500/[0.08]", href: "/shop?sort=popular" },
    { label: "Gift Ideas", icon: "🎁", color: "text-orange-500", bg: "bg-orange-500/10", hover: "hover:bg-orange-500/[0.08]", href: "/shop?tag=gifts" },
];

export default function CategoryList({ categories }: CategoryListProps) {
    return (
        <aside className="hidden lg:flex flex-col w-[260px] h-fit bg-white border border-gray-100 rounded-sm sticky top-24 overflow-hidden" suppressHydrationWarning={true}>
            <div className="flex flex-col h-full p-4 space-y-7" suppressHydrationWarning={true}>
                {/* 1. Featured Nav */}
                <section suppressHydrationWarning={true}>
                    <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Discovery</h3>
                    <nav className="flex flex-col gap-1" suppressHydrationWarning={true}>
                        {featuredItems.map((item) => (
                            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-2 py-1.5 rounded-sm transition-all duration-200 ${item.hover} group`} suppressHydrationWarning={true}>
                                <div className={`w-7 h-7 rounded-sm ${item.bg} ${item.color} flex items-center justify-center text-sm transition-transform group-hover:scale-110`} suppressHydrationWarning={true}>
                                    {item.icon}
                                </div>
                                <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </section>

                {/* 2. Categories List */}
                <section suppressHydrationWarning={true}>
                    <div className="flex items-center justify-between px-2 mb-4" suppressHydrationWarning={true}>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Categories</h3>
                        <Link href="/shop" className="text-[10px] font-bold text-pink-600 hover:underline flex items-center gap-0.5">
                            VIEW ALL <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                    </div>
                    <div className="flex flex-col gap-1" suppressHydrationWarning={true}>
                        {categories?.slice(0, 8).map((cat) => (
                            <Link key={cat._id} href={`/shop?category=${cat._id}`} className="flex items-center gap-3 px-2 py-1.5 rounded-sm transition-all duration-200 hover:bg-pink-100/50 group" suppressHydrationWarning={true}>
                                <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-sm border border-gray-100 bg-gray-50" suppressHydrationWarning={true}>
                                    <Image src={cat.image || "/icons/placeholder.png"} alt={cat.name} fill sizes="36px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <span className="text-[13px] font-medium text-gray-600 group-hover:text-black">{cat.name}</span>
                                <ChevronRight className="ml-auto w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 3. Footer Links */}
                <section className="pt-4 border-t border-gray-50" suppressHydrationWarning={true}>
                    <div className="flex flex-col gap-1" suppressHydrationWarning={true}>
                        <FeatureLink href="/wishlist" icon={<Heart className="w-3.5 h-3.5" />} label="Wishlist" hoverColor="hover:bg-rose-500/[0.05]" iconColor="text-rose-500" />
                        <FeatureLink href="/support" icon={<HeadphonesIcon className="w-3.5 h-3.5" />} label="Support" hoverColor="hover:bg-indigo-500/[0.05]" iconColor="text-indigo-500" />
                    </div>
                </section>
            </div>
        </aside>
    );
}

function FeatureLink({ href, icon, label, hoverColor, iconColor }: any) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 ${hoverColor} group`} suppressHydrationWarning={true}>
            <div className={`${iconColor} transition-transform group-hover:scale-110`} suppressHydrationWarning={true}>{icon}</div>
            <span className="text-[13px] font-medium text-gray-600 group-hover:text-black">{label}</span>
        </Link>
    );
}
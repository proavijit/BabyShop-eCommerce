import Link from "next/link";
import { ChevronRight, Plane, Car, Baby, ShoppingBag } from "lucide-react";
import { CategoryCard } from "./category-card";
import { TravelCategory } from "@/types/type";

// Defined outside to prevent re-creation on re-renders
const TRAVEL_CATEGORIES: TravelCategory[] = [
    {
        id: 1,
        name: "Strollers & Prams",
        icon: Baby,
        description: "Comfortable rides for your little one",
        accentColor: "bg-blue-500",
        iconColor: "text-blue-500",
        link: "/category/strollers",
    },
    {
        id: 2,
        name: "Car Seats",
        icon: Car,
        description: "Safety first on every journey",
        accentColor: "bg-emerald-500",
        iconColor: "text-emerald-500",
        link: "/category/car-seats",
    },
    {
        id: 3,
        name: "Travel Bags",
        icon: ShoppingBag,
        description: "Organized travel made easy",
        accentColor: "bg-purple-500",
        iconColor: "text-purple-500",
        link: "/category/travel-bags",
    },
    {
        id: 4,
        name: "Travel Accessories",
        icon: Plane,
        description: "Everything for smooth travels",
        accentColor: "bg-orange-500",
        iconColor: "text-orange-500",
        link: "/category/travel-accessories",
    },
];

/**
 * BabyTravelSection - Optimized Server Component
 * Uses SSG by default in Next.js App Router
 */
export default function BabyTravelSection() {
    return (
        <section className="w-full py-12 px-4 max-w-7xl mx-auto" aria-labelledby="travel-essentials-heading" suppressHydrationWarning={true}>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4" suppressHydrationWarning={true}>
                <div className="space-y-1.5" suppressHydrationWarning={true}>
                    <div className="flex items-center gap-3" suppressHydrationWarning={true}>
                        <span className="h-6 w-[3px] rounded-full bg-blue-400" aria-hidden="true" />
                        <h2 id="travel-essentials-heading" className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                            Travel Essentials
                        </h2>
                    </div>
                    <p className="text-sm font-medium text-slate-500 sm:ml-[15px]">
                        Premium gear for adventures with your little explorer.
                    </p>
                </div>

                <Link
                    href="/travel"
                    className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 transition-colors hover:text-slate-900"
                >
                    View all
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-8 xs:grid-cols-2 lg:grid-cols-4" suppressHydrationWarning={true}>
                {TRAVEL_CATEGORIES.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </section>
    );
}
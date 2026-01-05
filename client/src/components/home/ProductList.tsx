import { API_ENDPOINTS, fetchData, buildQueryString } from "@/lib/api";
import { Product } from "@/types/type";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductSectionProps {
    title: string;
    description?: string;
    query: Record<string, string | number | boolean>;
    viewAllLink?: string;
    accentColor?: string;
}

async function ProductSection({
    title,
    description,
    query,
    viewAllLink,
    accentColor = "bg-[#00B5A5]",
}: ProductSectionProps) {
    let products: Product[] = [];

    try {
        const queryString = buildQueryString({ ...query, perPage: 5 });
        const data = await fetchData<{ products: Product[] }>(
            `${API_ENDPOINTS.PRODUCTS}${queryString}`,
            {
                next: { revalidate: 3600 },
                cache: "force-cache",
            }
        );
        products = data.products || [];
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return null;
    }

    if (!products.length) return null;

    return (
        <section className="group">
            {/* Header Section */}
            <div className="flex items-end justify-between mb-6 px-1">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className={`h-6 w-[3px] rounded-full ${accentColor}`} />
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                            {title}
                        </h2>
                    </div>
                    {description && (
                        <p className="text-sm text-slate-500 ml-[15px]">
                            {description}
                        </p>
                    )}
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="group/link flex items-center gap-1 text-sm font-medium text-slate-600 transition-all hover:text-slate-900"
                    >
                        View all
                        <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                )}
            </div>

            {/* Grid Container */}
            <div className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {products.map((product) => (
                        <div key={product._id} className="transition-transform duration-300 hover:-translate-y-1">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function ProductList() {
    return (
        <div className="mx-auto max-w-[1400px] space-y-20 px-6 py-16 bg-[#fafafa]">
            <ProductSection
                title="Featured Picks"
                description="Curated quality for your little ones"
                query={{ isFeatured: true }}
                viewAllLink="/products?isFeatured=true"
            />

            <ProductSection
                title="Trending Now"
                description="The most loved pieces this week"
                query={{ trending: true }}
                viewAllLink="/products?trending=true"
                accentColor="bg-amber-400"
            />

            <ProductSection
                title="Exclusive Deals"
                description="Premium quality, better prices"
                query={{ isBestDeal: true }}
                viewAllLink="/products?isBestDeal=true"
                accentColor="bg-rose-400"
            />
        </div>
    );
}
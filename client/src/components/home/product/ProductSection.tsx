import { API_ENDPOINTS, fetchData, buildQueryString } from "@/lib/api";
import { Product } from "@/types/type";
import ProductCard from "../product/ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductSectionProps {
    title: string;
    description?: string;
    query: Record<string, string | number | boolean>;
    viewAllLink?: string;
    accentColor?: string;
    isFirstSection?: boolean;
}

export default async function ProductSection({
    title,
    description,
    query,
    viewAllLink,
    accentColor = "bg-[#00B5A5]",
    isFirstSection = false,
}: ProductSectionProps) {
    // Fetch with Tag-based revalidation (Best Practice)
    const queryString = buildQueryString({ ...query, perPage: 5 });
    const data = await fetchData<{ products: Product[] }>(
        `${API_ENDPOINTS.PRODUCTS}${queryString}`,
        {
            next: {
                revalidate: 3600,
                tags: ["products", String(query.isFeatured || "general")]
            },
        }
    );

    const products = data?.products || [];
    if (!products.length) return null;

    return (
        <section className="w-full" suppressHydrationWarning={true}>
            <div className="mb-8 flex items-end justify-between px-1" suppressHydrationWarning={true}>
                <div className="space-y-1.5" suppressHydrationWarning={true}>
                    <div className="flex items-center gap-3" suppressHydrationWarning={true}>
                        <span className={`h-6 w-[3px] rounded-full ${accentColor}`} />
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                            {title}
                        </h2>
                    </div>
                    {description && (
                        <p className="text-sm font-medium text-slate-500 md:ml-[15px]">{description}</p>
                    )}
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 transition-colors hover:text-slate-900"
                    >
                        View all
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                )}
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" suppressHydrationWarning={true}>
                {products.map((product, index) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        priority={isFirstSection && index < 4}
                    />
                ))}
            </div>
        </section>
    );
}
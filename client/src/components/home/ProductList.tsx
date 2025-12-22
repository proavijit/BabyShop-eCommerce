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
    className?: string; // Add className prop
}

async function ProductSection({ title, description, query, viewAllLink, className }: ProductSectionProps) {
    let products: Product[] = [];

    try {
        const queryString = buildQueryString({ ...query, perPage: 4 });
        const data = await fetchData<{ products: Product[] }>(`${API_ENDPOINTS.PRODUCTS}${queryString}`);
        products = data.products || [];
    } catch (error) {
        console.error(`Failed to fetch products for section ${title}:`, error);
        return null;
    }

    if (products.length === 0) return null;

    return (
        <section className={`py-12 ${className || ''}`}>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{title}</h2>
                    {description && <p className="text-gray-500">{description}</p>}
                </div>
                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="group flex items-center gap-1 text-primary font-semibold hover:text-primary/80 transition-colors"
                    >
                        View All <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default function ProductList() {
    return (
        <div className="space-y-4">
            {/* Trending Products */}
            <ProductSection
                title="🔥 Trending Products"
                description="Check out what's hot right now!"
                query={{ trending: true }}
                viewAllLink="/products?trending=true"
            />

            {/* Featured Products */}
            <ProductSection
                title="⭐ Featured Products"
                description="Handpicked favorites just for you!"
                query={{ isFeatured: true }}
                viewAllLink="/products?isFeatured=true"
                className="bg-gray-50 -mx-4 px-4 sm:-mx-8 sm:px-8 py-16 rounded-3xl"
            />

            {/* Best Deals */}
            <ProductSection
                title="💰 Best Deals"
                description="Don't miss out on these amazing deals!"
                query={{ isBestDeal: true }}
                viewAllLink="/products?isBestDeal=true"
            />
        </div>
    );
}
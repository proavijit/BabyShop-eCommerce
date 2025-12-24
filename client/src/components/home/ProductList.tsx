import { API_ENDPOINTS, fetchData, buildQueryString } from "@/lib/api";
import { Product } from "@/types/type";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ChevronRight, Sparkles, TrendingUp, Tag } from "lucide-react";


interface ProductSectionProps {
    title: string;
    description?: string;
    query: Record<string, string | number | boolean>;
    viewAllLink?: string;
    icon?: React.ReactNode;
    gradient?: string;
    accentColor?: string;
}

async function ProductSection({
    title,
    description,
    query,
    viewAllLink,
    icon,
    gradient = "from-gray-50 to-white",
    accentColor = "text-babyshopSky"
}: ProductSectionProps) {
    let products: Product[] = [];

    try {
        const queryString = buildQueryString({ ...query, perPage: 5 });
        const data = await fetchData<{ products: Product[] }>(`${API_ENDPOINTS.PRODUCTS}${queryString}`);
        products = data.products || [];
    } catch (error) {
        console.error(`Failed to fetch products for section ${title}:`, error);
        return null;
    }

    if (products.length === 0) return null;

    return (
        <section className="py-12 px-6 rounded-3xl bg-gradient-to-br from-teal-50/60 via-cyan-50/60 to-white border border-gray-100">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className={`w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center ${accentColor}`}>
                            {icon}
                        </div>
                    )}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-1 flex items-center gap-2">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-gray-600 text-sm">{description}</p>
                        )}
                    </div>
                </div>
                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className={`group flex items-center gap-2 ${accentColor} font-semibold hover:gap-3 transition-all duration-300 text-sm`}
                    >
                        View All
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>

            {/* Products Grid - 5 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default function ProductList() {
    return (
        <div className="space-y-8 py-8">
            {/* Featured Products - Purple/Pink Theme */}
            <ProductSection
                title="Featured Products"
                description="Handpicked favorites for your little ones!"
                query={{ isFeatured: true }}
                viewAllLink="/products?isFeatured=true"
                icon={<Sparkles className="w-7 h-7" />}
                gradient="from-purple-50 via-pink-50 to-white"
                accentColor="text-babyshopPurple"
            />

            {/* Trending Products - Teal/Sky Theme */}
            <ProductSection
                title="Trending Now"
                description="What's popular with parents right now!"
                query={{ trending: true }}
                viewAllLink="/products?trending=true"
                icon={<TrendingUp className="w-7 h-7" />}
                gradient="from-teal-50 via-cyan-50 to-white"
                accentColor="text-babyshopSky"
            />



            {/* Best Deals - Red/Orange Theme */}
            <ProductSection
                title="Best Deals"
                description="Amazing savings on quality baby products!"
                query={{ isBestDeal: true }}
                viewAllLink="/products?isBestDeal=true"
                icon={<Tag className="w-7 h-7" />}
                gradient="from-red-50 via-orange-50 to-white"
                accentColor="text-babyshopRed"
            />
        </div>
    );
}
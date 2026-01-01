import { API_ENDPOINTS, fetchData, buildQueryString } from "@/lib/api";
import { Product } from "@/types/type";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { Sparkles, TrendingUp, Tag, ArrowRight } from "lucide-react";

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
    gradient = "from-slate-50 to-white",
    accentColor = "text-babyshopSky"
}: ProductSectionProps) {
    let products: Product[] = [];

    try {
        const queryString = buildQueryString({ ...query, perPage: 5 });
        const data = await fetchData<{ products: Product[] }>(`${API_ENDPOINTS.PRODUCTS}${queryString}`);
        products = data.products || [];
    } catch (error) {
        console.error(`Failed to fetch products:`, error);
        return null;
    }

    if (products.length === 0) return null;

    return (
        // ১. সেকশন কার্ডকে আরও প্রিমিয়াম লুক দিতে shadow-sm এবং subtle border ব্যবহার করা হয়েছে
        <section className={`py-10 px-4 md:px-8 rounded-[2rem] bg-gradient-to-br ${gradient} border border-gray-100/50 shadow-sm transition-all duration-500 hover:shadow-md`}>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-5">
                    {icon && (
                        // ২. আইকন বক্সকে আরও ক্লিন এবং মডার্ন করা হয়েছে
                        <div className={`hidden sm:flex w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-50 items-center justify-center ${accentColor}`}>
                            {icon}
                        </div>
                    )}
                    <div className="space-y-1">
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-800">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-gray-500 text-sm md:text-base font-medium opacity-80">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className={`group flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 ${accentColor} text-sm font-bold shadow-sm hover:bg-white hover:shadow transition-all duration-300`}
                    >
                        Explore More
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>

            {/* ৩. গ্রিড লেআউট এবং কার্ড স্পেসিং ফিক্সড */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default function ProductList() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 py-10 px-4">
            {/* Featured Products - Sophisticated Purple */}
            <ProductSection
                title="Featured Picks"
                description="Handpicked excellence for your little ones"
                query={{ isFeatured: true }}
                viewAllLink="/products?isFeatured=true"
                icon={<Sparkles className="w-6 h-6" />}
                gradient="from-cyan-50/50 via-white to-white"
                accentColor="text-cyan-600"
            />

            {/* Trending Products - Modern Cyan/Teal */}
            <ProductSection
                title="Trending Style"
                description="What's making waves this season"
                query={{ trending: true }}
                viewAllLink="/products?trending=true"
                icon={<TrendingUp className="w-6 h-6" />}
                gradient="from-cyan-50/50 via-white to-white"
                accentColor="text-cyan-600"
            />

            {/* Best Deals - Warm Orange/Red */}
            <ProductSection
                title="Exclusive Deals"
                description="Premium quality at unbeatable prices"
                query={{ isBestDeal: true }}
                viewAllLink="/products?isBestDeal=true"
                icon={<Tag className="w-6 h-6" />}
                gradient="from-cyan-50/50 via-white to-white"
                accentColor="text-cyan-600"
            />
        </div>
    );
}
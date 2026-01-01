"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Category, Brand, Product, ProductResponse } from "@/types/type";
import { fetchWithConfig, buildQueryString } from "@/lib/config";
import ProductCard from "@/components/home/ProductCard";
import {
    X, Search, Loader2,
    SlidersHorizontal, Trash2, ListFilter
} from "lucide-react";
import ShopSkeleton from "@/components/skeleton/ShopSkeleton";

interface Props {
    categories: Category[];
    brands: Brand[];
}

export default function ShopPageClient({ categories, brands }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [category, setCategory] = useState<string>(searchParams.get("category") || "");
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.get("brands")?.split(",").filter(Boolean) || []
    );
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");
    const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "newest");
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(12);
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
    const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
    const [ageGroup, setAgeGroup] = useState<string>(searchParams.get("ageGroup") || "");
    const [trending, setTrending] = useState<string>(searchParams.get("trending") || "");
    const [featured, setFeatured] = useState<string>(searchParams.get("featured") || "");
    const [onSale, setOnSale] = useState<string>(searchParams.get("onSale") || "");

    const activeFilterCount = useMemo(() => {
        return [category, selectedBrands.length > 0, searchQuery, minPrice, maxPrice, ageGroup, trending, featured, onSale].filter(Boolean).length;
    }, [category, selectedBrands, searchQuery, minPrice, maxPrice, ageGroup, trending, featured, onSale]);

    const fetchProducts = useCallback(async () => {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);
        try {
            const params: Record<string, string | number | boolean> = {
                page,
                limit,
                category,
                brands: selectedBrands.join(","),
                search: searchQuery,
                sort: sortBy,
                minPrice,
                maxPrice,
                ageGroup,
                trending,
                featured,
                onSale
            };
            const queryString = buildQueryString(params);
            const data = await fetchWithConfig<ProductResponse>(`/products${queryString}`);
            setProducts(prev => (page === 1 ? data.products : [...prev, ...data.products]));
            setTotal(data.total || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [page, limit, category, selectedBrands, searchQuery, sortBy, minPrice, maxPrice, ageGroup, trending, featured, onSale]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // URL Sync
    useEffect(() => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
        if (searchQuery) params.set("search", searchQuery);
        if (sortBy) params.set("sort", sortBy);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (ageGroup) params.set("ageGroup", ageGroup);
        if (trending) params.set("trending", trending);
        if (featured) params.set("featured", featured);
        if (onSale) params.set("onSale", onSale);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [category, selectedBrands, searchQuery, sortBy, minPrice, maxPrice, ageGroup, trending, featured, onSale, pathname, router]);

    const handleClearFilters = () => {
        setCategory("");
        setSelectedBrands([]);
        setSearchQuery("");
        setMinPrice("");
        setMaxPrice("");
        setAgeGroup("");
        setTrending("");
        setFeatured("");
        setOnSale("");
        setPage(1);
    };

    if (loading && products.length === 0) return <ShopSkeleton />;

    return (
        <div className="min-h-screen bg-[#FDFDFF]">
            {/* 1. Gradient Hero Header */}
            <div className="bg-gradient-to-b from-babyshopSky/10 to-transparent py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                        The Collection
                    </h1>
                    <p className="text-gray-500 max-w-lg">
                        Curated premium products for your little ones, designed with love and safety in mind.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8">
                {/* 2. Floating Action Bar */}
                <div className="sticky top-4 z-40 mb-10">
                    <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-2xl p-3 flex flex-col md:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-babyshopSky rounded-xl transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 md:w-48 px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-babyshopSky"
                            >
                                <option value="newest">Newest Arrival</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>

                            <button
                                onClick={() => setIsFiltersOpen(true)}
                                className="lg:hidden flex items-center justify-center gap-2 px-5 py-2.5 bg-babyshopSky text-white rounded-xl font-semibold shadow-md shadow-babyshopSky/20"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-10">
                    {/* 3. Modern Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-8">
                        <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm sticky top-28">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <ListFilter className="w-5 h-5 text-babyshopSky" /> Filters
                                </h2>
                                {activeFilterCount > 0 && (
                                    <button onClick={handleClearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> Reset
                                    </button>
                                )}
                            </div>

                            {/* Price Range Section */}
                            <div className="mb-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Price Range</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                        <input
                                            type="number" placeholder="0" value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full pl-7 pr-2 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-babyshopSky"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                        <input
                                            type="number" placeholder="500" value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full pl-7 pr-2 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-babyshopSky"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category Pills */}
                            <div className="mb-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat._id}
                                            onClick={() => setCategory(category === cat._id ? "" : cat._id)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === cat._id
                                                ? "bg-babyshopSky text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brands Checkbox */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Popular Brands</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {brands.map((brand) => (
                                        <label key={brand._id} className="flex items-center group cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand._id)}
                                                onChange={() => {
                                                    setSelectedBrands(prev => prev.includes(brand._id) ? prev.filter(id => id !== brand._id) : [...prev, brand._id]);
                                                    setPage(1);
                                                }}
                                                className="w-4 h-4 rounded border-gray-300 text-babyshopSky focus:ring-babyshopSky"
                                            />
                                            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* 4. Product Grid Area */}
                    <main className="flex-1 pb-20">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-500 font-medium">
                                Showing <span className="text-gray-900">{products.length}</span> of {total} results
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-gray-100 rounded-full" />
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-500 mb-8">{"We couldn't find anything matching your current filters."}</p>
                                <button onClick={handleClearFilters} className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all">
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                    {loadingMore && Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="animate-pulse bg-gray-100 rounded-3xl aspect-[3/4]" />
                                    ))}
                                </div>

                                {products.length < total && (
                                    <div className="mt-16 text-center">
                                        <button
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={loadingMore}
                                            className="group relative px-10 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 hover:border-babyshopSky transition-all duration-300 hover:shadow-xl hover:shadow-babyshopSky/10 overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {loadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : "Load More Products"}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* 5. Mobile Drawer Logic (Simplified Tailwind classes) */}
            {isFiltersOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsFiltersOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl p-8 overflow-y-auto rounded-l-[2rem]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Filters</h2>
                            <button onClick={() => setIsFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        {/* Re-use sidebar content here or create a shared component */}
                    </div>
                </div>
            )}
        </div>
    );
}

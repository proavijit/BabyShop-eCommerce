"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchWithConfig, buildQueryString, API_ENDPOINTS } from "@/lib/config";
import { Product } from "@/types/type";
import Image from "next/image";

// Internal Skeleton Component for the results list
const SearchItemSkeleton = () => (
    <div className="flex items-center gap-3 p-3 animate-pulse border-b border-gray-50 last:border-0">
        <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-2 bg-gray-50 rounded w-1/4" />
        </div>
    </div>
);

export default function SearchInput() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedSearch.trim()) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            setIsOpen(true); // Open immediately to show the skeleton

            try {
                const queryString = buildQueryString({ search: debouncedSearch, perPage: 6 });
                const response = await fetchWithConfig<{ products: Product[] }>(`${API_ENDPOINTS.PRODUCTS}${queryString}`);
                setSuggestions(response.products || []);
            } catch (error) {
                console.error("Search error:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSearchResults();
    }, [debouncedSearch]);

    // ... (Keep your existing handleClickOutside, handleKeyDown, handleClear logic)

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="relative flex items-center bg-transparent">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Products..."
                    className="w-full pl-4 pr-12 py-2 bg-transparent outline-none text-sm text-gray-700"
                />

                <div className="absolute right-3 flex items-center gap-2">
                    {searchQuery && (
                        <button onClick={() => { setSearchQuery(""); setSuggestions([]); setIsOpen(false); }}>
                            <X className="h-4 w-4 text-gray-400" />
                        </button>
                    )}
                    {!searchQuery && <Search className="h-5 w-5 text-gray-400" />}
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-[100]">
                    {isLoading ? (
                        // Show 4 skeleton items while loading
                        <div className="bg-white">
                            {[...Array(4)].map((_, i) => (
                                <SearchItemSkeleton key={i} />
                            ))}
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            <div className="max-h-80 overflow-y-auto">
                                {suggestions.map((product, index) => (
                                    <button
                                        key={product._id}
                                        onClick={() => {
                                            router.push(`/product/${product.slug}`);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${selectedIndex === index ? "bg-gray-50" : ""}`}
                                    >
                                        <div className="relative w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                                            {product.images?.[0] && (
                                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                                            <p className="text-xs font-bold text-gray-900">${product.price?.toFixed(2)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => router.push(`/search?q=${searchQuery}`)} className="w-full py-2.5 text-xs text-center text-gray-500 hover:bg-gray-50 font-medium border-t border-gray-50">
                                View all results
                            </button>
                        </>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">No products found</div>
                    )}
                </div>
            )}
        </div>
    );
}
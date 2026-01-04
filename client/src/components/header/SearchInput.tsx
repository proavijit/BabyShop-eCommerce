"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchWithConfig, buildQueryString, API_ENDPOINTS } from "@/lib/config";
import { Product } from "@/types/type";
import Image from "next/image";

interface SearchResponse {
    products: Product[];
    total: number;
}

export default function SearchInput() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // [আগের লজিকগুলো (fetch, handling click, keyboard) অপরিবর্তিত থাকবে]
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedSearch.trim()) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }
            setIsLoading(true);
            try {
                const queryString = buildQueryString({ search: debouncedSearch, perPage: 6 });
                const response = await fetchWithConfig<SearchResponse>(`${API_ENDPOINTS.PRODUCTS}${queryString}`);
                setSuggestions(response.products || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSearchResults();
    }, [debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || suggestions.length === 0) return;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => prev < suggestions.length - 1 ? prev + 1 : prev);
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleProductClick(suggestions[selectedIndex]);
                } else if (searchQuery.trim()) {
                    handleViewAllResults();
                }
                break;
            case "Escape":
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const handleProductClick = (product: Product) => {
        router.push(`/product/${product.slug}`);
        setIsOpen(false);
        setSearchQuery("");
        setSuggestions([]);
    };

    const handleViewAllResults = () => {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsOpen(false);
    };

    const handleClear = () => {
        setSearchQuery("");
        setSuggestions([]);
        setIsOpen(false);
        setSelectedIndex(-1);
    };

    const getPrice = (product: Product): number => {
        return product.discountPrice && product.discountPrice > 0 ? product.discountPrice : (product.price || 0);
    };

    return (
        <div ref={searchRef} className="relative w-full" suppressHydrationWarning={true}>
            {/* Search Input - Cleaned Design */}
            <div className="relative flex items-center bg-transparent" suppressHydrationWarning={true}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
                    placeholder="Search Products..."
                    className="w-full pl-4 pr-12 py-2 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    suppressHydrationWarning={true}
                />

                <div className="absolute right-3 flex items-center gap-2">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                    ) : searchQuery ? (
                        <button onClick={handleClear} className="p-1 hover:bg-gray-100 rounded-full">
                            <X className="h-4 w-4 text-gray-400" />
                        </button>
                    ) : (
                        <Search className="h-5 w-5 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Suggestions Dropdown - Minimal Styling */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-[100]">
                    {suggestions.length > 0 ? (
                        <>
                            <div className="max-h-80 overflow-y-auto">
                                {suggestions.map((product, index) => (
                                    <button
                                        key={product._id}
                                        onClick={() => handleProductClick(product)}
                                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${selectedIndex === index ? "bg-gray-50" : ""}`}
                                    >
                                        <div className="relative w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                                            {product.images?.[0] ? (
                                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Search size={14} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                                            <p className="text-xs font-bold text-gray-900">${getPrice(product).toFixed(2)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleViewAllResults} className="w-full py-2.5 text-xs text-center text-gray-500 hover:bg-gray-50 font-medium border-t border-gray-50">
                                View all results
                            </button>
                        </>
                    ) : searchQuery.trim() && !isLoading ? (
                        <div className="p-4 text-center text-sm text-gray-500">No products found</div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
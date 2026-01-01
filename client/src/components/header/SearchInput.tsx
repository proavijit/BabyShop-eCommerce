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

    // Fetch search results
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedSearch.trim()) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            try {
                const queryString = buildQueryString({
                    search: debouncedSearch,
                    perPage: 6,
                });
                const response = await fetchWithConfig<SearchResponse>(
                    `${API_ENDPOINTS.PRODUCTS}${queryString}`
                );
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

    // Handle click outside
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

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
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
        if (product.discountPrice && product.discountPrice > 0) {
            return product.discountPrice;
        }
        return product.price || 0;
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-xl">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true);
                    }}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-12 py-3 rounded-full border-2 border-gray-200 focus:border-[#29beb3] focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
                {isLoading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#29beb3] animate-spin" />
                )}
                {!isLoading && searchQuery && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 backdrop-blur-sm bg-white/95">
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3 animate-pulse">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            <div className="max-h-96 overflow-y-auto">
                                {suggestions.map((product, index) => (
                                    <button
                                        key={product._id}
                                        onClick={() => handleProductClick(product)}
                                        className={`w-full flex items-center gap-4 p-4 hover:bg-[#29beb3]/10 transition-colors border-b border-gray-100 last:border-0 ${selectedIndex === index ? "bg-[#29beb3]/10" : ""
                                            }`}
                                    >
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Search className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-medium text-gray-900 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[#29beb3] font-semibold">
                                                    ${getPrice(product).toFixed(2)}
                                                </span>
                                                {product.discountPrice && product.discountPrice > 0 && product.price && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ${(product.price || 0).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {suggestions.length >= 6 && (
                                <button
                                    onClick={handleViewAllResults}
                                    className="w-full p-4 text-center text-[#29beb3] hover:bg-[#29beb3]/10 font-medium transition-colors border-t border-gray-100"
                                >
                                    View all results for &quot;{searchQuery}&quot;
                                </button>
                            )}
                        </>
                    ) : searchQuery.trim() ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            </div>
                            <p className="text-gray-600 font-medium">No results found</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Try different keywords
                            </p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
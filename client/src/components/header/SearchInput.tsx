"use client";

import { useState, useEffect, useRef, useCallback, memo, useId } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchWithConfig, buildQueryString, API_ENDPOINTS } from "@/lib/config";
import { Product } from "@/types/type";
import Image from "next/image";

/**
 * Memoized skeleton component for loading state
 * Prevents re-creation on every render
 */
const SearchItemSkeleton = memo(() => (
    <div className="flex items-center gap-3 p-3 animate-pulse border-b border-gray-50 last:border-0">
        <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-2 bg-gray-50 rounded w-1/4" />
        </div>
    </div>
));

SearchItemSkeleton.displayName = "SearchItemSkeleton";

/**
 * Memoized search result item component
 * Only re-renders when product, isSelected, or onClick changes
 */
const SearchResultItem = memo(
    ({
        product,
        isSelected,
        onClick,
        id,
    }: {
        product: Product;
        isSelected: boolean;
        onClick: () => void;
        id: string;
    }) => {
        const hasDiscount = product.discountPrice && product.discountPrice < product.price;

        return (
            <button
                id={id}
                onClick={onClick}
                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${isSelected ? "bg-gray-50" : ""
                    }`}
                role="option"
                aria-selected={isSelected}
            >
                <div className="relative w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                    {product.images?.[0] && (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    )}
                </div>
                <div className="flex-1 text-left">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-pink-600">
                            ${(product.discountPrice || product.price)?.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-[10px] text-gray-400 line-through decoration-gray-300">
                                ${product.price?.toFixed(2)}
                            </span>
                        )}
                        {product.discountPercentage > 0 && (
                            <span className="text-[8px] px-1 bg-pink-50 text-pink-500 rounded font-bold">
                                -{product.discountPercentage}%
                            </span>
                        )}
                    </div>
                </div>
            </button>
        );
    }
);

SearchResultItem.displayName = "SearchResultItem";

/**
 * Advanced search input component with:
 * - Debounced search (300ms)
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Click-outside detection
 * - Memoization for performance
 * - Accessibility (ARIA attributes)
 * - Loading states
 */
function SearchInputComponent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const uniqueId = useId();

    const debouncedSearch = useDebounce(searchQuery, 500);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch search results with debouncing
    useEffect(() => {
        let isActive = true;

        const fetchSearchResults = async () => {
            if (!debouncedSearch.trim()) {
                setSuggestions([]);
                setTotalResults(0);
                setIsOpen(false);
                setIsLoading(false);
                return;
            }

            try {
                const queryString = buildQueryString({
                    search: debouncedSearch,
                    limit: 6,
                });
                const response = await fetchWithConfig<{ products: Product[]; total: number }>(
                    `${API_ENDPOINTS.PRODUCTS}${queryString}`
                );

                if (isActive) {
                    setSuggestions(response.products || []);
                    setTotalResults(response.total || 0);
                    setSelectedIndex(-1);
                }
            } catch (error) {
                if (isActive) {
                    console.error("Search error:", error);
                    setSuggestions([]);
                    setTotalResults(0);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        fetchSearchResults();

        return () => {
            isActive = false;
        };
    }, [debouncedSearch]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && isOpen) {
            const selectedElement = document.getElementById(`${uniqueId}-item-${selectedIndex}`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    block: "nearest",
                    behavior: "smooth",
                });
            }
        }
    }, [selectedIndex, isOpen, uniqueId]);

    // Click outside handler to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation handler
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!isOpen || suggestions.length === 0) {
                // If dropdown is closed or no suggestions, Enter goes to search page
                if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
                    setIsOpen(false);
                }
                return;
            }

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
                        // Navigate to selected product
                        router.push(`/product/${suggestions[selectedIndex].slug}`);
                        setIsOpen(false);
                        setSearchQuery("");
                    } else if (searchQuery.trim()) {
                        // Navigate to search results page
                        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
                        setIsOpen(false);
                    }
                    break;

                case "Escape":
                    e.preventDefault();
                    setIsOpen(false);
                    setSelectedIndex(-1);
                    inputRef.current?.blur();
                    break;
            }
        },
        [isOpen, suggestions, selectedIndex, searchQuery, router]
    );

    // Clear search handler
    const handleClear = useCallback(() => {
        setSearchQuery("");
        setSuggestions([]);
        setTotalResults(0);
        setIsOpen(false);
        setIsLoading(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    }, []);

    // Navigate to product handler
    const handleProductClick = useCallback(
        (slug: string) => {
            router.push(`/product/${slug}`);
            setIsOpen(false);
            setSearchQuery("");
            setSelectedIndex(-1);
        },
        [router]
    );

    // View all results handler
    const handleViewAll = useCallback(() => {
        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
        setIsOpen(false);
    }, [router, searchQuery]);

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="relative flex items-center bg-transparent">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchQuery(value);
                        if (value.trim()) {
                            setIsOpen(true);
                            setIsLoading(true);
                        } else {
                            setIsOpen(false);
                            setIsLoading(false);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search Products..."
                    className="w-full pl-4 pr-12 py-2 bg-transparent outline-none text-sm text-gray-700"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls={`${uniqueId}-results`}
                    aria-activedescendant={
                        selectedIndex >= 0 ? `${uniqueId}-item-${selectedIndex}` : undefined
                    }
                />

                <div className="absolute right-3 flex items-center gap-2">
                    {searchQuery && (
                        <button
                            onClick={handleClear}
                            aria-label="Clear search"
                            className="hover:opacity-70 transition-opacity"
                        >
                            <X className="h-4 w-4 text-gray-400" />
                        </button>
                    )}
                    {!searchQuery && <Search className="h-5 w-5 text-gray-400" />}
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (
                <div
                    id={`${uniqueId}-results`}
                    role="listbox"
                    className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-[100]"
                >
                    {isLoading ? (
                        <div className="bg-white">
                            {[...Array(4)].map((_, i) => (
                                <SearchItemSkeleton key={i} />
                            ))}
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            <div className="max-h-80 overflow-y-auto">
                                {suggestions.map((product, index) => (
                                    <SearchResultItem
                                        key={product._id}
                                        id={`${uniqueId}-item-${index}`}
                                        product={product}
                                        isSelected={selectedIndex === index}
                                        onClick={() => handleProductClick(product.slug)}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={handleViewAll}
                                className="w-full py-2.5 text-[11px] text-center text-gray-500 hover:bg-gray-50 font-semibold border-t border-gray-50 flex items-center justify-center gap-2"
                            >
                                View all {totalResults > 0 && <span>({totalResults})</span>} results
                            </button>
                        </>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No products found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Export memoized component to prevent unnecessary re-renders
 * when parent component (Header) re-renders
 */
export default memo(SearchInputComponent);
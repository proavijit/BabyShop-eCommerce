import { useState, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface ShopFilters {
    category: string;
    selectedBrands: string[];
    searchQuery: string;
    sortBy: string;
    minPrice: string;
    maxPrice: string;
}

export interface UseShopFiltersReturn {
    filters: ShopFilters;
    setCategory: (category: string) => void;
    setSelectedBrands: (brands: string[]) => void;
    setSearchQuery: (query: string) => void;
    setSortBy: (sort: string) => void;
    setMinPrice: (price: string) => void;
    setMaxPrice: (price: string) => void;
    clearFilters: () => void;
    activeFilterCount: number;
    toggleBrand: (brandId: string) => void;
}

/**
 * Custom hook for managing shop page filters with URL synchronization
 * Optimized with useMemo and useCallback to prevent unnecessary re-renders
 */
export function useShopFilters(): UseShopFiltersReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize filters from URL params
    const [category, setCategory] = useState<string>(
        searchParams.get("category") || ""
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.get("brands")?.split(",").filter(Boolean) || []
    );
    const [searchQuery, setSearchQuery] = useState<string>(
        searchParams.get("search") || ""
    );
    const [sortBy, setSortBy] = useState<string>(
        searchParams.get("sort") || "newest"
    );
    const [minPrice, setMinPrice] = useState<string>(
        searchParams.get("minPrice") || ""
    );
    const [maxPrice, setMaxPrice] = useState<string>(
        searchParams.get("maxPrice") || ""
    );

    // Memoized active filter count
    const activeFilterCount = useMemo(() => {
        return [
            category,
            selectedBrands.length > 0,
            searchQuery,
            minPrice,
            maxPrice,
        ].filter(Boolean).length;
    }, [category, selectedBrands.length, searchQuery, minPrice, maxPrice]);

    // Memoized clear filters function
    const clearFilters = useCallback(() => {
        setCategory("");
        setSelectedBrands([]);
        setSearchQuery("");
        setMinPrice("");
        setMaxPrice("");
    }, []);

    // Memoized toggle brand function
    const toggleBrand = useCallback((brandId: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brandId)
                ? prev.filter((id) => id !== brandId)
                : [...prev, brandId]
        );
    }, []);

    // Combine all filters into a single object
    const filters = useMemo(
        () => ({
            category,
            selectedBrands,
            searchQuery,
            sortBy,
            minPrice,
            maxPrice,
        }),
        [category, selectedBrands, searchQuery, sortBy, minPrice, maxPrice]
    );

    return {
        filters,
        setCategory,
        setSelectedBrands,
        setSearchQuery,
        setSortBy,
        setMinPrice,
        setMaxPrice,
        clearFilters,
        activeFilterCount,
        toggleBrand,
    };
}

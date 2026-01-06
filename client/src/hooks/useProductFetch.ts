import { useState, useCallback, useEffect, useRef } from "react";
import { Product, ProductResponse } from "@/types/type";
import { fetchWithConfig, buildQueryString } from "@/lib/config";
import { ShopFilters } from "./useShopFilters";

export interface UseProductFetchReturn {
    products: Product[];
    loading: boolean;
    loadingMore: boolean;
    total: number;
    page: number;
    hasMore: boolean;
    loadMore: () => void;
    resetPage: () => void;
}

/**
 * Custom hook for fetching products with pagination
 * Optimized to prevent duplicate API calls
 * 
 * @param filters - Shop filters object
 * @param limit - Number of products per page (default: 12)
 * @returns Product fetch state and actions
 */
export function useProductFetch(
    filters: ShopFilters,
    limit: number = 12
): UseProductFetchReturn {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    // Track if a fetch is in progress to prevent duplicates
    const isFetchingRef = useRef(false);

    // Track previous filters to detect changes
    const prevFiltersRef = useRef<string>("");

    // Calculate if there are more products to load
    const hasMore = products.length < total;

    // Fetch products function
    const fetchProducts = useCallback(
        async (currentPage: number, isLoadMore: boolean = false) => {
            // Prevent duplicate fetches
            if (isFetchingRef.current) {
                return;
            }

            isFetchingRef.current = true;

            if (currentPage === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            try {
                const params = {
                    page: currentPage,
                    limit,
                    category: filters.category,
                    search: filters.searchQuery,
                    sort: filters.sortBy,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    brands: filters.selectedBrands.join(","),
                };

                const queryString = buildQueryString(params);
                const data = await fetchWithConfig<ProductResponse>(
                    `/products${queryString}`
                );

                setProducts((prev) =>
                    isLoadMore ? [...prev, ...data.products] : data.products
                );
                setTotal(data.total || 0);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
                setTotal(0);
            } finally {
                setLoading(false);
                setLoadingMore(false);
                isFetchingRef.current = false;
            }
        },
        [
            filters.category,
            filters.searchQuery,
            filters.sortBy,
            filters.minPrice,
            filters.maxPrice,
            filters.selectedBrands.join(","), // Use string to avoid array reference issues
            limit,
        ]
    );

    // Reset page when filters change
    const resetPage = useCallback(() => {
        setPage(1);
    }, []);

    // Load more products
    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && !isFetchingRef.current) {
            setPage((prev) => prev + 1);
        }
    }, [loadingMore, hasMore]);

    // Detect filter changes and reset page
    useEffect(() => {
        const currentFilters = JSON.stringify({
            category: filters.category,
            brands: filters.selectedBrands.join(","),
            search: filters.searchQuery,
            sort: filters.sortBy,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
        });

        // If filters changed, reset to page 1
        if (prevFiltersRef.current && prevFiltersRef.current !== currentFilters) {
            setPage(1);
        }

        prevFiltersRef.current = currentFilters;
    }, [
        filters.category,
        filters.selectedBrands,
        filters.searchQuery,
        filters.sortBy,
        filters.minPrice,
        filters.maxPrice,
    ]);

    // Fetch products when page changes or when it's the initial load
    useEffect(() => {
        fetchProducts(page, page > 1);
    }, [page, fetchProducts]);

    return {
        products,
        loading,
        loadingMore,
        total,
        page,
        hasMore,
        loadMore,
        resetPage,
    };
}

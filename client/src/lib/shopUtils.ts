/**
 * Utility functions for shop page
 * Pure functions for better testability and reusability
 */

/**
 * Calculate the number of active filters
 * @param filters - Object containing all filter values
 * @returns Number of active filters
 */
export function calculateActiveFilters(filters: {
    category?: string;
    selectedBrands?: string[];
    searchQuery?: string;
    minPrice?: string;
    maxPrice?: string;
}): number {
    return [
        filters.category,
        filters.selectedBrands && filters.selectedBrands.length > 0,
        filters.searchQuery,
        filters.minPrice,
        filters.maxPrice,
    ].filter(Boolean).length;
}

/**
 * Format price for display
 * @param price - Price number
 * @param currency - Currency symbol (default: $)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = "$"): string {
    return `${currency}${price.toFixed(2)}`;
}

/**
 * Check if price is within range
 * @param price - Product price
 * @param minPrice - Minimum price filter
 * @param maxPrice - Maximum price filter
 * @returns True if price is within range
 */
export function isPriceInRange(
    price: number,
    minPrice?: string,
    maxPrice?: string
): boolean {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    return price >= min && price <= max;
}

/**
 * Build query parameters for product fetching
 * @param filters - Shop filters
 * @param page - Current page
 * @param limit - Items per page
 * @returns Query parameters object
 */
export function buildProductQueryParams(
    filters: {
        category?: string;
        selectedBrands?: string[];
        searchQuery?: string;
        sortBy?: string;
        minPrice?: string;
        maxPrice?: string;
    },
    page: number = 1,
    limit: number = 12
): Record<string, string | number> {
    return {
        page,
        limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.searchQuery && { search: filters.searchQuery }),
        ...(filters.sortBy && { sort: filters.sortBy }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.selectedBrands &&
            filters.selectedBrands.length > 0 && {
            brands: filters.selectedBrands.join(","),
        }),
    };
}

/**
 * Get sort label for display
 * @param sortValue - Sort value
 * @returns Human-readable sort label
 */
export function getSortLabel(sortValue: string): string {
    const sortLabels: Record<string, string> = {
        newest: "Newest Arrival",
        "price-asc": "Price: Low to High",
        "price-desc": "Price: High to Low",
        popular: "Most Popular",
        rating: "Highest Rated",
    };
    return sortLabels[sortValue] || sortValue;
}

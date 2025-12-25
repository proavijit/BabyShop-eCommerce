import { fetchWithConfig, getAuthHeaders, API_ENDPOINTS } from "./config";
import { Product } from "@/types/type";
import Cookies from "js-cookie";

export interface WishlistResponse {
    success: boolean;
    wishlist: string[]; // Array of Product IDs
    message?: string;
}

export interface WishlistProductsResponse {
    success: boolean;
    products: Product[];
}

/**
 * Get the current user's wishlist (IDs only)
 */
export const getUserWishlist = async (): Promise<string[]> => {
    const token = Cookies.get("auth_token");
    if (!token) return [];

    try {
        const response = await fetchWithConfig<WishlistResponse>(API_ENDPOINTS.WISHLIST, {
            method: "GET",
            headers: getAuthHeaders(token),
        });
        return response.wishlist;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

/**
 * Add a product to the wishlist
 */
export const addToWishlist = async (productId: string): Promise<string[]> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("User not authenticated");

    const response = await fetchWithConfig<WishlistResponse>(`${API_ENDPOINTS.WISHLIST}/add`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ productId }),
    });
    return response.wishlist;
};

/**
 * Remove a product from the wishlist
 */
export const removeFromWishlist = async (productId: string): Promise<string[]> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("User not authenticated");

    const response = await fetchWithConfig<WishlistResponse>(`${API_ENDPOINTS.WISHLIST}/remove`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ productId }),
    });
    return response.wishlist;
};

/**
 * Clear the entire wishlist
 */
export const clearWishlist = async (): Promise<string[]> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("User not authenticated");

    const response = await fetchWithConfig<WishlistResponse>(`${API_ENDPOINTS.WISHLIST}/clear`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
    });
    return response.wishlist;
};

/**
 * Get full product details for a list of IDs (used for Wishlist Page)
 */
export const getWishlistProducts = async (productIds: string[]): Promise<Product[]> => {
    const token = Cookies.get("auth_token");
    if (!token || productIds.length === 0) return [];

    try {
        const response = await fetchWithConfig<WishlistProductsResponse>(`${API_ENDPOINTS.WISHLIST}/products`, {
            method: "POST",
            headers: getAuthHeaders(token),
            body: JSON.stringify({ productIds }),
        });
        return response.products;
    } catch (error) {
        console.error("Error fetching wishlist products:", error);
        return [];
    }
};

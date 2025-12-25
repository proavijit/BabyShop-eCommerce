import { fetchWithConfig, getAuthHeaders, API_ENDPOINTS } from "./config";
import { Product } from "@/types/type";
import Cookies from "js-cookie";

export interface CartItem {
    productId: Product; // Server populates this currently
    quantity: number;
    _id?: string;
}

export interface CartResponse {
    success: boolean;
    cart: CartItem[];
    message?: string;
}

/**
 * Get user's cart
 */
export const getCart = async (): Promise<CartResponse | null> => {
    const token = Cookies.get("auth_token");
    if (!token) return null;

    try {
        return await fetchWithConfig<CartResponse>(API_ENDPOINTS.CART, {
            method: "GET",
            headers: getAuthHeaders(token),
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return null;
    }
};

/**
 * Add item to cart
 */
export const addToCart = async (productId: string, quantity: number): Promise<CartResponse> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("User not authenticated");

    return await fetchWithConfig<CartResponse>(API_ENDPOINTS.CART, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ productId, quantity }),
    });
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (productId: string, quantity: number): Promise<CartResponse> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("User not authenticated");

    return await fetchWithConfig<CartResponse>(`${API_ENDPOINTS.CART}/update`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ productId, quantity }),
    });
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (productId: string): Promise<CartResponse> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("User not authenticated");

    return await fetchWithConfig<CartResponse>(`${API_ENDPOINTS.CART}/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
    });
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<CartResponse> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("User not authenticated");

    return await fetchWithConfig<CartResponse>(API_ENDPOINTS.CART, {
        method: "DELETE",
        headers: getAuthHeaders(token),
    });
};

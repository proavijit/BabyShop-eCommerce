import { fetchWithConfig, getAuthHeaders, API_ENDPOINTS } from "./config";
import Cookies from "js-cookie";

export interface ShippingAddress {
    _id?: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}

export interface OrderItem {
    _id?: string;
    productId: string; // ID when sending, Object when receiving usually but we can handle partials
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "paid" | "completed";

export interface Order {
    _id: string;
    userId: string;
    items: {
        productId: {
            _id: string;
            name: string;
            image: string;
            price: number;
        } | string;
        quantity: number;
        price: number;
    }[];
    total: number;
    status: OrderStatus;
    shippingAddress: ShippingAddress;
    paymentMethod?: string;
    isPaid?: boolean;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Get user orders
 */
export const getOrders = async (): Promise<Order[]> => {
    const token = Cookies.get("auth_token");
    if (!token) return [];

    try {
        // Backend returns the array directly
        return await fetchWithConfig<Order[]>(API_ENDPOINTS.ORDERS, {
            method: "GET",
            headers: getAuthHeaders(token),
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (id: string): Promise<Order | null> => {
    const token = Cookies.get("auth_token");
    if (!token) return null;

    try {
        return await fetchWithConfig<Order>(`${API_ENDPOINTS.ORDERS}/${id}`, {
            method: "GET",
            headers: getAuthHeaders(token),
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
};

/**
 * Create new order
 */
export interface CreateOrderPayload {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
}

export const createOrder = async (orderData: CreateOrderPayload): Promise<{ success: boolean; order: Order; message: string }> => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("User not authenticated");

    return await fetchWithConfig<{ success: boolean; order: Order; message: string }>(API_ENDPOINTS.ORDERS, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(orderData),
    });
};
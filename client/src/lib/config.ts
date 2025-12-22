
export interface ApiConfig {
    baseUrl: string;
    isProduction: boolean;
}

export const getApiConfig = (): ApiConfig => {
    const isClient = typeof window !== "undefined";

    let baseUrl = isClient
        ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
        : process.env.API_ENDPOINT ?? "http://localhost:8000/api";

    // Ensure API URL ends with /api
    if (!baseUrl.endsWith("/api")) {
        baseUrl = baseUrl.endsWith("/") ? `${baseUrl}api` : `${baseUrl}/api`;
    }

    const isProduction =
        process.env.NODE_ENV === "production" ||
        process.env.NEXT_PUBLIC_APP_ENV === "production";

    return {
        baseUrl,
        isProduction,
    };
};


export async function fetchWithConfig<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const { baseUrl } = getApiConfig();
    const endpoint = url.startsWith("/") ? `${baseUrl}${url}` : url;

    const defaultOptions: RequestInit = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const mergedOptions: RequestInit = {
        ...defaultOptions,
        ...options,
        headers: {
            ...(defaultOptions.headers ?? {}),
            ...(options?.headers ?? {}),
        },
    };

    // ✅ Only add Next.js revalidate option on the server
    if (typeof window === "undefined") {
        (mergedOptions as any).next = { revalidate: 100 };
    }

    const response = await fetch(endpoint, mergedOptions);

    if (!response.ok) {
        throw new Error(
            `API Error: ${response.status} ${response.statusText} - ${endpoint}`
        );
    }

    return response.json() as Promise<T>;
}


/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = (token?: string): Record<string, string> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Build query string from parameters
 */
export const buildQueryString = (
    params: Record<string, string | number | boolean>
): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
};

/**
 * Common API endpoints
 */
export const API_ENDPOINTS = {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",

    // Products
    PRODUCTS: "/products",
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,

    // Categories
    CATEGORIES: "/categories",
    CATEGORY_BY_ID: (id: string) => `/categories/${id}`,

    // Brands
    BRANDS: "/brands",
    BRAND_BY_ID: (id: string) => `/brands/${id}`,

    // Users
    USERS: "/users",
    USER_BY_ID: (id: string) => `/users/${id}`,
    USER_PROFILE: "/users/profile",

    // Orders
    ORDERS: "/orders",
    ORDER_BY_ID: (id: string) => `/orders/${id}`,
    USER_ORDERS: (userId: string) => `/orders/user/${userId}`,

    // Cart
    CART: "/cart",
    ADD_TO_CART: "/cart/add",
    REMOVE_FROM_CART: "/cart/remove",

    // Stats & Analytics
    STATS: "/stats",
    ANALYTICS: "/analytics",

    // Banners
    BANNERS: "/banners",
    BANNER_BY_ID: (id: string) => `/banners/${id}`,
} as const;
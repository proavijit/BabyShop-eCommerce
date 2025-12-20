import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios";

// Configuration utility for Admin API

// Get API Configuration for admin
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create configured axios instance
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: `${API_BASE_URL}/api`,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    // Add request interceptor to attach auth token
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem("adminToken");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor for better error handling
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError) => {
            // Handle specific error cases
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        // Unauthorized - clear token and redirect to login
                        localStorage.removeItem("adminToken");
                        localStorage.removeItem("adminUser");
                        window.location.href = "/login";
                        break;
                    case 403:
                        // Forbidden
                        console.error("Access forbidden:", error.response.data);
                        break;
                    case 404:
                        // Not found
                        console.error("Resource not found:", error.response.data);
                        break;
                    case 500:
                        // Server error
                        console.error("Server error:", error.response.data);
                        break;
                    default:
                        console.error("API error:", error.response.data);
                }
            } else if (error.request) {
                // Request made but no response received
                console.error("Network error:", error.message);
            } else {
                // Something else happened
                console.error("Error:", error.message);
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

// Create and export the configured axios instance
export const api = createAxiosInstance();

// Export API base URL for reference
export const API_URL = API_BASE_URL;

// Admin API endpoints - organized by resource
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        PROFILE: "/auth/profile",
        LOGOUT: "/auth/logout",
    },
    // User endpoints
    USERS: {
        BASE: "/users",
        BY_ID: (id: string) => `/users/${id}`,
        ADDRESS: (id: string) => `/users/${id}/address`,
    },
    // Product endpoints
    PRODUCTS: {
        BASE: "/products",
        BY_ID: (id: string) => `/products/${id}`,
        STATS: "/products/stats",
    },
    // Category endpoints
    CATEGORIES: {
        BASE: "/categories",
        BY_ID: (id: string) => `/categories/${id}`,
    },
    // Brand endpoints
    BRANDS: {
        BASE: "/brands",
        BY_ID: (id: string) => `/brands/${id}`,
    },
    // Order endpoints
    ORDERS: {
        BASE: "/orders",
        ADMIN: "/orders/admin",
        BY_ID: (id: string) => `/orders/${id}`,
        STATUS: (id: string) => `/orders/${id}/status`,
    },
    // Banner endpoints
    BANNERS: {
        BASE: "/banners",
        BY_ID: (id: string) => `/banners/${id}`,
    },
    // Stats endpoints
    STATS: {
        DASHBOARD: "/stats/dashboard",
        SALES: "/stats/sales",
    },
    // Analytics endpoints
    ANALYTICS: {
        BASE: "/analytics",
        USERS: "/analytics/users",
        PRODUCTS: "/analytics/products",
    },
    // Cart endpoints
    CART: {
        BASE: "/cart",
        BY_USER: (userId: string) => `/cart/${userId}`,
    },
    // Wishlist endpoints
    WISHLIST: {
        BASE: "/wishlist",
        BY_USER: (userId: string) => `/wishlist/${userId}`,
    },
    // Payment endpoints
    PAYMENT: {
        BASE: "/payment",
        PROCESS: "/payment/process",
    },
    UPLOAD: "/upload",
};

export default api;
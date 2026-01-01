import api, { API_ENDPOINTS } from "./config";

// Generic API response type
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
}

// ============================================
// AUTH API
// ============================================
export const authApi = {
    login: async (email: string, password: string) => {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
        return response.data;
    },

    register: async (name: string, email: string, password: string) => {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, { name, email, password });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        return response.data;
    },

    logout: async () => {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        return response.data;
    },
};

// ============================================
// USER API
// ============================================
export const userApi = {
    getAllUsers: async (params?: Record<string, unknown>) => {
        const response = await api.get(API_ENDPOINTS.USERS.BASE, { params });
        return response.data;
    },

    getUserById: async (id: string) => {
        const response = await api.get(API_ENDPOINTS.USERS.BY_ID(id));
        return response.data;
    },

    createUser: async <T extends object>(userData: T) => {
        const response = await api.post(API_ENDPOINTS.USERS.BASE, userData);
        return response.data;
    },

    updateUser: async <T extends object>(id: string, userData: T) => {
        const response = await api.put(API_ENDPOINTS.USERS.BY_ID(id), userData);
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete(API_ENDPOINTS.USERS.BY_ID(id));
        return response.data;
    },

    updateUserAddress: async (id: string, address: Record<string, unknown>) => {
        const response = await api.post(API_ENDPOINTS.USERS.ADDRESS(id), address);
        return response.data;
    },
};

// ============================================
// PRODUCT API
// ============================================
export const productApi = {
    getAllProducts: async (params?: Record<string, unknown>) => {
        const response = await api.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
        return response.data;
    },

    getProductById: async (id: string) => {
        const response = await api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
        return response.data;
    },

    createProduct: async (productData: Record<string, unknown> | FormData) => {
        const response = await api.post(API_ENDPOINTS.PRODUCTS.BASE, productData);
        return response.data;
    },

    updateProduct: async (id: string, productData: Record<string, unknown> | FormData) => {
        const response = await api.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), productData);
        return response.data;
    },

    deleteProduct: async (id: string) => {
        const response = await api.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
        return response.data;
    },

    getProductStats: async () => {
        const response = await api.get(API_ENDPOINTS.PRODUCTS.STATS);
        return response.data;
    },
};

// ============================================
// CATEGORY API
// ============================================
export const categoryApi = {
    getAllCategories: async (params?: Record<string, unknown>) => {
        const response = await api.get(API_ENDPOINTS.CATEGORIES.BASE, { params });
        return response.data;
    },

    getCategoryById: async (id: string) => {
        const response = await api.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
        return response.data;
    },

    createCategory: async <T extends object>(categoryData: T) => {
        const response = await api.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
        return response.data;
    },

    updateCategory: async <T extends object>(id: string, categoryData: T) => {
        const response = await api.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), categoryData);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await api.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
        return response.data;
    },
};

// ============================================
// BRAND API
// ============================================
export const brandApi = {
    getAllBrands: async () => {
        const response = await api.get(API_ENDPOINTS.BRANDS.BASE);
        return response.data;
    },

    getBrandById: async (id: string) => {
        const response = await api.get(API_ENDPOINTS.BRANDS.BY_ID(id));
        return response.data;
    },

    createBrand: async <T extends object>(brandData: T) => {
        const response = await api.post(API_ENDPOINTS.BRANDS.BASE, brandData);
        return response.data;
    },

    updateBrand: async <T extends object>(id: string, brandData: T) => {
        const response = await api.put(API_ENDPOINTS.BRANDS.BY_ID(id), brandData);
        return response.data;
    },

    deleteBrand: async (id: string) => {
        const response = await api.delete(API_ENDPOINTS.BRANDS.BY_ID(id));
        return response.data;
    },
};

// ============================================
// ORDER API
// ============================================
export const orderApi = {
    getAllOrders: async (params?: Record<string, unknown>) => {
        const response = await api.get(API_ENDPOINTS.ORDERS.BASE, { params });
        return response.data;
    },

    getAllOrdersAdmin: async (params?: Record<string, unknown>) => {
        const response = await api.get(API_ENDPOINTS.ORDERS.ADMIN, { params });
        return response.data;
    },

    getOrderById: async (id: string) => {
        const response = await api.get(API_ENDPOINTS.ORDERS.BY_ID(id));
        return response.data;
    },

    updateOrderStatus: async (id: string, status: string) => {
        const response = await api.put(API_ENDPOINTS.ORDERS.STATUS(id), { status });
        return response.data;
    },

    deleteOrder: async (id: string) => {
        const response = await api.delete(API_ENDPOINTS.ORDERS.BY_ID(id));
        return response.data;
    },
};

// ============================================
// BANNER API
// ============================================
export const bannerApi = {
    getAllBanners: async () => {
        const response = await api.get(API_ENDPOINTS.BANNERS.BASE);
        return response.data;
    },

    getBannerById: async (id: string) => {
        const response = await api.get(API_ENDPOINTS.BANNERS.BY_ID(id));
        return response.data;
    },

    createBanner: async <T extends object>(bannerData: T) => {
        const response = await api.post(API_ENDPOINTS.BANNERS.BASE, bannerData);
        return response.data;
    },

    updateBanner: async <T extends object>(id: string, bannerData: T) => {
        const response = await api.put(API_ENDPOINTS.BANNERS.BY_ID(id), bannerData);
        return response.data;
    },

    deleteBanner: async (id: string) => {
        const response = await api.delete(API_ENDPOINTS.BANNERS.BY_ID(id));
        return response.data;
    },
};

// ============================================
// STATS API
// ============================================
export const statsApi = {
    getDashboardStats: async () => {
        const response = await api.get(API_ENDPOINTS.STATS.DASHBOARD);
        return response.data;
    },

    getSalesStats: async (period?: string) => {
        const response = await api.get(API_ENDPOINTS.STATS.SALES, {
            params: { period },
        });
        return response.data;
    },
};

// ============================================
// ANALYTICS API
// ============================================
export const analyticsApi = {
    getAnalytics: async (params?: Record<string, unknown>) => {
        const response = await api.get(API_ENDPOINTS.ANALYTICS.BASE, { params });
        return response.data;
    },

    getUserAnalytics: async () => {
        const response = await api.get(API_ENDPOINTS.ANALYTICS.USERS);
        return response.data;
    },

    getProductAnalytics: async () => {
        const response = await api.get(API_ENDPOINTS.ANALYTICS.PRODUCTS);
        return response.data;
    },
};

// ============================================
// CART API
// ============================================
export const cartApi = {
    getCart: async (userId: string) => {
        const response = await api.get(API_ENDPOINTS.CART.BY_USER(userId));
        return response.data;
    },

    addToCart: async (userId: string, productId: string, quantity: number) => {
        const response = await api.post(API_ENDPOINTS.CART.BASE, {
            userId,
            productId,
            quantity,
        });
        return response.data;
    },

    updateCartItem: async (userId: string, productId: string, quantity: number) => {
        const response = await api.put(API_ENDPOINTS.CART.BY_USER(userId), {
            productId,
            quantity,
        });
        return response.data;
    },

    removeFromCart: async (userId: string, productId: string) => {
        const response = await api.delete(
            `${API_ENDPOINTS.CART.BY_USER(userId)}/item/${productId}`
        );
        return response.data;
    },

    clearCart: async (userId: string) => {
        const response = await api.delete(API_ENDPOINTS.CART.BY_USER(userId));
        return response.data;
    },
};

// ============================================
// WISHLIST API
// ============================================
export const wishlistApi = {
    getWishlist: async (userId: string) => {
        const response = await api.get(API_ENDPOINTS.WISHLIST.BY_USER(userId));
        return response.data;
    },

    addToWishlist: async (userId: string, productId: string) => {
        const response = await api.post(API_ENDPOINTS.WISHLIST.BASE, {
            userId,
            productId,
        });
        return response.data;
    },

    removeFromWishlist: async (userId: string, productId: string) => {
        const response = await api.delete(
            `${API_ENDPOINTS.WISHLIST.BY_USER(userId)}/item/${productId}`
        );
        return response.data;
    },
};

// ============================================
// PAYMENT API
// ============================================
export const paymentApi = {
    processPayment: async (paymentData: Record<string, unknown>) => {
        const response = await api.post(API_ENDPOINTS.PAYMENT.PROCESS, paymentData);
        return response.data;
    },

    getPaymentStatus: async (paymentId: string) => {
        const response = await api.get(`${API_ENDPOINTS.PAYMENT.BASE}/${paymentId}`);
        return response.data;
    },
};

// Export all APIs as a single object
export default {
    authApi,
    userApi,
    productApi,
    categoryApi,
    brandApi,
    orderApi,
    bannerApi,
    statsApi,
    analyticsApi,
    cartApi,
    wishlistApi,
    paymentApi,
};

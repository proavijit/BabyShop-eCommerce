import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { Product } from "@/types/type";
import * as cartApi from "./cartApi";
import * as wishlistApi from "./wishlistApi";
import * as orderApi from "./orderApi";
import { Order } from "./orderApi";

// --- 1. Interfaces & Types ---

// User Interface
export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    addresses?: Array<{
        _id?: string;
        street: string;
        city: string;
        country: string;
        postalCode: string;
        isDefault?: boolean;
    }>;
}

// --- 2. Helper Functions ---

/**
 * Maps server cart item to client cart item structure
 */
const mapServerCartItemToClient = (item: cartApi.CartItem) => ({
    product: item.productId,
    quantity: item.quantity,
    _id: item._id
});

// --- 3. User & Auth Store ---

interface UserState {
    authUser: User | null;
    auth_token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            authUser: null,
            auth_token: Cookies.get("auth_token") || null,
            isAuthenticated: !!Cookies.get("auth_token"),

            setAuth: (user, token) => {
                Cookies.set("auth_token", token, { expires: 7 });
                set({ authUser: user, auth_token: token, isAuthenticated: true });
                // Trigger fetches when logging in
                useCartStore.getState().fetchCart();
                useWishlistStore.getState().fetchWishlist();
                useOrderStore.getState().fetchOrders();
            },

            updateUser: (userUpdates) =>
                set((state) => ({
                    authUser: state.authUser ? { ...state.authUser, ...userUpdates } : null
                })),

            logout: () => {
                Cookies.remove("auth_token");
                set({ authUser: null, auth_token: null, isAuthenticated: false });
                useCartStore.getState().clearLocalCart();
                useWishlistStore.getState().clearLocalWishlist();
                useOrderStore.getState().clearLocalOrders();
            },
        }),
        { name: "user-storage" }
    )
);

// --- 4. Cart Store ---

export interface ClientCartItem {
    product: Product;
    quantity: number;
    _id?: string;
}

interface CartState {
    cartItems: ClientCartItem[];
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    clearLocalCart: () => void;
    getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            isLoading: false,

            fetchCart: async () => {
                if (!useUserStore.getState().isAuthenticated) return;
                set({ isLoading: true });
                try {
                    const response = await cartApi.getCart();
                    if (response && response.success) {
                        set({ cartItems: response.cart.map(mapServerCartItemToClient) });
                    }
                } catch (error) {
                    console.error("Failed to fetch cart:", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            addToCart: async (product, quantity = 1) => {
                // Optimistic update
                const items = get().cartItems;
                const existing = items.find((i) => i.product._id === product._id);
                let newItems;

                if (existing) {
                    newItems = items.map((i) =>
                        i.product._id === product._id
                            ? { ...i, quantity: i.quantity + quantity }
                            : i
                    );
                } else {
                    newItems = [...items, { product, quantity }];
                }
                set({ cartItems: newItems });

                // Sync with server
                if (useUserStore.getState().isAuthenticated) {
                    try {
                        const response = await cartApi.addToCart(product._id, quantity);
                        if (response.success) {
                            set({ cartItems: response.cart.map(mapServerCartItemToClient) });
                        }
                    } catch (error) {
                        console.error("Failed to sync cart", error);
                        get().fetchCart();
                    }
                }
            },

            removeFromCart: async (productId) => {
                // Optimistic
                set((state) => ({
                    cartItems: state.cartItems.filter((i) => i.product._id !== productId),
                }));

                if (useUserStore.getState().isAuthenticated) {
                    try {
                        const response = await cartApi.removeFromCart(productId);
                        if (response.success) {
                            set({ cartItems: response.cart.map(mapServerCartItemToClient) });
                        }
                    } catch (error) {
                        console.error("Failed to remove from cart on server", error);
                        get().fetchCart();
                    }
                }
            },

            updateQuantity: async (productId, quantity) => {
                // Optimistic
                set((state) => ({
                    cartItems: state.cartItems.map((i) =>
                        i.product._id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                }));

                if (useUserStore.getState().isAuthenticated) {
                    try {
                        const response = await cartApi.updateCartItem(productId, quantity);
                        if (response.success) {
                            set({ cartItems: response.cart.map(mapServerCartItemToClient) });
                        }
                    } catch (error) {
                        console.error("Failed to update cart quantity on server", error);
                        get().fetchCart();
                    }
                }
            },

            clearCart: async () => {
                set({ cartItems: [] });
                if (useUserStore.getState().isAuthenticated) {
                    try {
                        await cartApi.clearCart();
                    } catch (error) {
                        console.error("Failed to clear cart on server", error);
                        get().fetchCart();
                    }
                }
            },

            clearLocalCart: () => set({ cartItems: [] }),

            getCartTotal: () =>
                get().cartItems.reduce((acc, item) => {
                    const price = item.product.discountPrice ?? item.product.price;
                    return acc + price * item.quantity;
                }, 0),
        }),
        { name: "cart-storage" }
    )
);

// --- 5. Wishlist Store ---

interface WishlistState {
    wishlist: string[]; // IDs only
    wishlistProducts: Product[]; // Hydrated products
    isLoading: boolean;
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (product: Product) => Promise<void>;
    clearWishlist: () => Promise<void>;
    clearLocalWishlist: () => void;
    // Helper to check if in wishlist
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlist: [],
            wishlistProducts: [],
            isLoading: false,

            fetchWishlist: async () => {
                if (!useUserStore.getState().isAuthenticated) return;
                set({ isLoading: true });
                try {
                    const ids = await wishlistApi.getUserWishlist();
                    set({ wishlist: ids });

                    // Fetch details if we have IDs
                    if (ids.length > 0) {
                        const products = await wishlistApi.getWishlistProducts(ids);
                        set({ wishlistProducts: products });
                    } else {
                        set({ wishlistProducts: [] });
                    }
                } catch (error) {
                    console.error("Failed to fetch wishlist:", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            toggleWishlist: async (product) => {
                const { wishlist, wishlistProducts } = get();
                const exists = wishlist.includes(product._id);

                // Optimistic
                if (exists) {
                    set({
                        wishlist: wishlist.filter(id => id !== product._id),
                        wishlistProducts: wishlistProducts.filter(p => p._id !== product._id)
                    });
                } else {
                    set({
                        wishlist: [...wishlist, product._id],
                        wishlistProducts: [...wishlistProducts, product]
                    });
                }

                if (useUserStore.getState().isAuthenticated) {
                    try {
                        if (exists) {
                            await wishlistApi.removeFromWishlist(product._id);
                        } else {
                            await wishlistApi.addToWishlist(product._id);
                        }
                    } catch (error) {
                        console.error("Failed to toggle wishlist on server", error);
                        get().fetchWishlist(); // Revert
                    }
                }
            },

            clearWishlist: async () => {
                set({ wishlist: [], wishlistProducts: [] });
                if (useUserStore.getState().isAuthenticated) {
                    try {
                        await wishlistApi.clearWishlist();
                    } catch (error) {
                        console.error("Failed to clear wishlist on server", error);
                        get().fetchWishlist(); // Revert
                    }
                }
            },

            clearLocalWishlist: () => set({ wishlist: [], wishlistProducts: [] }),

            isInWishlist: (productId) => get().wishlist.includes(productId),
        }),
        { name: "wishlist-storage" }
    )
);

// --- 6. Order Store ---

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    fetchOrders: () => Promise<void>;
    addOrder: (order: Order) => void;
    clearLocalOrders: () => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
    orders: [],
    isLoading: false,
    fetchOrders: async () => {
        if (!useUserStore.getState().isAuthenticated) return;
        set({ isLoading: true });
        try {
            const orders = await orderApi.getOrders();
            set({ orders, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            set({ isLoading: false });
        }
    },
    addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    clearLocalOrders: () => set({ orders: [] }),
}));
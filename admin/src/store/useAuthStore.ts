import { create } from "zustand";
import { persist } from "zustand/middleware";
import api, { API_ENDPOINTS } from "../lib/config";

// User interface
export interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    avatar?: string;
    createdAt?: string;
}

// Auth state interface
interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
    setUser: (user: User) => void;
}

// Create auth store with Zustand
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,

            // Login action
            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
                        email,
                        password,
                    });

                    const { token, user } = response.data;

                    // Check if user is admin
                    if (!user.isAdmin) {
                        throw new Error("Access denied. Admin privileges required.");
                    }

                    // Store token in localStorage
                    localStorage.setItem("adminToken", token);
                    localStorage.setItem("adminUser", JSON.stringify(user));

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error: any) {
                    const errorMessage =
                        error.response?.data?.message ||
                        error.message ||
                        "Login failed. Please check your credentials.";

                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                        user: null,
                        token: null,
                    });
                    throw error;
                }
            },

            // Register action
            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
                        name,
                        email,
                        password,
                    });

                    const { token, user } = response.data;

                    // Check if user is admin
                    if (!user.isAdmin) {
                        throw new Error("Access denied. Admin privileges required.");
                    }

                    // Store token in localStorage
                    localStorage.setItem("adminToken", token);
                    localStorage.setItem("adminUser", JSON.stringify(user));

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error: any) {
                    const errorMessage =
                        error.response?.data?.message ||
                        error.message ||
                        "Registration failed. Please try again.";

                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                        user: null,
                        token: null,
                    });
                    throw error;
                }
            },

            // Logout action
            logout: () => {
                // Clear localStorage
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");

                // Reset state
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                    isLoading: false,
                });

                // Redirect to login
                window.location.href = "/login";
            },

            // Check authentication status
            checkAuth: async () => {
                const token = localStorage.getItem("adminToken");
                const userStr = localStorage.getItem("adminUser");

                if (!token || !userStr) {
                    set({
                        isAuthenticated: false,
                        user: null,
                        token: null,
                        isLoading: false,
                    });
                    return;
                }

                try {
                    const user = JSON.parse(userStr);

                    // Verify token is still valid by making a request
                    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);

                    // Check if user is admin
                    if (!response.data.isAdmin) {
                        throw new Error("Access denied. Admin privileges required.");
                    }

                    set({
                        user: response.data,
                        token,
                        isAuthenticated: true,
                        error: null,
                        isLoading: false,
                    });
                } catch (error: any) {
                    // Token is invalid or user is not admin, clear auth state
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminUser");

                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null,
                        isLoading: false,
                    });
                }
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },

            // Set user (for updates)
            setUser: (user: User) => {
                localStorage.setItem("adminUser", JSON.stringify(user));
                set({ user });
            },
        }),
        {
            name: "admin-auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;

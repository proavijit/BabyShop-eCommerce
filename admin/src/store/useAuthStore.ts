import { create } from "zustand";
import { persist } from "zustand/middleware";
import api, { API_ENDPOINTS } from "../lib/config";

// User interface - updated to match server Model
export interface User {
    _id: string;
    name: string;
    email: string;
    role: string; // Server uses role: "user", "admin", etc.
    isAdmin?: boolean; // Derived field for UI
    avatar?: string;
    createdAt?: string;
    address?: any[];
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

// Helper to normalize user data from server
const normalizeUser = (userData: any): User | null => {
    if (!userData) return null;

    // Check for both 'role' and 'isAdmin' depending on server version
    // The current server uses 'role'
    const isAdmin = userData.role === "admin" || userData.role === "proavijit" || userData.isAdmin === true;

    return {
        ...userData,
        isAdmin, // Ensure this is always a boolean for the UI
        role: userData.role || (userData.isAdmin ? "admin" : "user")
    };
};

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

                    // Server returns flat object: { _id, name, email, role, token, ... }
                    const data = response.data;
                    const normalizedUser = normalizeUser(data);

                    if (!normalizedUser) {
                        throw new Error("Invalid response from server");
                    }

                    // Check if user is admin
                    if (!normalizedUser.isAdmin) {
                        throw new Error("Access denied. Admin privileges required.");
                    }

                    const token = data.token;

                    // Store token in localStorage
                    localStorage.setItem("adminToken", token);
                    localStorage.setItem("adminUser", JSON.stringify(normalizedUser));

                    set({
                        user: normalizedUser,
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
                        role: "admin" // Forcing admin role for new admin accounts
                    });

                    // Server returns flat object on registration too
                    const data = response.data;
                    const normalizedUser = normalizeUser(data);

                    if (!normalizedUser) {
                        throw new Error("Invalid response from server");
                    }

                    // Store token in localStorage
                    const token = data.token;
                    localStorage.setItem("adminToken", token);
                    localStorage.setItem("adminUser", JSON.stringify(normalizedUser));

                    set({
                        user: normalizedUser,
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
                    // Start loading to prevent flicker
                    set({ isLoading: true });

                    // Verify token by making a request
                    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);

                    // Normalize user from profile response
                    const normalizedUser = normalizeUser(response.data);

                    if (!normalizedUser || !normalizedUser.isAdmin) {
                        throw new Error("Invalid session or insufficient permissions");
                    }

                    set({
                        user: normalizedUser,
                        token,
                        isAuthenticated: true,
                        error: null,
                        isLoading: false,
                    });
                } catch (error: any) {
                    // Token is invalid, clear auth state
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminUser");

                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null, // Don't show error for silent auto-auth failure
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
                const normalizedUser = normalizeUser(user);
                if (normalizedUser) {
                    localStorage.setItem("adminUser", JSON.stringify(normalizedUser));
                    set({ user: normalizedUser });
                }
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

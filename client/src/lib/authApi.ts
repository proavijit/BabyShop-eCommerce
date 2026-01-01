import { fetchWithConfig, API_ENDPOINTS, getAuthHeaders } from "./config";
import { User } from "./store";
import Cookies from "js-cookie";

export interface AuthResponse {
    success?: boolean;
    _id: string;
    name: string;
    email: string;
    role: string;
    address?: unknown[];
    avatar?: string;
    token: string;
    message?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchWithConfig<AuthResponse>(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify(credentials),
    });
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return fetchWithConfig<AuthResponse>(API_ENDPOINTS.REGISTER, {
        method: "POST",
        body: JSON.stringify(credentials),
    });
};

export const logout = async (): Promise<{ message: string }> => {
    // Note: Logout usually requires the token, but we handle token clear on client side mostly.
    // If server requires token to invalidate, it should be passed in headers.
    // fetchWithConfig handles headers if we extend it or pass token, 
    // but here we might need to rely on the store to provide the token if needed,
    // or just hit the endpoint if it relies on cookie.
    // Based on server implementation, it uses 'protect' middleware, so it needs token.
    // For now, we will assume the caller provides the token via global config or similar,
    // but fetchWithConfig doesn't automatically attach 'Authorization' from store.
    // We might need to update fetchWithConfig or pass headers here.
    // However, usually logout on JWT stateless is just client side.
    // But server has a route, so we call it.

    // We need to access the token. Ideally, pass it as arg or get from cookie/storage.
    // For simplicity, we'll try to get it from document.cookie or localStorage if feasible,
    // but better to let the store handle the API call with the token.
    // Actually, let's look at how other APIs do it. They don't seem to pass token explicitly in the args 
    // in previous files users created? 
    // Wait, `fetchWithConfig` in `config.ts` DOES NOT attach token automatically. 
    // `store.ts` adds headers? No.
    // `store.ts` uses `cartApi` etc.
    // Let's check `cartApi.ts` again.

    // Checking `cartApi.ts` usage in `store.ts`:
    // It calls `cartApi.getCart()`.
    // `cartApi.getCart()` calls `fetchWithConfig`.
    // `fetchWithConfig` does NOT attach token.
    // This is a BUG in the previous implementation if the server requires auth.
    // `cartApi` needs to attach auth headers.
    // I should fix this pattern.
    // I'll import `Cookies` here to get the token for now, or assume `fetchWithConfig` will be updated.
    // For now, I will explicitly get the token from cookies here.

    const token = typeof window !== 'undefined' ?
        Cookies.get('auth_token') : null;

    return fetchWithConfig<{ message: string }>(API_ENDPOINTS.LOGOUT, {
        method: "POST",
        headers: getAuthHeaders(token || ""),
    });
};

export const getUserProfile = async (token: string): Promise<User> => {
    return fetchWithConfig<User>(API_ENDPOINTS.USER_PROFILE, {
        method: "GET",
        headers: getAuthHeaders(token),
    });
};

export const uploadImage = async (file: File, token: string): Promise<{ success: boolean; url: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    return fetchWithConfig<{ success: boolean; url: string }>(API_ENDPOINTS.UPLOAD, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
};

export const updateUserProfile = async (userId: string, data: Partial<User>, token: string): Promise<{ success: boolean; user: User }> => {
    return fetchWithConfig<{ success: boolean; user: User }>(API_ENDPOINTS.USER_BY_ID(userId), {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });
};

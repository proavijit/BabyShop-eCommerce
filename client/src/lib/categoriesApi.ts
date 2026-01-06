import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Category } from "@/types/type";

export const getCategories = async (): Promise<Category[]> => {
    try {
        const data = await fetchData<Category[] | { categories: Category[] }>(API_ENDPOINTS.CATEGORIES, {
            next: {
                revalidate: 3600, // ISR: 1 hour
            },
        });

        if (Array.isArray(data)) {
            return data;
        } else if (data && typeof data === 'object' && 'categories' in data && Array.isArray(data.categories)) {
            return data.categories;
        }

        return [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
};

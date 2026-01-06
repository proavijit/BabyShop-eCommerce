import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Brand } from "@/types/type";

export const getBrands = async (): Promise<Brand[]> => {
    try {
        const data = await fetchData<Brand[]>(API_ENDPOINTS.BRANDS, {
            next: {
                revalidate: 3600, // ✅ ISR: 1 hour
            },
        });
        // Ensure we always return an array, even if API returns { brands: [] } structure unexpectedly
        // But based on types, it returns Brand[] directly or wrapped. Let's assume Brand[] as per generic.
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch brands:", error);
        return [];
    }
};

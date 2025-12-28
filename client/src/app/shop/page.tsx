import ShopPageClient from "@/components/page/shop/ShopPageClient";
import { fetchData } from "@/lib/api";
import { CategoryResponse, BrandResponse, Category, Brand } from "@/types/type";

const ShopPage = async () => {
    let categories: Category[] = [];
    let brands: Brand[] = [];

    try {
        const categoryData = await fetchData<CategoryResponse>("/categories");
        categories = categoryData.categories || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
    }

    try {
        const brandData = await fetchData<BrandResponse>("/brands");
        brands = brandData.brands || [];
    } catch (error) {
        console.error("Error fetching brands:", error);
    }

    return (
        <>
            <ShopPageClient categories={categories} brands={brands} />
        </>
    )
}

export default ShopPage


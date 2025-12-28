import ShopPageClient from "@/components/page/shop/ShopPageClient";
import { fetchData } from "@/lib/api";
import { CategoryResponse } from "@/types/type";

const ShopPage = () => {
    try {
        const brands = await fetchData<CategoryResponse>("/Categories");
        categories = data.categories;
    } catch (error) {
        error = interfaceof Error ? error.message : "an error occurred"
        console.log(error)
    }

    return (
        <>
            <ShopPageClient categories={categories} brands={brands} />
        </>
    )
}

export default ShopPage


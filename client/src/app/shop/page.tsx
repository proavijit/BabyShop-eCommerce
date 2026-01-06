import { Metadata } from "next";
import { getCategories } from "@/lib/categoriesApi";
import { getBrands } from "@/lib/brandsApi";
import ShopPageClient from "@/components/shop/ShopPageClient";

/**
 * SEO Metadata for shop page
 * Improves search engine indexing and social sharing
 */
export const metadata: Metadata = {
    title: "Shop Baby Products | Premium Baby Essentials | BabyShop",
    description:
        "Browse our curated collection of premium baby products. Find the perfect items for your little ones with our wide selection of safe, stylish, and high-quality baby essentials.",
    keywords: [
        "baby products",
        "baby essentials",
        "baby shop",
        "baby gear",
        "baby clothes",
        "baby toys",
        "baby care",
    ],
    openGraph: {
        title: "Shop Baby Products | BabyShop",
        description:
            "Premium baby essentials curated for safety and style. Shop now!",
        type: "website",
        url: "/shop",
    },
    twitter: {
        card: "summary_large_image",
        title: "Shop Baby Products | BabyShop",
        description: "Premium baby essentials curated for safety and style.",
    },
};

const ShopPage = async () => {
    const [categories, brands] = await Promise.all([
        getCategories(),
        getBrands(),
    ]);

    return <ShopPageClient categories={categories} brands={brands} />;
};

export default ShopPage;

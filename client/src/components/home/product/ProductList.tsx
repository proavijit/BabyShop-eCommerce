import { Suspense } from "react";
import ProductSection from "./ProductSection";
import ProductRowSkeleton from "./ProductRowSkeleton";
import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { CategoryResponse } from "@/types/type";

export default async function ProductList() {
    // Fetch categories for dynamic sections
    const categoryData = await fetchData<CategoryResponse>(API_ENDPOINTS.CATEGORIES, {
        next: { revalidate: 3600, tags: ["categories"] }
    });

    // Take top 4 categories to show on home page (excluding potentially massive lists)
    const homeCategories = categoryData?.categories?.slice(0, 4) || [];

    return (
        <div className="mt-10 space-y-20" suppressHydrationWarning={true}>
            {/* 1. Primary Sections (Fixed) */}
            <Suspense fallback={<ProductRowSkeleton />}>
                <ProductSection
                    title="Featured Picks"
                    description="Specially curated for your little one"
                    query={{ isFeatured: true }}
                    viewAllLink="/shop?featured=true"
                    isFirstSection={true} // Priority loading for LCP
                />
            </Suspense>

            <Suspense fallback={<ProductRowSkeleton />}>
                <ProductSection
                    title="Trending Style"
                    description="What other parents are loving"
                    query={{ trending: true }}
                    viewAllLink="/shop?trending=true"
                    accentColor="bg-amber-400"
                />
            </Suspense>

            {/* 2. Dynamic Category Sections */}
            {homeCategories.map((category, index) => (
                <Suspense key={category._id} fallback={<ProductRowSkeleton />}>
                    <ProductSection
                        title={category.name}
                        description={`Explore our collection of ${category.name.toLowerCase()}`}
                        query={{ category: category._id }}
                        viewAllLink={`/shop?category=${category.slug}`}
                        accentColor={index % 2 === 0 ? "bg-babyshopSky" : "bg-babyshopPurple"}
                    />
                </Suspense>
            ))}

            {/* Additional sections wrap in Suspense for independent streaming */}
        </div>
    );
}
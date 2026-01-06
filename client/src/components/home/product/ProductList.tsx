import { Suspense } from "react";
import ProductSection from "./ProductSection";
import ProductRowSkeleton from "./ProductRowSkeleton";

export default function ProductList() {
    return (
        <div className="mt-10 space-y-16" suppressHydrationWarning={true}>
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

            {/* Additional sections wrap in Suspense for independent streaming */}
        </div>
    );
}
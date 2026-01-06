"use client";

import { memo } from "react";
import { Product } from "@/types/type";
import ProductCard from "@/components/home/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";

interface ShopProductGridProps {
    products: Product[];
    total: number;
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onClearFilters: () => void;
}

/**
 * Memoized product grid component
 * Only re-renders when products array or loading states change
 */
function ShopProductGridComponent({
    products,
    total,
    loading,
    loadingMore,
    hasMore,
    onLoadMore,
    onClearFilters,
}: ShopProductGridProps) {
    // Empty state
    if (!loading && products.length === 0) {
        return (
            <div className="bg-card rounded-3xl p-20 text-center border-2 border-dashed flex flex-col items-center">
                <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-8">
                    Try adjusting your filters or search terms.
                </p>
                <Button onClick={onClearFilters} size="lg" className="rounded-2xl">
                    Clear all filters
                </Button>
            </div>
        );
    }

    return (
        <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium text-muted-foreground">
                    Showing <span className="text-foreground">{products.length}</span> of{" "}
                    {total} products
                </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="mt-16 text-center">
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={loadingMore}
                        onClick={onLoadMore}
                        className="px-12 py-6 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all"
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="animate-spin mr-2" /> Loading...
                            </>
                        ) : (
                            "Load More Products"
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}

/**
 * Memoized export with custom comparison
 * Prevents re-renders when products array reference changes but content is same
 */
export const ShopProductGrid = memo(
    ShopProductGridComponent,
    (prevProps, nextProps) => {
        return (
            prevProps.loading === nextProps.loading &&
            prevProps.loadingMore === nextProps.loadingMore &&
            prevProps.hasMore === nextProps.hasMore &&
            prevProps.total === nextProps.total &&
            prevProps.products.length === nextProps.products.length &&
            prevProps.products.every(
                (product, index) => product._id === nextProps.products[index]?._id
            )
        );
    }
);

ShopProductGrid.displayName = "ShopProductGrid";

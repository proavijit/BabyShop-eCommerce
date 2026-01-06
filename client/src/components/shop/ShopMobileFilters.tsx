"use client";

import { memo } from "react";
import { Category, Brand } from "@/types/type";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ShopFilters } from "./ShopFilters";
import { ListFilter } from "lucide-react";

interface ShopMobileFiltersProps {
    categories: Category[];
    brands: Brand[];
    category: string;
    selectedBrands: string[];
    minPrice: string;
    maxPrice: string;
    activeFilterCount: number;
    onCategoryChange: (category: string) => void;
    onBrandToggle: (brandId: string) => void;
    onMinPriceChange: (price: string) => void;
    onMaxPriceChange: (price: string) => void;
    onClearFilters: () => void;
    trigger?: React.ReactNode;
}

/**
 * Memoized mobile filter sheet component
 * Wraps ShopFilters in a mobile-friendly sheet
 */
function ShopMobileFiltersComponent({
    categories,
    brands,
    category,
    selectedBrands,
    minPrice,
    maxPrice,
    activeFilterCount,
    onCategoryChange,
    onBrandToggle,
    onMinPriceChange,
    onMaxPriceChange,
    onClearFilters,
    trigger,
}: ShopMobileFiltersProps) {
    return (
        <Sheet>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent side="right" className="w-[85%] sm:w-[400px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <ListFilter className="w-5 h-5 text-primary" /> Filters
                    </SheetTitle>
                </SheetHeader>
                <ShopFilters
                    categories={categories}
                    brands={brands}
                    category={category}
                    selectedBrands={selectedBrands}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    activeFilterCount={activeFilterCount}
                    onCategoryChange={onCategoryChange}
                    onBrandToggle={onBrandToggle}
                    onMinPriceChange={onMinPriceChange}
                    onMaxPriceChange={onMaxPriceChange}
                    onClearFilters={onClearFilters}
                    showHeader={false}
                />
            </SheetContent>
        </Sheet>
    );
}

/**
 * Memoized export
 */
export const ShopMobileFilters = memo(ShopMobileFiltersComponent);

ShopMobileFilters.displayName = "ShopMobileFilters";

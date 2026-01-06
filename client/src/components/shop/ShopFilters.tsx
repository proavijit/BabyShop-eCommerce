"use client";

import { memo } from "react";
import { Category, Brand } from "@/types/type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Trash2, ListFilter } from "lucide-react";

interface ShopFiltersProps {
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
    showHeader?: boolean;
}

/**
 * Memoized filter sidebar component
 * Only re-renders when props actually change
 * Used in both desktop sidebar and mobile sheet
 */
function ShopFiltersComponent({
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
    showHeader = true,
}: ShopFiltersProps) {
    return (
        <div className="space-y-8">
            {showHeader && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ListFilter className="w-5 h-5" /> Filters
                        </h2>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearFilters}
                                className="text-destructive hover:text-destructive/90 h-8 px-2"
                            >
                                <Trash2 className="w-3 h-3 mr-1" /> Reset
                            </Button>
                        )}
                    </div>
                    <Separator />
                </>
            )}

            {/* Price Range */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Price Range
                </h3>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => onMinPriceChange(e.target.value)}
                        className="h-9"
                        min="0"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => onMaxPriceChange(e.target.value)}
                        className="h-9"
                        min="0"
                    />
                </div>
            </div>

            <Separator />

            {/* Categories */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <Badge
                            key={cat._id}
                            variant={category === cat._id ? "default" : "secondary"}
                            className="cursor-pointer px-3 py-1 hover:opacity-80 transition-all"
                            onClick={() =>
                                onCategoryChange(category === cat._id ? "" : cat._id)
                            }
                        >
                            {cat.name}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Brands */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Brands
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {brands.map((brand) => (
                        <div key={brand._id} className="flex items-center space-x-3">
                            <Checkbox
                                id={`brand-${brand._id}`}
                                checked={selectedBrands.includes(brand._id)}
                                onCheckedChange={() => onBrandToggle(brand._id)}
                            />
                            <label
                                htmlFor={`brand-${brand._id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {brand.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Memoized export with custom comparison
 * Prevents re-renders when reference changes but values are the same
 */
export const ShopFilters = memo(ShopFiltersComponent, (prevProps, nextProps) => {
    return (
        prevProps.category === nextProps.category &&
        prevProps.minPrice === nextProps.minPrice &&
        prevProps.maxPrice === nextProps.maxPrice &&
        prevProps.activeFilterCount === nextProps.activeFilterCount &&
        prevProps.selectedBrands.length === nextProps.selectedBrands.length &&
        prevProps.selectedBrands.every((brand, index) => brand === nextProps.selectedBrands[index])
    );
});

ShopFilters.displayName = "ShopFilters";

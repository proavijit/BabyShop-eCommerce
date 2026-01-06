"use client";

import { memo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

interface ShopSearchBarProps {
    searchQuery: string;
    sortBy: string;
    onSearchChange: (query: string) => void;
    onSortChange: (sort: string) => void;
    onMobileFilterClick?: () => void;
    showMobileFilter?: boolean;
}

/**
 * Memoized search and sort bar component
 * Implements internal debouncing for search input
 * Only triggers search after user stops typing for 300ms
 */
function ShopSearchBarComponent({
    searchQuery,
    sortBy,
    onSearchChange,
    onSortChange,
    onMobileFilterClick,
    showMobileFilter = true,
}: ShopSearchBarProps) {
    // Local state for immediate input feedback
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    // Sync local state when external searchQuery changes (e.g., clear filters)
    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    // Debounce the search query
    useEffect(() => {
        // Only trigger if local value differs from parent value
        if (localSearchQuery === searchQuery) {
            return;
        }

        const timer = setTimeout(() => {
            onSearchChange(localSearchQuery);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [localSearchQuery, searchQuery, onSearchChange]);

    return (
        <div className="sticky top-4 z-40 mb-10">
            <div className="bg-background/95 backdrop-blur-md border shadow-lg rounded-2xl p-3 flex flex-col md:flex-row items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        className="pl-11 h-11 border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                    />
                </div>

                {/* Sort and Filter Controls */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Sort Select */}
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="w-full md:w-[200px] h-11 rounded-xl bg-muted/50 border-none">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest Arrival</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Mobile Filter Button */}
                    {showMobileFilter && onMobileFilterClick && (
                        <Button
                            variant="default"
                            className="lg:hidden h-11 px-6 rounded-xl gap-2"
                            onClick={onMobileFilterClick}
                        >
                            <SlidersHorizontal className="w-4 h-4" /> Filter
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Memoized export - only re-renders when props change
 */
export const ShopSearchBar = memo(ShopSearchBarComponent);

ShopSearchBar.displayName = "ShopSearchBar";

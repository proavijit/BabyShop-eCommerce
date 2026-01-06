"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Category, Brand, Product, ProductResponse } from "@/types/type";
import { fetchWithConfig, buildQueryString } from "@/lib/config";

// shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Icons & Custom Components
import ProductCard from "@/components/home/product/ProductCard";
import ShopSkeleton from "@/components/skeleton/ShopSkeleton";
import { X, Search, Loader2, SlidersHorizontal, Trash2, ListFilter, ShoppingBag } from "lucide-react";

interface Props {
  categories: Category[];
  brands: Brand[];
}

export default function ShopPageClient({ categories, brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<number>(1);

  // Filters
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",").filter(Boolean) || []
  );
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");

  const activeFilterCount = useMemo(() => {
    return [category, selectedBrands.length > 0, searchQuery, minPrice, maxPrice].filter(Boolean).length;
  }, [category, selectedBrands, searchQuery, minPrice, maxPrice]);

  // --- Actions ---
  const fetchProducts = useCallback(async () => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const params = {
        page, limit: 12, category, search: searchQuery,
        sort: sortBy, minPrice, maxPrice, brands: selectedBrands.join(",")
      };
      const queryString = buildQueryString(params);
      const data = await fetchWithConfig<ProductResponse>(`/products${queryString}`);
      setProducts(prev => (page === 1 ? data.products : [...prev, ...data.products]));
      setTotal(data.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, category, selectedBrands, searchQuery, sortBy, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy) params.set("sort", sortBy);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [category, selectedBrands, searchQuery, sortBy, minPrice, maxPrice, pathname, router]);

  const handleClearFilters = () => {
    setCategory(""); setSelectedBrands([]); setSearchQuery("");
    setMinPrice(""); setMaxPrice(""); setPage(1);
  };

  if (loading && products.length === 0) return <ShopSkeleton />;

  // Shared Filter Component for Sidebar/Mobile
  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="h-9" />
          <span className="text-muted-foreground">-</span>
          <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-9" />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat._id}
              variant={category === cat._id ? "default" : "secondary"}
              className="cursor-pointer px-3 py-1 hover:opacity-80 transition-all"
              onClick={() => { setCategory(category === cat._id ? "" : cat._id); setPage(1); }}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Brands</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {brands.map((brand) => (
            <div key={brand._id} className="flex items-center space-x-3">
              <Checkbox
                id={brand._id}
                checked={selectedBrands.includes(brand._id)}
                onCheckedChange={() => {
                  setSelectedBrands(prev => prev.includes(brand._id) ? prev.filter(id => id !== brand._id) : [...prev, brand._id]);
                  setPage(1);
                }}
              />
              <label htmlFor={brand._id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">The Collection</h1>
          <p className="text-muted-foreground max-w-lg">Premium essentials for your little ones, curated for safety and style.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Floating Search & Sort Bar */}
        <div className="sticky top-4 z-40 mb-10">
          <div className="bg-background/95 backdrop-blur-md border shadow-lg rounded-2xl p-3 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-11 h-11 border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px] h-11 rounded-xl bg-muted/50 border-none">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrival</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="default" className="lg:hidden h-11 px-6 rounded-xl gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] sm:w-[400px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                      <ListFilter className="w-5 h-5 text-primary" /> Filters
                    </SheetTitle>
                  </SheetHeader>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-card border rounded-3xl p-7 sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold flex items-center gap-2"><ListFilter className="w-5 h-5" /> Filters</h2>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-destructive hover:text-destructive/90 h-8 px-2">
                    <Trash2 className="w-3 h-3 mr-1" /> Reset
                  </Button>
                )}
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 pb-20">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-muted-foreground">
                Showing <span className="text-foreground">{products.length}</span> of {total} products
              </p>
            </div>

            {products.length === 0 ? (
              <div className="bg-card rounded-3xl p-20 text-center border-2 border-dashed flex flex-col items-center">
                <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-8">Try adjusting your filters or search terms.</p>
                <Button onClick={handleClearFilters} size="lg" className="rounded-2xl">Clear all filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {products.length < total && (
                  <div className="mt-16 text-center">
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={loadingMore}
                      onClick={() => setPage(p => p + 1)}
                      className="px-12 py-6 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all"
                    >
                      {loadingMore ? <Loader2 className="animate-spin mr-2" /> : "Load More Products"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

// Modular Components
import { ProductTable, ProductDialog, ProductDeleteDialog } from "@/pages/Products/components";

// Types and API
import type { Product, ProductFormData, ProductStats } from "../types/product";
import { productApi } from "../lib/api";

export const Products: React.FC = () => {
    // State for products and stats
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<ProductStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    // Pagination and filtering state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state
    const initialFormData: ProductFormData = {
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        category: "",
        brand: "",
        images: [],
        stock: 0,
        ageGroup: "",
        isFeatured: false,
        isTrending: false,
        isBestDeal: false,
    };
    const [formData, setFormData] = useState<ProductFormData>(initialFormData);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productApi.getAllProducts({
                page: currentPage,
                limit: 20,
                search: searchTerm,
                sort: sortOrder,
            });
            setProducts(response.products);
            setTotalPages(response.pages);
            setTotalCount(response.total);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, sortOrder]);

    // Fetch stats
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const data = await productApi.getProductStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, [fetchProducts, fetchStats]);

    // Handlers
    const handleRefresh = () => {
        fetchProducts();
        fetchStats();
        toast.success("Data refreshed");
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setFormData(initialFormData);
        setIsDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice || 0,
            category: typeof product.category === 'object' ? product.category._id : product.category,
            brand: typeof product.brand === 'object' ? product.brand._id : (product.brand || ""),
            images: product.images,
            stock: product.stock,
            ageGroup: product.ageGroup || "",
            isFeatured: product.isFeatured,
            isTrending: product.isTrending,
            isBestDeal: product.isBestDeal,
        });
        setIsDialogOpen(true);
    };

    const handleDeleteProduct = (id: string) => {
        setDeletingProductId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = editingProduct
            ? productApi.updateProduct(editingProduct._id, formData)
            : productApi.createProduct(formData);

        toast.promise(promise, {
            loading: editingProduct ? "Updating product..." : "Creating product...",
            success: () => {
                setIsSubmitting(false);
                setIsDialogOpen(false);
                fetchProducts();
                fetchStats();
                return editingProduct ? "Product updated successfully" : "Product created successfully";
            },
            error: (err) => {
                setIsSubmitting(false);
                return err.response?.data?.message || "Something went wrong";
            },
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deletingProductId) return;
        setIsDeleting(true);

        toast.promise(productApi.deleteProduct(deletingProductId), {
            loading: "Deleting product...",
            success: () => {
                setIsDeleting(false);
                setIsDeleteDialogOpen(false);
                setDeletingProductId(null);
                fetchProducts();
                fetchStats();
                return "Product deleted successfully";
            },
            error: "Failed to delete product",
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Products"
                    value={stats?.totalProducts}
                    loading={statsLoading}
                    icon={<Package className="h-5 w-5 text-blue-500" />}
                    color="blue"
                />
                <StatsCard
                    title="Low Stock"
                    value={stats?.lowStock}
                    loading={statsLoading}
                    icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
                    color="amber"
                    badge="Action Needed"
                />
                <StatsCard
                    title="Out of Stock"
                    value={stats?.outOfStock}
                    loading={statsLoading}
                    icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                    color="red"
                    badge="Critical"
                />
                <StatsCard
                    title="Featured Products"
                    value={stats?.featured}
                    loading={statsLoading}
                    icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
                    color="emerald"
                />
            </div>

            <Separator />

            {/* Main Content */}
            <Card>
                <CardContent className="pt-6">
                    <ProductTable
                        products={products}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        onAddProduct={handleAddProduct}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                        onRefresh={handleRefresh}
                    />
                </CardContent>
            </Card>

            {/* Dialogs */}
            <ProductDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingProduct={editingProduct}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            <ProductDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                productName={products.find(p => p._id === deletingProductId)?.name || "this product"}
            />
        </div>
    );
};

// Internal Stats Card Component
const StatsCard = ({
    title,
    value,
    loading,
    icon,
    color,
    badge
}: {
    title: string;
    value?: number;
    loading: boolean;
    icon: React.ReactNode;
    color: string;
    badge?: string;
}) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-${color}-500/10`}>
                    {icon}
                </div>
                {badge && (
                    <Badge variant={color === 'red' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {badge}
                    </Badge>
                )}
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="flex items-baseline gap-2">
                    {loading ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                        <h3 className="text-2xl font-bold">{value?.toLocaleString() || 0}</h3>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
);



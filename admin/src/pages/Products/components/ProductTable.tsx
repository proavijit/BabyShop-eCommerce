import React from 'react';
import {
    Search,
    Plus,
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
    Package,
    RefreshCw,
    MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Product } from '../../../types/product';

interface ProductTableProps {
    products: Product[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (value: 'asc' | 'desc') => void;
    currentPage: number;
    setCurrentPage: (value: number | ((prev: number) => number)) => void;
    totalPages: number;
    totalCount: number;
    onAddProduct: () => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
    onRefresh: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    loading,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
    onRefresh,
}) => {
    const getStockBadgeVariant = (stock: number) => {
        if (stock === 0) return 'destructive';
        if (stock < 10) return 'secondary';
        return 'default';
    };

    const getStockLabel = (stock: number) => {
        if (stock === 0) return 'Out of Stock';
        if (stock < 10) return 'Low Stock';
        return 'In Stock';
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Products</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your product inventory ({totalCount} total)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={onAddProduct}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={sortOrder} onValueChange={(val: 'asc' | 'desc') => setSortOrder(val)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Oldest First</SelectItem>
                        <SelectItem value="desc">Newest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr className="border-b">
                                <th className="text-left p-4 font-medium text-sm">Image</th>
                                <th className="text-left p-4 font-medium text-sm">Name</th>
                                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Category</th>
                                <th className="text-right p-4 font-medium text-sm">Price</th>
                                <th className="text-center p-4 font-medium text-sm hidden sm:table-cell">Stock</th>
                                <th className="text-right p-4 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b">
                                        <td colSpan={6} className="p-4">
                                            <div className="flex items-center gap-4 animate-pulse">
                                                <div className="w-12 h-12 bg-muted rounded" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 bg-muted rounded w-1/3" />
                                                    <div className="h-3 bg-muted rounded w-1/4" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">No products found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="border-b hover:bg-muted/50">
                                        <td className="p-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={product.images?.[0] || ''}
                                                    alt={product.name}
                                                />
                                                <AvatarFallback>
                                                    {product.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{product.name}</span>
                                                    <div className="flex gap-1">
                                                        {product.isTrending && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                🔥
                                                            </Badge>
                                                        )}
                                                        {product.isFeatured && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                ⭐
                                                            </Badge>
                                                        )}
                                                        {product.isBestDeal && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                💰
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground md:hidden">
                                                    {(product.category && typeof product.category === 'object')
                                                        ? product.category.name
                                                        : 'Unknown'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <Badge variant="outline">
                                                {(product.category && typeof product.category === 'object')
                                                    ? product.category.name
                                                    : 'Unknown'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-medium">
                                                    ৳{product.price.toLocaleString()}
                                                </span>
                                                {product.discountPrice !== undefined && product.discountPrice > 0 && (
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        ৳{product.discountPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center hidden sm:table-cell">
                                            <div className="flex flex-col items-center gap-1">
                                                <Badge variant={getStockBadgeVariant(product.stock)}>
                                                    {getStockLabel(product.stock)}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {product.stock} units
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEditProduct(product)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => onEditProduct(product)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => onDeleteProduct(product._id)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * 20 + 1, totalCount)} to{' '}
                    {Math.min(currentPage * 20, totalCount)} of {totalCount} products
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm">
                        Page {currentPage} of {totalPages || 1}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

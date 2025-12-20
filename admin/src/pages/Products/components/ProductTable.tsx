import React from 'react';
import {
    Search,
    Plus,
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Package,
    RefreshCw,
    SortAsc,
    SortDesc,
    Box,
    Tag,
    AlertCircle
} from 'lucide-react';
import type { Product } from '../../../types/product';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).format(new Date(dateString));
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
        if (stock < 10) return { label: `Low Stock (${stock})`, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
        return { label: `In Stock (${stock})`, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Product Management
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 font-bold ml-2 h-7 rounded-lg">
                            {totalCount} Total
                        </Badge>
                    </h1>
                    <p className="text-slate-400 text-sm">Manage your inventory, prices, and product details</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={onRefresh}
                        disabled={loading}
                        className="h-12 w-12 rounded-xl bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all border shadow-sm p-0 flex items-center justify-center"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        onClick={onAddProduct}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-600/20 group gap-2"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Add New Product
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-20" />
                    <Input
                        placeholder="Search products by name, brand, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-blue-500/20 transition-all shadow-inner w-full"
                    />
                </div>

                <div className="w-full md:w-[240px]">
                    <Select value={sortOrder} onValueChange={(val: 'asc' | 'desc') => setSortOrder(val)}>
                        <SelectTrigger
                            className="w-full bg-white/5 border-white/10 text-white h-12 px-4 rounded-xl focus:ring-blue-500/20 flex items-center gap-2"
                        >
                            <div className="flex items-center gap-2">
                                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 text-slate-400" /> : <SortDesc className="w-4 h-4 text-slate-400" />}
                                <SelectValue placeholder="Sort Order" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                            <SelectItem value="asc" className="focus:bg-white/10 focus:text-white cursor-pointer">
                                Ascending (Oldest)
                            </SelectItem>
                            <SelectItem value="desc" className="focus:bg-white/10 focus:text-white cursor-pointer">
                                Descending (Newest)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-b border-white/10 hover:bg-transparent">
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest w-[80px]">Product</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Details</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Price</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Inventory</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-white/5">
                                        <TableCell colSpan={5} className="px-6 py-8">
                                            <div className="flex items-center gap-4 animate-pulse">
                                                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="w-48 h-4 bg-white/10 rounded" />
                                                    <div className="w-32 h-3 bg-white/10 rounded" />
                                                </div>
                                                <div className="w-24 h-8 bg-white/10 rounded-xl" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-medium italic">No products found in the database.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : products.map((product) => {
                                const stockInfo = getStockStatus(product.stock);
                                return (
                                    <TableRow key={product._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="px-6 py-4">
                                            <Avatar className="w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-lg">
                                                <AvatarImage
                                                    src={product.images && product.images[0] ? product.images[0] : ''}
                                                    alt={product.name}
                                                    className="rounded-xl object-contain bg-white p-1"
                                                />
                                                <AvatarFallback className="bg-[#1e293b] text-white font-bold text-lg rounded-xl">
                                                    {product.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-white font-bold text-sm tracking-tight line-clamp-1">{product.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-slate-400 h-5 px-2">
                                                        {typeof product.category === 'object' ? product.category.name : 'Unknown Category'}
                                                    </Badge>
                                                    {product.brand && (
                                                        <Badge variant="outline" className="text-[10px] bg-blue-500/10 border-blue-500/20 text-blue-400 h-5 px-2">
                                                            {typeof product.brand === 'object' ? product.brand.name : 'Unknown Brand'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold text-sm">৳{product.price}</span>
                                                    {product.isFeatured && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Tag className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                                                                </TooltipTrigger>
                                                                <TooltipContent className="bg-amber-500 text-white border-0 font-bold text-[10px]">
                                                                    Featured Product
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </div>
                                                {product.discountPrice ? (
                                                    <span className="text-[10px] text-slate-500 line-through">৳{product.discountPrice}</span>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${stockInfo.color}`}
                                            >
                                                {stockInfo.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEditProduct(product)}
                                                    className="h-9 w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDeleteProduct(product._id)}
                                                    className="h-9 w-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer / Pagination */}
                <div className="px-6 py-6 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-300">{(currentPage - 1) * 20 + 1}</span> to <span className="text-slate-300">{Math.min(currentPage * 20, totalCount)}</span> of <span className="text-slate-300">{totalCount}</span> products
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="h-10 w-10 rounded-xl bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all min-w-[40px] ${currentPage === i + 1
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 border-0'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="h-10 w-10 rounded-xl bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

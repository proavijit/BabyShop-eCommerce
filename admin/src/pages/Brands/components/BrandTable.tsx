import React from 'react';
import {
    Search,
    Plus,
    MoreVertical,
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Image as ImageIcon
} from 'lucide-react';
import type { Brand } from '../../../types/brand';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface BrandTableProps {
    brands: Brand[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    currentPage: number;
    setCurrentPage: (value: number | ((prev: number) => number)) => void;
    totalPages: number;
    paginatedBrands: Brand[];
    onAddBrand: () => void;
    onEditBrand: (brand: Brand) => void;
    onDeleteBrand: (brandId: string) => void;
}

export const BrandTable: React.FC<BrandTableProps> = ({
    brands,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedBrands,
    onAddBrand,
    onEditBrand,
    onDeleteBrand,
}) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).format(new Date(dateString));
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header: Stacks on mobile, row on MD+ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Brand Management</h1>
                    <p className="text-slate-400 text-xs md:text-sm">Manage your product brands and logos</p>
                </div>
                <Button
                    onClick={onAddBrand}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 md:h-12 px-6 rounded-xl shadow-lg shadow-blue-600/20 group gap-2"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Add New Brand
                </Button>
            </div>

            {/* Controls: Ensuring the input doesn't squash */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <Input
                    placeholder="Search brands by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-blue-500/20 transition-all shadow-inner w-full"
                />
            </div>

            {/* Table Container: Using overflow-x-auto for horizontal scrolling on tiny screens */}
            <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <Table className="min-w-[600px] md:min-w-full">
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-b border-white/10 hover:bg-transparent">
                                <TableHead className="px-4 md:px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest w-[80px]">Logo</TableHead>
                                <TableHead className="px-4 md:px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Brand Name</TableHead>
                                {/* Hidden on very small mobile, visible on small up */}
                                <TableHead className="hidden sm:table-cell px-4 md:px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Created Date</TableHead>
                                <TableHead className="px-4 md:px-6 py-4 text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-white/5">
                                        <TableCell colSpan={4} className="px-6 py-8">
                                            <div className="flex items-center gap-4 animate-pulse">
                                                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                                                <div className="w-32 h-4 bg-white/10 rounded" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : paginatedBrands.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-medium italic">No matching brands found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedBrands.map((brand) => (
                                <TableRow key={brand._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <TableCell className="px-4 md:px-6 py-4">
                                        <Avatar className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-lg">
                                            <AvatarImage
                                                src={brand.image}
                                                alt={brand.name}
                                                className="rounded-xl object-contain bg-white p-1"
                                            />
                                            <AvatarFallback className="bg-[#1e293b] text-white font-bold text-base md:text-lg rounded-xl">
                                                {brand.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="px-4 md:px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-bold text-sm tracking-tight">{brand.name}</span>
                                            {/* Show date below name on tiny screens only */}
                                            <span className="sm:hidden text-[10px] text-slate-400">{formatDate(brand.createdAt)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-xs">{formatDate(brand.createdAt)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 md:px-6 py-4 text-right">
                                        {/* Reduced group-hover dependency for mobile to allow tap to see actions */}
                                        <div className="flex items-center justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEditBrand(brand)}
                                                className="h-8 w-8 md:h-9 md:w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDeleteBrand(brand._id)}
                                                className="h-8 w-8 md:h-9 md:w-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer / Pagination: Stacks on small screens */}
                <div className="px-6 py-6 border-t border-white/10 bg-white/5 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-slate-500 font-medium order-2 lg:order-1">
                        Showing <span className="text-slate-300">{(currentPage - 1) * 8 + 1}</span> to <span className="text-slate-300">{Math.min(currentPage * 8, brands.length)}</span> of <span className="text-slate-300">{brands.length}</span> brands
                    </p>

                    <div className="flex items-center gap-2 order-1 lg:order-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs font-bold transition-all min-w-[36px] md:min-w-[40px] ${currentPage === i + 1
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
                            className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
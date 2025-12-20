import React from 'react';
import {
    Search,
    Plus,
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Layers,
    RefreshCw,
    SortAsc,
    SortDesc
} from 'lucide-react';
import type { Category } from '../../../types/category';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryTableProps {
    categories: Category[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (value: 'asc' | 'desc') => void;
    currentPage: number;
    setCurrentPage: (value: number | ((prev: number) => number)) => void;
    totalPages: number;
    totalCount: number;
    onAddCategory: () => void;
    onEditCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: string) => void;
    onRefresh: () => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
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

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'Featured': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Hot Categories': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'Top Categories': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Category Management
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 font-bold ml-2 h-7 rounded-lg">
                            {totalCount} Total
                        </Badge>
                    </h1>
                    <p className="text-slate-400 text-sm">Organize your products into logical collections</p>
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
                        onClick={onAddCategory}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-600/20 group gap-2"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Add New Category
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Search categories by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-blue-500/20 transition-all shadow-inner"
                    />
                </div>
                <Select value={sortOrder} onValueChange={(val: any) => setSortOrder(val)}>
                    <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-blue-500/20">
                        <div className="flex items-center gap-2">
                            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                            <SelectValue placeholder="Sort Order" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                        <SelectItem value="asc">Ascending (Oldest)</SelectItem>
                        <SelectItem value="desc">Descending (Newest)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-b border-white/10 hover:bg-transparent">
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest w-[80px]">Image</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Category Name</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest text-center">Collection Type</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Created Date</TableHead>
                                <TableHead className="px-6 py-4 text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-white/5">
                                        <TableCell colSpan={5} className="px-6 py-8">
                                            <div className="flex items-center gap-4 animate-pulse">
                                                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                                                <div className="space-y-2">
                                                    <div className="w-32 h-4 bg-white/10 rounded" />
                                                    <div className="w-24 h-3 bg-white/10 rounded" />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                                                <Layers className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-medium italic">No matching categories found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : categories.map((category) => (
                                <TableRow key={category._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <TableCell className="px-6 py-4">
                                        <Avatar className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-lg">
                                            <AvatarImage
                                                src={category.image}
                                                alt={category.name}
                                                className="rounded-xl object-contain bg-white p-1"
                                            />
                                            <AvatarFallback className="bg-[#1e293b] text-white font-bold text-lg rounded-xl">
                                                {category.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className="text-white font-bold text-sm tracking-tight">{category.name}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <Badge
                                                variant="outline"
                                                className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm ${getTypeStyles(category.categoryType)}`}
                                            >
                                                {category.categoryType}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-xs">{formatDate(category.createdAt)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEditCategory(category)}
                                                className="h-9 w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDeleteCategory(category._id)}
                                                className="h-9 w-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/10"
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

                {/* Footer / Pagination */}
                <div className="px-6 py-6 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-300">{(currentPage - 1) * 8 + 1}</span> to <span className="text-slate-300">{Math.min(currentPage * 8, totalCount)}</span> of <span className="text-slate-300">{totalCount}</span> categories
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
                            {Array.from({ length: totalPages }).map((_, i) => (
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

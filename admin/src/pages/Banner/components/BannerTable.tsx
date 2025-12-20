import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Pencil,
    Trash2,
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    ImageOff,
    ImageIcon
} from "lucide-react";
import type { Banner } from '../../../types/banner';

interface BannerTableProps {
    banners: Banner[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    currentPage: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    totalPages: number;
    paginatedBanners: Banner[];
    onAddBanner: () => void;
    onEditBanner: (banner: Banner) => void;
    onDeleteBanner: (id: string) => void;
}

export const BannerTable: React.FC<BannerTableProps> = ({
    banners,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedBanners,
    onAddBanner,
    onEditBanner,
    onDeleteBanner
}) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Banner Management</h1>
                    <p className="text-slate-400 text-sm">Manage promotion banners and visual assets</p>
                </div>
                <Button
                    onClick={onAddBanner}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-600/20 group gap-2"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    New Banner
                </Button>
            </div>

            {/* Controls Section */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <Input
                    placeholder="Search banners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-blue-500/20 transition-all shadow-inner"
                />
            </div>

            {/* Table Section */}
            <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-b border-white/10 hover:bg-transparent">
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest w-[150px]">Preview</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Name</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Title</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Type</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Start From</TableHead>
                                <TableHead className="px-6 py-4 text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-white/5">
                                        <TableCell colSpan={6} className="px-6 py-8">
                                            <div className="flex items-center gap-4 animate-pulse">
                                                <div className="w-24 h-12 bg-white/10 rounded-lg" />
                                                <div className="w-32 h-4 bg-white/10 rounded" />
                                                <div className="w-24 h-4 bg-white/10 rounded" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : paginatedBanners.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-medium italic">No banners found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedBanners.map((banner) => (
                                    <TableRow key={banner._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="px-6 py-4">
                                            <div className="w-32 h-16 rounded-lg bg-white/5 overflow-hidden border border-white/10 relative">
                                                {banner.image ? (
                                                    <img
                                                        src={banner.image}
                                                        alt={banner.name}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                        <ImageOff className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-white font-bold text-sm tracking-tight">{banner.name}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-slate-300 text-sm max-w-[200px] truncate block">{banner.title}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                                                {banner.bannerType}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-slate-300 font-mono text-sm">
                                            {banner.startFrom}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEditBanner(banner)}
                                                    className="h-9 w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDeleteBanner(banner._id)}
                                                    className="h-9 w-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer Section */}
                <div className="px-6 py-6 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-300">{(currentPage - 1) * 8 + 1}</span> to <span className="text-slate-300">{Math.min(currentPage * 8, banners.length)}</span> of <span className="text-slate-300">{banners.length}</span> banners
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

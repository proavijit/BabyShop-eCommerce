import React, { useState, useEffect } from 'react';
import { brandApi } from '../lib/api';
import { toast } from 'sonner';
import type { Brand, BrandFormData } from '../types/brand';

// Modular Components
import {
    BrandTable,
    BrandDialog,
    BrandDeleteDialog
} from './Brands/components';

export const Brands: React.FC = () => {
    // -------------------------------------------------------------------------
    // 1. STATE MANAGEMENT
    // -------------------------------------------------------------------------

    // Core Data
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog Visibility
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selection State
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);

    // Form & UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<BrandFormData>({
        name: '', image: ''
    });

    // Filtering & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // -------------------------------------------------------------------------
    // 2. DATA FETCHING
    // -------------------------------------------------------------------------

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const res = await brandApi.getAllBrands();
            // The brand controller returns a plain array of brands
            if (Array.isArray(res)) {
                setBrands(res);
            } else if (res && res.success && Array.isArray(res.data)) {
                setBrands(res.data);
            } else {
                setBrands([]);
            }
        } catch (error) {
            toast.error('Cloud synchronization failed. Please check network.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // -------------------------------------------------------------------------
    // 3. DIALOG HANDLERS
    // -------------------------------------------------------------------------

    const handleOpenAddDialog = () => {
        setEditingBrand(null);
        setFormData({ name: '', image: '' });
        setIsDialogOpen(true);
        toast.info('Accessing brand registration form...');
    };

    const handleOpenEditDialog = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({
            name: brand.name,
            image: brand.image || ''
        });
        setIsDialogOpen(true);
        toast.info(`Preparing to modify brand: ${brand.name}`);
    };

    const handleDeleteClick = (brandId: string) => {
        setDeletingBrandId(brandId);
        setIsDeleteDialogOpen(true);
        toast.warning('Warning: Permanent deletion requested');
    };

    // -------------------------------------------------------------------------
    // 4. API ACTIONS
    // -------------------------------------------------------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = (async () => {
            if (editingBrand) {
                const res = await brandApi.updateBrand(editingBrand._id, formData);
                if (res.error) throw new Error(res.error);
                setIsDialogOpen(false);
                fetchBrands();
                return res;
            } else {
                const res = await brandApi.createBrand(formData);
                if (res.error) throw new Error(res.error);
                setIsDialogOpen(false);
                setCurrentPage(1);
                fetchBrands();
                return res;
            }
        })();

        toast.promise(promise, {
            loading: editingBrand ? 'Pushing brand updates...' : 'Generating new brand identity...',
            success: editingBrand ? 'Brand updated successfully' : 'Brand registered successfully',
            error: (err) => err.message || 'Identity processing failed'
        });

        try { await promise; } catch { } finally { setIsSubmitting(false); }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingBrandId) return;
        const promise = (async () => {
            const res = await brandApi.deleteBrand(deletingBrandId);
            if (res.error) throw new Error(res.error);
            fetchBrands();
            return res;
        })();

        toast.promise(promise, {
            loading: 'Purging brand from database...',
            success: 'Identity permanently removed',
            error: (err) => err.message || 'Purge failed'
        });
    };

    // -------------------------------------------------------------------------
    // 5. FILTERING & PAGINATION LOGIC
    // -------------------------------------------------------------------------

    const filteredBrands = brands.filter(brand => {
        const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredBrands.length / 8);
    const paginatedBrands = filteredBrands.slice((currentPage - 1) * 8, currentPage * 8);

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // -------------------------------------------------------------------------
    // 6. RENDER
    // -------------------------------------------------------------------------

    return (
        <div className="p-4 md:p-8 min-h-screen bg-[#0f172a]/50 text-white">
            <BrandTable
                brands={brands}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                paginatedBrands={paginatedBrands}
                onAddBrand={handleOpenAddDialog}
                onEditBrand={handleOpenEditDialog}
                onDeleteBrand={handleDeleteClick}
            />

            <BrandDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingBrand={editingBrand}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            <BrandDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
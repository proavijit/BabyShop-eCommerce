import React, { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '../lib/api';
import { toast } from 'sonner';
import type { Category, CategoryFormData, CategoryResponse } from '../types/category';

// Modular Components
import {
    CategoryTable,
    CategoryDialog,
    CategoryDeleteDialog
} from '@/pages/Categories/components';

export const Categories: React.FC = () => {
    // -------------------------------------------------------------------------
    // 1. STATE MANAGEMENT
    // -------------------------------------------------------------------------

    // Core Data
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Dialog Visibility
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selection State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

    // Form & UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '', image: '', categoryType: 'Featured'
    });

    // Filtering, Sorting & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 8;

    // -------------------------------------------------------------------------
    // 2. DATA FETCHING
    // -------------------------------------------------------------------------

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            // The API expects params for pagination and sorting
            const params = {
                page: currentPage,
                perPage: PER_PAGE,
                sortOrder: sortOrder,
                search: searchTerm // Assuming backend handles search, if not we filter locally
            };

            const res: CategoryResponse = await categoryApi.getAllCategories(params);

            if (res && res.categories) {
                setCategories(res.categories);
                setTotalCount(res.total);
                setTotalPages(res.totalPages);
            } else if (Array.isArray(res)) {
                // Fallback for older API structure
                const data = res as unknown as Category[];
                setCategories(data);
                setTotalCount(data.length);
                setTotalPages(Math.ceil(data.length / PER_PAGE));
            }
        } catch (error) {
            toast.error('Cloud synchronization failed. Please check network.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, sortOrder, searchTerm]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // -------------------------------------------------------------------------
    // 3. DIALOG HANDLERS
    // -------------------------------------------------------------------------

    const handleOpenAddDialog = () => {
        setEditingCategory(null);
        setFormData({ name: '', image: '', categoryType: 'Featured' });
        setIsDialogOpen(true);
        toast.info('Accessing collection registration form...');
    };

    const handleOpenEditDialog = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            image: category.image || '',
            categoryType: category.categoryType || 'Featured'
        });
        setIsDialogOpen(true);
        toast.info(`Preparing to modify collection: ${category.name}`);
    };

    const handleDeleteClick = (categoryId: string) => {
        setDeletingCategoryId(categoryId);
        setIsDeleteDialogOpen(true);
        toast.warning('Warning: Permanent deletion requested');
    };

    const handleRefresh = () => {
        fetchCategories();
        toast.success('Category list synchronized');
    };

    // -------------------------------------------------------------------------
    // 4. API ACTIONS
    // -------------------------------------------------------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = (async () => {
            if (editingCategory) {
                const res = await categoryApi.updateCategory(editingCategory._id, formData);
                if (res.error) throw new Error(res.error);
                setIsDialogOpen(false);
                fetchCategories();
                return res;
            } else {
                const res = await categoryApi.createCategory(formData);
                if (res.error) throw new Error(res.error);
                setIsDialogOpen(false);
                setCurrentPage(1);
                fetchCategories();
                return res;
            }
        })();

        toast.promise(promise, {
            loading: editingCategory ? 'Pushing collection updates...' : 'Generating new category identity...',
            success: editingCategory ? 'Collection updated successfully' : 'Collection registered successfully',
            error: (err) => err.message || 'Identity processing failed'
        });

        try { await promise; } catch { } finally { setIsSubmitting(false); }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCategoryId) return;
        const promise = (async () => {
            const res = await categoryApi.deleteCategory(deletingCategoryId);
            if (res.error) throw new Error(res.error);
            setIsDeleteDialogOpen(false);
            fetchCategories();
            return res;
        })();

        toast.promise(promise, {
            loading: 'Purging collection from database...',
            success: 'Identity permanently removed',
            error: (err) => err.message || 'Purge failed'
        });
    };

    // -------------------------------------------------------------------------
    // 5. RENDER
    // -------------------------------------------------------------------------

    return (
        <div className="p-4 md:p-8 min-h-screen bg-[#0f172a]/50 text-white">
            <CategoryTable
                categories={categories}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onAddCategory={handleOpenAddDialog}
                onEditCategory={handleOpenEditDialog}
                onDeleteCategory={handleDeleteClick}
                onRefresh={handleRefresh}
            />

            <CategoryDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingCategory={editingCategory}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            <CategoryDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

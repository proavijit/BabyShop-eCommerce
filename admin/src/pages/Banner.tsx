import React, { useState, useEffect } from 'react';
import { bannerApi } from '../lib/api';
import { toast } from 'sonner';
import type { Banner as BannerType, BannerFormData } from '../types/banner';

// Modular Components
import {
    BannerTable,
    BannerDialog,
    BannerDeleteDialog
} from './Banner/components';

export const Banner = () => {
    // -------------------------------------------------------------------------
    // 1. STATE MANAGEMENT
    // -------------------------------------------------------------------------

    // Core Data
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog Visibility
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selection State
    const [editingBanner, setEditingBanner] = useState<BannerType | null>(null);
    const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);

    // Form & UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<BannerFormData>({
        name: '',
        title: '',
        startFrom: '',
        image: '',
        bannerType: ''
    });

    // Filtering & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // -------------------------------------------------------------------------
    // 2. DATA FETCHING
    // -------------------------------------------------------------------------

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await bannerApi.getAllBanners();
            // Handle different response structures gracefully
            if (Array.isArray(res)) {
                setBanners(res);
            } else if (res && res.success && Array.isArray(res.data)) {
                setBanners(res.data);
            } else if (res && Array.isArray(res.data)) {
                // Some APIs return { data: [...] } without success flag
                setBanners(res.data);
            } else {
                setBanners([]);
            }
        } catch (error) {
            console.error("Failed to fetch banners:", error);
            toast.error('Failed to load display banners.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // -------------------------------------------------------------------------
    // 3. DIALOG HANDLERS
    // -------------------------------------------------------------------------

    const handleOpenAddDialog = () => {
        setEditingBanner(null);
        setFormData({ name: '', title: '', startFrom: '', image: '', bannerType: '' });
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (banner: BannerType) => {
        setEditingBanner(banner);
        setFormData({
            name: banner.name,
            title: banner.title,
            startFrom: banner.startFrom,
            image: banner.image || '',
            bannerType: banner.bannerType
        });
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (bannerId: string) => {
        setDeletingBannerId(bannerId);
        setIsDeleteDialogOpen(true);
    };

    // -------------------------------------------------------------------------
    // 4. API ACTIONS
    // -------------------------------------------------------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.title || !formData.startFrom || !formData.bannerType || !formData.image) {
            toast.error("Please fill in all required fields and upload an image.");
            return;
        }

        setIsSubmitting(true);

        const promise = (async () => {
            if (editingBanner) {
                const res = await bannerApi.updateBanner(editingBanner._id, formData);
                if (res.error) throw new Error(res.error);
                return res;
            } else {
                const res = await bannerApi.createBanner(formData);
                if (res.error) throw new Error(res.error);
                return res;
            }
        })();

        toast.promise(promise, {
            loading: editingBanner ? 'Updating banner...' : 'Creating new banner...',
            success: () => {
                setIsDialogOpen(false);
                fetchBanners();
                return editingBanner ? 'Banner updated successfully' : 'Banner created successfully';
            },
            error: (err) => {
                return err.message || 'Operation failed';
            }
        });

        try {
            await promise;
        } catch (error) {
            // Error handled by toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingBannerId) return;

        const promise = (async () => {
            const res = await bannerApi.deleteBanner(deletingBannerId);
            if (res.error) throw new Error(res.error);
            return res;
        })();

        toast.promise(promise, {
            loading: 'Deleting banner...',
            success: () => {
                setIsDeleteDialogOpen(false);
                fetchBanners();
                return 'Banner deleted successfully';
            },
            error: (err) => err.message || 'Deletion failed'
        });
    };

    // -------------------------------------------------------------------------
    // 5. FILTERING & PAGINATION LOGIC
    // -------------------------------------------------------------------------

    const filteredBanners = banners.filter(banner => {
        const matchesSearch =
            banner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            banner.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
    const paginatedBanners = filteredBanners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // -------------------------------------------------------------------------
    // 6. RENDER
    // -------------------------------------------------------------------------

    return (
        <div className="p-4 md:p-8 min-h-screen bg-[#0f172a]/50 text-white">
            <BannerTable
                banners={banners}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                paginatedBanners={paginatedBanners}
                onAddBanner={handleOpenAddDialog}
                onEditBanner={handleOpenEditDialog}
                onDeleteBanner={handleDeleteClick}
            />

            <BannerDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingBanner={editingBanner}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            <BannerDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
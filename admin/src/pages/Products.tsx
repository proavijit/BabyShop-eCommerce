import React, { useState, useEffect, useCallback } from 'react';
import { productApi } from '../lib/api';
import { toast } from 'sonner';
import type { Product, ProductFormData, ProductResponse } from '../types/product';

// Modular Components
import {
    ProductTable,
    ProductDialog,
    ProductDeleteDialog
} from '@/pages/Products/components';

export const Products: React.FC = () => {
    // -------------------------------------------------------------------------
    // 1. STATE MANAGEMENT
    // -------------------------------------------------------------------------

    // Core Data
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Dialog Visibility
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selection State
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

    // Form & UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        discountPrice: 0,
        category: '',
        brand: '',
        images: [],
        stock: 0,
        ageGroup: '0-6 Months',
        isFeatured: false
    });

    // Filtering, Sorting & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 20;

    // -------------------------------------------------------------------------
    // 2. DATA FETCHING
    // -------------------------------------------------------------------------

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                perPage: PER_PAGE,
                sortOrder: sortOrder,
                search: searchTerm
            };

            const res: ProductResponse = await productApi.getAllProducts(params);

            if (res && res.products) {
                setProducts(res.products);
                setTotalCount(res.total);
                setTotalPages(res.pages);
            } else {
                setProducts([]);
                setTotalCount(0);
                setTotalPages(0);
            }
        } catch (error) {
            toast.error('Inventory synchronization failed');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, sortOrder, searchTerm]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // -------------------------------------------------------------------------
    // 3. DIALOG HANDLERS
    // -------------------------------------------------------------------------

    const handleOpenAddDialog = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            discountPrice: 0,
            category: '',
            brand: '',
            images: [],
            stock: 0,
            ageGroup: '0-6 Months',
            isFeatured: false
        });
        setIsDialogOpen(true);
        toast.info('Accessing inventory registration...');
    };

    const handleOpenEditDialog = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            discountPrice: product.discountPrice || 0,
            category: typeof product.category === 'object' ? product.category._id : product.category,
            brand: typeof product.brand === 'object' ? product.brand?._id || '' : product.brand || '',
            images: product.images || [],
            stock: product.stock,
            ageGroup: product.ageGroup || '0-6 Months',
            isFeatured: product.isFeatured || false
        });
        setIsDialogOpen(true);
        toast.info(`Preparing modifications for: ${product.name}`);
    };

    const handleDeleteClick = (productId: string) => {
        setDeletingProductId(productId);
        setIsDeleteDialogOpen(true);
        toast.warning('Security clearance required for deletion');
    };

    const handleRefresh = () => {
        fetchProducts();
        toast.success('Live inventory synchronized');
    };

    // -------------------------------------------------------------------------
    // 4. API ACTIONS
    // -------------------------------------------------------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.category) {
            return toast.error('Category is required for placement');
        }

        setIsSubmitting(true);
        const promise = (async () => {
            if (editingProduct) {
                const res = await productApi.updateProduct(editingProduct._id, formData);
                if (res.error) throw new Error(res.error);
                setIsDialogOpen(false);
                fetchProducts();
                return res;
            } else {
                const res = await productApi.createProduct(formData);
                if (res.error) throw new Error(res.error);
                setIsDialogOpen(false);
                setCurrentPage(1);
                fetchProducts();
                return res;
            }
        })();

        toast.promise(promise, {
            loading: editingProduct ? 'Syncing product updates...' : 'Generating product identity...',
            success: editingProduct ? 'Product details updated' : 'Product successfully published',
            error: (err) => err.message || 'Operation failed'
        });

        try { await promise; } catch { } finally { setIsSubmitting(false); }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingProductId) return;
        const promise = (async () => {
            const res = await productApi.deleteProduct(deletingProductId);
            if (res.error) throw new Error(res.error);
            setIsDeleteDialogOpen(false);
            fetchProducts();
            return res;
        })();

        toast.promise(promise, {
            loading: 'Expunging record from database...',
            success: 'Product record permanently removed',
            error: (err) => err.message || 'Purge operation failed'
        });
    };

    // -------------------------------------------------------------------------
    // 5. RENDER
    // -------------------------------------------------------------------------

    return (
        <div className="p-4 md:p-8 min-h-screen bg-[#0f172a]/50 text-white">
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
                onAddProduct={handleOpenAddDialog}
                onEditProduct={handleOpenEditDialog}
                onDeleteProduct={handleDeleteClick}
                onRefresh={handleRefresh}
            />

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
            />
        </div>
    );
};
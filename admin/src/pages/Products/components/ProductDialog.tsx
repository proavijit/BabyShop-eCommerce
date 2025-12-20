import React, { useRef, useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Loader2, Package, Image as ImageIcon, Plus } from 'lucide-react';
import type { Product, ProductFormData } from '../../../types/product';
import type { Category } from '../../../types/category';
import type { Brand } from '../../../types/brand';
import { categoryApi, brandApi } from '../../../lib/api';

interface ProductDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingProduct: Product | null;
    formData: ProductFormData;
    setFormData: (data: ProductFormData) => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
    isOpen,
    onOpenChange,
    editingProduct,
    formData,
    setFormData,
    isSubmitting,
    onSubmit,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loadingResources, setLoadingResources] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchResources = async () => {
                setLoadingResources(true);
                try {
                    const [catRes, brandRes] = await Promise.all([
                        categoryApi.getAllCategories(),
                        brandApi.getAllBrands()
                    ]);
                    setCategories(catRes.categories || catRes || []);
                    setBrands(brandRes.brands || brandRes || []);
                } catch (error) {
                    console.error('Failed to fetch categories/brands', error);
                } finally {
                    setLoadingResources(false);
                }
            };
            fetchResources();
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({
                        ...formData,
                        images: [...formData.images, reader.result as string]
                    });
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-white/10 text-white max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl shadow-2xl">
                <DialogHeader className="border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <Package className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                {editingProduct ? 'Edit Product' : 'Create New Product'}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 mt-1 text-sm">
                                {editingProduct ? 'Update product inventory, details and media.' : 'Add a new item to your store inventory and start selling.'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(92vh-200px)] px-1">
                    <form onSubmit={onSubmit} className="space-y-8 py-6">
                        {/* Section 1: Product Images */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-blue-400" />
                                    Product Gallery
                                </Label>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative aspect-square group">
                                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                                            <img src={img} alt={`Preview ${index}`} className="w-full h-full object-contain p-3" />
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">
                                                    PRIMARY
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-red-500/50 hover:scale-110 transition-all border-2 border-[#0f172a] opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {formData.images.length < 8 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 hover:scale-105 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Add Image</span>
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                                multiple
                            />
                            <p className="text-[11px] text-slate-500 text-center italic">
                                Upload up to 8 images • First image will be the primary display • Recommended: 1000x1000px
                            </p>
                        </div>

                        {/* Section 2: Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Basic Information
                                </Label>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-sm font-semibold text-white flex items-center gap-2">
                                    Product Title <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Newborn Sleep Gown Set of 2 - Organic Cotton"
                                    required
                                    className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all text-base placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-sm font-semibold text-white">
                                    Product Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Write a detailed, compelling description that highlights key features, benefits, and specifications..."
                                    className="bg-white/5 border-white/10 text-white min-h-[140px] rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 resize-none transition-all placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {/* Section 3: Classification */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Classification
                                </Label>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-white flex items-center gap-2">
                                        Category <span className="text-red-400">*</span>
                                    </Label>
                                    {loadingResources ? (
                                        <div className="h-14 rounded-xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.category}
                                            onValueChange={(val) => setFormData({ ...formData, category: val })}
                                            required
                                        >
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:ring-2 focus:ring-blue-500/30 hover:bg-white/10 transition-all">
                                                <SelectValue placeholder="Select a category..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1e293b] border-white/10 text-white max-h-[300px] rounded-xl">
                                                {categories.length === 0 ? (
                                                    <div className="p-4 text-center text-slate-400 text-sm">No categories available</div>
                                                ) : categories.map(cat => (
                                                    <SelectItem key={cat._id} value={cat._id} className="focus:bg-white/10 cursor-pointer">
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-white">
                                        Brand (Optional)
                                    </Label>
                                    {loadingResources ? (
                                        <div className="h-14 rounded-xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.brand}
                                            onValueChange={(val) => setFormData({ ...formData, brand: val })}
                                        >
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:ring-2 focus:ring-blue-500/30 hover:bg-white/10 transition-all">
                                                <SelectValue placeholder="Select a brand..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1e293b] border-white/10 text-white max-h-[300px] rounded-xl">
                                                {brands.length === 0 ? (
                                                    <div className="p-4 text-center text-slate-400 text-sm">No brands available</div>
                                                ) : brands.map(brand => (
                                                    <SelectItem key={brand._id} value={brand._id} className="focus:bg-white/10 cursor-pointer">
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Pricing & Inventory */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Pricing & Inventory
                                </Label>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="price" className="text-sm font-semibold text-white flex items-center gap-2">
                                        Sale Price (৳) <span className="text-red-400">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        required
                                        placeholder="0.00"
                                        className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:ring-2 focus:ring-blue-500/30 text-base"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="discountPrice" className="text-sm font-semibold text-white">
                                        Compare Price (৳)
                                    </Label>
                                    <Input
                                        id="discountPrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.discountPrice}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                                        placeholder="0.00"
                                        className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:ring-2 focus:ring-blue-500/30 text-base"
                                    />
                                    <p className="text-[10px] text-slate-500 italic">Original price for discount display</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="stock" className="text-sm font-semibold text-white flex items-center gap-2">
                                        Stock Quantity <span className="text-red-400">*</span>
                                    </Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        required
                                        placeholder="0"
                                        className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:ring-2 focus:ring-blue-500/30 text-base"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="ageGroup" className="text-sm font-semibold text-white">
                                        Target Age Group
                                    </Label>
                                    <Select
                                        value={formData.ageGroup}
                                        onValueChange={(val) => setFormData({ ...formData, ageGroup: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:ring-2 focus:ring-blue-500/30 hover:bg-white/10 transition-all">
                                            <SelectValue placeholder="Select age range..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1e293b] border-white/10 text-white rounded-xl">
                                            <SelectItem value="0-6 Months" className="focus:bg-white/10 cursor-pointer">0-6 Months</SelectItem>
                                            <SelectItem value="6-12 Months" className="focus:bg-white/10 cursor-pointer">6-12 Months</SelectItem>
                                            <SelectItem value="1-3 Years" className="focus:bg-white/10 cursor-pointer">1-3 Years</SelectItem>
                                            <SelectItem value="3-6 Years" className="focus:bg-white/10 cursor-pointer">3-6 Years</SelectItem>
                                            <SelectItem value="6+ Years" className="focus:bg-white/10 cursor-pointer">6+ Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Additional Settings */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Additional Settings
                                </Label>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>

                            <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Package className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-base font-bold text-white cursor-pointer">Featured Product</Label>
                                        <span className="text-xs text-slate-400">Showcase this product on the homepage and featured sections</span>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.isFeatured}
                                    onCheckedChange={(val) => setFormData({ ...formData, isFeatured: val })}
                                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600 scale-125"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter className="gap-3 border-t border-white/10 pt-6 mt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="flex-1 h-14 rounded-xl border-2 border-white/10 hover:bg-white/5 hover:border-white/20 text-slate-300 hover:text-white transition-all font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="flex-[2] h-14 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Publishing to Store...
                            </>
                        ) : (
                            <>
                                {editingProduct ? (
                                    <>
                                        <Package className="w-5 h-5 mr-2" />
                                        Update Product
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5 mr-2" />
                                        Publish Product
                                    </>
                                )}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

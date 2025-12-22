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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Loader2 } from 'lucide-react';
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

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        onSubmit(e as any);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingProduct
                            ? `Update the details for ${editingProduct.name}`
                            : 'Fill in the product information below'}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="media">Images</TabsTrigger>
                    </TabsList>

                    <div className="overflow-y-auto max-h-[50vh] mt-4 px-1">
                        <TabsContent value="general" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter product description"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadingResources ? (
                                                <div className="p-4 flex justify-center">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                </div>
                                            ) : (
                                                categories.map(cat => (
                                                    <SelectItem key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Brand</Label>
                                    <Select
                                        value={formData.brand}
                                        onValueChange={(val) => setFormData({ ...formData, brand: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadingResources ? (
                                                <div className="p-4 flex justify-center">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                </div>
                                            ) : (
                                                brands.map(brand => (
                                                    <SelectItem key={brand._id} value={brand._id}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="featured"
                                        checked={formData.isFeatured}
                                        onCheckedChange={(val) => setFormData({ ...formData, isFeatured: val })}
                                    />
                                    <Label htmlFor="featured" className="cursor-pointer">⭐ Featured Product</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="trending"
                                        checked={formData.isTrending}
                                        onCheckedChange={(val) => setFormData({ ...formData, isTrending: val })}
                                    />
                                    <Label htmlFor="trending" className="cursor-pointer">🔥 Trending Product</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="bestDeal"
                                        checked={formData.isBestDeal}
                                        onCheckedChange={(val) => setFormData({ ...formData, isBestDeal: val })}
                                    />
                                    <Label htmlFor="bestDeal" className="cursor-pointer">💰 Best Deal</Label>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="pricing" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discountPrice">Discount Price</Label>
                                    <Input
                                        id="discountPrice"
                                        type="number"
                                        value={formData.discountPrice}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Age Group</Label>
                                    <Select
                                        value={formData.ageGroup}
                                        onValueChange={(val) => setFormData({ ...formData, ageGroup: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select age group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0-6 Months">0-6 Months</SelectItem>
                                            <SelectItem value="6-12 Months">6-12 Months</SelectItem>
                                            <SelectItem value="1-2 Years">1-2 Years</SelectItem>
                                            <SelectItem value="2-5 Years">2-5 Years</SelectItem>
                                            <SelectItem value="5+ Years">5+ Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="media" className="space-y-4">
                            <div className="space-y-2">
                                <Label>Product Images ({formData.images.length}/5)</Label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent"
                                >
                                    <p className="text-sm text-muted-foreground">
                                        Click to upload images (PNG, JPG - Max 5)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {index === 0 && (
                                            <Badge className="absolute top-2 left-2">Primary</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <DialogFooter className="mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            editingProduct ? 'Update Product' : 'Add Product'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

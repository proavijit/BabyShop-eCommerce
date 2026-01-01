import React, { useRef } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2, Layers } from 'lucide-react';
import type { Category, CategoryFormData } from '../../../types/category';

interface CategoryDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingCategory: Category | null;
    formData: CategoryFormData;
    setFormData: (data: CategoryFormData) => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
    isOpen,
    onOpenChange,
    editingCategory,
    formData,
    setFormData,
    isSubmitting,
    onSubmit,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0f172a] border-white/10 text-white max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                            <Layers className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">
                            {editingCategory ? 'Edit Collection' : 'Create Collection'}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400">
                        {editingCategory ? 'Update collection details and display image.' : 'Organize your products by creating a new category.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        {/* Image Upload Area */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-32 h-32 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500/50 shadow-inner group-hover:bg-white/10">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Upload className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Add Image</span>
                                        </div>
                                    )}
                                </div>
                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData({ ...formData, image: '' });
                                        }}
                                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors border-2 border-[#0f172a]"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <p className="text-[10px] text-slate-500 text-center italic">
                                Best format: PNG or WebP (min 500x500px)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Category Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Diapers & Wipes, Feeding & Nursing"
                                required
                                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Collection Type
                            </Label>
                            <Select
                                value={formData.categoryType}
                                onValueChange={(val: string) => setFormData({ ...formData, categoryType: val as any })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-blue-500/20">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                                    <SelectItem value="Featured">Featured Collection</SelectItem>
                                    <SelectItem value="Hot Categories">Hot Trending</SelectItem>
                                    <SelectItem value="Top Categories">Best Sellers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 sm:space-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 h-12 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                editingCategory ? 'Update Collection' : 'Create Collection'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

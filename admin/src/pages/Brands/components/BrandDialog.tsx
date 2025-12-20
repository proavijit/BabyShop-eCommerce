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
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import type { Brand, BrandFormData } from '../../../types/brand';

interface BrandDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingBrand: Brand | null;
    formData: BrandFormData;
    setFormData: (data: BrandFormData) => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const BrandDialog: React.FC<BrandDialogProps> = ({
    isOpen,
    onOpenChange,
    editingBrand,
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
            <DialogContent className="bg-[#0f172a] border-white/10 text-white max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {editingBrand ? 'Edit Brand' : 'Register New Brand'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {editingBrand ? 'Update brand details and logo.' : 'Add a new brand to your marketplace.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        {/* Image Upload Area */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-32 h-32 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500/50">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-contain bg-white p-2" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Upload className="w-8 h-8" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Upload Logo</span>
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
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
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
                                Recommended: 400x400 PNG or SVG
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Brand Identity
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. BabyComfort, TinySteps"
                                required
                                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
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
                                    Processing...
                                </>
                            ) : (
                                editingBrand ? 'Update Brand' : 'Create Brand'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

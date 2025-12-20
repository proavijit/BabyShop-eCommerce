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
import { Upload, X, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Banner, BannerFormData } from '../../../types/banner';

interface BannerDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingBanner: Banner | null;
    formData: BannerFormData;
    setFormData: (data: BannerFormData) => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const BannerDialog: React.FC<BannerDialogProps> = ({
    isOpen,
    onOpenChange,
    editingBanner,
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
                        {editingBanner ? 'Edit Banner' : 'Register New Banner'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {editingBanner ? 'Update promotion details and visuals.' : 'Add a new banner to your marketplace.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        {/* Image Upload Area */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-full h-48 md:w-80 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500/50">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Upload className="w-8 h-8" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Upload Banner</span>
                                            <span className="text-[9px] text-slate-600">Max 2MB</span>
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Internal Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Summer Sale"
                                    required
                                    className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bannerType" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Type
                                </Label>
                                <Select
                                    value={formData.bannerType}
                                    onValueChange={(value) => setFormData({ ...formData, bannerType: value })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus:ring-blue-500/20">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                                        <SelectItem value="slider">Slider</SelectItem>
                                        <SelectItem value="static">Static</SelectItem>
                                        <SelectItem value="popup">Popup</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Display Title
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. 50% Off Everything"
                                required
                                className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startFrom" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Start Price / Discount
                            </Label>
                            <Input
                                id="startFrom"
                                type="number"
                                value={formData.startFrom}
                                onChange={(e) => setFormData({ ...formData, startFrom: Number(e.target.value) })}
                                placeholder="e.g. 99"
                                required
                                className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus:ring-blue-500/20"
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
                                editingBanner ? 'Update Banner' : 'Create Banner'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

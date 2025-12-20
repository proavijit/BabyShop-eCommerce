import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from 'lucide-react';

interface ProductDeleteDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const ProductDeleteDialog: React.FC<ProductDeleteDialogProps> = ({
    isOpen,
    onOpenChange,
    onConfirm,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-[#0f172a] border-white/10 text-white">
                <AlertDialogHeader>
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <AlertDialogTitle className="text-xl font-bold">Delete Product?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                        This action cannot be undone. This product will be permanently removed from the inventory and will no longer be visible to customers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 mt-4">
                    <AlertDialogCancel className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white rounded-xl h-12 px-6">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl h-12 px-8 shadow-lg shadow-red-600/20 transition-all border-0"
                    >
                        Delete Permanently
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

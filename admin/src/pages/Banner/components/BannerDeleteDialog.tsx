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

interface BannerDeleteDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const BannerDeleteDialog: React.FC<BannerDeleteDialogProps> = ({
    isOpen,
    onOpenChange,
    onConfirm,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-[#0f172a] border-white/10 text-white rounded-2xl max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-red-500">
                        Delete Banner?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                        Are you sure you want to delete this banner? This action cannot be undone and the banner will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 rounded-xl h-10 flex-1 mt-0">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl h-10 flex-1 shadow-lg shadow-red-500/20"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

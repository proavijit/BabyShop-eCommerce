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
import { Trash2 } from 'lucide-react';

interface UserDeleteDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
    isOpen,
    onOpenChange,
    onConfirm,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-[#1e293b] border-white/10 text-white">
                <AlertDialogHeader className="space-y-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mx-auto">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 text-center">
                        <AlertDialogTitle className="text-xl font-bold">Destroy User Account?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This action is <span className="text-red-400 font-bold uppercase">irreversible</span>. All personal data, orders, and addresses associated with this member will be permanently purged from the system.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex-row gap-3 justify-center sm:justify-center">
                    <AlertDialogCancel className="bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl px-6 m-0">Go Back</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl px-8 shadow-lg shadow-red-600/20 m-0"
                    >
                        Confirm Purge
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

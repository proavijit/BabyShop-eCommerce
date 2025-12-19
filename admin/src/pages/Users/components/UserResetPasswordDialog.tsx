import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from 'lucide-react';
import type { User } from '../../../types/user';

interface UserResetPasswordDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    newPassword: string;
    setNewPassword: (password: string) => void;
    isSubmitting: boolean;
    onReset: () => void;
}

export const UserResetPasswordDialog: React.FC<UserResetPasswordDialogProps> = ({
    isOpen,
    onOpenChange,
    user,
    newPassword,
    setNewPassword,
    isSubmitting,
    onReset,
}) => {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-[#1e293b] border-white/10 text-white">
                <DialogHeader className="space-y-3">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-2">
                        <Lock className="w-6 h-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Security Force Reset</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        You are about to force a password reset for <span className="text-white font-bold">{user.name}</span>. This action takes effect immediately.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-slate-300">New Secure Password</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-[#0f172a]/50 border-white/10 focus-visible:ring-purple-500/20 h-12 rounded-xl"
                            placeholder="Min 6 characters recommended"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                    <Button
                        onClick={onReset}
                        disabled={isSubmitting || !newPassword}
                        className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 px-6 rounded-xl transition-all"
                    >
                        {isSubmitting ? 'Encrypting...' : 'Update Credentials'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

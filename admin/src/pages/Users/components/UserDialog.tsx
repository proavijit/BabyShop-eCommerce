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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from '../../../components/ImageUpload';
import type { User, UserFormData } from '../../../types/user';

interface UserDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingUser: User | null;
    formData: UserFormData;
    setFormData: (data: UserFormData) => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const UserDialog: React.FC<UserDialogProps> = ({
    isOpen,
    onOpenChange,
    editingUser,
    formData,
    setFormData,
    isSubmitting,
    onSubmit,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1e293b] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {editingUser ? 'Edit User Profile' : 'Add New Member'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {editingUser ? "Update the user's information and access level." : "Register a new user to the system."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 py-4">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Label className="text-slate-300 text-sm font-bold uppercase tracking-wider">Profile Picture</Label>
                        <ImageUpload
                            value={formData.avatar}
                            onChange={(url) => setFormData({ ...formData, avatar: url })}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-[#0f172a]/50 border-white/10 focus-visible:ring-blue-500/20"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-[#0f172a]/50 border-white/10 focus-visible:ring-blue-500/20"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-slate-300">Access Level</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(v: string) => setFormData({ ...formData, role: v as any })}
                        >
                            <SelectTrigger className="bg-[#0f172a]/50 border-white/10 focus:ring-blue-500/20">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                                <SelectItem value="user">User (Standard)</SelectItem>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="proavijit">System Owner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {!editingUser && (
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="bg-[#0f172a]/50 border-white/10 focus-visible:ring-blue-500/20"
                                placeholder="Min 6 characters"
                            />
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-slate-400 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 transition-all shadow-lg shadow-blue-600/20"
                        >
                            {isSubmitting ? 'Processing...' : (editingUser ? 'Save Updates' : 'Add System Member')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

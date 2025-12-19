import React from 'react';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Shield,
    Mail,
    Calendar,
    MapPin,
    Smartphone,
    Info
} from 'lucide-react';
import type { User } from '../../../types/user';

interface UserViewDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export const UserViewDialog: React.FC<UserViewDialogProps> = ({
    isOpen,
    onOpenChange,
    user,
}) => {
    if (!user) return null;

    const formatDate = (dateString?: string, includeTime = false) => {
        if (!dateString) return 'Unknown';
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    const getRoleStyles = (role: string) => {
        switch (role) {
            case 'proavijit': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'admin': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusStyles = (status: string) => {
        return status === 'suspended'
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-[#1e293b] border-white/10 text-white p-0 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 relative">
                    <div className="absolute -bottom-12 left-8">
                        <Avatar className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] shadow-2xl border-4 border-[#1e293b]">
                            <AvatarImage src={user.avatar} className="rounded-2xl object-cover" />
                            <AvatarFallback className="bg-[#0f172a] text-white font-bold text-3xl rounded-xl">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="pt-16 px-8 pb-8 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Mail className="w-4 h-4 text-blue-400" />
                                {user.email}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getRoleStyles(user.role)}`}>
                                <Shield className="w-3 h-3 mr-1.5" />
                                {user.role}
                            </Badge>
                            <Badge variant="outline" className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusStyles(user.status)}`}>
                                {user.status}
                            </Badge>
                        </div>
                    </div>

                    <Separator className="bg-white/5" />

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> Account History
                                </label>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-300">Created: {formatDate(user.createdAt, true)}</p>
                                    <p className="text-xs text-slate-400/80">Last Updated: {formatDate(user.updatedAt, true)}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                                    <Smartphone className="w-3.5 h-3.5" /> System ID
                                </label>
                                <code className="text-[10px] bg-black/30 px-2 py-1 rounded text-blue-400 font-mono">
                                    {user._id}
                                </code>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> Registered Addresses
                                </label>
                                {user.address && user.address.length > 0 ? (
                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                        {user.address.map((addr) => (
                                            <div key={addr._id} className={`p-2 rounded-lg border text-[10px] ${addr.default ? 'bg-blue-600/5 border-blue-500/20 text-blue-200' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold">{addr.city}, {addr.country}</span>
                                                    {addr.default && <span className="bg-blue-500 text-[8px] px-1 rounded font-bold text-white">DEFAULT</span>}
                                                </div>
                                                <p>{addr.street}</p>
                                                <p>{addr.postalCode}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 italic flex items-center gap-1.5">
                                        <Info className="w-3.5 h-3.5" /> No addresses found
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl h-11">
                        Close Profile
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

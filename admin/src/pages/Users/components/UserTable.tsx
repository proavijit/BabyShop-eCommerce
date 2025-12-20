import React from 'react';
import {
    Search,
    UserPlus,
    MoreVertical,
    Shield,
    User as UserIcon,
    Mail,
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Calendar,
    Loader2,
    Ban,
    CheckCircle
} from 'lucide-react';
import type { User } from '../../../types/user';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface UserTableProps {
    users: User[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    roleFilter: string;
    setRoleFilter: (value: string) => void;
    currentPage: number;
    setCurrentPage: (value: number | ((prev: number) => number)) => void;
    totalPages: number;
    paginatedUsers: User[];
    onAddUser: () => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (userId: string) => void;
    onViewDetails: (user: User) => void;
    onToggleSuspend: (user: User) => void;
    onResetPassword: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    loading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedUsers,
    onAddUser,
    onEditUser,
    onDeleteUser,
    onViewDetails,
    onToggleSuspend,
    onResetPassword,
}) => {
    // Helper for formatting date
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Customer Management</h1>
                    <p className="text-slate-400 text-sm">Manage user accounts, roles, and access levels</p>
                </div>
                <Button
                    onClick={onAddUser}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-600/20 group gap-2"
                >
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Add New User
                </Button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input Container */}
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        // Added py-0 and forced min/max height to match Select
                        className="pl-12 bg-white/5 border-white/10 text-white h-12 min-h-[48px] max-h-[48px] py-0 rounded-xl focus-visible:ring-blue-500/20 transition-all shadow-inner w-full"
                    />
                </div>

                {/* Select Box Container */}
                <div className="w-full md:w-auto">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        {/* Added py-0 and forced min/max height to match Input */}
                        <SelectTrigger className="w-full md:w-[160px] bg-white/5 border-white/10 text-white h-12 min-h-[48px] max-h-[48px] py-0 rounded-xl focus:ring-blue-500/20 flex items-center">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                            <SelectItem value="all">Every Role</SelectItem>
                            <SelectItem value="proavijit">System Owners</SelectItem>
                            <SelectItem value="admin">Administrators</SelectItem>
                            <SelectItem value="user">Customers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-b border-white/10 hover:bg-transparent">
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Profile & Contact</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest text-center">Auth & Status</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Metadata</TableHead>
                                <TableHead className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Primary Origin</TableHead>
                                <TableHead className="px-6 py-4 text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest">Quick Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-white/5">
                                        <TableCell colSpan={5} className="px-6 py-8">
                                            <div className="flex items-center gap-4 animate-pulse">
                                                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                                                <div className="space-y-2">
                                                    <div className="w-32 h-4 bg-white/10 rounded" />
                                                    <div className="w-48 h-3 bg-white/10 rounded" />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : paginatedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                                                <UserIcon className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-medium italic">No matching users found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedUsers.map((user) => (
                                <TableRow key={user._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-lg">
                                                    <AvatarImage
                                                        src={user.avatar || undefined}
                                                        alt={user.name}
                                                        className="rounded-xl object-cover"
                                                    />
                                                    <AvatarFallback className="bg-[#1e293b] text-white font-bold text-lg rounded-xl">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-[#1e293b] rounded-full shadow-lg ${user.status === 'active' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'}`} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-white font-bold text-sm tracking-tight truncate">{user.name}</span>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <Badge
                                                variant="outline"
                                                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm ${getRoleStyles(user.role)}`}
                                            >
                                                <Shield className="w-2.5 h-2.5" />
                                                {user.role}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={`inline-flex items-center gap-1 px-2 py-0 rounded-full text-[8px] font-bold uppercase border ${getStatusStyles(user.status)}`}
                                            >
                                                <div className={`w-1 h-1 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                {user.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-xs font-semibold">Joined</span>
                                            </div>
                                            <span className="text-slate-500 text-[10px] font-medium ml-5 italic">
                                                {formatDate(user.createdAt)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="text-xs truncate max-w-[120px]">
                                                {user.address?.find(a => a.default)?.city || user.address?.[0]?.city || 'Unknown'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEditUser(user)}
                                                className="h-9 w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDeleteUser(user._id)}
                                                className="h-9 w-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1e293b] border-white/10 text-slate-300 min-w-[160px]">
                                                    <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1.5">User Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-white/5" />
                                                    <DropdownMenuItem onClick={() => onViewDetails(user)} className="gap-2 focus:bg-white/5 cursor-pointer text-xs">
                                                        <UserIcon className="w-3.5 h-3.5 text-blue-400" /> View Statistics
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onResetPassword(user)} className="gap-2 focus:bg-white/5 cursor-pointer text-xs">
                                                        <Loader2 className="w-3.5 h-3.5 text-purple-400" /> Force Key Reset
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onToggleSuspend(user)} className="gap-2 focus:bg-white/5 cursor-pointer text-xs text-red-400">
                                                        {user.status === 'suspended' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                                        {user.status === 'suspended' ? 'Activate Account' : 'Restrict Access'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer / Pagination */}
                <div className="px-6 py-6 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-300">{(currentPage - 1) * 8 + 1}</span> to <span className="text-slate-300">{Math.min(currentPage * 8, users.length)}</span> of <span className="text-slate-300">{users.length}</span> members
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="h-10 w-10 rounded-xl bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all min-w-[40px] ${currentPage === i + 1
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 border-0'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="h-10 w-10 rounded-xl bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
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
    Lock,
    Ban,
    CheckCircle,
    Info,
    Smartphone
} from 'lucide-react';
import { userApi } from '../lib/api';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'proavijit';
    status: 'active' | 'suspended';
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
    address?: Array<{
        street: string;
        city: string;
        county: string;
        postalCode: string;
        country: string;
        default: boolean;
        _id: string;
    }>;
}

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);

    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    // Form State for Create/Edit
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' as User['role']
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userApi.getAllUsers();
            if (data.success) {
                const normalizedUsers = data.users.map((u: any) => ({
                    ...u,
                    status: u.status || 'active'
                }));
                setUsers(normalizedUsers);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'user' });
        setIsDialogOpen(true);
        toast.info('Accessing user registration form...');
    };

    const handleOpenEditDialog = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        });
        setIsDialogOpen(true);
        toast.info(`Preparing to modify profile: ${user.name}`);
    };

    const handleViewDetails = (user: User) => {
        setViewingUser(user);
        setIsViewDialogOpen(true);
        toast.info(`Requesting full profile data for ${user.name}`);
    };

    const handleOpenResetPassword = (user: User) => {
        setViewingUser(user);
        setNewPassword('');
        setIsResetPasswordDialogOpen(true);
        toast.warning(`Security verification for ${user.name}'s password reset`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = (async () => {
            if (editingUser) {
                const updateData = { ...formData };
                if (!updateData.password) delete (updateData as any).password;
                const res = await userApi.updateUser(editingUser._id, updateData);
                if (!res.success) throw new Error(res.message || 'Update failed');
                setIsDialogOpen(false);
                fetchUsers();
                return res;
            } else {
                const res = await userApi.createUser(formData);
                if (!res.success) throw new Error(res.message || 'Creation failed');
                setIsDialogOpen(false);
                fetchUsers();
                return res;
            }
        })();

        toast.promise(promise, {
            loading: editingUser ? 'Syncing user updates...' : 'Creating new system member...',
            success: (data) => editingUser ? `Successfully updated ${data.user.name}` : `Welcome aboard, ${data.user.name}! Account created.`,
            error: (err) => err.message || 'Operation failed'
        });

        try { await promise; } catch { } finally { setIsSubmitting(false); }
    };

    const handleResetPassword = async () => {
        if (!viewingUser || !newPassword) return;
        setIsSubmitting(true);

        const promise = (async () => {
            const res = await userApi.updateUser(viewingUser._id, { password: newPassword });
            if (!res.success) throw new Error(res.message || 'Reset failed');
            setIsResetPasswordDialogOpen(false);
            return res;
        })();

        toast.promise(promise, {
            loading: 'Encrypting and updating password...',
            success: 'Security credentials updated successfully',
            error: (err) => err.message || 'Password reset failed'
        });

        try { await promise; } catch { } finally { setIsSubmitting(false); }
    };

    const toggleSuspendUser = async (user: User) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';

        const promise = (async () => {
            const res = await userApi.updateUser(user._id, { status: newStatus });
            if (!res.success) throw new Error(res.message || 'Operation failed');
            fetchUsers();
            return res;
        })();

        toast.promise(promise, {
            loading: `${newStatus === 'suspended' ? 'Revoking' : 'Restoring'} account access...`,
            success: `User status changed to ${newStatus}`,
            error: (err) => err.message || 'Status update failed'
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deletingUserId) return;

        const promise = (async () => {
            const res = await userApi.deleteUser(deletingUserId);
            if (!res.success) throw new Error(res.message || 'Deletion failed');
            fetchUsers();
            return res;
        })();

        toast.promise(promise, {
            loading: 'Purging user records from database...',
            success: 'User permanently removed from system',
            error: (err) => err.message || 'Failed to delete user'
        });

        setIsDeleteDialogOpen(false);
        setDeletingUserId(null);
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

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Customer Management</h1>
                    <p className="text-slate-400 text-sm">Manage user accounts, roles, and access levels</p>
                </div>
                <Button
                    onClick={handleOpenAddDialog}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-600/20 group gap-2"
                >
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Add New User
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
                    <Input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e293b]/50 border-white/5 rounded-2xl pl-12 pr-4 py-6 text-sm text-slate-300 outline-none focus-visible:ring-blue-500/10 focus-visible:border-blue-500/50 transition-all backdrop-blur-md placeholder:text-slate-600"
                    />
                </div>
                <div className="relative">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full bg-[#1e293b]/50 border-white/5 rounded-2xl h-12 px-6 text-slate-300 focus:ring-blue-500/10 focus:border-blue-500/50 backdrop-blur-md">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e293b] border-white/10 text-slate-300">
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="user">Users</SelectItem>
                            <SelectItem value="admin">Admins</SelectItem>
                            <SelectItem value="proavijit">System Admins</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Main Content Table */}
            <Card className="bg-[#1e293b]/30 backdrop-blur-xl border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-b border-white/5 text-slate-500 hover:bg-transparent">
                            <TableHead className="px-6 py-5 uppercase text-[11px] font-bold">User Profile</TableHead>
                            <TableHead className="px-6 py-5 text-center uppercase text-[11px] font-bold">Role & Status</TableHead>
                            <TableHead className="px-6 py-5 uppercase text-[11px] font-bold">Activity</TableHead>
                            <TableHead className="px-6 py-5 uppercase text-[11px] font-bold">Location</TableHead>
                            <TableHead className="px-6 py-5 text-right uppercase text-[11px] font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <TableRow key={i} className="animate-pulse border-b border-white/5 text-transparent">
                                    <TableCell colSpan={5} className="px-6 py-8">
                                        <div className="h-12 bg-white/5 rounded-xl w-full"></div>
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
                                                <AvatarImage src={user.avatar} alt={user.name} className="rounded-xl object-cover" />
                                                <AvatarFallback className="bg-[#1e293b] text-white font-bold text-lg rounded-xl">
                                                    {user.name.charAt(0)}
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
                                            onClick={() => handleOpenEditDialog(user)}
                                            className="h-9 w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setDeletingUserId(user._id);
                                                setIsDeleteDialogOpen(true);
                                                toast.warning('Warning: Permanent deletion requested');
                                            }}
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
                                                <DropdownMenuItem onClick={() => handleViewDetails(user)} className="cursor-pointer gap-2 px-3 py-2 text-sm focus:bg-white/5">
                                                    <Info className="w-4 h-4 text-blue-400" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenResetPassword(user)} className="cursor-pointer gap-2 px-3 py-2 text-sm focus:bg-white/5">
                                                    <Lock className="w-4 h-4 text-orange-400" />
                                                    Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleSuspendUser(user)} className={`cursor-pointer gap-2 px-3 py-2 text-sm focus:bg-white/5 ${user.status === 'active' ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                    {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Footer / Pagination */}
                <div className="px-6 py-5 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-slate-500 font-medium font-mono">
                            Total: <span className="text-blue-400 font-bold">{filteredUsers.length}</span> Users
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="h-10 w-10 rounded-xl bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-[200px] md:max-w-none">
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

            {/* Add/Edit User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#1e293b] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {editingUser ? 'Edit User Profile' : 'Add New Member'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {editingUser ? "Update the user's information and access level." : "Register a new user to the system."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
                                onValueChange={(v: any) => setFormData({ ...formData, role: v })}
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
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="border-white/10 text-white hover:bg-white/5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingUser ? 'Save Changes' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-[#1e293b] border-white/10 text-white overflow-hidden p-0">
                    <div className="h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 relative">
                        <div className="absolute -bottom-10 left-6">
                            <Avatar className="w-24 h-24 rounded-2xl border-4 border-[#1e293b] shadow-2xl">
                                <AvatarImage src={viewingUser?.avatar} />
                                <AvatarFallback className="bg-blue-600 text-white text-3xl font-bold">
                                    {viewingUser?.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <div className="pt-12 px-6 pb-6 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">{viewingUser?.name}</h2>
                            <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1">
                                <Mail className="w-3.5 h-3.5" />
                                {viewingUser?.email}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Role</p>
                                <p className="text-sm font-semibold capitalize text-blue-400 mt-0.5">{viewingUser?.role}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Status</p>
                                <p className={`text-sm font-semibold capitalize mt-0.5 ${viewingUser?.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {viewingUser?.status}
                                </p>
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-widest">Account Information</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        Created At
                                    </span>
                                    <span className="font-medium">{formatDate(viewingUser?.createdAt, true)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-slate-500" />
                                        Last Updated
                                    </span>
                                    <span className="font-medium">{formatDate(viewingUser?.updatedAt, true)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-slate-500" />
                                        User ID
                                    </span>
                                    <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5">{viewingUser?._id}</span>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-widest">Shipping Address</h3>
                            {viewingUser?.address && viewingUser.address.length > 0 ? (
                                <div className="bg-[#0f172a]/40 rounded-xl p-4 border border-white/5 space-y-2">
                                    <p className="text-sm">
                                        {viewingUser.address[0].street}, {viewingUser.address[0].city}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {viewingUser.address[0].county}, {viewingUser.address[0].postalCode}
                                    </p>
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-tighter">
                                        {viewingUser.address[0].country}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No address provided.</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[400px] bg-[#1e293b] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Lock className="w-5 h-5 text-orange-400" />
                            Reset User Password
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Enter a new password for <span className="text-white font-semibold">{viewingUser?.name}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-[#0f172a]/50 border-white/10"
                                placeholder="••••••••"
                            />
                            <p className="text-[10px] text-slate-500">Minimum 6 characters recommended.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsResetPasswordDialogOpen(false)}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleResetPassword}
                            disabled={!newPassword || isSubmitting}
                            className="bg-orange-600 hover:bg-orange-500 text-white"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-[#1e293b] border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-400 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This will permanently remove the user from the database. This action cannot be undone. Are you absolutely sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold"
                        >
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
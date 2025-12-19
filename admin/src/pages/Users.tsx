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
    Calendar
} from 'lucide-react';
import { userApi } from '../lib/api';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// Helper for formatting date
const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }).format(new Date(dateString));
};

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'proavijit';
    avatar?: string;
    createdAt?: string;
    address?: any[];
}

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userApi.getAllUsers();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
        try {
            const res = await userApi.deleteUser(id);
            if (res.success) {
                toast.success('User deleted successfully');
                fetchUsers();
            }
        } catch (error: any) {
            toast.error(error.message || 'Deletion failed');
        }
    };

    const getRoleStyles = (role: string) => {
        switch (role) {
            case 'proavijit': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'admin': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
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
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-600/20 group gap-2">
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
                        className="w-full bg-[#1e293b]/50 border-white/5 rounded-2xl pl-12 pr-4 py-6 text-sm text-slate-300 outline-none focus-visible:ring-blue-500/10 focus-visible:border-blue-500/50 transition-all backdrop-blur-md"
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

            {/* Main Content Card */}
            <Card className="bg-[#1e293b]/30 backdrop-blur-xl border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-b border-white/5 text-slate-500 hover:bg-transparent">
                            <TableHead className="px-6 py-5 uppercase text-[11px] font-bold">User Profile</TableHead>
                            <TableHead className="px-6 py-5 text-center uppercase text-[11px] font-bold">Role Status</TableHead>
                            <TableHead className="px-6 py-5 uppercase text-[11px] font-bold">Activity</TableHead>
                            <TableHead className="px-6 py-5 uppercase text-[11px] font-bold">Location</TableHead>
                            <TableHead className="px-6 py-5 text-right uppercase text-[11px] font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <TableRow key={i} className="animate-pulse border-b border-white/5">
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
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f172a] rounded-full shadow-lg shadow-emerald-500/20" />
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
                                <TableCell className="px-6 py-4 text-center">
                                    <Badge
                                        variant="outline"
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getRoleStyles(user.role)}`}
                                    >
                                        <Shield className="w-3 h-3" />
                                        {user.role}
                                    </Badge>
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
                                        <span className="text-xs">{user.address?.[0]?.city || 'Unknown Location'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 shadow-sm">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="h-10 w-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl border border-red-500/10 shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 shadow-sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1e293b] border-white/10 text-slate-300">
                                                <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">Reset Password</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-300">Suspend User</DropdownMenuItem>
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

                        <div className="flex gap-1.5">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 border-0'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm flex items-center justify-center transition-all bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-20 shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
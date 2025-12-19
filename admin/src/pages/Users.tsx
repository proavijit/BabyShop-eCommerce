import React, { useState, useEffect } from 'react';
import { userApi } from '../lib/api';
import { toast } from 'sonner';
import type { User, UserFormData } from '../types/user';

// Modular Components
import {
    UserTable,
    UserDialog,
    UserViewDialog,
    UserResetPasswordDialog,
    UserDeleteDialog
} from './Users/components';

export const Users: React.FC = () => {
    // -------------------------------------------------------------------------
    // 1. STATE MANAGEMENT
    // -------------------------------------------------------------------------

    // Core Data
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog Visibility
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selection State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [selectedUserForReset, setSelectedUserForReset] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    // Form & UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [formData, setFormData] = useState<UserFormData>({
        name: '', email: '', password: '', role: 'user', avatar: ''
    });

    // Filtering & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // -------------------------------------------------------------------------
    // 2. DATA FETCHING
    // -------------------------------------------------------------------------

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await userApi.getAllUsers();
            if (res.success) {
                // Ensure each user has required fields for UI
                const normalizedUsers = res.users.map((u: any) => ({
                    ...u,
                    status: u.status || 'active',
                    address: u.address || []
                }));
                setUsers(normalizedUsers);
            }
        } catch (error) {
            toast.error('Cloud synchronization failed. Please check network.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // -------------------------------------------------------------------------
    // 3. DIALOG HANDLERS
    // -------------------------------------------------------------------------

    const handleOpenAddDialog = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'user', avatar: '' });
        setIsDialogOpen(true);
        toast.info('Accessing user registration form...');
    };

    const handleOpenEditDialog = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            avatar: user.avatar || ''
        });
        setIsDialogOpen(true);
        toast.info(`Preparing to modify profile: ${user.name}`);
    };

    const handleViewDetails = (user: User) => {
        setViewingUser(user);
        setIsViewDialogOpen(true);
        toast.info(`Requesting full profile data for ${user.name}`);
    };

    const handleOpenResetDialog = (user: User) => {
        setSelectedUserForReset(user);
        setNewPassword('');
        setIsResetPasswordDialogOpen(true);
    };

    const handleDeleteClick = (userId: string) => {
        setDeletingUserId(userId);
        setIsDeleteDialogOpen(true);
        toast.warning('Warning: Permanent deletion requested');
    };

    // -------------------------------------------------------------------------
    // 4. API ACTIONS
    // -------------------------------------------------------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = (async () => {
            if (editingUser) {
                // If updating, only send password if it's not empty
                const updateData = { ...formData };
                if (!updateData.password || updateData.password.trim() === '') {
                    delete updateData.password;
                }

                const res = await userApi.updateUser(editingUser._id, updateData);
                if (!res.success) throw new Error(res.message);
                setIsDialogOpen(false);
                fetchUsers();
                return res;
            } else {
                const res = await userApi.createUser(formData);
                if (!res.success) throw new Error(res.message);
                setIsDialogOpen(false);
                setCurrentPage(1); // Jump to first page to see new member
                fetchUsers();
                return res;
            }
        })();

        toast.promise(promise, {
            loading: editingUser ? 'Pushing profile updates...' : 'Generating new user identity...',
            success: editingUser ? 'Profile updated successfully' : 'Member registered successfully',
            error: (err) => err.message || 'Identity processing failed'
        });

        try { await promise; } catch { } finally { setIsSubmitting(false); }
    };

    const handleToggleSuspend = async (user: User) => {
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

    const handleResetPassword = async () => {
        if (!selectedUserForReset || !newPassword) return;
        setIsSubmitting(true);

        const promise = (async () => {
            const res = await userApi.updateUser(selectedUserForReset._id, { password: newPassword });
            if (!res.success) throw new Error(res.message);
            setIsResetPasswordDialogOpen(false);
            return res;
        })();

        toast.promise(promise, {
            loading: 'Rebuilding security keys...',
            success: 'Password updated successfully',
            error: (err) => err.message || 'Key rotation failed'
        });

        try { await promise; } catch { } finally { setIsSubmitting(false); }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingUserId) return;
        const promise = (async () => {
            const res = await userApi.deleteUser(deletingUserId);
            if (!res.success) throw new Error(res.message);
            fetchUsers();
            return res;
        })();

        toast.promise(promise, {
            loading: 'Purging user from database...',
            success: 'Identity permanently removed',
            error: (err) => err.message || 'Purge failed'
        });
    };

    // -------------------------------------------------------------------------
    // 5. FILTERING & PAGINATION LOGIC
    // -------------------------------------------------------------------------

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / 8);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * 8, currentPage * 8);

    // -------------------------------------------------------------------------
    // 6. RENDER
    // -------------------------------------------------------------------------

    return (
        <div className="p-4 md:p-8 min-h-screen bg-[#0f172a]/50 text-white">
            <UserTable
                users={users}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                paginatedUsers={paginatedUsers}
                onAddUser={handleOpenAddDialog}
                onEditUser={handleOpenEditDialog}
                onDeleteUser={handleDeleteClick}
                onViewDetails={handleViewDetails}
                onToggleSuspend={handleToggleSuspend}
                onResetPassword={handleOpenResetDialog}
            />

            <UserDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingUser={editingUser}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            <UserViewDialog
                isOpen={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                user={viewingUser}
            />

            <UserResetPasswordDialog
                isOpen={isResetPasswordDialogOpen}
                onOpenChange={setIsResetPasswordDialogOpen}
                user={selectedUserForReset}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                isSubmitting={isSubmitting}
                onReset={handleResetPassword}
            />

            <UserDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
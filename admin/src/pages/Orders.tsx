import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Trash2,
    CheckCircle,
    Clock,
    XCircle,
    Truck,
    ChevronLeft,
    ChevronRight,
    Download,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { orderApi } from '../lib/api';
import { toast } from 'sonner';

// Helper for formatting date
const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }).format(new Date(dateString));
};

interface Order {
    _id: string;
    orderId: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    items: Array<{
        product: {
            _id: string;
            name: string;
            price: number;
            image: string;
        };
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: 'pending' | 'paid' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    shippingAddress: {
        street: string;
        city: string;
        state?: string;
        zipCode?: string;
        country: string;
    };
    createdAt: string;
}

export const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderApi.getAllOrdersAdmin({
                page: currentPage,
                perPage: itemsPerPage,
                status: statusFilter === 'all' ? undefined : statusFilter,
                sortOrder: 'desc'
            });
            setOrders(data.orders);
            setTotalPages(data.totalPages);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await orderApi.updateOrderStatus(id, status);
            toast.success(`Order status updated to ${status}`);
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message || 'Update failed');
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        try {
            await orderApi.deleteOrder(id);
            toast.success('Order deleted successfully');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message || 'Deletion failed');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'paid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-3 h-3" />;
            case 'paid': return <Truck className="w-3 h-3" />;
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'cancelled': return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Order Management</h1>
                    <p className="text-slate-400 text-sm">View and manage all customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all text-sm font-bold shadow-lg shadow-blue-600/20">
                        <ArrowUpRight className="w-4 h-4" />
                        New Order
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e293b]/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all backdrop-blur-md"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#1e293b]/50 border border-white/5 rounded-2xl pl-10 pr-8 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50 transition-all backdrop-blur-md appearance-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid/Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1e293b]/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-white/5">
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8">
                                            <div className="h-12 bg-white/5 rounded-xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 font-bold text-xs">
                                                #{order.orderId.slice(-4)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm tracking-tight">{order.orderId}</span>
                                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">{order.items.length} Items</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-semibold">{order.user.name}</span>
                                            <span className="text-slate-500 text-xs">{order.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-3 h-3 text-slate-500" />
                                            <span className="text-xs">{formatDate(order.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-white">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="group/status relative flex items-center">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${getStatusStyles(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                            {/* Status Update Quick Menu */}
                                            <div className="absolute left-0 top-full mt-2 hidden group-hover/status:flex flex-col bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-20 py-1 min-w-[120px]">
                                                {['pending', 'paid', 'completed', 'cancelled'].filter(s => s !== order.status).map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleUpdateStatus(order._id, s)}
                                                        className="px-4 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order._id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/10 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="relative inline-block text-left">
                                                <button className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <p className="text-xs text-slate-500 font-medium font-mono">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length} orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
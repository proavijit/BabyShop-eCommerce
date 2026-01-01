import React, { useState, useEffect } from 'react';
import {
    Search,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to fetch orders';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await orderApi.updateOrderStatus(id, status);
            toast.success(`Order status updated to ${status}`);
            fetchOrders();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Update failed';
            toast.error(message);
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        try {
            await orderApi.deleteOrder(id);
            toast.success('Order deleted successfully');
            fetchOrders();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Deletion failed';
            toast.error(message);
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
                    <Button variant="outline" className="bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20">
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        New Order
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
                    <Input
                        type="text"
                        placeholder="Search by Order ID, Customer Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e293b]/50 border-white/5 rounded-2xl pl-12 pr-4 py-6 text-sm text-slate-300 outline-none focus-visible:ring-blue-500/10 focus-visible:border-blue-500/50 transition-all backdrop-blur-md"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] bg-[#1e293b]/50 border-white/5 rounded-2xl text-slate-300 h-12 focus:ring-blue-500/10 focus:border-blue-500/50 backdrop-blur-md">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e293b] border-white/10 text-slate-300">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid/Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1e293b]/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-b border-white/5 text-slate-500 hover:bg-transparent">
                            <TableHead className="px-6 py-4 uppercase text-[11px] font-bold">Order Details</TableHead>
                            <TableHead className="px-6 py-4 uppercase text-[11px] font-bold">Customer</TableHead>
                            <TableHead className="px-6 py-4 uppercase text-[11px] font-bold">Date</TableHead>
                            <TableHead className="px-6 py-4 uppercase text-[11px] font-bold">Amount</TableHead>
                            <TableHead className="px-6 py-4 uppercase text-[11px] font-bold text-center">Status</TableHead>
                            <TableHead className="px-6 py-4 uppercase text-[11px] font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <TableRow key={i} className="animate-pulse border-b border-white/5">
                                    <TableCell colSpan={6} className="px-6 py-8">
                                        <div className="h-12 bg-white/5 rounded-xl w-full"></div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                                    No orders found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : orders.map((order) => (
                            <TableRow key={order._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 bg-blue-600/10 border-0 rounded-xl">
                                            <AvatarFallback className="bg-transparent text-blue-400 font-bold text-xs">
                                                #{order.orderId.slice(-4)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm tracking-tight">{order.orderId}</span>
                                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">{order.items.length} Items</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-semibold">{order.user.name}</span>
                                        <span className="text-slate-500 text-xs">{order.user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Calendar className="w-3 h-3 text-slate-500" />
                                        <span className="text-xs">{formatDate(order.createdAt)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm font-bold text-white">
                                    ${order.totalAmount.toFixed(2)}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="outline-none">
                                                <Badge
                                                    variant="outline"
                                                    className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${getStatusStyles(order.status)}`}
                                                >
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </Badge>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-[#1e293b] border-white/10 text-slate-300">
                                            {['pending', 'paid', 'completed', 'cancelled'].filter(s => s !== order.status).map(s => (
                                                <DropdownMenuItem
                                                    key={s}
                                                    onClick={() => handleUpdateStatus(order._id, s)}
                                                    className="uppercase text-[10px] font-bold tracking-widest hover:bg-white/5 cursor-pointer"
                                                >
                                                    Mark as {s}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteOrder(order._id)}
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
                                            <DropdownMenuContent align="end" className="bg-[#1e293b] border-white/10 text-slate-300">
                                                <DropdownMenuItem className="cursor-pointer">Edit Order</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">Invoice PDF</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-300">Cancel Order</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <p className="text-xs text-slate-500 font-medium font-mono">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length} orders
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-30 rounded-xl h-9 w-9"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 border-0'
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
                            className="bg-white/5 border-white/10 text-slate-400 hover:text-white disabled:opacity-30 rounded-xl h-9 w-9"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
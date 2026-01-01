import React from 'react';
import { motion } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { Order } from '../../../types/order';


interface RecentOrdersProps {
    orders: Order[];
    loading: boolean;
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, loading }) => {
    // Fallback data
    const fallbackOrders = [
        { _id: 'ORD-7890', user: { name: 'John Doe' }, totalPrice: 120.50, status: 'delivered', createdAt: new Date().toISOString() },
        { _id: 'ORD-7891', user: { name: 'Sarah Smith' }, totalPrice: 45.00, status: 'pending', createdAt: new Date().toISOString() },
        { _id: 'ORD-7892', user: { name: 'Michael Ross' }, totalPrice: 230.00, status: 'processing', createdAt: new Date().toISOString() },
    ];

    const displayOrders = (orders && orders.length > 0) ? orders.slice(0, 5) : fallbackOrders;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return <CheckCircle className="w-3 h-3 mr-1" />;
            case 'pending': return <Clock className="w-3 h-3 mr-1" />;
            case 'processing': return <Clock className="w-3 h-3 mr-1" />;
            case 'cancelled': return <AlertCircle className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="h-full"
        >
            <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 shadow-xl h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold text-white">Recent Orders</CardTitle>
                    <NavLink to="/dashboard/orders">
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </NavLink>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider pl-6">Order ID</TableHead>
                                <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Customer</TableHead>
                                <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Amount</TableHead>
                                <TableHead className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-white/5">
                                        <TableCell colSpan={4} className="h-16 animate-pulse bg-white/5" />
                                    </TableRow>
                                ))
                            ) : (
                                displayOrders.map((order) => (
                                    <TableRow key={order._id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <TableCell className="font-mono text-blue-400 pl-6 cursor-pointer hover:underline">
                                            #{order._id.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell className="font-medium text-white">
                                            {typeof order.user === 'object' && order.user !== null && 'name' in order.user
                                                ? order.user.name
                                                : 'Guest User'}
                                        </TableCell>
                                        <TableCell className="font-bold text-white">
                                            ${order.totalPrice.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`border font-bold uppercase text-[10px] items-center ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
};

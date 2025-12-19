import React from 'react';
import {
    Users,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Package,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
    { label: 'Total Revenue', value: '$24,560', change: '+12.5%', icon: DollarSign, color: 'bg-emerald-500', trend: 'up' },
    { label: 'Active Orders', value: '145', change: '+5.2%', icon: ShoppingCart, color: 'bg-blue-500', trend: 'up' },
    { label: 'Total Customers', value: '1,240', change: '+18.4%', icon: Users, color: 'bg-purple-500', trend: 'up' },
    { label: 'Products Sold', value: '3,500', change: '-2.1%', icon: Package, color: 'bg-orange-500', trend: 'down' },
];

const recentOrders = [
    { id: '#ORD-7890', customer: 'John Doe', amount: '$120.50', status: 'Delivered', date: '2 mins ago' },
    { id: '#ORD-7891', customer: 'Sarah Smith', amount: '$45.00', status: 'Pending', date: '15 mins ago' },
    { id: '#ORD-7892', customer: 'Michael Ross', amount: '$230.00', status: 'Processing', date: '1 hour ago' },
    { id: '#ORD-7893', customer: 'Emma Watson', amount: '$89.99', status: 'Delivered', date: '3 hours ago' },
];

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">Store Overview</h1>
                <p className="text-slate-400 text-sm italic">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg shadow-black/10 transition-transform group-hover:scale-110`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <Badge variant="outline" className={`border-0 font-bold ${stat.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                        <TrendingUp className={`w-3 h-3 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
                                    <span className="text-white text-2xl font-bold mt-1 tracking-tight">{stat.value}</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <Card className="lg:col-span-2 bg-[#1e293b]/50 backdrop-blur-xl border-white/5 shadow-xl overflow-hidden">
                    <CardHeader className="px-6 py-5 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg font-bold text-white">Recent Orders</CardTitle>
                        <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto font-medium">View All</Button>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-white/5 text-slate-500 hover:bg-transparent">
                                <TableHead className="px-6 py-4 uppercase text-[11px] font-bold">Order ID</TableHead>
                                <TableHead className="px-6 py-4 uppercase text-[11px] font-bold">Customer</TableHead>
                                <TableHead className="px-6 py-4 uppercase text-[11px] font-bold">Amount</TableHead>
                                <TableHead className="px-6 py-4 uppercase text-[11px] font-bold">Status</TableHead>
                                <TableHead className="px-6 py-4 uppercase text-[11px] font-bold text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order, idx) => (
                                <TableRow key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <TableCell className="px-6 py-4 text-sm font-bold text-blue-400">{order.id}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-slate-300">{order.customer}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm font-semibold text-white">{order.amount}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge
                                            variant="outline"
                                            className={`font-bold uppercase tracking-wide border-0 ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    order.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' :
                                                        'bg-blue-500/10 text-blue-400'
                                                }`}
                                        >
                                            {order.status === 'Delivered' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                                                order.status === 'Pending' ? <Clock className="w-3 h-3 mr-1" /> :
                                                    <AlertCircle className="w-3 h-3 mr-1" />}
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-slate-500 text-right">{order.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Quick Actions / Notifications */}
                <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 shadow-xl p-6 flex flex-col gap-6">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-bold text-white">Quick Actions</CardTitle>
                        <p className="text-slate-500 text-xs text-balance">Common administrative tasks</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all gap-2">
                            <Package className="w-4 h-4" />
                            Add New Product
                        </Button>
                        <Button variant="outline" className="w-full h-12 bg-white/5 hover:bg-white/10 text-slate-300 font-bold border-white/5 transition-all gap-2">
                            <Users className="w-4 h-4" />
                            Invite Manager
                        </Button>
                        <Button variant="outline" className="w-full h-12 bg-white/5 hover:bg-white/10 text-slate-300 font-bold border-white/5 transition-all gap-2 text-red-400 hover:bg-red-500/10 hover:border-red-500/20">
                            Clear Cache
                        </Button>
                    </div>

                    <div className="mt-4 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold text-white mb-4">Stock Alerts</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-300">Pampers S3</p>
                                    <p className="text-[10px] text-slate-500">Only 2 items left in stock</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-300">Milk Powder A2</p>
                                    <p className="text-[10px] text-slate-500">Restock arriving tomorrow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
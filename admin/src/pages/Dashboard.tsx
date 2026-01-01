import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardStats } from './Dashboard/components/DashboardStats';
import { SalesChart } from './Dashboard/components/SalesChart';
import { RecentOrders } from './Dashboard/components/RecentOrders';
import { TopProducts } from './Dashboard/components/TopProducts';
import { DistributionCharts } from './Dashboard/components/DistributionCharts';
import { InventoryWidget } from './Dashboard/components/InventoryWidget';
import { ActiveCartsWidget } from './Dashboard/components/ActiveCartsWidget';
import { Activity, Server, Database, Globe } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { api } from '../lib/config';
import { toast } from 'sonner';
import type { Order } from '../types/order';
import type { DataItem } from './Dashboard/components/DistributionCharts';

// Define types for the data we expect
interface DashboardData {
    stats: {
        totalRevenue: number;
        revenueChange: number;
        totalOrders: number;
        ordersChange: number;
        activeUsers: number;
        usersChange: number;
    } | null;
    contacts?: {
        categories: DataItem[];
        brands: DataItem[];
        roles: DataItem[];
    };
    recentOrders: Order[];
    salesData: { name: string; total: number }[];
    loading: boolean;
}

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData>({
        stats: null,
        recentOrders: [],
        contacts: {
            categories: [],
            brands: [],
            roles: []
        },
        salesData: [],
        loading: true
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch basic stats
                const statsRes = await api.get('/stats');

                // Fetch recent orders (simulated by getting all and slicing)
                // In a real app we'd want a dedicated endpoint or query param ?limit=5
                const ordersRes = await api.get('/orders/admin');

                // Process stats data to match DashboardStats component expectations
                const processedStats = {
                    totalRevenue: statsRes.data.counts.totalRevenue,
                    revenueChange: 12.5, // Mocked for now as backend doesn't provide comparison
                    totalOrders: statsRes.data.counts.orders,
                    ordersChange: 5.2,
                    activeUsers: statsRes.data.counts.users,
                    usersChange: 18.2,
                };

                // Sort orders by date descending and take top 5
                const sortedOrders = Array.isArray(ordersRes.data) ?
                    [...ordersRes.data].sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
                    : [];

                setData({
                    stats: processedStats,
                    contacts: statsRes.data,
                    recentOrders: sortedOrders,
                    salesData: [],
                    loading: false
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                toast.error("Failed to load dashboard data");
                setData(prev => ({ ...prev, loading: false }));
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6 lg:space-y-8 p-4 md:p-6 lg:p-8 min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-1"
            >
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 w-fit">
                    Store Overview
                </h1>
                <p className="text-slate-400 text-sm">Welcome back! Here's what's happening today.</p>
            </motion.div>

            {/* Stats Grid */}
            <DashboardStats stats={data.stats} loading={data.loading} />

            {/* Distribution Charts */}
            <div className="w-full">
                <DistributionCharts
                    categories={data.contacts?.categories || []}
                    brands={data.contacts?.brands || []}
                    roles={data.contacts?.roles || []}
                />
            </div>

            {/* Recent Orders - Full Width */}
            <div className="w-full">
                <RecentOrders orders={data.recentOrders} loading={data.loading} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Sales Chart - Spans 2 columns */}
                <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                    <SalesChart data={data.salesData} loading={data.loading} />

                    {/* Active Carts & System Health Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <ActiveCartsWidget />

                        {/* System Status Card */}
                        <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 h-full">
                            <CardContent className="p-6">
                                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-400" />
                                    System Status
                                </h3>
                                <div className="space-y-4">
                                    {/* ... system status items ... */}
                                    <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                                                <Server size={14} />
                                            </div>
                                            <span className="text-sm text-slate-300">API Server</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-xs text-emerald-400 font-medium">Operational</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                                                <Database size={14} />
                                            </div>
                                            <span className="text-sm text-slate-300">Database</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-xs text-emerald-400 font-medium">Connected</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-violet-500/10 text-violet-400">
                                                <Globe size={14} />
                                            </div>
                                            <span className="text-sm text-slate-300">Client Store</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-xs text-emerald-400 font-medium">Live</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column */}
                <div className="xl:col-span-1 space-y-6 lg:space-y-8">
                    <TopProducts />
                </div>
            </div>

            {/* Inventory Stats Row */}
            <InventoryWidget />


        </div>
    );
};
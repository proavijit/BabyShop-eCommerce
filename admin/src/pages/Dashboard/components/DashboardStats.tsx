import React from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface StatData {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    activeUsers: number;
    usersChange: number;
}

interface DashboardStatsProps {
    stats: StatData | null;
    loading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
    // Default/Fallback data structure
    const data = [
        {
            label: 'Total Revenue',
            value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
            change: stats ? `${stats.revenueChange}%` : '0%',
            trend: (stats?.revenueChange || 0) >= 0 ? 'up' : 'down',
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-500',
            iconBg: 'bg-emerald-500/10 text-emerald-500'
        },
        {
            label: 'Total Orders',
            value: stats ? stats.totalOrders.toLocaleString() : '0',
            change: stats ? `${stats.ordersChange}%` : '0%',
            trend: (stats?.ordersChange || 0) >= 0 ? 'up' : 'down',
            icon: ShoppingCart,
            color: 'from-blue-500 to-indigo-500',
            iconBg: 'bg-blue-500/10 text-blue-500'
        },
        {
            label: 'Total Customers',
            value: stats ? stats.activeUsers.toLocaleString() : '0',
            change: stats ? `${stats.usersChange}%` : '0%',
            trend: (stats?.usersChange || 0) >= 0 ? 'up' : 'down',
            icon: Users,
            color: 'from-purple-500 to-pink-500',
            iconBg: 'bg-purple-500/10 text-purple-500'
        },
        {
            label: 'Active Products',
            value: '540', // Ideally this comes from API too
            change: '+12%',
            trend: 'up',
            icon: Package,
            color: 'from-orange-500 to-red-500',
            iconBg: 'bg-orange-500/10 text-orange-500'
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-white/5 border-white/10 h-32 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
            {data.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div key={index} variants={item}>
                        <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all cursor-pointer group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110 group-hover:opacity-[0.06]`} />

                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${stat.iconBg} shadow-lg ring-1 ring-inset ring-black/5`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${stat.trend === 'up'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="w-3 h-3" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3" />
                                        )}
                                        <span>{stat.change}</span>
                                    </div>
                                </div>

                                <div className="space-y-1 relative z-10">
                                    <h3 className="text-sm font-medium text-slate-400 tracking-wide uppercase">{stat.label}</h3>
                                    <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

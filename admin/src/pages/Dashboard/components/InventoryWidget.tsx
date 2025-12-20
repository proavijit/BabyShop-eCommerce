import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { api, API_ENDPOINTS } from '@/lib/config';
import { motion } from 'framer-motion';

interface InventoryCounts {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    featuredProducts: number;
}

export const InventoryWidget: React.FC = () => {
    const [counts, setCounts] = useState<InventoryCounts>({
        totalProducts: 0,
        lowStock: 0,
        outOfStock: 0,
        featuredProducts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                // Fetch overview which contains all the stats we need in one go
                const res = await api.get(`${API_ENDPOINTS.ANALYTICS.BASE}/overview`);

                // Response structure: { success: true, data: { overview: {...}, inventory: {...}, sales: {...} } }
                const analyticsData = res.data.data;
                const overview = analyticsData?.overview || {};
                const inventory = analyticsData?.inventory || {};
                const sales = analyticsData?.sales || {};

                setCounts({
                    totalProducts: overview.totalProducts || 0,
                    lowStock: inventory.lowStockCount || (inventory.lowStockProducts?.length || 0),
                    outOfStock: inventory.outOfStockCount || (inventory.outOfStockProducts?.length || 0),
                    // Using best selling products count as a proxy for "Featured"
                    featuredProducts: sales.bestSellingProducts?.length || 0
                });

            } catch (error) {
                console.error("Failed to fetch inventory data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventoryData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-[#1e293b]/50 border-white/5 h-32 animate-pulse" />
                ))}
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Products",
            value: counts.totalProducts,
            icon: Package,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-500/10",
            badge: null
        },
        {
            label: "Low Stock",
            value: counts.lowStock,
            icon: AlertTriangle,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-500/10",
            badge: { text: "Action Needed", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" }
        },
        {
            label: "Out of Stock",
            value: counts.outOfStock,
            icon: AlertCircle,
            iconColor: "text-red-500",
            iconBg: "bg-red-500/10",
            badge: { text: "Critical", color: "bg-red-500/10 text-red-500 border-red-500/20" }
        },
        {
            label: "Featured Products",
            value: counts.featuredProducts,
            icon: CheckCircle,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-500/10",
            badge: null
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all cursor-pointer group h-full">
                            <CardContent className="p-6 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.iconColor} shadow-lg ring-1 ring-inset ring-black/5`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {stat.badge && (
                                        <Badge className={`text-[10px] py-0.5 px-2 rounded-full font-bold uppercase tracking-tight ${stat.badge.color}`}>
                                            {stat.badge.text}
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-slate-400 tracking-wide">{stat.label}</h3>
                                    <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};

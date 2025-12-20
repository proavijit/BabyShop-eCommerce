import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from 'framer-motion';

interface DataItem {
    name: string;
    value: number;
    [key: string]: any;
}

interface DistributionChartsProps {
    categories: DataItem[];
    brands: DataItem[];
    roles: DataItem[];
    loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-700 p-2 rounded-lg shadow-xl">
                <p className="text-white font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const ChartCard = ({ title, data, delay, description }: { title: string, data: DataItem[], delay: number, description?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
    >
        <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
                {description && <CardDescription className="text-slate-400">{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    {data && data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-slate-300 text-xs ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-500">
                            No data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export const DistributionCharts: React.FC<DistributionChartsProps> = ({ categories, brands, roles }) => {
    // Sort and slice to show only top 3 items to prevent overflow
    const topCategories = [...categories].sort((a, b) => b.value - a.value).slice(0, 3);
    const topBrands = [...brands].sort((a, b) => b.value - a.value).slice(0, 3);
    const topRoles = [...roles].sort((a, b) => b.value - a.value).slice(0, 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <ChartCard title="Category Distribution" data={topCategories} delay={0.1} description="Products by category" />
            <ChartCard title="Brand Distribution" data={topBrands} delay={0.2} description="Products by brand" />
            <ChartCard title="User Roles" data={topRoles} delay={0.3} description="User account types" />
        </div>
    );
};


import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package } from 'lucide-react';

export const TopProducts = () => {
    const products = [
        { name: 'Premium Baby Stroller', sales: 120, percentage: 80, color: 'bg-emerald-500' },
        { name: 'Cotton Onesie Set', sales: 95, percentage: 65, color: 'bg-blue-500' },
        { name: 'Natural Wood Teether', sales: 88, percentage: 55, color: 'bg-purple-500' },
        { name: 'Organic Baby Formula', sales: 76, percentage: 48, color: 'bg-orange-500' },
        { name: 'Soft Fleece Blanket', sales: 65, percentage: 42, color: 'bg-pink-500' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full"
        >
            <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 shadow-xl h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-white">Top Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {products.map((product, index) => (
                        <div key={index} className="space-y-2 group">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-lg ${product.color}/10 flex items-center justify-center text-${product.color.split('-')[1]}-400`}>
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{product.name}</span>
                                </div>
                                <span className="font-bold text-white">{product.sales} sold</span>
                            </div>
                            <Progress value={product.percentage} className="h-2 bg-white/5" indicatorClassName={product.color} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
};

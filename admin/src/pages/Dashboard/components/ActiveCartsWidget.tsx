import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { api, API_ENDPOINTS } from '@/lib/config';

interface CartItem {
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface ActiveCart {
    _id: string;
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    itemCount: number;
    totalValue: number;
    items: CartItem[];
}

export const ActiveCartsWidget: React.FC = () => {
    const [carts, setCarts] = useState<ActiveCart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.ANALYTICS.ACTIVE_CARTS);
                setCarts(res.data.data);
            } catch (error) {
                console.error("Failed to fetch active carts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarts();
    }, []);

    if (loading) {
        return <Card className="bg-[#1e293b]/50 h-[450px] animate-pulse border-white/5" />;
    }

    return (
        <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/5 h-full">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-1">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
                        <ShoppingBag className="w-5 h-5 text-emerald-400" />
                        Live Active Carts
                    </CardTitle>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                        {carts.length} Active
                    </Badge>
                </div>
                <CardDescription className="text-slate-400">Users currently shopping</CardDescription>
            </CardHeader>
            <CardContent>
                {carts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 gap-2">
                        <ShoppingCart className="w-8 h-8 opacity-20" />
                        <p>No active carts right now</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                            {carts.map((cart) => (
                                <div key={cart._id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar className="h-9 w-9 border border-white/10 ring-2 ring-white/5">
                                            <AvatarImage src={cart.user.avatar} />
                                            <AvatarFallback className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold">
                                                {cart.user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="text-sm font-semibold text-white truncate leading-tight">{cart.user.name}</h4>
                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{cart.user.email}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-sm font-bold text-white">${cart.totalValue.toFixed(2)}</div>
                                            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{cart.itemCount} items</div>
                                        </div>
                                    </div>

                                    {/* Cart Items Preview */}
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {cart.items.map((item, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-slate-900 border border-white/5 group">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                ) : (
                                                    <div className="h-full w-full bg-slate-800" />
                                                )}
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-white truncate text-center backdrop-blur-sm">
                                                    x{item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};

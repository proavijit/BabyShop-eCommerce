import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SelectCurrency() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-[60px] h-4 bg-white/10 animate-pulse rounded-md" />
        );
    }

    return (
        <Select defaultValue="usd">
            <SelectTrigger className="w-auto h-auto border-none bg-transparent text-white/90 text-xs font-medium  gap-1 p-0 hover:text-emerald-300 data-[state=open]:bg-transparent transition-colors">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="min-w-[80px]">
                <SelectGroup>
                    <SelectLabel>Currency</SelectLabel>
                    <SelectItem value="usd" className="cursor-pointer">USD</SelectItem>
                    <SelectItem value="eur" className="cursor-pointer">EUR</SelectItem>
                    <SelectItem value="gbp" className="cursor-pointer">GBP</SelectItem>
                    <SelectItem value="bdt" className="cursor-pointer">BDT</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

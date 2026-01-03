"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function SelectCurrency() {
    return (
        <Select defaultValue="usd">
            <SelectTrigger className="w-auto h-auto border-none bg-transparent text-white/90 text-[11px] sm:text-xs font-medium gap-1 p-0 hover:text-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 transition-colors shadow-none outline-none">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>

            <SelectContent
                position="popper"
                sideOffset={8}
                className="min-w-[100px] z-[100] bg-white text-slate-950 shadow-xl border border-slate-200"
            >
                <SelectGroup>
                    <SelectLabel>Currency</SelectLabel>
                    <SelectItem value="usd" className="cursor-pointer">USD</SelectItem>
                    <SelectItem value="eur" className="cursor-pointer">EUR</SelectItem>
                    <SelectItem value="gbp" className="cursor-pointer">GBP</SelectItem>
                    <SelectItem value="bdt" className="cursor-pointer">BDT</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
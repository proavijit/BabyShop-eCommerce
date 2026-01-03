"use client";

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

export default function SelectLanguage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-12 h-4 bg-white/10 animate-pulse rounded-md" />;
    }

    return (
        <Select defaultValue="en">
            <SelectTrigger
                className="w-auto h-auto border-none bg-transparent text-white/90 text-[11px] sm:text-xs font-medium gap-1 p-0 hover:text-white focus:ring-0 focus:ring-offset-0 transition-colors shadow-none outline-none"
            >
                <SelectValue placeholder="Language" />
            </SelectTrigger>

            {/* 1. Added position="popper" for better floating behavior
               2. sideOffset ensures it doesn't touch the trigger
               3. Higher z-index just in case
            */}
            <SelectContent
                position="popper"
                sideOffset={10}
                className="min-w-[120px] z-[100] bg-white text-slate-950 shadow-md"
            >
                <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    <SelectItem value="en" className="cursor-pointer">English</SelectItem>
                    <SelectItem value="es" className="cursor-pointer">Español</SelectItem>
                    <SelectItem value="fr" className="cursor-pointer">Français</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
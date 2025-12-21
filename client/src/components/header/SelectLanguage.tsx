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
    return (
        <Select defaultValue="en">
            <SelectTrigger className="w-auto h-auto border-none bg-transparent text-white/90 text-xs font-medium   gap-1 p-0 hover:text-emerald-300 data-[state=open]:bg-transparent transition-colors">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="min-w-[100px]">
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

import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
    suppressHydrationWarning?: boolean;
}

const Container = ({ children, className, suppressHydrationWarning }: Props) => {
    return (
        <div
            className={cn("max-w-screen-2xl mx-auto px-4", className)}
            suppressHydrationWarning={suppressHydrationWarning}
        >
            {children}
        </div>
    );
};

export default Container;
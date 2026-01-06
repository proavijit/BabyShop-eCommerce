interface ShopHeaderProps {
    title?: string;
    description?: string;
}

/**
 * Static shop header component
 * Can be server component if moved to page.tsx
 * No client-side JavaScript needed
 */
export function ShopHeader({
    title = "The Collection",
    description = "Premium essentials for your little ones, curated for safety and style.",
}: ShopHeaderProps) {
    return (
        <div className="border-b bg-muted/30 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                    {title}
                </h1>
                <p className="text-muted-foreground max-w-lg">{description}</p>
            </div>
        </div>
    );
}

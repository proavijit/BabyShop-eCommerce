import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbItem, BreadcrumbListSchema } from "@/types/type";

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    baseUrl?: string;
}

export default function Breadcrumb({ items, baseUrl = "http://localhost:3000" }: BreadcrumbProps) {
    // Generate JSON-LD for BreadcrumbList
    const jsonLd: BreadcrumbListSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: item.href ? `${baseUrl}${item.href}` : undefined,
        })),
    };

    return (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium">
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ol className="flex items-center flex-wrap gap-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                        )}
                        {item.current ? (
                            <span
                                className="text-babyshopSky font-bold truncate max-w-[200px]"
                                aria-current="page"
                            >
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-gray-500 hover:text-babyshopSky transition-colors whitespace-nowrap"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

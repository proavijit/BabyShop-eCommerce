import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TravelCategory } from "@/types/type";


export function CategoryCard({ category }: { category: TravelCategory }) {
    const Icon = category.icon;

    return (
        <Link
            href={category.link}
            className="group relative flex flex-col items-start p-4 transition-all duration-300 hover:bg-slate-50 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
            aria-labelledby={`cat-title-${category.id}`}
            suppressHydrationWarning={true}
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300" suppressHydrationWarning={true}>
                <Icon className={`h-6 w-6 ${category.iconColor}`} aria-hidden="true" />
            </div>

            <h3 id={`cat-title-${category.id}`} className="mb-1 text-base font-bold text-slate-900">
                {category.name}
            </h3>

            <p className="text-xs font-medium leading-relaxed text-slate-500">
                {category.description}
            </p>

            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" suppressHydrationWarning={true}>
                Explore <ChevronRight className="h-3 w-3" />
            </div>
        </Link>
    );
}
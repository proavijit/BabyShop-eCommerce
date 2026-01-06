import { getBrands } from "@/lib/brandsApi";
import BrandGrid from "./BrandGrid";
import Link from "next/link";
import dynamic from "next/dynamic";

const ChevronRight = dynamic(
    () => import("lucide-react").then((mod) => mod.ChevronRight),
    { ssr: true }
);

interface BrandSectionProps {
    title?: string;
    description?: string;
    accentColor?: string;
    viewAllLink?: string;
}

export default async function BrandSection({
    title = "Brand we love",
    description,
    accentColor = "bg-[#00B5A5]",
    viewAllLink = "/shop",
}: BrandSectionProps) {
    const brands = await getBrands();

    if (brands.length === 0) return null;

    return (
        <section
            aria-labelledby="brand-section-title"
            className="w-full py-10"
        >
            <header className="mb-8 flex items-end justify-between px-1">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <span className={`h-6 w-[3px] rounded-full ${accentColor}`} />
                        <h2
                            id="brand-section-title"
                            className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
                        >
                            {title}
                        </h2>
                    </div>
                    {description && (
                        <p className="text-sm font-medium text-slate-500 md:ml-[15px]">
                            {description}
                        </p>
                    )}
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-slate-900"
                    >
                        View all
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                )}
            </header>

            <BrandGrid brands={brands} />
        </section>
    );
}

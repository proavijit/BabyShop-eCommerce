import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Brand } from "@/types/type";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HomeBrandProps {
    title?: string;
    description?: string;
    accentColor?: string;
    viewAllLink?: string;
}

export default async function HomeBrand({
    title = "Brand we love",
    description,
    accentColor = "bg-[#00B5A5]",
    viewAllLink = "/shop"
}: HomeBrandProps) {
    let brands: Brand[] = [];

    try {
        const data = await fetchData<Brand[]>(API_ENDPOINTS.BRANDS);
        brands = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch brands in HomeBrand:", error);
    }

    if (brands.length === 0) return null;

    return (
        <section className="w-full py-10">
            {/* Header Style */}
            <div className="mb-8 flex items-end justify-between px-1">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <span className={`h-6 w-[3px] rounded-full ${accentColor}`} />
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                            {title}
                        </h2>
                    </div>
                    {description && (
                        <p className="text-sm font-medium text-slate-500 md:ml-[15px]">{description}</p>
                    )}
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 transition-colors hover:text-slate-900"
                    >
                        View all
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                )}
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {brands.map((brand) => (
                    <Link
                        key={brand._id}
                        href={`/shop?brands=${brand._id}`}
                        className="group flex flex-col items-center"
                    >
                        {/* Outer Card: চারদিকে প্যাডিং সহ সাদা ব্যাকগ্রাউন্ডের কার্ড */}
                        <div className="relative w-full aspect-square max-w-[160px] bg-white border border-slate-100 rounded-2xl p-4 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 flex items-center justify-center">

                            {/* Inner Circle: কার্ডের মাঝখানে ছোট বৃত্তাকার ইমেজ কন্টেইনার */}
                            <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50 ring-1 ring-slate-100">
                                {brand.image ? (
                                    <Image
                                        src={brand.image}
                                        alt={brand.name}
                                        fill
                                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                        sizes="(max-width: 768px) 30vw, 15vw"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-400 font-bold text-xl uppercase">
                                        {brand.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Brand Name Label */}
                        <span className="mt-4 text-sm font-bold text-slate-700 transition-colors duration-300 group-hover:text-slate-900">
                            {brand.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
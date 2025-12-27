import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Brand } from "@/types/type";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function HomeBrand() {
    let brands: Brand[] = [];

    try {
        const data = await fetchData<Brand[]>(API_ENDPOINTS.BRANDS);
        brands = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch brands in HomeBrand:", error);
    }

    if (brands.length === 0) return null;

    return (
        <section className={`py-10 px-4 md:px-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-gray-100/50 shadow-sm transition-all duration-500 hover:shadow-md`}>
            <div className="max-w-7xl mx-auto relative">

                {/* Section Header - Clean & Professional */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-100 pb-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Our Trusted <span className="text-babyshopSky">Brands</span>
                        </h2>
                        <p className="text-slate-500 text-sm">
                            Quality products from the names you love and trust.
                        </p>
                    </div>

                    <Link
                        href="/brands"
                        className="group flex items-center gap-2 text-slate-900 font-bold hover:text-babyshopSky transition-all duration-300 text-sm"
                    >
                        View All
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Brands Grid - All same size & No badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {brands.map((brand) => (
                        <Link
                            key={brand._id}
                            href={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group flex flex-col items-center"
                        >
                            {/* Fixed Aspect Ratio Container */}
                            <div className="relative w-full aspect-square rounded-2xl bg-slate-50 border border-transparent overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:border-slate-100 group-hover:-translate-y-2">

                                {brand.image ? (
                                    <Image
                                        src={brand.image}
                                        alt={brand.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <span className="text-slate-300 font-bold text-2xl">{brand.name.charAt(0)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <span className="mt-4 text-[14px] font-bold text-slate-700 group-hover:text-babyshopSky transition-colors duration-300">
                                {brand.name}
                            </span>
                        </Link>
                    ))}
                </div>


            </div>
        </section>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    )
}
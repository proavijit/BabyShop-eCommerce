import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Brand } from "@/types/type";
import { Award, ChevronRight, Sparkles, Star } from "lucide-react";
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

    // If no brands, don't render the section
    if (brands.length === 0) return null;

    return (
        <section className="py-12 px-6 rounded-3xl bg-gradient-to-br from-teal-50/60 via-cyan-50/60 to-white border border-gray-100">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-babyshopSky">
                        <Award className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-1 flex items-center gap-2">
                            Shop by Brand
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Trusted brands for your precious little ones!
                        </p>
                    </div>
                </div>
                <Link
                    href="/brands"
                    className="group flex items-center gap-2 text-babyshopSky font-semibold hover:gap-3 transition-all duration-300 text-sm"
                >
                    View All Brands
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {brands.map((brand) => (
                    <Link
                        key={brand._id}
                        href={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-babyshopSky/40 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Sparkle Effect */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Sparkles className="w-4 h-4 text-babyshopSky" />
                        </div>

                        {/* Brand Content */}
                        <div className="relative flex flex-col items-center justify-center gap-3 h-full min-h-[100px]">
                            {brand.image ? (
                                <div className="relative w-full h-16 flex items-center justify-center">
                                    <Image
                                        src={brand.image}
                                        alt={brand.name}
                                        width={80}
                                        height={64}
                                        className="object-contain max-h-16 w-auto transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                    <Award className="w-8 h-8 text-babyshopSky" />
                                </div>
                            )}

                            <h3 className="text-sm font-bold text-gray-800 text-center group-hover:text-babyshopSky transition-colors duration-300 line-clamp-2">
                                {brand.name}
                            </h3>
                        </div>

                        {/* Bottom Accent Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-babyshopSky to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>
                ))}
            </div>

            {/* Bottom CTA Banner */}
            <div className="mt-10 bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 rounded-2xl p-6 border border-teal-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
                            <Star className="w-6 h-6 text-babyshopSky" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                                Can't find your favorite brand?
                            </h3>
                            <p className="text-sm text-gray-600">
                                We're always adding new trusted brands to our collection
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/contact"
                        className="px-6 py-3 bg-gradient-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 whitespace-nowrap"
                    >
                        Request a Brand
                    </Link>
                </div>
            </div>
        </section>
    );
}
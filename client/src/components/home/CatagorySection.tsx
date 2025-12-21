import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Category, CategoryResponse } from "../../../types/type";
import { ChevronRight } from "lucide-react";
import Link from "next/link";



export default async function CatagorySection() {
    let categories: Category[] = [];
    try {
        const response = await fetchData<CategoryResponse>(API_ENDPOINTS.CATEGORIES);
        categories = response.categories;
    } catch (error) {
        console.error("Failed to fetch categories inside CatagorySection:", error);
    }

    return (
        <div className="hidden md:flex flex-col bg-white h-full p-4 border border-gray-100 rounded-lg shadow-sm min-w-[240px]">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Shop by Category</h2>
            <div className="flex flex-col gap-1">
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                        <Link
                            key={category._id}
                            href={`/category/${category.slug}`}
                            className="flex items-center justify-between text-gray-600 hover:text-[#9c059c] hover:bg-purple-50 px-2 py-2.5 rounded-md transition-all group"
                        >
                            <span className="text-sm font-medium">{category.name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#9c059c] transition-colors" />
                        </Link>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 px-2">Loading categories...</p>
                )}
            </div>
        </div>
    );
}
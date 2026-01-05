// components/sections/category/index.tsx
import { Suspense } from "react";
import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { CategoryResponse } from "@/types/type";
import CategoryList from "./category-list";
import CategorySkeleton from "./category-skeleton";

export default async function CategorySection() {
    // Parallel Fetching - initiating the promise but not awaiting yet
    const categoryPromise = fetchData<CategoryResponse>(
        API_ENDPOINTS.CATEGORIES,
        { next: { revalidate: 3600 } }
    ).catch(err => {
        console.error("Category Fetch Error:", err);
        return { categories: [], total: 0, page: 1, perPage: 0, totalPages: 0 } as CategoryResponse;
    });

    return (
        <Suspense fallback={<CategorySkeleton />}>
            <CategoryDataLayer promise={categoryPromise} />
        </Suspense>
    );
}

// Data layer to handle the specific async boundary
async function CategoryDataLayer({ promise }: { promise: Promise<CategoryResponse> }) {
    const response = await promise;
    return <CategoryList categories={response?.categories || []} />;
}
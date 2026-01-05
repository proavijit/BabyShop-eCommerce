// components/sections/category/category-skeleton.tsx
export default function CategorySkeleton() {
    return (
        <aside className="hidden lg:flex flex-col w-[260px] h-fit bg-white border border-gray-100 rounded-sm p-4 space-y-7 animate-pulse">
            <div className="space-y-3">
                <div className="h-2 w-20 bg-gray-200 rounded" />
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-full bg-gray-100 rounded" />
                ))}
            </div>
            <div className="space-y-3">
                <div className="h-2 w-20 bg-gray-200 rounded" />
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-10 w-full bg-gray-100 rounded" />
                ))}
            </div>
        </aside>
    );
}
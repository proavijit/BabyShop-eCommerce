export default function ProductRowSkeleton() {
    return (
        <div className="w-full mt-10 space-y-16 animate-pulse">
            {[1, 2].map((section) => (
                <div key={section} className="space-y-8">
                    {/* Header Skeleton */}
                    <div className="flex items-end justify-between px-1">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-gray-100 rounded-full" />
                                <div className="h-7 w-48 bg-gray-100 rounded-md" />
                            </div>
                            <div className="h-4 w-64 bg-gray-50 rounded-md ml-[15px]" />
                        </div>
                        <div className="h-4 w-24 bg-gray-50 rounded-md" />
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex flex-col space-y-4">
                                <div className="aspect-[4/5] w-full bg-gray-100 rounded-2xl" />
                                <div className="space-y-2 px-1">
                                    <div className="h-3 w-16 bg-gray-50 rounded" />
                                    <div className="h-4 w-full bg-gray-100 rounded" />
                                    <div className="h-4 w-20 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

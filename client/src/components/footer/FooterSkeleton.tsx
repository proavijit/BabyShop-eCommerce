export default function FooterSkeleton() {
    return (
        <div className="bg-white border-t border-gray-200 animate-pulse">
            {/* Features Bar Skeleton */}
            <div className="bg-gray-50/50 border-b border-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                <div className="space-y-2">
                                    <div className="h-3 w-20 bg-gray-200 rounded" />
                                    <div className="h-2 w-16 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                        <div className="h-4 w-full bg-gray-100 rounded" />
                        <div className="h-4 w-2/3 bg-gray-100 rounded" />
                        <div className="flex gap-3 pt-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-4 w-20 bg-gray-200 rounded" />
                            <div className="space-y-2">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="h-3 w-full bg-gray-100 rounded" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar Skeleton */}
                <div className="border-t border-gray-100 pt-8 flex flex-col items-center space-y-4">
                    <div className="h-1 w-24 bg-gray-100 rounded" />
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}
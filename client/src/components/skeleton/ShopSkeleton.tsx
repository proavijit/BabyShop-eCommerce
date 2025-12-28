import React from 'react';

const ShopSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-10 bg-gray-200 rounded-lg w-32 mb-3" />
                    <div className="h-5 bg-gray-200 rounded-md w-64" />
                </div>

                {/* Search and Sort Bar Skeleton */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
                    <div className="h-12 bg-gray-200 rounded-xl sm:w-56" />
                    <div className="h-12 bg-gray-200 rounded-xl sm:w-56" />
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar Skeleton */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="bg-white rounded-xl p-6 shadow-sm space-y-8">
                            <div>
                                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-200 rounded" />
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-200 rounded" />
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Skeleton */}
                    <main className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-40 mb-6" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                    <div className="aspect-square bg-gray-200" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                                        <div className="flex justify-between items-center pt-2">
                                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                                            <div className="h-10 bg-gray-200 rounded-xl w-1/4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ShopSkeleton;
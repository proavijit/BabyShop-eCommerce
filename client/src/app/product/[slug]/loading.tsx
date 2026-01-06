import Container from "@/components/common/Container";

export default function Loading() {
    return (
        <div className="bg-[#fbfbfb] min-h-screen pb-20 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="bg-white border-b border-gray-100">
                <Container className="py-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-12 bg-gray-100 rounded"></div>
                        <div className="h-3 w-3 bg-gray-100 rounded"></div>
                        <div className="h-3 w-16 bg-gray-100 rounded"></div>
                        <div className="h-3 w-3 bg-gray-100 rounded"></div>
                        <div className="h-3 w-32 bg-gray-50 rounded"></div>
                    </div>
                </Container>
            </div>

            <Container className="mt-8">
                {/* Main Product Card Skeleton */}
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left: Gallery Skeleton */}
                        <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
                            <div className="w-full aspect-square bg-gray-50 rounded-xl mb-6"></div>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="aspect-square w-16 bg-gray-50 rounded-lg"></div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Info Skeleton */}
                        <div className="p-6 md:p-10 flex flex-col gap-8">
                            <div className="space-y-4">
                                <div className="h-4 w-20 bg-gray-100 rounded-full"></div>
                                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                                <div className="h-10 w-2/3 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 w-32 bg-gray-100 rounded"></div>
                            </div>

                            <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="h-12 w-32 bg-gray-100 rounded-lg"></div>
                                    <div className="h-12 flex-1 bg-gray-200 rounded-lg"></div>
                                    <div className="h-12 w-12 bg-gray-100 rounded-lg"></div>
                                </div>
                                <div className="h-14 w-full bg-teal-100/50 rounded-lg"></div>
                            </div>

                            <div className="space-y-4 mt-auto">
                                <div className="h-4 w-full bg-gray-50 rounded"></div>
                                <div className="h-4 w-full bg-gray-50 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="mt-12 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-16 bg-gray-50 border-b border-gray-200"></div>
                    <div className="p-10 space-y-4">
                        <div className="h-6 w-40 bg-gray-200 rounded"></div>
                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

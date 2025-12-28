import Container from "@/components/common/Container";

export default function Loading() {
    return (
        <div className="bg-white min-h-screen animate-pulse">
            <div className="py-6 border-b border-gray-50">
                <Container>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                </Container>
            </div>

            <Container className="py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="w-full aspect-square bg-gray-100 rounded-xl"></div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="aspect-square w-16 bg-gray-100 rounded-lg"></div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-10">
                        <div className="space-y-4">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-12 w-full bg-gray-200 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-10 w-32 bg-gray-200 rounded"></div>
                            <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-14 w-40 bg-gray-100 rounded-2xl"></div>
                                <div className="h-14 flex-1 bg-gray-200 rounded-2xl"></div>
                                <div className="h-14 w-14 bg-gray-100 rounded-2xl"></div>
                            </div>
                            <div className="h-12 bg-gray-50 rounded-xl"></div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 space-y-4">
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-100 rounded"></div>
                                <div className="h-4 w-full bg-gray-100 rounded"></div>
                                <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

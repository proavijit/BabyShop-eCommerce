// components/sections/banner/banner-skeleton.tsx
export default function BannerSkeleton() {
    return (
        <div className="w-full flex flex-col lg:flex-row gap-3 h-auto lg:h-[380px] mb-6 animate-pulse">
            <div className="w-full lg:w-[75%] h-[280px] lg:h-full bg-gray-100 rounded-md border border-gray-50 flex flex-col items-center justify-center space-y-4">
                <div className="w-48 h-3 bg-gray-200 rounded-full" />
                <div className="w-64 h-8 bg-gray-200 rounded-md" />
            </div>
            <div className="hidden lg:flex lg:w-[25%] h-full bg-gray-50 rounded-md border border-gray-50 flex-col items-center pt-10 space-y-4">
                <div className="w-20 h-3 bg-gray-100 rounded-full" />
                <div className="w-32 h-6 bg-gray-100 rounded-md" />
            </div>
        </div>
    );
}
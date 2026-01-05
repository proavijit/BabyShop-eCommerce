// components/sections/banner/index.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Banner } from "@/types/type";
import BannerSkeleton from "./banner-skeleton";

// Dynamic import for client side interactions
const BannerSlider = dynamic(() => import('./banner-slider'), {
    ssr: true,
    loading: () => <BannerSkeleton />
});

export default async function BannerComponent() {
    try {
        const response = await fetchData<Banner[] | { banners: Banner[] }>(
            API_ENDPOINTS.BANNERS,
            { next: { revalidate: 3600 } } // ১ ঘণ্টা পর পর ডাটা রিফ্রেশ হবে (ঐচ্ছিক)
        );

        let allBanners: Banner[] = [];
        if (Array.isArray(response)) {
            allBanners = response;
        } else if (response && 'banners' in response) {
            allBanners = response.banners;
        }

        if (!allBanners || allBanners.length === 0) {
            return null;
        }

        const sliders = allBanners.filter(b => b.bannerType === 'slider');
        const statics = allBanners.filter(b => b.bannerType === 'static' || b.bannerType === 'popup');

        const mainBanners = sliders.length > 0 ? sliders : allBanners;

        return (
            <Suspense fallback={<BannerSkeleton />}>
                <BannerSlider mainBanners={mainBanners} sideBanners={statics} />
            </Suspense>
        );
    } catch (error) {
        console.error("Failed to fetch banners:", error);
        return null;
    }
}
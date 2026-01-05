import { Suspense } from "react";
import Container from "@/components/common/Container";
import CategorySection from "@/components/home/CategorySection";
import ProductList from "@/components/home/ProductList";
import HomeBrand from "@/components/home/HomeBrand"; // PPR এর জন্য ডিরেক্ট ইম্পোর্ট
import BabyTravelSection from "@/components/home/BabyTravelSection"; // PPR এর জন্য ডিরেক্ট ইম্পোর্ট
import BannerComponent from "@/components/home/banner";
import BannerSkeleton from "@/components/home/banner/banner-skeleton";


// নোট: export const experimental_ppr = true; এখানে দেওয়ার দরকার নেই, 
// কারণ আপনার next.config.ts এ cacheComponents: true দেওয়া আছে।

export default function Home() {
  return (
    <div className="bg-babyShopLightWhite min-h-screen">
      <Container className="flex py-7 gap-3">
        {/* লেফট সাইডবার ক্যাটাগরি */}
        <CategorySection />

        <div className="flex-1">
          {/* ১. ব্যানার সেকশন */}
          <Suspense fallback={<BannerSkeleton />}>
            {/* Banner এখন একটি সার্ভার কম্পোনেন্ট যা ডাটা ফেচ করবে */}
            <BannerComponent />
          </Suspense>

          {/* ২. প্রোডাক্ট লিস্ট (সরাসরি ব্যবহারের বদলে সাসপেন্স দেওয়া ভালো পারফরম্যান্সের জন্য) */}
          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5"><div className="h-64 bg-gray-100 animate-pulse rounded-lg col-span-full" /></div>}>
            <ProductList />
          </Suspense>

          {/* ৩. হোম ব্র্যান্ড সেকশন */}
          <Suspense fallback={null}>
            <HomeBrand />
          </Suspense>

          {/* ৪. বেবি ট্রাভেল সেকশন */}
          <Suspense fallback={null}>
            <BabyTravelSection />
          </Suspense>

          {/* ComfyApparelSection ও FeaturedServicesSection এখানে যোগ করতে পারেন */}
        </div>
      </Container>
    </div>
  );
}
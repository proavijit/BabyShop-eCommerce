import Container from "@/components/common/Container";
import CatagorySection from "@/components/home/CatagorySection";
import ProductList from "@/components/home/ProductList";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamic imports for below-the-fold components
const Banner = dynamic(() => import("@/components/home/Banner"), {
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
  ),
});

const HomeBrand = dynamic(() => import("@/components/home/HomeBrand"), {
  loading: () => null,
});

const BabyTravelSection = dynamic(() => import("@/components/home/BabyTravelSection"), {
  loading: () => null,
});

export default function Home() {
  return (
    <div className="bg-babyShopLightWhite min-h-screen">
      <Container className="flex py-7 gap-3">
        <CatagorySection />

        <div className="flex-1">
          <Suspense fallback={<div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl" />}>
            <Banner />
          </Suspense>
          <ProductList />
          <Suspense fallback={null}>
            <HomeBrand />
          </Suspense>
          <Suspense fallback={null}>
            <BabyTravelSection />
          </Suspense>
          {/* ComfyApparelSection */}
          {/* FeaturedServicesSection */}
        </div>
      </Container>
    </div>
  );
}

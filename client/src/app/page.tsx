import { Suspense } from "react";
import Container from "@/components/common/Container";
import ProductList from "@/components/home/product/ProductList";
import ProductRowSkeleton from "@/components/home/product/ProductRowSkeleton";
import { BrandSection } from "@/components/home/brand";
import BabyTravelSection from "@/components/home/BabyTravelSection";
import BannerComponent from "@/components/home/banner";
import BannerSkeleton from "@/components/home/banner/banner-skeleton";
import CategorySection from "@/components/home/category";
import CategorySkeleton from "@/components/home/category/category-skeleton";


export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Container className="flex py-7 gap-6">
        {/* Left Sidebar Category */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Suspense fallback={<CategorySkeleton />}>
            <CategorySection />
          </Suspense>
        </aside>

        <div className="flex-1 overflow-hidden">
          {/* 1. Banner Section */}
          <Suspense fallback={<BannerSkeleton />}>
            <BannerComponent />
          </Suspense>

          {/* 2. Optimized Product Sections */}
          <Suspense fallback={<ProductRowSkeleton />}>
            <ProductList />
          </Suspense>

          {/* 3. Brands & Travel */}
          <div className="mt-20 space-y-20">
            <Suspense fallback={null}>
              <BrandSection />
            </Suspense>

            <Suspense fallback={null}>
              <BabyTravelSection />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
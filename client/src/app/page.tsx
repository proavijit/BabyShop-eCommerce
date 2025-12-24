import Container from "@/components/common/Container";
import Banner from "@/components/home/Banner";


import CatagorySection from "@/components/home/CatagorySection";
import ProductList from "@/components/home/ProductList";


export default function Home() {
  return (
    <div className="bg-babyShopLightWhite min-h-screen">
      <Container className="flex py-7 gap-3">
        <CatagorySection />

        <div className="flex-1">
          <Banner />
          <ProductList />
          {/* BabyTravelSection */}
          {/* ComfyApparelSection */}
          {/* FeaturedServicesSection */}
        </div>
      </Container>
    </div>
  );
}

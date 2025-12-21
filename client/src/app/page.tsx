import Container from "@/components/common/Container";
import CatagorySection from "@/components/home/CatagorySection";


export default function Home() {
  return (
    <div>
      <Container className="min-h-screen flex py-7 gap-3">
        <CatagorySection />

        <div className="flex-1 bg-red-50">
          {/* Banner */}
          {/* ProductList */}
          {/* BabyTravelSection */}
          {/* ComfyApparelSection */}
          {/* FeaturedServicesSection */}
        </div>
      </Container>
    </div>
  );
}

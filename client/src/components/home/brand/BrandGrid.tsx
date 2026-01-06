import { Brand } from "@/types/type";
import BrandCard from "./BrandCard";

interface BrandGridProps {
    brands: Brand[];
}

export default function BrandGrid({ brands }: BrandGridProps) {
    return (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {brands.map((brand) => (
                <BrandCard key={brand._id} brand={brand} />
            ))}
        </div>
    );
}

import { Brand } from "@/types/type";
import Image from "next/image";
import Link from "next/link";

interface BrandCardProps {
    brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
    return (
        <Link
            href={`/shop?brands=${brand._id}`}
            className="group flex flex-col items-center"
        >
            <div className="relative w-full aspect-square max-w-[160px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-50 ring-1 ring-slate-100">
                    {brand.image ? (
                        <Image
                            src={brand.image}
                            alt={brand.name}
                            fill
                            sizes="(max-width: 768px) 40vw, 160px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-bold uppercase text-slate-400">
                            {brand.name.charAt(0)}
                        </div>
                    )}
                </div>
            </div>

            <span className="mt-4 text-sm font-bold text-slate-700 group-hover:text-slate-900">
                {brand.name}
            </span>
        </Link>
    );
}

import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import Container from "@/components/common/Container";
import ProductAction from "@/components/common/product/ProductAction";
import ImageGallery from "@/components/common/product/ImageGallery";
import ProductDescription from "@/components/common/product/ProductDescription";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: {
        id: string;
    };
}

export default async function SingleProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    let product: Product | null = null;

    try {
        product = await fetchData<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    } catch (error) {
        console.error("Failed to fetch product:", error);
        notFound();
    }

    if (!product) {
        notFound();
    }

    const brandName = typeof product.brand === 'object' ? product.brand.name : product.brand;
    const categoryName = typeof product.category === 'object' ? product.category.name : product.category;

    const productImages = product.images && product.images.length > 0
        ? product.images
        : product.image
            ? [product.image]
            : ['/placeholder.png'];

    return (
        <div className="bg-white min-h-screen">
            {/* Minimal Breadcrumb */}
            <div className="py-6 border-b border-gray-50">
                <Container>
                    <nav className="flex items-center gap-2 text-xs text-gray-400 font-medium tracking-wide">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <Link href="/products" className="hover:text-black transition-colors">Shop</Link>
                        {categoryName && (
                            <>
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                                <Link
                                    href={`/category/${typeof product.category === 'object' ? product.category.slug : ''}`}
                                    className="hover:text-black transition-colors"
                                >
                                    {categoryName}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </Container>
            </div>

            <Container className="py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
                    {/* Left Column: Gallery (7 Cols for visual impact) */}
                    <div className="lg:col-span-7">
                        <div className="lg:sticky lg:top-24">
                            <ImageGallery
                                name={product.name}
                                images={productImages}
                            />
                        </div>
                    </div>

                    {/* Right Column: Product Info (5 Cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-10">
                        {/* Header Info */}
                        <div className="space-y-4">
                            {brandName && (
                                <Link
                                    href={`/brand/${typeof product.brand === 'object' ? product.brand._id : ''}`}
                                    className="text-sm font-semibold text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
                                >
                                    {brandName}
                                </Link>
                            )}
                            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-[1.1]">
                                {product.name}
                            </h1>

                            {/* Rating - Minimal */}
                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className={`w-4 h-4 ${star <= (product.averageRating || 0) ? 'text-gray-900 fill-current' : 'text-gray-200'}`}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-gray-500 underline decoration-gray-300 underline-offset-4 decoration-1">
                                    {product.averageRating > 0 ? `${product.averageRating} Rating` : 'No reviews'}
                                </span>
                            </div>
                        </div>

                        {/* Actions & Selectors */}
                        <ProductAction product={product} />

                        {/* Details Accordion - "Collapsible sections" */}
                        <div className="pt-8 border-t border-gray-100">
                            <ProductDescription product={product} />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
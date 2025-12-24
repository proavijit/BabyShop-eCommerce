import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import Container from "@/components/common/Container";
import ProductAction from "@/components/common/product/ProductAction";
import WishListButton from "@/components/common/product/WishListButton";
import ImageGallery from "@/components/common/product/ImageGallery";
import { Share2, Award, Package, Shield, Zap, Tag, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: {
        id: string;
    };
}

export default async function SingleProductPage({ params }: ProductPageProps) {
    let product: Product | null = null;

    try {
        product = await fetchData<Product>(`${API_ENDPOINTS.PRODUCTS}/${params.id}`);
    } catch (error) {
        console.error("Failed to fetch product:", error);
        notFound();
    }

    if (!product) {
        notFound();
    }

    // Get brand and category names
    const brandName = typeof product.brand === 'object' ? product.brand.name : product.brand;
    const categoryName = typeof product.category === 'object' ? product.category.name : product.category;

    // Get images array or fallback to single image
    const productImages = product.images && product.images.length > 0
        ? product.images
        : product.image
            ? [product.image]
            : ['/placeholder.png'];

    return (
        <div className="bg-babyShopLightWhite min-h-screen py-8">
            <Container>
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-babyshopSky transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-babyshopSky transition-colors">Products</Link>
                    <span>/</span>
                    {categoryName && (
                        <>
                            <Link href={`/category/${typeof product.category === 'object' ? product.category.slug : ''}`} className="hover:text-babyshopSky transition-colors">
                                {categoryName}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4 relative">
                        <ImageGallery
                            name={product.name}
                            images={productImages}
                            isFeatured={product.isFeatured}
                            isTrending={product.isTrending}
                            isBestDeal={product.isBestDeal}
                        />

                        {/* Wishlist & Share - Absolute positioned relative to the gallery area */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                            <WishListButton productId={product._id} />
                            <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-babyshopSky hover:scale-110 transition-all duration-300 group/share">
                                <Share2 className="w-5 h-5 text-gray-400 group-hover/share:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="space-y-6">
                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                {product.name}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                {brandName && (
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Brand:</span>
                                        <Link href={`/brand/${brandName.toLowerCase()}`} className="font-semibold text-babyshopSky hover:underline">
                                            {brandName}
                                        </Link>
                                    </div>
                                )}
                                {product.averageRating > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold text-gray-900">{product.averageRating}</span>
                                        </div>
                                        <span className="text-gray-400">|</span>
                                        <span className="text-gray-600">Reviews</span>
                                    </div>
                                )}
                                {product.ageGroup && (
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Age:</span>
                                        <span className="font-semibold text-gray-900">{product.ageGroup}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-3">Product Description</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Product Actions */}
                        <ProductAction product={product} />

                        {/* Trust Badges */}
                        <div className="bg-gradient-to-br from-teal-50/60 via-cyan-50/60 to-white rounded-2xl p-6 border border-gray-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Secure</p>
                                        <p className="text-sm font-bold text-gray-900">Payment</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Free</p>
                                        <p className="text-sm font-bold text-gray-900">Shipping</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Fast</p>
                                        <p className="text-sm font-bold text-gray-900">Delivery</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                        <Award className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Quality</p>
                                        <p className="text-sm font-bold text-gray-900">Assured</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
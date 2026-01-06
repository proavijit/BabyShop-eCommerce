import { API_ENDPOINTS, fetchData } from "@/lib/api";
import { Product, BreadcrumbItem, StructuredProductData } from "@/types/type";
import Container from "@/components/common/Container";
import ProductAction from "@/components/common/product/ProductAction";
import ImageGallery from "@/components/common/product/ImageGallery";
import ProductInfo from "@/components/common/product/ProductInfo";
import PricingSection from "@/components/common/product/PricingSection";
import Breadcrumb from "@/components/common/product/Breadcrumb";
import ProductTabs from "@/components/common/product/ProductTabs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const product = await fetchData<Product>(`${API_ENDPOINTS.PRODUCTS}/slug/${slug}`);

        if (!product) {
            return {
                title: 'Product Not Found | BabyShop',
                description: 'The requested product could not be found.'
            };
        }

        const productImages = product.images && product.images.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const currentUrl = `${baseUrl}/product/${slug}`;

        const metaTitle = product.metaTitle || `${product.name} | BabyShop`;
        const metaDescription = product.metaDescription ||
            (product.description && product.description.length > 155
                ? `${product.description.substring(0, 155)}...`
                : product.description) ||
            `Buy ${product.name} at the best price. High quality baby products with fast shipping.`;

        const ogImage = product.ogImage || productImages[0] || '/placeholder.png';

        return {
            title: metaTitle,
            description: metaDescription,
            keywords: product.keywords || ['baby products', 'kids', product.name],

            openGraph: {
                title: metaTitle,
                description: metaDescription,
                url: currentUrl,
                siteName: 'BabyShop',
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: product.name,
                    },
                ],
                locale: 'en_US',
                type: 'website',
            },

            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDescription,
                images: [ogImage],
            },

            alternates: {
                canonical: currentUrl,
            },

            other: {
                'product:price:amount': String(product.discountPrice || product.price),
                'product:price:currency': 'USD',
            },
        };
    } catch {
        return {
            title: 'Product Not Found | BabyShop',
            description: 'The requested product could not be found.'
        };
    }
}

export default async function SingleProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    let product: Product | null = null;

    try {
        product = await fetchData<Product>(`${API_ENDPOINTS.PRODUCTS}/slug/${slug}`);
    } catch (error) {
        console.error("Failed to fetch product:", error);
        notFound();
    }

    if (!product) {
        notFound();
    }

    const brandName = (product.brand && typeof product.brand === 'object') ? product.brand.name : (product.brand || null);
    const categoryName = (product.category && typeof product.category === 'object') ? product.category.name : (product.category || null);
    const categorySlug = (product.category && typeof product.category === 'object') ? product.category.slug : '';

    const productImages = product.images && product.images.length > 0
        ? product.images
        : product.image
            ? [product.image]
            : ['/placeholder.png'];

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const currentUrl = `${baseUrl}/product/${slug}`;

    // Generate JSON-LD Structured Data
    const structuredData: StructuredProductData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: productImages,
        description: product.description,
        brand: brandName ? {
            '@type': 'Brand',
            name: brandName,
        } : undefined,
        offers: {
            '@type': 'Offer',
            url: currentUrl,
            priceCurrency: 'USD',
            price: product.discountPrice || product.price,
            availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: product.averageRating > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: product.averageRating,
            reviewCount: 0,
            bestRating: 5,
            worstRating: 1,
        } : undefined,
    };

    // Build breadcrumb items
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/products' },
    ];

    if (categoryName && categorySlug) {
        breadcrumbItems.push({
            label: categoryName,
            href: `/category/${categorySlug}`,
        });
    }

    breadcrumbItems.push({
        label: product.name,
        href: `/product/${slug}`,
        current: true,
    });

    return (
        <div className="bg-[#fbfbfb] min-h-screen pb-20">
            {/* Product JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* Breadcrumb Section */}
            <div className="bg-white border-b border-gray-100">
                <Container className="py-4">
                    <Breadcrumb items={breadcrumbItems} baseUrl={baseUrl} />
                </Container>
            </div>

            <Container className="mt-8">
                {/* Main Product Card */}
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left: Gallery */}
                        <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
                            <ImageGallery
                                name={product.name}
                                images={productImages}
                            />
                        </div>

                        {/* Right: Info & Actions */}
                        <div className="p-6 md:p-10 flex flex-col justify-start">
                            <div className="max-w-xl">
                                <ProductInfo product={product} />
                                <PricingSection
                                    price={product.price}
                                    discountPrice={product.discountPrice}
                                />
                                <div className="mt-8">
                                    <ProductAction product={product} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Tabs (Description, Reviews, etc.) */}
                <ProductTabs product={product} />
            </Container>
        </div>
    );
}


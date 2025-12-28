
export interface Category {
    _id: string;
    name: string;
    slug: string;
    categoryType: string;
}
export interface CategoryResponse {
    categories: Category[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export interface Brand {
    _id: string;
    name: string;
    image?: string;
}

export interface BrandResponse {
    brands: Brand[];
    total: number;
}

export interface ProductResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    images?: string[];
    price: number;
    discountPrice?: number;
    brand: string | { _id: string; name: string; image?: string };
    category: string | { _id: string; name: string; slug: string };
    description: string;
    discountPercentage: number;
    stock: number;
    averageRating: number;
    ageGroup?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    isBestDeal?: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    // SEO Fields (Optional)
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords?: string[];
}

// Breadcrumb item for navigation
export interface BreadcrumbItem {
    label: string;
    href: string;
    current?: boolean;
}

// JSON-LD Structured Data Types
export interface StructuredProductData {
    '@context': string;
    '@type': string;
    name: string;
    image: string | string[];
    description: string;
    sku?: string;
    mpn?: string;
    brand?: {
        '@type': string;
        name: string;
    };
    offers: {
        '@type': string;
        url: string;
        priceCurrency: string;
        price: number;
        priceValidUntil?: string;
        availability: string;
        itemCondition: string;
    };
    aggregateRating?: {
        '@type': string;
        ratingValue: number;
        reviewCount: number;
        bestRating: number;
        worstRating: number;
    };
}

export interface BreadcrumbListSchema {
    '@context': string;
    '@type': string;
    itemListElement: Array<{
        '@type': string;
        position: number;
        name: string;
        item?: string;
    }>;
}

export interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Banner {
    _id: string;
    name: string;
    title: string;
    startFrom: number;
    image: string;
    bannerType: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BannerResponse {
    banners: Banner[];
}

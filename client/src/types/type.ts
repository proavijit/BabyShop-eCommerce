
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

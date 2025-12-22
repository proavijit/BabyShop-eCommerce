import type { Category } from './category';
import type { Brand } from './brand';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string | Category;
    brand?: string | Brand;
    images: string[];
    stock: number;
    ageGroup?: string;
    isFeatured: boolean;
    isTrending: boolean;
    isBestDeal: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    discountPrice: number;
    category: string;
    brand: string;
    images: string[];
    stock: number;
    ageGroup: string;
    isFeatured: boolean;
    isTrending: boolean;
    isBestDeal: boolean;
}

export interface ProductResponse {
    products: Product[];
    total: number;
    page: number;
    pages: number;
}

export interface ProductStats {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    featured: number;
    trending: number;
    bestDeals: number;
}

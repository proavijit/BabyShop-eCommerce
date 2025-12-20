import { Category } from './category';
import { Brand } from './brand';

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
}

export interface ProductResponse {
    products: Product[];
    total: number;
    page: number;
    pages: number;
}

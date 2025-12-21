
export interface Category {
    _id: string;
    name: string;
    slug: string;
    categoryType: string;
}

export interface Brand {
    _id: string;
    name: string;
    image?: string;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    price: number;
    brand: string;
    category: string;
    description: string;
    discountPercentage: number;
    stock: number;
    averageRating: number;
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

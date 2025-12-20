export interface Category {
    _id: string;
    name: string;
    image?: string;
    categoryType: 'Featured' | 'Hot Categories' | 'Top Categories';
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryFormData {
    name: string;
    image?: string;
    categoryType: Category['categoryType'];
}

export interface CategoryResponse {
    categories: Category[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

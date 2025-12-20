export interface Brand {
    _id: string;
    name: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BrandFormData {
    name: string;
    image?: string;
}

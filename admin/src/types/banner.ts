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

export interface BannerFormData {
    name: string;
    title: string;
    startFrom: number | '';
    image?: string;
    bannerType: string;
}

export interface Address {
    _id: string;
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    default: boolean;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'proavijit';
    status: 'active' | 'suspended';
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
    address?: Address[];
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    role: User['role'];
    avatar: string;
}

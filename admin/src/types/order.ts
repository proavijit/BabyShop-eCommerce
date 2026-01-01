import type { User } from './user';
import type { Product } from './product';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    product: string | Product;
    quantity: number;
    price: number;
    _id: string;
}

export interface Order {
    _id: string;
    user: string | User;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    shippingAddress: {
        street: string;
        city: string;
        county: string;
        postalCode: string;
        country: string;
    };
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderResponse {
    success: boolean;
    data: Order[] | Order;
    message?: string;
}

export interface OrderFormData {
    status: OrderStatus;
}

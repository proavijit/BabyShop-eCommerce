"use client";

import { Product } from "@/types/type";
import { Star, MessageSquare } from "lucide-react";

interface ProductReviewProps {
    product: Product;
}

export default function ProductReview({ product }: ProductReviewProps) {
    // Check if product has reviews
    const reviews = (product as any).reviews || [];
    const hasReviews = reviews.length > 0;

    return (
        <div className="space-y-8">
            {!hasReviews ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50/50 rounded-[2rem] border border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 rotate-3 transform transition-transform hover:rotate-6">
                        <MessageSquare className="w-8 h-8 text-babyshopSky" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm leading-relaxed">
                        Be the first parent to share your thoughts on <span className="text-babyshopSky font-bold">{product.name}</span>!
                    </p>
                    <button className="px-8 py-3 bg-gradient-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 whitespace-nowrap shadow-babyshopSky/20">
                        Write a Review
                    </button>
                </div>
            ) : (
                <>
                    {/* Rating Summary */}
                    <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                        <div className="text-center">
                            <div className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">{product.averageRating > 0 ? product.averageRating : '0.0'}</div>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className={`w-5 h-5 ${i <= (product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 font-bold">Based on {reviews.length} Reviews</p>
                        </div>

                        <div className="flex-1 w-full flex justify-center md:justify-end">
                            <button className="px-6 py-3 bg-gradient-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 whitespace-nowrap shadow-babyshopSky/20">
                                Write a Review
                            </button>
                        </div>
                    </div>

                    {/* Review List Placeholder */}
                    <div className="space-y-6">
                        <p className="text-center text-gray-400 pt-8">Reviews will appear here...</p>
                    </div>
                </>
            )}
        </div>
    );
}

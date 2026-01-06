"use client";

import { useState } from "react";
import { Product } from "@/types/type";
import ProductivityReview from "./ProductReview";
import { m, AnimatePresence } from "framer-motion";

interface ProductTabsProps {
    product: Product;
}

type TabType = "description" | "brand" | "reviews" | "questions";

export default function ProductTabs({ product }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("description");

    const tabs = [
        { id: "description", label: "Description" },
        { id: "brand", label: "About the Brand" },
        { id: "reviews", label: `Reviews (${product.averageRating > 0 ? '1' : '0'})` },
        { id: "questions", label: "Questions" },
    ];

    return (
        <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden mt-12 shadow-sm">
            {/* Tab Headers */}
            <div className="flex flex-wrap items-center bg-[#f9f9f9] border-b border-gray-200 px-4 pt-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`px-8 py-3 text-sm font-bold transition-all rounded-t-xl border-t border-x border-transparent -mb-[1px] ${activeTab === tab.id
                                ? "bg-white border-gray-200 text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-10 min-h-[300px]">
                <AnimatePresence mode="wait">
                    <m.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "description" && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900">Product Description</h3>
                                <div
                                    className="text-gray-600 leading-relaxed prose prose-slate max-w-none prose-p:font-medium prose-p:text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: product.description?.replace(/\n/g, '<br/>') || "No description available." }}
                                />
                            </div>
                        )}

                        {activeTab === "brand" && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900">About {typeof product.brand === 'object' ? product.brand.name : product.brand}</h3>
                                <p className="text-gray-600 font-medium italic">
                                    Quality baby products designed with care and safety in mind.
                                </p>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <ProductivityReview product={product} />
                        )}

                        {activeTab === "questions" && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-gray-400 font-bold mb-4">No questions have been asked yet.</p>
                                <button className="px-6 py-2 border border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-all">
                                    Ask a Question
                                </button>
                            </div>
                        )}
                    </m.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

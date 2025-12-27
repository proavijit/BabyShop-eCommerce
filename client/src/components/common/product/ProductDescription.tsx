"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/type";
import ProductReview from "./ProductReview";
import { Plus } from "lucide-react";

interface ProductDescriptionProps {
    product: Product;
}

interface AccordionItemProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between text-left group"
            >
                <span className={`text-base font-bold transition-colors ${isOpen ? 'text-babyshopSky' : 'text-gray-900 group-hover:text-babyshopSky'}`}>
                    {title}
                </span>
                <span className={`transition-all duration-300 ${isOpen ? "rotate-45 text-babyshopSky" : "text-gray-300 group-hover:text-babyshopSky"}`}>
                    <Plus className="w-5 h-5" />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-gray-500 text-sm leading-relaxed space-y-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const brandName = (product.brand && typeof product.brand === 'object') ? product.brand.name : (product.brand || 'Unknown');

    return (
        <div className="w-full space-y-8">
            {/* Description Section - Always Open / Static */}
            <div className="border-b border-gray-100 pb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Description</h3>
                <div className="text-gray-600 text-base leading-relaxed space-y-6">
                    {product.description ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <p>No description available.</p>
                    )}

                    {/* Feature Bullets */}
                    <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100">
                        <ul className="grid sm:grid-cols-2 gap-3">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-babyshopSky shadow-sm shadow-babyshopSky/50"></span>
                                <span className="text-sm font-medium text-gray-700">Premium soft-touch materials</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-babyshopSky shadow-sm shadow-babyshopSky/50"></span>
                                <span className="text-sm font-medium text-gray-700">Designed for comfort</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-babyshopSky shadow-sm shadow-babyshopSky/50"></span>
                                <span className="text-sm font-medium text-gray-700">Eco-friendly production</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-babyshopSky shadow-sm shadow-babyshopSky/50"></span>
                                <span className="text-sm font-medium text-gray-700">Durable & Long-lasting</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Accordion Sections for Details */}
            <div>
                <AccordionItem
                    title="Specifications"
                    isOpen={openSection === "specs"}
                    onToggle={() => toggleSection("specs")}
                >
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div className="space-y-1">
                            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Brand</span>
                            <p className="font-bold text-gray-900">{brandName}</p>
                        </div>
                        {product.ageGroup && (
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Age Group</span>
                                <p className="font-bold text-gray-900">{product.ageGroup}</p>
                            </div>
                        )}
                        <div className="space-y-1">
                            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Category</span>
                            <p className="font-bold text-gray-900">
                                {(product.category && typeof product.category === 'object') ? product.category.name : (product.category || 'Unknown')}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Stock Status</span>
                            <p className={`font-bold ${product.stock > 0 ? 'text-teal-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </p>
                        </div>
                    </div>
                </AccordionItem>

                <AccordionItem
                    title={`Reviews`}
                    isOpen={openSection === "reviews"}
                    onToggle={() => toggleSection("reviews")}
                >
                    <ProductReview product={product} />
                </AccordionItem>

                <AccordionItem
                    title="Shipping & Returns"
                    isOpen={openSection === "shipping"}
                    onToggle={() => toggleSection("shipping")}
                >
                    <p>
                        We offer <span className="text-teal-500 font-bold">Free Shipping</span> on all orders over $50. Your order will be processed within 24 hours.
                        <br /><br />
                        We want you to be 100% satisfied. You can return any item within 30 days of delivery, no questions asked.
                    </p>
                </AccordionItem>
            </div>
        </div>
    );
}

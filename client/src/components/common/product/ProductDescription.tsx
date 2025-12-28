"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/type";
import ProductReview from "./ProductReview";

interface AccordionItemProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
    const itemId = title.toLowerCase().replace(/\s+/g, '-');
    const panelId = `panel-${itemId}`;
    const buttonId = `button-${itemId}`;

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                id={buttonId}
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between text-left group"
                aria-expanded={isOpen}
                aria-controls={panelId}
            >
                <span className={`text-base font-bold transition-colors ${isOpen ? 'text-babyshopSky' : 'text-gray-900 group-hover:text-babyshopSky'}`}>
                    {title}
                </span>
                <span className={`transition-all duration-300 ${isOpen ? "rotate-45 text-babyshopSky" : "text-gray-300 group-hover:text-babyshopSky"}`}>
                    <Plus className="w-5 h-5" aria-hidden="true" />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
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

export default function ProductDescription({ product }: { product: Product }) {
    const [openSection, setOpenSection] = useState<string | null>("specs");

    return (
        <div className="w-full space-y-8">
            {/* Description Section - Always Open / Static */}
            <section className="border-b border-gray-100 pb-8" aria-labelledby="description-heading">
                <h2 id="description-heading" className="text-xl font-bold text-gray-900 mb-6">Description</h2>
                <div className="text-gray-600 text-base leading-relaxed space-y-6">
                    {product.description ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <p>No description available for this product.</p>
                    )}

                    <div className="bg-babyshopSky/5 rounded-2xl p-6 border border-babyshopSky/10">
                        <h3 className="font-bold text-babyshopSky flex items-center gap-2 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-babyshopSky"></span>
                            Safety Information
                        </h3>
                        <p className="text-sm text-gray-500 italic">
                            All our baby products are BPA-free and tested to meet international safety standards (ASTM F963).
                        </p>
                    </div>
                </div>
            </section>

            {/* Accordion Sections for Details */}
            <section aria-label="Product details accordion">
                <AccordionItem
                    title="Specifications"
                    isOpen={openSection === "specs"}
                    onToggle={() => setOpenSection(openSection === "specs" ? null : "specs")}
                >
                    <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <li className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Category</span>
                            <span className="text-gray-900 font-medium">{(product.category && typeof product.category === 'object') ? product.category.name : 'Baby Gear'}</span>
                        </li>
                        <li className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Suitability</span>
                            <span className="text-gray-900 font-medium">{product.ageGroup || "0-24 Months"}</span>
                        </li>
                        <li className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Material</span>
                            <span className="text-gray-900 font-medium">100% Organic Cotton</span>
                        </li>
                        <li className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">Condition</span>
                            <span className="text-gray-900 font-medium whitespace-nowrap">New in Box</span>
                        </li>
                    </ul>
                </AccordionItem>

                <AccordionItem
                    title="Customer Reviews"
                    isOpen={openSection === "reviews"}
                    onToggle={() => setOpenSection(openSection === "reviews" ? null : "reviews")}
                >
                    <ProductReview product={product} />
                </AccordionItem>

                <AccordionItem
                    title="Shipping & Returns"
                    isOpen={openSection === "shipping"}
                    onToggle={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                >
                    <p>
                        Free standard shipping on orders over $50. Standard delivery time is 3-5 business days. Express shipping options available at checkout.
                    </p>
                    <p className="mt-2">
                        We want you to be 100% satisfied. You can return any item within 30 days of delivery, no questions asked.
                    </p>
                </AccordionItem>
            </section>
        </div>
    );
}

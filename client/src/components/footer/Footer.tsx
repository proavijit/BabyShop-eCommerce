"use client"; // ✅ এটি যোগ করা হয়েছে

import { Facebook, Instagram, Twitter, Youtube, Heart, CreditCard, Truck, Shield, Baby } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
    // ডাইনামিক টাইমের এরর এড়াতে এই ট্রিকটি ব্যবহার করা হয়েছে
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const footerLinks = {
        shop: [
            { name: "New Arrivals", href: "/new-arrivals" },
            { name: "Best Sellers", href: "/best-sellers" },
            { name: "Sale", href: "/sale" },
            { name: "Brands", href: "/brands" },
            { name: "Gift Cards", href: "/gift-cards" }
        ],
        categories: [
            { name: "Clothing", href: "/category/clothing" },
            { name: "Toys & Games", href: "/category/toys" },
            { name: "Feeding", href: "/category/feeding" },
            { name: "Nursery", href: "/category/nursery" },
            { name: "Travel", href: "/category/travel" }
        ],
        support: [
            { name: "Contact Us", href: "/contact" },
            { name: "FAQs", href: "/faqs" },
            { name: "Shipping Info", href: "/shipping" },
            { name: "Returns", href: "/returns" },
            { name: "Size Guide", href: "/size-guide" }
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Blog", href: "/blog" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" }
        ]
    };

    const features = [
        { icon: Truck, text: "Free Shipping", subtext: "Over $50" },
        { icon: Shield, text: "Secure Payment", subtext: "100% Protected" },
        { icon: CreditCard, text: "Easy Returns", subtext: "30 Days" },
        { icon: Heart, text: "Quality Assured", subtext: "Certified Products" }
    ];

    return (
        <footer className="bg-white border-t border-gray-200" suppressHydrationWarning={true}>
            {/* Features Bar */}
            <div className="bg-gradient-to-br from-teal-50/60 via-cyan-50/60 to-white border-b border-gray-200" suppressHydrationWarning={true}>
                <div className="container mx-auto px-4 py-8" suppressHydrationWarning={true}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6" suppressHydrationWarning={true}>
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <div key={index} className="flex items-center gap-4 group" suppressHydrationWarning={true}>
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300" suppressHydrationWarning={true}>
                                        <IconComponent className="w-6 h-6 text-babyshopSky" />
                                    </div>
                                    <div suppressHydrationWarning={true}>
                                        <h4 className="font-bold text-gray-900 text-sm">{feature.text}</h4>
                                        <p className="text-xs text-gray-600">{feature.subtext}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12" suppressHydrationWarning={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12" suppressHydrationWarning={true}>
                    <div className="lg:col-span-2" suppressHydrationWarning={true}>
                        <Link href="/" className="flex items-center gap-2 mb-4 group" suppressHydrationWarning={true}>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-babyshopSky to-teal-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300" suppressHydrationWarning={true}>
                                <Baby className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-babyshopSky to-teal-400 bg-clip-text text-transparent">BabyShop</span>
                        </Link>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Your trusted destination for premium baby products. We provide quality, safety, and comfort for your little ones with love and care.
                        </p>

                        <div className="flex items-center gap-3" suppressHydrationWarning={true}>
                            <Link href="#" className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([key, links]) => (
                        <div key={key} suppressHydrationWarning={true}>
                            <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning={true}>
                                <div className="w-1 h-5 bg-babyshopSky rounded-full" suppressHydrationWarning={true}></div>
                                {key}
                            </h3>
                            <ul className="space-y-2.5">
                                {links.map((link, index) => (
                                    <li key={index}>
                                        <Link href={link.href} className="text-sm text-gray-600 hover:text-babyshopSky transition-colors duration-300 flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-babyshopSky transition-colors"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-babyshopSky/5 border-t border-babyshopSky/10 py-10" suppressHydrationWarning={true}>
                <div className="text-center" suppressHydrationWarning={true}>
                    <p className="text-sm text-gray-600">
                        © {currentYear} <span className="text-babyshopSky font-bold">BabyShop</span>.
                        Created by Avijit Ghosh <Heart className="w-3.5 h-3.5 inline-block mx-1 fill-red-500 text-red-500" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
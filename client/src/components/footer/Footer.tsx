import { Facebook, Instagram, Twitter, Youtube, Heart, CreditCard, Truck, Shield, Baby } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

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
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
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
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-babyshopSky to-teal-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Baby className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-babyshopSky to-teal-400 bg-clip-text text-transparent">BabyShop</span>
                        </Link>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Your trusted destination for premium baby products. We provide quality, safety, and comfort for your little ones with love and care.
                        </p>

                        {/* Social Media */}
                        <div>
                            <h4 className="text-gray-900 font-bold mb-3 text-sm">Follow Us</h4>
                            <div className="flex items-center gap-3">
                                <Link href="https://facebook.com" className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-500 hover:to-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                                    <Facebook className="w-5 h-5" />
                                </Link>
                                <Link href="https://instagram.com" className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-500 hover:to-pink-600 text-pink-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                                    <Instagram className="w-5 h-5" />
                                </Link>
                                <Link href="https://twitter.com" className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 hover:from-sky-500 hover:to-sky-600 text-sky-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                                    <Twitter className="w-5 h-5" />
                                </Link>
                                <Link href="https://youtube.com" className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-red-100 hover:from-red-500 hover:to-red-600 text-red-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                                    <Youtube className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div suppressHydrationWarning={true}>
                        <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning={true}>
                            <div className="w-1 h-5 bg-gradient-to-b from-babyshopSky to-teal-400 rounded-full" suppressHydrationWarning={true}></div>
                            Shop
                        </h3>
                        <ul className="space-y-2.5">
                            {footerLinks.shop.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="text-sm text-gray-600 hover:text-babyshopSky transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-babyshopSky transition-colors"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories Links */}
                    <div suppressHydrationWarning={true}>
                        <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning={true}>
                            <div className="w-1 h-5 bg-gradient-to-b from-babyshopSky to-teal-400 rounded-full" suppressHydrationWarning={true}></div>
                            Categories
                        </h3>
                        <ul className="space-y-2.5">
                            {footerLinks.categories.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="text-sm text-gray-600 hover:text-babyshopSky transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-babyshopSky transition-colors"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div suppressHydrationWarning={true}>
                        <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning={true}>
                            <div className="w-1 h-5 bg-gradient-to-b from-babyshopSky to-teal-400 rounded-full" suppressHydrationWarning={true}></div>
                            Support
                        </h3>
                        <ul className="space-y-2.5">
                            {footerLinks.support.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="text-sm text-gray-600 hover:text-babyshopSky transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-babyshopSky transition-colors"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div suppressHydrationWarning={true}>
                        <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning={true}>
                            <div className="w-1 h-5 bg-gradient-to-b from-babyshopSky to-teal-400 rounded-full" suppressHydrationWarning={true}></div>
                            Company
                        </h3>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="text-sm text-gray-600 hover:text-babyshopSky transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-babyshopSky transition-colors"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


            </div>

            {/* Bottom Bar - Soft & Playful */}
            <div className="bg-babyshopSky/5 border-t border-babyshopSky/10">
                <div className="container mx-auto px-4 py-10">
                    <div className="flex flex-col items-center gap-6">

                        {/* Payment Badges - Floating Style */}
                        {/* <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-babyshopSky/60 uppercase tracking-widest mr-2">Secure Checkout</span>
                            {['VISA', 'MC', 'AMEX', 'PP'].map((type) => (
                                <div key={type} className="w-10 h-6 bg-white shadow-sm rounded-md flex items-center justify-center text-[9px] font-bold text-gray-400">
                                    {type}
                                </div>
                            ))}
                        </div> */}

                        <div className="h-px w-24 bg-gray-200" />

                        {/* Branding & Attribution */}
                        <div className="text-center" suppressHydrationWarning={true}>
                            <p className="text-sm text-gray-600 mb-1">
                                © {currentYear} <span className="text-babyshopSky font-bold">BabyShop</span>.
                                Created by Avijit Ghosh  <Heart className="w-3.5 h-3.5 inline-block mx-1 fill-babyshopRed text-babyshopRed" />
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}
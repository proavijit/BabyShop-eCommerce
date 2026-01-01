import React from "react";
import { Truck, Facebook, Twitter, Instagram } from "lucide-react";
import Container from "../common/Container";
import { Button } from "../ui/button";
import SelectCurrency from "./SelectCurrency";
import SelectLanguage from "./SelectLanguage";

const TopHeader = () => {
    return (
        <div className="w-full bg-linear-to-r from-babyshopSky to-teal-400 text-white py-3 border-b border-white/10 shadow-md">
            <Container className="flex items-center justify-between text-xs sm:text-sm">
                {/* Left Section: Promo & Socials */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5 text-white/95">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Truck className="h-4 w-4 text-white" />
                        </div>
                        <p className="font-medium">
                            Free Shipping on orders over{" "}
                            <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">$50</span>
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="#"
                            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
                            aria-label="Facebook"
                        >
                            <Facebook className="h-3.5 w-3.5 text-white" />
                        </a>
                        <a
                            href="#"
                            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
                            aria-label="Twitter"
                        >
                            <Twitter className="h-3.5 w-3.5 text-white" />
                        </a>
                        <a
                            href="#"
                            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-3.5 w-3.5 text-white" />
                        </a>
                    </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3">
                        <SelectCurrency />
                        <SelectLanguage />
                    </div>

                    <div className="h-5 w-px bg-white/30 hidden sm:block" />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-3 py-1.5 text-white/90 hover:text-white hover:bg-white/20 font-semibold rounded-full transition-all"
                        >
                            Sign In
                        </Button>
                        <span className="text-white/50">|</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-3 py-1.5 text-white/90 hover:text-white hover:bg-white/20 font-semibold rounded-full transition-all"
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default TopHeader;

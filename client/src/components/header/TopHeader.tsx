import React from "react";
import { Truck, Facebook, Twitter, Instagram } from "lucide-react";
import Container from "../common/Container";
import { Button } from "../ui/button";
import SelectCurrency from "./SelectCurrency";
import SelectLanguage from "./SelectLanguage";

const TopHeader = () => {
    return (
        <div className="w-full bg-[#9c059c] text-white py-2.5 border-b border-white/10">
            <Container className="flex items-center justify-between text-xs sm:text-sm">
                {/* Left Section: Promo & Socials */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-200">
                        <Truck className="h-4 w-4 text-emerald-300" />
                        <p>
                            Free Shipping on all orders over{" "}
                            <span className="font-semibold text-white">$50</span>
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-white/80">
                        <a href="#" className="hover:text-emerald-300 transition-colors">
                            <Facebook className="h-3.5 w-3.5" />
                        </a>
                        <a href="#" className="hover:text-emerald-300 transition-colors">
                            <Twitter className="h-3.5 w-3.5" />
                        </a>
                        <a href="#" className="hover:text-emerald-300 transition-colors">
                            <Instagram className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <SelectCurrency />
                        <SelectLanguage />
                    </div>

                    <div className="h-4 w-px bg-white/20 hidden sm:block" />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-gray-200 hover:text-white hover:bg-transparent font-normal"
                        >
                            Sign In
                        </Button>
                        <span className="text-gray-400">/</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-gray-200 hover:text-white hover:bg-transparent font-normal"
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

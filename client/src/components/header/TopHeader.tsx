import dynamic from "next/dynamic";
import { TiSocialFacebook, TiSocialTwitter, TiSocialLinkedin, TiSocialYoutube } from "react-icons/ti";
import Container from "../common/Container";

// Dynamic imports for client-only components
const SelectCurrency = dynamic(() => import("./client/SelectCurrency"), {
    ssr: false,
    loading: () => <div className="w-16 h-6 bg-white/20 animate-pulse rounded-md" />,
});

const SelectLanguage = dynamic(() => import("./client/SelectLanguage"), {
    ssr: false,
    loading: () => <div className="w-16 h-6 bg-white/20 animate-pulse rounded-md" />,
});

const socialLinks = [
    { icon: <TiSocialFacebook />, label: "Facebook", href: "#" },
    { icon: <TiSocialTwitter />, label: "Twitter", href: "#" },
    { icon: <TiSocialLinkedin />, label: "LinkedIn", href: "#" },
    { icon: <TiSocialYoutube />, label: "YouTube", href: "#" },
];

const TopHeader = () => {
    return (
        <div className="relative z-50 w-full bg-purple-400 text-white text-[12px] sm:text-sm">
            <Container className="flex flex-col md:flex-row items-center justify-between py-2 gap-3 md:gap-0">

                {/* Left Section: Links */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-6">
                    <a href="#" className="hover:underline whitespace-nowrap">Help Center</a>
                    <a href="#" className="hover:underline whitespace-nowrap">Wishlist</a>
                    <a href="#" className="hover:underline whitespace-nowrap">Order Tracking</a>
                </div>

                {/* Center Section */}
                <div className="hidden lg:flex items-center justify-center bg-purple-500/50 px-4 py-1 rounded-full text-[11px] sm:text-xs">
                    100% Secure delivery without contacting the courier
                </div>

                {/* Right Section: Currency, Language & Socials */}
                <div className="flex flex-wrap items-center justify-center gap-4">

                    {/* Currency & Language Select */}
                    <div className="flex items-center gap-2 border-r border-white/20 pr-3 md:border-0 md:pr-0">
                        <SelectCurrency />
                        <SelectLanguage />
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        {socialLinks.map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                aria-label={social.label}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-transform hover:scale-110 backdrop-blur-sm"
                            >
                                <span className="text-lg">{social.icon}</span>
                            </a>
                        ))}
                    </div>

                </div>
            </Container>
        </div>
    );
};

export default TopHeader;

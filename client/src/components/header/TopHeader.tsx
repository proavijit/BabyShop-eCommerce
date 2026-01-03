
import dynamic from "next/dynamic"; // Import dynamic for lazy loading
import { TiSocialFacebook, TiSocialTwitter, TiSocialLinkedin, TiSocialYoutube } from "react-icons/ti";
import Container from "../common/Container";

// Dynamic imports with SSR disabled for browser-heavy components
const SelectCurrency = dynamic(() => import("./client/SelectCurrency"), {
    ssr: false,
    loading: () => <div className="w-12 h-4 bg-white/10 animate-pulse rounded-md" />,
});

const SelectLanguage = dynamic(() => import("./client/SelectLanguage"), {
    ssr: false,
    loading: () => <div className="w-12 h-4 bg-white/10 animate-pulse rounded-md" />,
});

const TopHeader = () => {
    return (
        <div className="relative z-[60] w-full bg-purple-400 text-white text-xs sm:text-sm overflow-visible">
            <Container className="flex flex-col md:flex-row items-center justify-between py-2 gap-3 md:gap-0 overflow-visible">

                {/* Left Section: Links */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-6">
                    <a href="#" className="hover:underline whitespace-nowrap">Help Center</a>
                    <a href="#" className="hover:underline whitespace-nowrap">Wishlist</a>
                    <a href="#" className="hover:underline whitespace-nowrap">Order Tracking</a>
                </div>

                {/* Center Section */}
                <div className="hidden lg:flex items-center text-center bg-purple-500/50 px-4 py-1 rounded-full text-[11px] sm:text-xs">
                    100% Secure delivery without contacting the courier
                </div>

                {/* Right Section: Actions & Socials */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2 border-r border-white/20 pr-3 mr-1 md:border-0 md:p-0 md:m-0">
                        {/* These now load only on the client */}
                        <SelectCurrency />
                        <SelectLanguage />
                    </div>

                    <div className="flex items-center gap-2">
                        {[
                            { icon: <TiSocialFacebook />, label: "Facebook" },
                            { icon: <TiSocialTwitter />, label: "Twitter" },
                            { icon: <TiSocialLinkedin />, label: "LinkedIn" },
                            { icon: <TiSocialYoutube />, label: "YouTube" }
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href="#"
                                aria-label={social.label}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-all hover:scale-110 backdrop-blur-sm"
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
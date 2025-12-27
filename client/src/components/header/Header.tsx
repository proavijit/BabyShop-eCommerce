import Container from "../common/Container";
import Logo from "./Logo";
import SearchInput from "./SearchInput";
import OrdersIcon from "./OrdersIcon";
import WishlistIcon from "./WishlistIcon";
import UserButton from "./UserButton";
import CartIcon from "./CartIcon";
import TopHeader from "./TopHeader";

export default function Header() {
    return (
        <>
            <TopHeader />
            {/* Main Header with Glassmorphism */}
            <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg sticky top-0 z-50 transition-all duration-300">
                <Container>
                    <div className="flex items-center justify-between gap-4 lg:gap-8 py-4 lg:py-5">
                        {/* Left: Logo */}
                        <div className="flex-shrink-0 transition-transform hover:scale-105 duration-200">
                            <Logo />
                        </div>

                        {/* Center: Search (Hidden on Mobile) */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
                            <SearchInput />
                        </div>

                        {/* Right: Action Icons */}
                        <div className="flex items-center gap-3 lg:gap-5">
                            {/* Desktop Icons */}
                            <div className="hidden md:flex items-center gap-4 lg:gap-5">
                                <div className="group relative">
                                    <OrdersIcon />
                                </div>
                                <div className="h-6 w-px bg-gray-200" />
                                <div className="group relative">
                                    <WishlistIcon />
                                </div>
                                <div className="h-6 w-px bg-gray-200" />
                                <div className="group relative">
                                    <UserButton />
                                </div>
                                <div className="h-6 w-px bg-gray-200" />
                                <div className="group relative">
                                    <CartIcon />
                                </div>
                            </div>

                            {/* Mobile Icons - Compact */}
                            <div className="md:hidden flex items-center gap-2">
                                <WishlistIcon />
                                <div className="h-6 w-px bg-gray-200" />
                                <UserButton />
                                <div className="h-6 w-px bg-gray-200" />
                                <CartIcon />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="md:hidden pb-4">
                        <SearchInput />
                    </div>
                </Container>
            </header>
        </>
    );
}
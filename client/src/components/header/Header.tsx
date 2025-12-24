import Container from "../common/Container";
import Logo from "./Logo";
import SearchInput from "./SearchInput";
import OrdersIcon from "./OrdersIcon";
import WishlistIcon from "./WishlistIcon";
import UserButton from "./UserButton";
import CartIcon from "./CartIcon";
import TopHeader from "./TopHeader";

export default function Header() {
    return <>
        <TopHeader />
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <Container className="flex items-center justify-between gap-10 py-5">
                <div className="flex flex-1 items-center justify-between md:justify-start md:gap-12">
                    {/* Logo */}
                    <Logo />

                    {/* Mobile Icons */}
                    <div className="md:hidden flex items-center gap-4">
                        <OrdersIcon />
                        <WishlistIcon />
                        <UserButton />
                        <CartIcon />
                    </div>

                    {/* Search */}
                    <SearchInput />
                </div>

                {/* Desktop Icons */}
                <div className="hidden md:inline-flex items-center gap-6">
                    <OrdersIcon />
                    <WishlistIcon />
                    <UserButton />
                    <CartIcon />
                </div>
            </Container>
        </div>
    </>
}
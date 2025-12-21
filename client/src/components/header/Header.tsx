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
        <Container className="flex items-center justify-between gap-10 py-4">
            <div className="flex flex-1 items-center justify-between md:justify-start md:gap-12">
                {/* Sidebar */}
                <Logo />
                <div className="md:hidden flex items-center gap-3">
                    <OrdersIcon />
                    <WishlistIcon />
                    <UserButton />
                    <CartIcon />
                </div>
                <SearchInput />
            </div>
            <div className="hidden md:inline-flex items-center gap-5">
                <OrdersIcon />
                <WishlistIcon />
                <UserButton />
                <CartIcon />
            </div>
        </Container>
    </>
}
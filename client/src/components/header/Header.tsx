import { Container } from "lucide-react"
import Logo from "./Logo"
import SearchInput from "./SearchInput"


export default function Header() {
    return <>
        <Container className="flex items-center justify-between gap-10 py-4">
            <div className="flex flex-1 items-center justify-between md:justify-start md:gap-12">
                {/* Sidebar */}
                <Logo />
                <div className="md:hidden flex items-center gap-3">
                    OrdersIcon WishlistIcon UserButton CartIcon
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
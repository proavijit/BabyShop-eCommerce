// Logo.tsx এর ভেতরে
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center">
            <Image
                src="/logo.png"
                alt="BabyShop"
                width={150}
                height={40}
                className="object-contain h-10 w-auto"
            />
        </Link>
    );
}
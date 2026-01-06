// Logo.tsx এর ভেতরে
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center" suppressHydrationWarning={true}>
            <Image
                src="/logo.png"
                alt="BabyShop"
                width={150}
                height={40}
                priority={true}
                suppressHydrationWarning={true}
                className="object-contain h-10 w-auto"
                style={{ height: "auto" }}
            />
        </Link>
    );
}
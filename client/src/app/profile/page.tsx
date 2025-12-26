"use client";

import ProfilePage from "@/components/common/pages/ProfilePage";
import Container from "@/components/common/Container";
import { useUserStore } from "@/lib/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function UserProfilePage() {
    const { isAuthenticated, authUser } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/signin?returnUrl=/profile");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !authUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <ProfilePage />
        </div>
    );
}

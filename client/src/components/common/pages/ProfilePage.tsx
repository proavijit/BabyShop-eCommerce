"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import {
    User,
    Mail,
    Shield,
    Calendar,
    LogOut,
    Camera,
    Loader2,
    Edit2,
} from "lucide-react";
import { toast } from "sonner";

import { useUserStore } from "@/lib/store";
import { uploadImage, updateUserProfile } from "@/lib/authApi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// ✅ shadcn-style reusable field (no motion here)
const ProfileField = ({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string;
    icon: any;
}) => (
    <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-3 rounded-md border bg-background px-4 py-3">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{value}</span>
        </div>
    </div>
);

export default function ProfilePage() {
    const { authUser, isAuthenticated, logout, auth_token, updateUser } =
        useUserStore();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, router]);

    if (!authUser || !auth_token) return null;

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        router.push("/");
    };

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size should be less than 2MB");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Updating profile picture...");

        try {
            const uploadRes = await uploadImage(file, auth_token);
            if (uploadRes.success) {
                const updateRes = await updateUserProfile(
                    authUser._id,
                    { avatar: uploadRes.url },
                    auth_token
                );
                if (updateRes.success) {
                    updateUser({ avatar: uploadRes.url });
                    toast.success("Avatar updated", { id: toastId });
                }
            }
        } catch {
            toast.error("Failed to upload image", { id: toastId });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const initials =
        authUser.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U";

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            {/* ✅ ONLY m.div — LazyMotion safe */}
            <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-3xl"
            >
                <Card className="mx-auto">
                    <CardHeader className="flex flex-col items-center gap-4 text-center">
                        <div className="relative">
                            <Avatar className="h-28 w-28">
                                <AvatarImage src={authUser.avatar} />
                                <AvatarFallback className="text-xl font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute -bottom-2 -right-2 rounded-full border bg-background p-2 shadow-sm hover:bg-accent disabled:opacity-60"
                            >
                                {isUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4" />
                                )}
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold leading-none">
                                {authUser.name}
                            </h1>
                            <Badge variant="secondary" className="mx-auto">
                                {authUser.role}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <ProfileField
                                label="Full Name"
                                value={authUser.name}
                                icon={User}
                            />
                            <ProfileField
                                label="Email Address"
                                value={authUser.email}
                                icon={Mail}
                            />
                            <ProfileField
                                label="Account Type"
                                value={authUser.role}
                                icon={Shield}
                            />
                            <ProfileField
                                label="Member Since"
                                value="December 2025"
                                icon={Calendar}
                            />
                        </div>

                        <Separator />

                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <Button className="w-full sm:w-auto">
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full sm:w-auto text-destructive"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </m.div>
        </div>
    );
}

"use client";

import React from "react";
import { useUserStore } from "@/lib/store";
import {
    User,
    Mail,
    Shield,
    Calendar,
    LogOut,
    Camera,
    Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { m } from "framer-motion";
import { uploadImage, updateUserProfile } from "@/lib/authApi";
import { useRef, useState } from "react";

export default function ProfilePage() {
    const { authUser, isAuthenticated, logout, auth_token, updateUser } = useUserStore();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    if (!isAuthenticated || !authUser || !auth_token) {
        return null;
    }

    const handleLogout = () => {
        logout();
        toast.info("Logged out successfully");
        router.push("/");
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size should be less than 2MB");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading avatar...");

        try {
            // 1. Upload to Cloudinary
            const uploadRes = await uploadImage(file, auth_token);

            if (uploadRes.success) {
                // 2. Update user profile in DB
                const updateRes = await updateUserProfile(authUser._id, { avatar: uploadRes.url }, auth_token);

                if (updateRes.success) {
                    // 3. Update local store
                    updateUser({ avatar: uploadRes.url });
                    toast.success("Avatar updated successfully", { id: toastId });
                } else {
                    toast.error("Failed to update profile", { id: toastId });
                }
            } else {
                toast.error("Failed to upload image", { id: toastId });
            }
        } catch (error: unknown) {
            console.error("Avatar update error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to update avatar";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const initials = authUser.name
        ? authUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U";

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <m.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8"
        >
            <Card className="rounded-[48px] border-none shadow-2xl shadow-primary/5 bg-white overflow-hidden">
                <div className="relative h-40 bg-linear-to-r from-babyshopSky to-teal-400" />

                <div className="px-10 pb-12">
                    <div className="relative -mt-20 mb-8 flex flex-col items-center">
                        <div className="relative group">
                            <Avatar className="w-40 h-40 border-8 border-white shadow-2xl rounded-[48px]">
                                <AvatarImage src={authUser.avatar} alt={authUser.name} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary text-5xl font-black">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            <button
                                onClick={handleAvatarClick}
                                disabled={isUploading}
                                className={`absolute bottom-2 right-2 p-3 bg-white rounded-2xl shadow-xl border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{authUser.name}</h1>
                            <Badge className="mt-2 bg-primary/10 text-primary border-none px-4 py-1 rounded-xl font-black text-xs uppercase tracking-widest">
                                {authUser.role}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black ml-1">Full Name</Label>
                            <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100 font-bold text-gray-700 flex items-center gap-3">
                                <User className="w-4 h-4 text-primary/50" />
                                {authUser.name}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black ml-1">Email Address</Label>
                            <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100 font-bold text-gray-700 flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary/50" />
                                {authUser.email}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black ml-1">Account Type</Label>
                            <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100 font-bold text-gray-700 flex items-center gap-3 capitalize">
                                <Shield className="w-4 h-4 text-primary/50" />
                                {authUser.role}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black ml-1">Member Since</Label>
                            <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100 font-bold text-gray-700 flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-primary/50" />
                                December 2025
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button className="px-8 py-6 bg-linear-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white font-black rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 h-auto">
                            Update Details
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="px-8 py-6 text-red-500 font-black rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all h-auto"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </Card>
        </m.div>
    );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore, User as StoreUser } from "@/lib/store";
import { register as registerUser } from "@/lib/authApi";
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Enhanced Schema
const signUpSchema = z.object({
    name: z.string()
        .trim()
        .min(2, { message: "Name must be at least 2 characters" }),
    email: z.string()
        .trim()
        .email({ message: "Please enter a valid email address" })
        .lowercase(),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
    const router = useRouter();
    const { setAuth } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const onSubmit = async (data: SignUpFormValues) => {
        setIsLoading(true);
        try {
            const response = await registerUser(data);

            if (response?.token) {
                const user = {
                    _id: response._id,
                    name: response.name,
                    email: response.email,
                    role: response.role,
                    avatar: response.avatar,
                    addresses: response.address as StoreUser["addresses"]
                };

                setAuth(user, response.token);
                setIsSuccess(true);
                toast.success(`Welcome aboard, ${response.name}!`);

                // Brief delay to show success state before redirect
                setTimeout(() => router.push("/"), 800);
            } else {
                throw new Error("Registration failed");
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] p-8 md:p-10">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h1>
                    <p className="text-gray-500 mt-2 font-bold">Join the baby shop family</p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Full Name Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-extrabold ml-1">
                            Full Name
                        </Label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-babyshopSky transition-colors" />
                            <Input
                                {...register("name")}
                                id="name"
                                placeholder="John Doe"
                                aria-invalid={errors.name ? "true" : "false"}
                                className={`pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-babyshopSky/5 focus:border-babyshopSky transition-all font-bold text-gray-700 ${errors.name ? "border-red-200 bg-red-50/30" : ""
                                    }`}
                            />
                        </div>
                        {errors.name && <p className="text-xs font-black text-red-500 ml-1 animate-in fade-in slide-in-from-left-1">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-extrabold ml-1">
                            Email Address
                        </Label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-babyshopSky transition-colors" />
                            <Input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                aria-invalid={errors.email ? "true" : "false"}
                                className={`pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-babyshopSky/5 focus:border-babyshopSky transition-all font-bold text-gray-700 ${errors.email ? "border-red-200 bg-red-50/30" : ""
                                    }`}
                            />
                        </div>
                        {errors.email && <p className="text-xs font-black text-red-500 ml-1 animate-in fade-in slide-in-from-left-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-extrabold ml-1">
                            Password
                        </Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-babyshopSky transition-colors" />
                            <Input
                                {...register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                aria-invalid={errors.password ? "true" : "false"}
                                className={`pl-12 pr-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-babyshopSky/5 focus:border-babyshopSky transition-all font-bold text-gray-700 ${errors.password ? "border-red-200 bg-red-50/30" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-babyshopSky transition-colors focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs font-black text-red-500 ml-1 animate-in fade-in slide-in-from-left-1">{errors.password.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        className={`w-full h-14 rounded-2xl font-black text-lg transition-all duration-300 border-none shadow-md active:scale-95 ${isSuccess
                            ? "bg-green-500 text-white"
                            : "bg-linear-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white hover:shadow-babyshopSky/20 hover:shadow-lg"
                            }`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : isSuccess ? (
                            <CheckCircle2 className="w-6 h-6 animate-bounce" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Create Account
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        )}
                    </Button>
                </form>

                <footer className="mt-8 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-500 font-bold">
                        Already have an account?{" "}
                        <Link
                            href="/auth/signin"
                            className="text-babyshopSky font-black hover:underline underline-offset-4 decoration-2"
                        >
                            Sign In
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
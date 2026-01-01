"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUserStore, User } from "@/lib/store";
import { login } from "@/lib/authApi";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/";
    const { setAuth } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: SignInFormValues) => {
        setIsLoading(true);

        try {
            const response = await login({
                email: data.email,
                password: data.password,
            });

            if (response && response.token) {
                const user = {
                    _id: response._id,
                    name: response.name,
                    email: response.email,
                    role: response.role,
                    avatar: response.avatar,
                    addresses: response.address as User["addresses"]
                };

                setAuth(user, response.token);
                toast.success("Welcome back! " + response.name);
                router.push(returnUrl);
            } else {
                toast.error("Invalid credentials or server error");
            }
        } catch (err: unknown) {
            console.error("Login Error:", err);
            const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white border border-gray-100 shadow-xl rounded-[32px] p-8 md:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 font-bold">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-extrabold ml-1">Email Address</Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-babyshopSky transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                                className={`pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-babyshopSky/5 focus:border-babyshopSky transition-all font-bold text-gray-700 ${errors.email ? "border-red-200 bg-red-50/30" : ""
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs font-black text-red-500 ml-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" title="password" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-extrabold">Password</Label>
                            <Link href="/auth/forgot-password" title="forgot-password" className="text-xs font-black text-babyshopSky hover:underline underline-offset-4">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-babyshopSky transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                className={`pl-12 pr-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-babyshopSky/5 focus:border-babyshopSky transition-all font-bold text-gray-700 ${errors.password ? "border-red-200 bg-red-50/30" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-babyshopSky transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs font-black text-red-500 ml-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl bg-linear-to-r from-babyshopSky to-teal-400 hover:from-teal-400 hover:to-babyshopSky text-white font-black text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-100 border-none"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-500 font-bold">
                        New here?{" "}
                        <Link href="/auth/signup" className="text-babyshopSky font-black hover:underline underline-offset-4">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

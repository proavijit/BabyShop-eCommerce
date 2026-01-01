import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, User, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        return () => clearError();
    }, [isAuthenticated, navigate, clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast.success('Admin account created successfully!');
            navigate('/dashboard');
        } catch (error: unknown) {
            let message = "Registration failed. Please try again.";
            if (error instanceof Error) message = error.message;
            toast.error(message);
        } finally {
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-[450px] z-10">
                <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-white/10 shadow-2xl">
                    <CardHeader className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                            <CardTitle className="text-2xl font-bold text-white">Create Admin Account</CardTitle>
                            <CardDescription className="text-slate-400">Join BabyMart management team</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-400">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300 ml-1">Full Name</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-[#0f172a]/50 border-white/10 text-white pl-12 pr-4 py-6 rounded-xl outline-none focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 ml-1">Email Address</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-[#0f172a]/50 border-white/10 text-white pl-12 pr-4 py-6 rounded-xl outline-none focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="admin@babymart.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300 ml-1">Password</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-[#0f172a]/50 border-white/10 text-white pl-12 pr-4 py-6 rounded-xl outline-none focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 ml-1 italic">* Password must be at least 6 characters long</p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-600/20 transition-all gap-2 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <div className="w-5 h-5 flex items-center justify-center relative transition-all group-hover:translate-x-1">
                                            →
                                        </div>
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col items-center gap-4 mt-2">
                        <p className="text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors">
                                Login Here
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
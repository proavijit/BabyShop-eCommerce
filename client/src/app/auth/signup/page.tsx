"use client";

import SignUpForm from "@/components/common/pages/SignUpForm";
import Container from "@/components/common/Container";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/30 py-20">
            <Container>
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
                    </div>
                }>
                    <SignUpForm />
                </Suspense>
            </Container>
        </div>
    );
}

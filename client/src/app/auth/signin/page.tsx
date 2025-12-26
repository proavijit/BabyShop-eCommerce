"use client";

import SignInForm from "@/components/common/pages/SignInForm";
import Container from "@/components/common/Container";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 py-12">
            <Container>
                <Suspense fallback={
                    <div className="flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                }>
                    <SignInForm />
                </Suspense>
            </Container>
        </div>
    );
}
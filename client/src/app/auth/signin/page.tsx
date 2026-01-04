"use client";

import SignInForm from "@/components/common/pages/SignInForm";
import Container from "@/components/common/Container";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="w-full py-12">
            <Container>
                <Suspense
                    fallback={
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    }
                >
                    <SignInForm />
                </Suspense>
            </Container>
        </div>
    );
}

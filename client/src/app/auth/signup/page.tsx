"use client";

import SignUpForm from "@/components/common/pages/SignUpForm";
import Container from "@/components/common/Container";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
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
                    <SignUpForm />
                </Suspense>
            </Container>
        </div>
    );
}

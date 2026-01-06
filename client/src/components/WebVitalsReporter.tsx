"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/web-vitals";

export default function WebVitalsReporter() {
    useEffect(() => {
        // 1. Report Web Vitals
        reportWebVitals();

        // 2. Hydration Noise Guard (Development only)
        // This silences persistent noise from browser extensions (e.g. Bitdefender)
        // that inject attributes after SSR but before hydration.
        if (process.env.NODE_ENV === "development") {
            const originalError = console.error;
            console.error = (...args) => {
                const errorMsg = args[0]?.toString() || "";
                const isHydrationError = errorMsg.includes("hydration-mismatch") ||
                    errorMsg.includes("Hydration failed") ||
                    errorMsg.includes("server rendered HTML didn't match");

                const isExtensionNoise = args.some(arg =>
                    typeof arg === 'string' && (arg.includes('bis_skin_checked') || arg.includes('bis_size'))
                );

                if (isHydrationError && isExtensionNoise) {
                    return;
                }
                originalError.apply(console, args);
            };

            return () => {
                console.error = originalError;
            };
        }
    }, []);

    return null;
}

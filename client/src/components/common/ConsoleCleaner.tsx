"use client";

import { useEffect } from "react";

export default function ConsoleCleaner() {
    useEffect(() => {
        // Save original methods
        const originalError = console.error;
        const originalWarn = console.warn;

        // Filter out hydration mismatch errors caused by extensions
        console.error = (...args: any[]) => {
            const msg = args[0];
            if (
                typeof msg === "string" &&
                (msg.includes("bis_skin_checked") ||
                    msg.includes("Hydration failed because the initial UI does not match the server-rendered HTML") ||
                    msg.includes("A tree hydrated but some attributes of the server rendered HTML didn't match") ||
                    msg.includes("There was an error while hydrating. Because the error happened outside of a Suspense boundary"))
            ) {
                // Suppress these specific errors
                return;
            }
            originalError.apply(console, args);
        };

        // Filter out specific warnings
        console.warn = (...args: any[]) => {
            const msg = args[0];
            if (typeof msg === "string" && msg.includes("bis_skin_checked")) {
                return;
            }
            originalWarn.apply(console, args);
        };

        // Cleanup on unmount
        return () => {
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);

    return null;
}

'use client'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
            <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 shadow-lg">
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* Error Icon */}
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-destructive"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    {/* Error Message */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">
                            Something went wrong!
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            We encountered an unexpected error. Please try again.
                        </p>
                    </div>

                    {/* Error Details (Development only) */}
                    {process.env.NODE_ENV === 'development' && error.message && (
                        <div className="w-full p-4 bg-muted rounded-lg text-left">
                            <p className="text-xs font-mono text-muted-foreground break-all">
                                {error.message}
                            </p>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={reset}
                        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </div>
        </div>
    )
}

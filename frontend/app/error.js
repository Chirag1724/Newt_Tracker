'use client';

export default function Error({ error, reset }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="text-center max-w-2xl">
                {/* Large 500 Text */}
                <div className="mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-black text-red-500/10 leading-none select-none">
                        500
                    </h1>
                </div>

                {/* Icon */}
                <div className="mb-6">
                    <svg className="mx-auto h-32 w-32 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Message */}
                <h2 className="text-4xl font-bold text-dark mb-4">Something Went Wrong!</h2>
                <p className="text-xl text-gray-600 mb-2">
                    We encountered an unexpected error. Don't worry, our team has been notified.
                </p>
                {error?.message && (
                    <p className="text-sm text-gray-500 mb-8 font-mono bg-gray-100 p-4 rounded-xl">
                        {error.message}
                    </p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <button onClick={reset} className="btn-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again
                    </button>
                    <a href="/distributor/dashboard" className="btn-outline">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go to Dashboard
                    </a>
                </div>

                {/* Help Text */}
                <p className="mt-12 text-sm text-gray-500">
                    If this persists, please <a href="/contact" className="text-primary font-semibold hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}

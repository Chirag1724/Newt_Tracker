'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Prefetch dashboards for instant navigation
    useEffect(() => {
        router.prefetch('/admin/dashboard');
        router.prefetch('/distributor/dashboard');
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData.email, formData.password);

            if (response.success) {
                setIsSuccess(true);
                const dashboard = response.user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/distributor/dashboard';

                // Play animation then redirect
                setTimeout(() => {
                    router.replace(dashboard);
                }, 1800);
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4 font-body relative">
            {/* Back to Home Link */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-primary font-bold transition-colors group"
            >
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </div>
                <span className="hidden sm:inline">Back to Home</span>
            </Link>

            {/* Logo Section */}
            <Link href="/" className="mb-8 animate-fadeIn flex flex-col items-center group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center p-2 mb-4 group-hover:scale-105 transition-transform">
                    <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-dark tracking-tight">Newt Tracker</h1>
            </Link>

            <div className="w-full max-w-md animate-fadeIn">
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-primary/5 border border-gray-100">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-heading font-bold text-dark mb-2">Welcome Back</h2>
                        <p className="text-gray-500 font-medium whitespace-nowrap">Enter your details to access your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl animate-shake">
                            <p className="text-red-700 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-1 py-[1.25rem] pl-[1.1rem] flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <svg className="w-5 h-5 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-medium placeholder:text-gray-400/60"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
                                <Link href="#" className="text-xs font-bold text-primary hover:text-secondary transition-colors uppercase tracking-wider">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-1 py-[1.25rem] pl-[1.1rem] flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-12 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-medium placeholder:text-gray-400/60"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 font-medium">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* iPhone style Success Overlay */}
            {isSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md animate-fadeIn">
                    <div className="flex flex-col items-center animate-scaleInSuccess">
                        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center success-glow mb-6">
                            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" className="animate-drawCheck" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-dark mb-1">Authentication Successful</h3>
                        <p className="text-gray-500 font-medium">Welcome back to Newt Tracker</p>
                    </div>
                </div>
            )}
        </div>
    );
}

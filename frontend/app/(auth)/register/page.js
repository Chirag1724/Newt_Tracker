'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'distributor',
        phone: '',
        state: '',
        district: '',
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

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await register(formData);

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
            setError(err.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-6 font-body relative">
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
            <Link href="/" className="mb-8 flex flex-col items-center group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center p-2 mb-3 group-hover:scale-110 transition-transform">
                    <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-dark tracking-tight">Newt Tracker</h1>
            </Link>

            <div className="w-full max-w-2xl animate-fadeIn">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-gray-100">
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl font-heading font-bold text-dark mb-3">Create Account</h2>
                        <p className="text-gray-500 font-medium">Join our mission to power conservation with data</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-xl animate-shake">
                            <p className="text-red-700 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name *</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-medium"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address *</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-medium"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password *</label>
                                <div className="relative group">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-medium pr-14"
                                        placeholder="Min. 6 characters"
                                    />
                                    {formData.password.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-2"
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
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Role *</label>
                                <select
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-bold appearance-none cursor-pointer"
                                >
                                    <option value="distributor">Distributor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-medium"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">State</label>
                                <input
                                    name="state"
                                    type="text"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-medium"
                                    placeholder="Maharashtra"
                                />
                            </div>

                            {formData.role === 'distributor' && (
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">District</label>
                                    <input
                                        name="district"
                                        type="text"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all text-dark font-medium"
                                        placeholder="Enter your district"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-[1.5rem] font-bold text-lg transition-all transform active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center group mt-4"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <svg className="w-6 h-6 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                                Sign in here
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
                        <h3 className="text-2xl font-heading font-bold text-dark mb-1">Registration Successful</h3>
                        <p className="text-gray-500 font-medium">Welcome to the Newt Tracker mission</p>
                    </div>
                </div>
            )}
        </div>
    );
}

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

    useEffect(() => {
        // Prefetch dashboard pages for instant transition after login
        router.prefetch('/admin/dashboard');
        router.prefetch('/distributor/dashboard');
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData.email, formData.password);

            if (response.success) {
                // Redirect based on user role
                const dashboard = response.user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/distributor/dashboard';
                router.push(dashboard);
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="card animate-fadeIn">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="font-heading text-4xl font-bold text-dark mb-2">
                            Newt Tracker
                        </h2>
                        <p className="text-gray-600">
                            Sign in to access your tracking dashboard
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded animate-slideIn">
                            <p className="font-semibold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="input-label">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="input-label">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner mr-3"></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary hover:text-primary/80 font-semibold">
                                Register here
                            </Link>
                        </p>
                    </div>

                    {/* Test Credentials */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-800 mb-2">Test Credentials:</p>
                        <p className="text-xs text-blue-700">
                            <strong>Admin:</strong> admin@newt.com / admin123
                        </p>
                        <p className="text-xs text-blue-700">
                            <strong>Distributor:</strong> officer@newt.com / dist123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
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

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await register(formData);

            if (response.success) {
                // Auto-login successful - redirect based on role
                const dashboard = response.user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/distributor/dashboard';
                router.push(dashboard);
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                <div className="card animate-fadeIn">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="font-heading text-4xl font-bold text-dark mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-600">
                            Join Newt Tracker to manage your field operations
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded animate-slideIn">
                            <p className="font-semibold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="input-label">
                                    Full Name *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="input-label">
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="input-label">
                                    Password *
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="input-label">
                                    Role *
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="distributor">Distributor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="input-label">
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label htmlFor="state" className="input-label">
                                    State
                                </label>
                                <input
                                    id="state"
                                    name="state"
                                    type="text"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Maharashtra"
                                />
                            </div>

                            {/* District (only for distributors) */}
                            {formData.role === 'distributor' && (
                                <div className="md:col-span-2">
                                    <label htmlFor="district" className="input-label">
                                        District
                                    </label>
                                    <input
                                        id="district"
                                        name="district"
                                        type="text"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Pune"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner mr-3"></div>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

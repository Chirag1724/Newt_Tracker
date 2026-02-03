'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import MapPicker from '@/components/MapPicker';

export default function DistributeSamplePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        recipient_name: '',
        quantity: '',
        purpose: '',
        latitude: '',
        longitude: '',
        location_address: ''
    });

    const handleLocationSelect = (locationData) => {
        setFormData(prev => ({
            ...prev,
            latitude: locationData.latitude.toString(),
            longitude: locationData.longitude.toString(),
            location_address: locationData.address
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.post('/samples', formData);
            setSuccess(true);
            setTimeout(() => {
                router.push('/distributor/samples');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log sample distribution');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-dark mb-2">Distribute Sample</h1>
                        <p className="text-gray-600">Log a new sample distribution and location</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="card-premium animate-fade-in">
                            <h3 className="text-xl font-bold text-dark mb-6">Sample Information</h3>

                            <div className="grid grid-cols-1 gap-6">
                                {/* Recipient Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">Recipient Name *</label>
                                    <input
                                        type="text"
                                        name="recipient_name"
                                        required
                                        value={formData.recipient_name}
                                        onChange={handleChange}
                                        placeholder="Enter recipient's name"
                                        className="input-field"
                                    />
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">Quantity *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        required
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="Number of samples distributed"
                                        className="input-field"
                                    />
                                </div>

                                {/* Purpose */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">Purpose</label>
                                    <textarea
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Purpose of distribution..."
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="card-premium animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <MapPicker onLocationSelect={handleLocationSelect} />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 font-semibold animate-shake">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-2xl text-green-700 font-semibold animate-fade-in">
                                Sample distribution logged successfully! Redirecting...
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full md:w-auto px-12 py-4 text-lg shadow-xl shadow-primary/20"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Saving Distributions...</span>
                                    </div>
                                ) : (
                                    'Log Sample Distribution'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

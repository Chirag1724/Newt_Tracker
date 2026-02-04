'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import MapPicker from '@/components/MapPicker';
import { toast } from '@/lib/toastUtils';
import { ButtonLoader } from '@/components/LoadingSkeletons';

export default function DistributeSamplePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
        toast.success('Location captured');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.latitude || !formData.longitude) {
            toast.error('Please select a location on the map');
            return;
        }

        setLoading(true);

        try {
            await api.post('/samples', formData);
            toast.success('Sample distribution logged successfully!');
            router.push('/distributor/samples');
        } catch (err) {
            console.error('Submit error:', err);
            toast.error(err.response?.data?.message || 'Failed to log sample distribution');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="text-primary font-bold mb-4 flex items-center space-x-2 hover:translate-x-[-4px] transition-transform"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>
                        <h1 className="text-4xl font-bold text-dark mb-2">Distribute Sample</h1>
                        <p className="text-gray-600 font-medium">Record a new sample distribution and location</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="card-premium">
                            <h3 className="text-xl font-bold text-dark mb-6">Distribution Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-dark mb-2">Recipient Name *</label>
                                    <input
                                        type="text"
                                        name="recipient_name"
                                        required
                                        value={formData.recipient_name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-dark mb-2">Quantity *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        required
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="Units distributed"
                                        className="input-field"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-dark mb-2">Purpose</label>
                                    <textarea
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Why were these samples given?"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="block text-sm font-bold text-dark uppercase tracking-wider">Capture Location *</label>
                            <MapPicker onLocationSelect={handleLocationSelect} />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn-soft flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1 py-4"
                                disabled={loading}
                            >
                                {loading ? <ButtonLoader /> : 'Record Distribution'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

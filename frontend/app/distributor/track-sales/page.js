'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import MapPicker from '@/components/MapPicker';
import DashboardLayout from '@/components/DashboardLayout';

export default function TrackSalesPage() {
    const router = useRouter();
    const [saleType, setSaleType] = useState('B2C');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        product_sku: '',
        pack_size: '',
        quantity: '',
        amount: '',
        mode: 'Direct',
        customer_name: '',
        is_repeat_order: false,
        latitude: null,
        longitude: null,
        location_address: ''
    });

    const productSKUs = [
        'PEST-001', 'PEST-006',
        'FERT-002', 'FERT-004',
        'SEED-003', 'SEED-005', 'SEED-007'
    ];

    const packSizes = ['250ml', '500ml', '1L', '2L', '1kg', '2kg', '5kg', '10kg'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Auto-calculate amount based on quantity
    useEffect(() => {
        if (formData.quantity && formData.pack_size) {
            // Simple pricing logic (can be customized)
            const basePrice = {
                '250ml': 400,
                '500ml': 500,
                '1L': 600,
                '2L': 1200,
                '1kg': 500,
                '2kg': 1000,
                '5kg': 600,
                '10kg': 1200
            };

            const unitPrice = basePrice[formData.pack_size] || 500;
            const calculatedAmount = unitPrice * parseInt(formData.quantity);

            setFormData(prev => ({
                ...prev,
                amount: calculatedAmount.toString()
            }));
        }
    }, [formData.quantity, formData.pack_size]);

    const handleLocationSelect = (locationData) => {
        setFormData(prev => ({
            ...prev,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            location_address: locationData.address
        }));
    };

    const validate = () => {
        if (!formData.product_sku) return 'Product SKU is required';
        if (!formData.quantity || formData.quantity < 1) return 'Valid quantity is required';
        if (!formData.amount || formData.amount < 1) return 'Valid amount is required';
        if (!formData.customer_name) return 'Customer name is required';
        if (!formData.latitude || !formData.longitude) return 'Please select a location';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const payload = {
                sale_type: saleType,
                ...formData,
                quantity: parseInt(formData.quantity),
                amount: parseFloat(formData.amount)
            };

            await api.post('/sales', payload);

            setSuccess(true);
            setTimeout(() => {
                router.push('/distributor/sales');
            }, 1500);
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Failed to track sale');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="text-primary font-semibold mb-4 flex items-center space-x-2 hover:text-primary/80 transition-smooth"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>
                        <h1 className="text-4xl font-bold text-dark mb-2">Track New Sale</h1>
                        <p className="text-gray-600">Record your sales transaction</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center space-x-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold text-green-800">Sale tracked successfully!</p>
                                <p className="text-sm text-green-600">Redirecting to sales list...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="card-premium space-y-6">
                        {/* Sale Type Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-3">
                                Sale Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSaleType('B2C')}
                                    className={`p-4 rounded-xl border-2 font-semibold transition-smooth ${saleType === 'B2C'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    B2C (Direct to Consumer)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSaleType('B2B')}
                                    className={`p-4 rounded-xl border-2 font-semibold transition-smooth ${saleType === 'B2B'
                                        ? 'border-secondary bg-secondary/10 text-secondary'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    B2B (Business to Business)
                                </button>
                            </div>
                        </div>

                        {/* Product SKU */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">
                                Product SKU <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="product_sku"
                                value={formData.product_sku}
                                onChange={handleInputChange}
                                className="input-field"
                                required
                            >
                                <option value="">Select Product</option>
                                {productSKUs.map(sku => (
                                    <option key={sku} value={sku}>{sku}</option>
                                ))}
                            </select>
                        </div>

                        {/* Pack Size & Quantity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Pack Size
                                </label>
                                <select
                                    name="pack_size"
                                    value={formData.pack_size}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="">Select Size</option>
                                    {packSizes.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="10"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">
                                Amount (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="5000"
                                min="1"
                                required
                            />
                            {formData.amount && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Amount: ₹{parseFloat(formData.amount).toLocaleString('en-IN')}
                                </p>
                            )}
                        </div>

                        {/* Mode & Customer Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Mode
                                </label>
                                <select
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="Direct">Direct</option>
                                    <option value="Distributor">Distributor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Customer Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Customer name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Repeat Order Checkbox */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                            <input
                                type="checkbox"
                                name="is_repeat_order"
                                id="is_repeat_order"
                                checked={formData.is_repeat_order}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <label htmlFor="is_repeat_order" className="text-sm font-semibold text-dark cursor-pointer">
                                This is a repeat order from an existing customer
                            </label>
                        </div>

                        {/* Location Picker */}
                        <MapPicker onLocationSelect={handleLocationSelect} />

                        {/* Submit Button */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn-outline flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Tracking Sale...</span>
                                    </span>
                                ) : (
                                    'Track Sale'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

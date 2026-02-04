'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import MapPicker from '@/components/MapPicker';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from '@/lib/toastUtils';
import { ButtonLoader } from '@/components/LoadingSkeletons';

export default function TrackSalesPage() {
    const router = useRouter();
    const [saleType, setSaleType] = useState('B2C');
    const [loading, setLoading] = useState(false);

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
            const basePrice = {
                '250ml': 400, '500ml': 500, '1L': 600, '2L': 1200,
                '1kg': 500, '2kg': 1000, '5kg': 600, '10kg': 1200
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
        toast.success('Location captured');
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

        const validationError = validate();
        if (validationError) {
            toast.error(validationError);
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

            toast.success('Sale tracked successfully!');
            router.push('/distributor/sales');
        } catch (err) {
            console.error('Submit error:', err);
            toast.error(err.response?.data?.message || 'Failed to track sale');
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
                        <h1 className="text-4xl font-bold text-dark mb-2">Track New Sale</h1>
                        <p className="text-gray-600 font-medium">Record a sales transaction with location and customer details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="card-premium space-y-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-dark uppercase tracking-wider">
                                Sale Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSaleType('B2C')}
                                    className={`p-6 rounded-2xl border-2 font-bold transition-all duration-300 ${saleType === 'B2C'
                                        ? 'border-primary bg-primary/10 text-primary shadow-lg scale-[1.02]'
                                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    B2C (Consumer)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSaleType('B2B')}
                                    className={`p-6 rounded-2xl border-2 font-bold transition-all duration-300 ${saleType === 'B2B'
                                        ? 'border-secondary bg-secondary/10 text-secondary shadow-lg scale-[1.02]'
                                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    B2B (Business)
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-dark mb-2">Product SKU *</label>
                                <select
                                    name="product_sku"
                                    value={formData.product_sku}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="">Select Product</option>
                                    {productSKUs.map(sku => (
                                        <option key={sku} value={sku}>{sku}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dark mb-2">Pack Size</label>
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
                                <label className="block text-sm font-bold text-dark mb-2">Quantity *</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Units sold"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dark mb-2">Total Amount (₹) *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Total revenue"
                                />
                                {formData.amount && (
                                    <p className="mt-2 text-xs font-bold text-primary">
                                        Confirmed: ₹{parseFloat(formData.amount).toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dark mb-2">Customer Name *</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="is_repeat_order"
                                    id="is_repeat_order"
                                    checked={formData.is_repeat_order}
                                    onChange={handleInputChange}
                                    className="w-6 h-6 text-primary rounded-lg border-gray-300 focus:ring-primary"
                                />
                                <label htmlFor="is_repeat_order" className="text-sm font-bold text-dark cursor-pointer">
                                    Repeat Order from Existing Customer
                                </label>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="block text-sm font-bold text-dark uppercase tracking-wider">Transaction Location *</label>
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
                                {loading ? <ButtonLoader /> : 'Record Sale'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

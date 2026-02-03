'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

export default function MySalesPage() {
    const router = useRouter();
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        sale_type: '',
        product_sku: '',
        search: '',
        from_date: '',
        to_date: ''
    });

    useEffect(() => {
        fetchSales();
        fetchStats();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, sales]);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const response = await api.get('/sales');
            setSales(response.data.sales || []);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load sales');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/sales/stats');
            setStats(response.data.stats);
        } catch (err) {
            console.error('Stats error:', err);
        }
    };

    const applyFilters = () => {
        let filtered = [...sales];

        if (filters.sale_type) {
            filtered = filtered.filter(s => s.sale_type === filters.sale_type);
        }

        if (filters.product_sku) {
            filtered = filtered.filter(s => s.product_sku === filters.product_sku);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(s =>
                (s.customer_name && s.customer_name.toLowerCase().includes(searchLower)) ||
                (s.product_sku && s.product_sku.toLowerCase().includes(searchLower))
            );
        }

        if (filters.from_date) {
            filtered = filtered.filter(s =>
                new Date(s.created_at) >= new Date(filters.from_date)
            );
        }

        if (filters.to_date) {
            filtered = filtered.filter(s =>
                new Date(s.created_at) <= new Date(filters.to_date + 'T23:59:59')
            );
        }

        setFilteredSales(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            sale_type: '',
            product_sku: '',
            search: '',
            from_date: '',
            to_date: ''
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <DashboardLayout role="distributor">
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading sales...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-2">My Sales</h1>
                            <p className="text-gray-600">
                                {filteredSales.length} sale{filteredSales.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/distributor/track-sales')}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Track New Sale</span>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="card-premium">
                                <p className="text-sm text-gray-600 mb-2">Total Sales</p>
                                <p className="text-3xl font-bold text-dark">{stats.total_sales || 0}</p>
                            </div>
                            <div className="card-premium">
                                <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                                <p className="text-3xl font-bold text-primary">
                                    ₹{parseFloat(stats.total_revenue || 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="card-premium">
                                <p className="text-sm text-gray-600 mb-2">B2C Revenue</p>
                                <p className="text-3xl font-bold text-secondary">
                                    ₹{parseFloat(stats.b2c_revenue || 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="card-premium">
                                <p className="text-sm text-gray-600 mb-2">B2B Revenue</p>
                                <p className="text-3xl font-bold text-accent">
                                    ₹{parseFloat(stats.b2b_revenue || 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="card-premium mb-8 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-dark">Filters</h3>
                            <button
                                onClick={resetFilters}
                                className="text-sm text-primary font-semibold hover:text-primary/80 transition-smooth"
                            >
                                Reset All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Sale Type */}
                            <select
                                name="sale_type"
                                value={filters.sale_type}
                                onChange={handleFilterChange}
                                className="input-field"
                            >
                                <option value="">All Sale Types</option>
                                <option value="B2C">B2C</option>
                                <option value="B2B">B2B</option>
                            </select>

                            {/* Product SKU */}
                            <input
                                type="text"
                                name="product_sku"
                                value={filters.product_sku}
                                onChange={handleFilterChange}
                                placeholder="Product SKU"
                                className="input-field"
                            />

                            {/* Search */}
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search by customer, product..."
                                className="input-field"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* From Date */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">From Date</label>
                                <input
                                    type="date"
                                    name="from_date"
                                    value={filters.from_date}
                                    onChange={handleFilterChange}
                                    className="input-field"
                                />
                            </div>

                            {/* To Date */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">To Date</label>
                                <input
                                    type="date"
                                    name="to_date"
                                    value={filters.to_date}
                                    onChange={handleFilterChange}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Sales Table */}
                    {filteredSales.length > 0 ? (
                        <div className="card-premium overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-4 px-4 font-semibold text-dark">Date</th>
                                        <th className="text-left py-4 px-4 font-semibold text-dark">Customer</th>
                                        <th className="text-left py-4 px-4 font-semibold text-dark">Product</th>
                                        <th className="text-center py-4 px-4 font-semibold text-dark">Qty</th>
                                        <th className="text-right py-4 px-4 font-semibold text-dark">Amount</th>
                                        <th className="text-center py-4 px-4 font-semibold text-dark">Type</th>
                                        <th className="text-center py-4 px-4 font-semibold text-dark">Repeat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSales.map(sale => (
                                        <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50 transition-smooth">
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {formatDate(sale.created_at)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-dark">{sale.customer_name}</p>
                                                {sale.location_address && (
                                                    <p className="text-xs text-gray-500 mt-1">{sale.location_address}</p>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-dark">{sale.product_sku}</p>
                                                {sale.pack_size && (
                                                    <p className="text-xs text-gray-500 mt-1">{sale.pack_size}</p>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center font-semibold text-dark">
                                                {sale.quantity}
                                            </td>
                                            <td className="py-4 px-4 text-right font-bold text-primary">
                                                ₹{parseFloat(sale.amount).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sale.sale_type === 'B2C'
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-secondary/10 text-secondary'
                                                    }`}>
                                                    {sale.sale_type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {sale.is_repeat_order && (
                                                    <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="text-xl font-semibold text-dark mb-2">No sales found</h3>
                            <p className="text-gray-600 mb-6">
                                {filters.search || filters.sale_type
                                    ? 'Try adjusting your filters'
                                    : 'Start by tracking your first sale'
                                }
                            </p>
                            <button
                                onClick={() => router.push('/distributor/track-sales')}
                                className="btn-primary"
                            >
                                Track First Sale
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

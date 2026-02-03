'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminSamplesPage() {
    const [samples, setSamples] = useState([]);
    const [filteredSamples, setFilteredSamples] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        from_date: '',
        to_date: ''
    });

    useEffect(() => {
        fetchSamples();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, samples]);

    const fetchSamples = async () => {
        try {
            setLoading(true);
            const response = await api.get('/samples');
            setSamples(response.data.samples || []);
            setStats(response.data.stats);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load samples');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...samples];

        // Search filter (recipient or distributor name)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(s =>
                (s.recipient_name && s.recipient_name.toLowerCase().includes(searchLower)) ||
                (s.user_name && s.user_name.toLowerCase().includes(searchLower)) ||
                (s.location_address && s.location_address.toLowerCase().includes(searchLower)) ||
                (s.state && s.state.toLowerCase().includes(searchLower))
            );
        }

        // Date range filter
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

        setFilteredSamples(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
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
            <DashboardLayout role="admin">
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading samples...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-2">All Sample Distributions</h1>
                            <p className="text-gray-600">
                                {filteredSamples.length} total distribution{filteredSamples.length !== 1 ? 's' : ''} recorded
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="card-premium flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Distributions</p>
                                    <p className="text-3xl font-bold text-dark">{stats.total_distributions || 0}</p>
                                </div>
                                <div className="bg-primary/10 p-4 rounded-2xl">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                            <div className="card-premium flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Quantity Distributed</p>
                                    <p className="text-3xl font-bold text-secondary">{stats.total_samples || 0}</p>
                                </div>
                                <div className="bg-secondary/10 p-4 rounded-2xl">
                                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
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
                            {/* Search */}
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search by recipient, distributor, state..."
                                className="input-field"
                            />

                            {/* From Date */}
                            <input
                                type="date"
                                name="from_date"
                                value={filters.from_date}
                                onChange={handleFilterChange}
                                className="input-field"
                            />

                            {/* To Date */}
                            <input
                                type="date"
                                name="to_date"
                                value={filters.to_date}
                                onChange={handleFilterChange}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Samples Table */}
                    {filteredSamples.length > 0 ? (
                        <div className="card-premium overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-4 px-4 font-semibold text-dark">Date</th>
                                        <th className="text-left py-4 px-4 font-semibold text-dark">Distributor</th>
                                        <th className="text-left py-4 px-4 font-semibold text-dark">Recipient</th>
                                        <th className="text-center py-4 px-4 font-semibold text-dark">Qty</th>
                                        <th className="text-left py-4 px-4 font-semibold text-dark">Location</th>
                                        <th className="text-left py-4 px-4 font-semibold text-dark">State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSamples.map(sample => (
                                        <tr key={sample.id} className="border-b border-gray-100 hover:bg-gray-50 transition-smooth">
                                            <td className="py-4 px-4 text-sm text-gray-600 whitespace-nowrap">
                                                {formatDate(sample.created_at)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                                                        {sample.user_name?.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-dark">{sample.user_name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-dark">{sample.recipient_name}</p>
                                                {sample.purpose && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{sample.purpose}</p>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                                                    {sample.quantity}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 max-w-xs">
                                                <p className="text-sm text-gray-600 line-clamp-1">{sample.location_address || 'No address'}</p>
                                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                                    {parseFloat(sample.latitude).toFixed(4)}, {parseFloat(sample.longitude).toFixed(4)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                                    {sample.state}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 card-premium">
                            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="text-xl font-semibold text-dark mb-2">No samples found</h3>
                            <p className="text-gray-600">No sample distributions have been recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

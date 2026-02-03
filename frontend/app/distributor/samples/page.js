'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

export default function MySamplesPage() {
    const router = useRouter();
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

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(s =>
                (s.recipient_name && s.recipient_name.toLowerCase().includes(searchLower)) ||
                (s.location_address && s.location_address.toLowerCase().includes(searchLower))
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
            <DashboardLayout role="distributor">
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
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-2">My Samples</h1>
                            <p className="text-gray-600">
                                {filteredSamples.length} distribution{filteredSamples.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/distributor/distribute-sample')}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Distribute New Sample</span>
                        </button>
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
                                placeholder="Search by recipient, location..."
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

                    {/* Samples List/Table */}
                    {filteredSamples.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSamples.map(sample => (
                                <div key={sample.id} className="card-premium group hover:scale-[1.02] transition-smooth">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                            {formatDate(sample.created_at)}
                                        </div>
                                        <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                                            {sample.quantity} Unit{sample.quantity !== 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                                        {sample.recipient_name}
                                    </h3>

                                    {sample.purpose && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {sample.purpose}
                                        </p>
                                    )}

                                    <div className="pt-4 border-t border-gray-100 space-y-3">
                                        {sample.location_address && (
                                            <div className="flex items-start space-x-2">
                                                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm text-gray-500 line-clamp-2">{sample.location_address}</span>
                                            </div>
                                        )}
                                        <div className="flex space-x-4 text-xs font-mono text-gray-400">
                                            <span>LAT: {parseFloat(sample.latitude).toFixed(4)}</span>
                                            <span>LNG: {parseFloat(sample.longitude).toFixed(4)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 card-premium">
                            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="text-xl font-semibold text-dark mb-2">No samples found</h3>
                            <p className="text-gray-600 mb-6">
                                {filters.search
                                    ? 'Try adjusting your filters'
                                    : 'Start by distributing your first sample'
                                }
                            </p>
                            <button
                                onClick={() => router.push('/distributor/distribute-sample')}
                                className="btn-primary"
                            >
                                Distribute First Sample
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

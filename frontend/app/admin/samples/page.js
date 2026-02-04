'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import SampleDetailModal from '@/components/SampleDetailModal';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import QuickFilters from '@/components/QuickFilters';
import { TableRowSkeleton } from '@/components/LoadingSkeletons';
import { NoSamplesEmpty, NoResultsEmpty } from '@/components/EmptyStates';
import { exportSamplesCSV } from '@/lib/exportUtils';

export default function AdminSamplesPage() {
    const [samples, setSamples] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSample, setSelectedSample] = useState(null);

    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filters
    const [filters, setFilters] = useState({
        from_date: '',
        to_date: '',
        quickFilter: 'all'
    });

    useEffect(() => {
        fetchSamples();
    }, []);

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

        // Search filter (recipient, distributor, address, or state)
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
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

        return filtered;
    };

    const filteredSamples = applyFilters();

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentSamples = filteredSamples.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredSamples.length / itemsPerPage);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleQuickFilter = (filter, dateRange) => {
        setFilters(prev => ({
            ...prev,
            quickFilter: filter,
            from_date: dateRange.from_date || '',
            to_date: dateRange.to_date || ''
        }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({
            from_date: '',
            to_date: '',
            quickFilter: 'all'
        });
        setSearchQuery('');
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const hasActiveFilters = searchQuery || filters.from_date || filters.to_date;

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header with Export */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-2">Sample Distributions</h1>
                            <p className="text-gray-600">
                                {filteredSamples.length} total distribution{filteredSamples.length !== 1 ? 's' : ''} recorded
                            </p>
                        </div>
                        <button
                            onClick={() => exportSamplesCSV(filteredSamples)}
                            disabled={filteredSamples.length === 0}
                            className="btn-soft flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export to CSV
                        </button>
                    </div>

                    {/* Stats Cards */}
                    {!loading && stats && (
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

                    {/* Search Bar */}
                    <div className="mb-6">
                        <SearchBar
                            placeholder="Search by recipient, distributor, state..."
                            onSearch={setSearchQuery}
                            initialValue={searchQuery}
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="mb-6">
                        <QuickFilters
                            onFilterChange={handleQuickFilter}
                            activeFilter={filters.quickFilter}
                        />
                    </div>

                    {/* Advanced Filters */}
                    <div className="card-premium mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-dark">Advanced Date Filters</h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-primary font-semibold hover:text-primary/80 transition-smooth"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="date"
                                name="from_date"
                                value={filters.from_date}
                                onChange={handleFilterChange}
                                className="input-field"
                                placeholder="From Date"
                            />

                            <input
                                type="date"
                                name="to_date"
                                value={filters.to_date}
                                onChange={handleFilterChange}
                                className="input-field"
                                placeholder="To Date"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Samples Table with Loading & Empty States */}
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
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRowSkeleton key={i} columns={6} />
                                    ))
                                ) : filteredSamples.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12">
                                            {hasActiveFilters ? (
                                                <NoResultsEmpty onClearFilters={resetFilters} />
                                            ) : (
                                                <NoSamplesEmpty />
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    currentSamples.map(sample => (
                                        <tr
                                            key={sample.id}
                                            onClick={() => setSelectedSample(sample)}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-smooth cursor-pointer"
                                        >
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && filteredSamples.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(newValue) => {
                                setItemsPerPage(newValue);
                                setCurrentPage(1);
                            }}
                            totalItems={filteredSamples.length}
                        />
                    )}

                    {/* Sample Detail Modal */}
                    <SampleDetailModal
                        sample={selectedSample}
                        onClose={() => setSelectedSample(null)}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}

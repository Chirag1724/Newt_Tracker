'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import QuickFilters from '@/components/QuickFilters';
import { TableRowSkeleton } from '@/components/LoadingSkeletons';
import { NoSalesEmpty, NoResultsEmpty } from '@/components/EmptyStates';
import { exportSalesCSV } from '@/lib/exportUtils';

export default function MySalesPage() {
    const router = useRouter();
    const [sales, setSales] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filters
    const [filters, setFilters] = useState({
        sale_type: '',
        product_sku: '',
        from_date: '',
        to_date: '',
        quickFilter: 'all'
    });

    useEffect(() => {
        fetchSales();
        fetchStats();
    }, []);

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

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                (s.customer_name && s.customer_name.toLowerCase().includes(searchLower)) ||
                (s.product_sku && s.product_sku.toLowerCase().includes(searchLower)) ||
                (s.location_address && s.location_address.toLowerCase().includes(searchLower))
            );
        }

        if (filters.sale_type) {
            filtered = filtered.filter(s => s.sale_type?.toLowerCase() === filters.sale_type.toLowerCase());
        }

        if (filters.product_sku) {
            const skuLower = filters.product_sku.toLowerCase();
            filtered = filtered.filter(s => s.product_sku?.toLowerCase().includes(skuLower));
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

        return filtered;
    };

    const filteredSales = applyFilters();

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentSales = filteredSales.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

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
            sale_type: '',
            product_sku: '',
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

    const hasActiveFilters = searchQuery || filters.sale_type || filters.product_sku || filters.from_date || filters.to_date;

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Export */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-2">My Sales</h1>
                            <p className="text-gray-600">
                                {filteredSales.length} sale{filteredSales.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => exportSalesCSV(filteredSales)}
                                disabled={filteredSales.length === 0}
                                className="btn-soft flex items-center gap-2 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Export CSV</span>
                            </button>
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
                    </div>

                    {/* Stats Cards */}
                    {!loading && stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="card-premium">
                                <p className="text-xs text-gray-600 mb-2">Total Sales</p>
                                <p className="text-2xl font-bold text-dark">{stats.total_sales || 0}</p>
                            </div>
                            <div className="card-premium">
                                <p className="text-xs text-gray-600 mb-2">Total Revenue</p>
                                <p className="text-2xl font-bold text-primary">
                                    ₹{parseFloat(stats.total_revenue || 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="card-premium">
                                <p className="text-xs text-gray-600 mb-2">B2C Revenue</p>
                                <p className="text-2xl font-bold text-secondary">
                                    ₹{parseFloat(stats.b2c_revenue || 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="card-premium">
                                <p className="text-xs text-gray-600 mb-2">B2B Revenue</p>
                                <p className="text-2xl font-bold text-accent">
                                    ₹{parseFloat(stats.b2b_revenue || 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Filters Section */}
                    <div className="mb-6">
                        <SearchBar
                            placeholder="Search by customer, product SKU, location..."
                            onSearch={setSearchQuery}
                            initialValue={searchQuery}
                        />
                    </div>

                    <div className="mb-6">
                        <QuickFilters
                            onFilterChange={handleQuickFilter}
                            activeFilter={filters.quickFilter}
                        />
                    </div>

                    <div className="card-premium mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-dark">Advanced Filters</h3>
                            {hasActiveFilters && (
                                <button onClick={resetFilters} className="text-sm font-semibold text-primary">
                                    Reset Filters
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <input
                                type="text"
                                name="product_sku"
                                value={filters.product_sku}
                                onChange={handleFilterChange}
                                placeholder="Filter by SKU"
                                className="input-field"
                            />
                            <input
                                type="date"
                                name="from_date"
                                value={filters.from_date}
                                onChange={handleFilterChange}
                                className="input-field"
                            />
                            <input
                                type="date"
                                name="to_date"
                                value={filters.to_date}
                                onChange={handleFilterChange}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="card-premium overflow-x-auto mb-6">
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
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRowSkeleton key={i} columns={7} />
                                    ))
                                ) : filteredSales.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-12">
                                            {hasActiveFilters ? (
                                                <NoResultsEmpty onClearFilters={resetFilters} />
                                            ) : (
                                                <NoSalesEmpty onTrackSale={() => router.push('/distributor/track-sales')} />
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    currentSales.map(sale => (
                                        <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50 transition-smooth">
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {formatDate(sale.created_at)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-dark">{sale.customer_name}</p>
                                                {sale.location_address && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{sale.location_address}</p>
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
                                                ₹{parseFloat(sale.amount || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sale.sale_type?.toUpperCase() === 'B2C'
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!loading && filteredSales.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(val) => {
                                setItemsPerPage(val);
                                setCurrentPage(1);
                            }}
                            totalItems={filteredSales.length}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

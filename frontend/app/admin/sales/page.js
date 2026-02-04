'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import SaleDetailModal from '@/components/SaleDetailModal';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import QuickFilters from '@/components/QuickFilters';
import { TableRowSkeleton } from '@/components/LoadingSkeletons';
import { NoSalesEmpty, NoResultsEmpty } from '@/components/EmptyStates';
import { exportSalesCSV } from '@/lib/exportUtils';

export default function AdminSalesPage() {
    const router = useRouter();
    const [sales, setSales] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);

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
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/admin');
            setStats(response.data.stats);
        } catch (err) {
            console.error('Stats error:', err);
        }
    };

    // Apply all filters
    const applyFilters = () => {
        let filtered = [...sales];

        // Search filter
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                (s.customer_name && s.customer_name.toLowerCase().includes(searchLower)) ||
                (s.product_sku && s.product_sku.toLowerCase().includes(searchLower)) ||
                (s.user_name && s.user_name.toLowerCase().includes(searchLower)) ||
                (s.location_address && s.location_address.toLowerCase().includes(searchLower))
            );
        }

        if (filters.sale_type) {
            filtered = filtered.filter(s => s.sale_type === filters.sale_type);
        }

        if (filters.product_sku) {
            filtered = filtered.filter(s => s.product_sku === filters.product_sku);
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

    const handleSaleClick = (sale) => {
        setSelectedSale(sale);
    };

    // Calculate summary stats
    const summaryStats = {
        total: filteredSales.length,
        b2c: filteredSales.filter(s => s.sale_type === 'b2c').length,
        b2b: filteredSales.filter(s => s.sale_type === 'b2b').length,
        totalRevenue: filteredSales.reduce((sum, s) => sum + (parseFloat(s.total_amount) || 0), 0)
    };

    const hasActiveFilters = searchQuery || filters.sale_type || filters.product_sku || filters.from_date || filters.to_date;

    // Get unique product SKUs for filter
    const uniqueSKUs = [...new Set(sales.map(s => s.product_sku))].filter(Boolean);

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Export */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-2">All Sales</h1>
                            <p className="text-gray-600">
                                {filteredSales.length} sale{filteredSales.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <button
                            onClick={() => exportSalesCSV(filteredSales)}
                            disabled={filteredSales.length === 0}
                            className="btn-soft flex items-center gap-2 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export to CSV
                        </button>
                    </div>

                    {/* Stats Cards */}
                    {!loading && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="card-premium text-center">
                                <p className="text-sm text-gray-600 mb-2">Total Sales</p>
                                <p className="text-4xl font-bold text-dark">{summaryStats.total}</p>
                            </div>
                            <div className="card-premium text-center">
                                <p className="text-sm text-gray-600 mb-2">B2C Sales</p>
                                <p className="text-4xl font-bold text-primary">{summaryStats.b2c}</p>
                            </div>
                            <div className="card-premium text-center">
                                <p className="text-sm text-gray-600 mb-2">B2B Sales</p>
                                <p className="text-4xl font-bold text-secondary">{summaryStats.b2b}</p>
                            </div>
                            <div className="card-premium text-center">
                                <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                                <p className="text-3xl font-bold text-accent">
                                    ₹{summaryStats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="mb-6">
                        <SearchBar
                            placeholder="Search by customer, product SKU, or distributor..."
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
                            <h3 className="text-lg font-bold text-dark">Filters</h3>
                            {hasActiveFilters && (
                                <button onClick={resetFilters} className="btn-soft text-sm">
                                    Clear All
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
                                <option value="">All Types</option>
                                <option value="b2c">B2C</option>
                                <option value="b2b">B2B</option>
                            </select>
                            <select
                                name="product_sku"
                                value={filters.product_sku}
                                onChange={handleFilterChange}
                                className="input-field"
                            >
                                <option value="">All Products</option>
                                {uniqueSKUs.map(sku => (
                                    <option key={sku} value={sku}>{sku}</option>
                                ))}
                            </select>
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

                    {/* Sales Table with Loading & Empty States */}
                    <div className="card-premium overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-dark">Date</th>
                                    <th className="text-left py-4 px-4 font-semibold text-dark">Customer</th>
                                    <th className="text-left py-4 px-4 font-semibold text-dark">Product</th>
                                    <th className="text-center py-4 px-4 font-semibold text-dark">Type</th>
                                    <th className="text-center py-4 px-4 font-semibold text-dark">Quantity</th>
                                    <th className="text-right py-4 px-4 font-semibold text-dark">Amount</th>
                                    <th className="text-left py-4 px-4 font-semibold text-dark">Distributor</th>
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
                                                <NoSalesEmpty />
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    currentSales.map(sale => (
                                        <tr
                                            key={sale.id}
                                            onClick={() => handleSaleClick(sale)}
                                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-smooth"
                                        >
                                            <td className="py-4 px-4 text-gray-600">
                                                {new Date(sale.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-4 font-semibold text-dark">
                                                {sale.customer_name}
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">{sale.product_sku}</td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sale.sale_type === 'b2c'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {sale.sale_type?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center text-gray-600">
                                                {sale.quantity}
                                            </td>
                                            <td className="py-4 px-4 text-right font-bold text-primary">
                                                ₹{parseFloat(sale.total_amount || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">{sale.user_name}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && filteredSales.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(newValue) => {
                                setItemsPerPage(newValue);
                                setCurrentPage(1);
                            }}
                            totalItems={filteredSales.length}
                        />
                    )}
                </div>
            </div>

            {/* Sale Detail Modal */}
            {selectedSale && (
                <SaleDetailModal
                    sale={selectedSale}
                    onClose={() => setSelectedSale(null)}
                />
            )}
        </DashboardLayout>
    );
}

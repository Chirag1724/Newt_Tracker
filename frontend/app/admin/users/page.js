'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import UserDetailModal from '@/components/UserDetailModal';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import { CardSkeleton } from '@/components/LoadingSkeletons';
import { NoUsersEmpty, NoResultsEmpty } from '@/components/EmptyStates';
import { exportUsersCSV } from '@/lib/exportUtils';

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // 3x3 grid

    // Filters
    const [stateFilter, setStateFilter] = useState('');

    const states = ['Maharashtra', 'Punjab', 'Haryana', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/users');
            setUsers(response.data.users || []);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...users];

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(u =>
                (u.name && u.name.toLowerCase().includes(searchLower)) ||
                (u.email && u.email.toLowerCase().includes(searchLower)) ||
                (u.phone && u.phone.includes(searchQuery)) ||
                (u.district && u.district.toLowerCase().includes(searchLower))
            );
        }

        if (stateFilter) {
            filtered = filtered.filter(u => u.state === stateFilter);
        }

        return filtered;
    };

    const filteredUsers = applyFilters();

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const resetFilters = () => {
        setSearchQuery('');
        setStateFilter('');
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        distributors: users.filter(u => u.role === 'distributor').length,
        activeThisMonth: users.filter(u => {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return u.created_at && new Date(u.created_at) >= monthAgo;
        }).length
    };

    const stateDistribution = states.map(state => ({
        state,
        count: users.filter(u => u.state === state).length
    })).filter(s => s.count > 0);

    const hasActiveFilters = searchQuery || stateFilter;

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Export */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-2">Manage Users</h1>
                            <p className="text-gray-600">
                                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <button
                            onClick={() => exportUsersCSV(filteredUsers)}
                            disabled={filteredUsers.length === 0}
                            className="btn-soft flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Users CSV
                        </button>
                    </div>

                    {/* Stats Cards */}
                    {!loading && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="card-premium text-center">
                                <p className="text-sm text-gray-600 mb-2">Total Users</p>
                                <p className="text-4xl font-bold text-dark">{stats.total}</p>
                            </div>
                            <div className="card-premium text-center">
                                <p className="text-sm text-gray-600 mb-2">Distributors</p>
                                <p className="text-4xl font-bold text-primary">{stats.distributors}</p>
                            </div>
                            <div className="card-premium text-center">
                                <p className="text-sm text-gray-600 mb-2">Admins</p>
                                <p className="text-4xl font-bold text-secondary">{stats.admins}</p>
                            </div>
                            <div className="card-premium text-center">
                                <p className="text-sm text-gray-600 mb-2">New This Month</p>
                                <p className="text-4xl font-bold text-accent">{stats.activeThisMonth}</p>
                            </div>
                        </div>
                    )}

                    {/* State Distribution */}
                    {!loading && stateDistribution.length > 0 && (
                        <div className="card-premium mb-8">
                            <h3 className="font-heading text-xl font-bold text-dark mb-6">
                                State-wise Distribution
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {stateDistribution.map(({ state, count }) => (
                                    <div key={state} className="text-center p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-600 mb-1">{state}</p>
                                        <p className="text-xl font-bold text-primary">{count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search & Simple Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <SearchBar
                            placeholder="Search by name, email, phone, district..."
                            onSearch={setSearchQuery}
                            initialValue={searchQuery}
                        />
                        <select
                            value={stateFilter}
                            onChange={(e) => {
                                setStateFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="input-field h-[48px]"
                        >
                            <option value="">All States</option>
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Users Grid with Loading & Empty States */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        hasActiveFilters ? (
                            <NoResultsEmpty onClearFilters={resetFilters} />
                        ) : (
                            <NoUsersEmpty />
                        )
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className="card-premium hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-dark">{user.name}</h3>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-primary/10 text-primary'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm truncate">{user.email}</span>
                                            </div>

                                            {user.phone && (
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="text-sm">{user.phone}</span>
                                                </div>
                                            )}

                                            {user.state && (
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-sm truncate">{user.district}, {user.state}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                Joined: {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                onItemsPerPageChange={(newValue) => {
                                    setItemsPerPage(newValue);
                                    setCurrentPage(1);
                                }}
                                totalItems={filteredUsers.length}
                            />
                        </>
                    )}

                    <UserDetailModal
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}

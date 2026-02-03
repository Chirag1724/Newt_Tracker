'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import MeetingCard from '@/components/MeetingCard';

export default function AdminMeetingsPage() {
    const router = useRouter();
    const [meetings, setMeetings] = useState([]);
    const [filteredMeetings, setFilteredMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        meeting_type: '',
        category: '',
        search: '',
        from_date: '',
        to_date: '',
        state: ''
    });

    const states = ['Maharashtra', 'Punjab', 'Haryana', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];

    useEffect(() => {
        fetchMeetings();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, meetings]);

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/meetings');
            setMeetings(response.data.meetings || []);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load meetings');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...meetings];

        if (filters.meeting_type) {
            filtered = filtered.filter(m => m.meeting_type === filters.meeting_type);
        }

        if (filters.category) {
            filtered = filtered.filter(m => m.category === filters.category);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(m =>
                (m.person_name && m.person_name.toLowerCase().includes(searchLower)) ||
                (m.village_name && m.village_name.toLowerCase().includes(searchLower)) ||
                (m.location_address && m.location_address.toLowerCase().includes(searchLower)) ||
                (m.user_name && m.user_name.toLowerCase().includes(searchLower))
            );
        }

        if (filters.from_date) {
            filtered = filtered.filter(m =>
                new Date(m.created_at) >= new Date(filters.from_date)
            );
        }

        if (filters.to_date) {
            filtered = filtered.filter(m =>
                new Date(m.created_at) <= new Date(filters.to_date + 'T23:59:59')
            );
        }

        if (filters.state) {
            filtered = filtered.filter(m => m.state === filters.state);
        }

        setFilteredMeetings(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            meeting_type: '',
            category: '',
            search: '',
            from_date: '',
            to_date: '',
            state: ''
        });
    };

    const handleMeetingClick = (meeting) => {
        console.log('Meeting clicked:', meeting);
        // Could open a modal with full details
    };

    // Calculate stats
    const stats = {
        total: filteredMeetings.length,
        oneOnOne: filteredMeetings.filter(m => m.meeting_type === 'one-on-one').length,
        group: filteredMeetings.filter(m => m.meeting_type === 'group').length,
        thisWeek: filteredMeetings.filter(m => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(m.created_at) >= weekAgo;
        }).length
    };

    if (loading) {
        return (
            <DashboardLayout role="admin">
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading meetings...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-dark mb-2">All Meetings</h1>
                        <p className="text-gray-600">
                            {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''} found across all distributors
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="card-premium text-center">
                            <p className="text-sm text-gray-600 mb-2">Total Meetings</p>
                            <p className="text-4xl font-bold text-dark">{stats.total}</p>
                        </div>
                        <div className="card-premium text-center">
                            <p className="text-sm text-gray-600 mb-2">One-on-One</p>
                            <p className="text-4xl font-bold text-primary">{stats.oneOnOne}</p>
                        </div>
                        <div className="card-premium text-center">
                            <p className="text-sm text-gray-600 mb-2">Group Meetings</p>
                            <p className="text-4xl font-bold text-secondary">{stats.group}</p>
                        </div>
                        <div className="card-premium text-center">
                            <p className="text-sm text-gray-600 mb-2">This Week</p>
                            <p className="text-4xl font-bold text-accent">{stats.thisWeek}</p>
                        </div>
                    </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Meeting Type */}
                            <select
                                name="meeting_type"
                                value={filters.meeting_type}
                                onChange={handleFilterChange}
                                className="input-field"
                            >
                                <option value="">All Types</option>
                                <option value="one-on-one">One-on-One</option>
                                <option value="group">Group</option>
                            </select>

                            {/* Category */}
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="input-field"
                            >
                                <option value="">All Categories</option>
                                <option value="Farmer">Farmer</option>
                                <option value="Seller">Seller</option>
                                <option value="Influencer">Influencer</option>
                            </select>

                            {/* State */}
                            <select
                                name="state"
                                value={filters.state}
                                onChange={handleFilterChange}
                                className="input-field"
                            >
                                <option value="">All States</option>
                                {states.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>

                            {/* Search */}
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search meetings..."
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

                    {/* Meetings Grid */}
                    {filteredMeetings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMeetings.map(meeting => (
                                <MeetingCard
                                    key={meeting.id}
                                    meeting={meeting}
                                    onClick={() => handleMeetingClick(meeting)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-dark mb-2">No meetings found</h3>
                            <p className="text-gray-600">
                                {filters.search || filters.meeting_type || filters.category
                                    ? 'Try adjusting your filters'
                                    : 'No meetings have been logged yet'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

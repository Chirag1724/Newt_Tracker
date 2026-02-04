'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import MeetingCard from '@/components/MeetingCard';
import DashboardLayout from '@/components/DashboardLayout';
import MeetingDetailModal from '@/components/MeetingDetailModal';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import QuickFilters from '@/components/QuickFilters';
import { CardSkeleton } from '@/components/LoadingSkeletons';
import { NoMeetingsEmpty, NoResultsEmpty } from '@/components/EmptyStates';
import { exportMeetingsCSV } from '@/lib/exportUtils';

export default function MyMeetingsPage() {
    const router = useRouter();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    // Filters
    const [filters, setFilters] = useState({
        meeting_type: '',
        category: '',
        from_date: '',
        to_date: '',
        quickFilter: 'all'
    });

    useEffect(() => {
        fetchMeetings();
    }, []);

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

        // Search filter
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(m =>
                (m.person_name && m.person_name.toLowerCase().includes(searchLower)) ||
                (m.village_name && m.village_name.toLowerCase().includes(searchLower)) ||
                (m.location_address && m.location_address.toLowerCase().includes(searchLower)) ||
                (m.category && m.category.toLowerCase().includes(searchLower))
            );
        }

        if (filters.meeting_type) {
            filtered = filtered.filter(m => m.meeting_type === filters.meeting_type);
        }

        if (filters.category) {
            filtered = filtered.filter(m => m.category === filters.category);
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

        return filtered;
    };

    const filteredMeetings = applyFilters();

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentMeetings = filteredMeetings.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);

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
            meeting_type: '',
            category: '',
            from_date: '',
            to_date: '',
            quickFilter: 'all'
        });
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleMeetingClick = (meeting) => {
        setSelectedMeeting(meeting);
    };

    const hasActiveFilters = searchQuery || filters.meeting_type || filters.category || filters.from_date || filters.to_date;

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Export */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-2">My Meetings</h1>
                            <p className="text-gray-600">
                                {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => exportMeetingsCSV(filteredMeetings)}
                                disabled={filteredMeetings.length === 0}
                                className="btn-soft flex items-center gap-2 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Export CSV</span>
                            </button>
                            <button
                                onClick={() => router.push('/distributor/log-meeting')}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Log New Meeting</span>
                            </button>
                        </div>
                    </div>

                    {/* Search & Quick Filters */}
                    <div className="mb-6">
                        <SearchBar
                            placeholder="Search by person, village, category..."
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

                    {/* Advanced Filters */}
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
                                name="meeting_type"
                                value={filters.meeting_type}
                                onChange={handleFilterChange}
                                className="input-field"
                            >
                                <option value="">All Types</option>
                                <option value="one-on-one">One-on-One</option>
                                <option value="group">Group</option>
                            </select>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="input-field"
                            >
                                <option value="">All Categories</option>
                                <option value="Farmer">Farmer</option>
                                <option value="Retailer">Retailer</option>
                                <option value="Distributor">Distributor</option>
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

                    {/* Content Section */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredMeetings.length === 0 ? (
                        hasActiveFilters ? (
                            <NoResultsEmpty onClearFilters={resetFilters} />
                        ) : (
                            <NoMeetingsEmpty onAddMeeting={() => router.push('/distributor/log-meeting')} />
                        )
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentMeetings.map(meeting => (
                                    <MeetingCard
                                        key={meeting.id}
                                        meeting={meeting}
                                        onClick={() => handleMeetingClick(meeting)}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                onItemsPerPageChange={(val) => {
                                    setItemsPerPage(val);
                                    setCurrentPage(1);
                                }}
                                totalItems={filteredMeetings.length}
                            />
                        </>
                    )}
                </div>
            </div>

            {selectedMeeting && (
                <MeetingDetailModal
                    meeting={selectedMeeting}
                    onClose={() => setSelectedMeeting(null)}
                />
            )}
        </DashboardLayout>
    );
}

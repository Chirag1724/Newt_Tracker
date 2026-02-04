'use client';

/**
 * Quick Date Range Filter Component
 * Provides preset filters: Today, This Week, This Month, All Time
 */
export default function QuickFilters({ onFilterChange, activeFilter = 'all' }) {
    const now = new Date();

    const getDateRange = (filter) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filter) {
            case 'today':
                return {
                    from_date: today.toISOString().split('T')[0],
                    to_date: new Date().toISOString().split('T')[0]
                };

            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return {
                    from_date: weekAgo.toISOString().split('T')[0],
                    to_date: new Date().toISOString().split('T')[0]
                };

            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return {
                    from_date: monthAgo.toISOString().split('T')[0],
                    to_date: new Date().toISOString().split('T')[0]
                };

            case 'all':
            default:
                return { from_date: null, to_date: null };
        }
    };

    const handleFilterClick = (filter) => {
        const dateRange = getDateRange(filter);
        onFilterChange(filter, dateRange);
    };

    const filters = [
        { id: 'all', label: 'All Time', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'today', label: 'Today', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'week', label: 'This Week', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'month', label: 'This Month', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
    ];

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-600 mr-2">Quick Filter:</span>
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => handleFilterClick(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-smooth ${activeFilter === filter.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={filter.icon} />
                    </svg>
                    {filter.label}
                </button>
            ))}
        </div>
    );
}

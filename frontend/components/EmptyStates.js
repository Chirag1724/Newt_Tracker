// Empty state when no meetings are found
export function NoMeetingsEmpty({ onAddMeeting }) {
    return (
        <div className="text-center py-16 px-6">
            <div className="mb-6">
                <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-2">No Meetings Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building relationships by logging your first meeting with farmers, sellers, or influencers.
            </p>
            {onAddMeeting && (
                <button onClick={onAddMeeting} className="btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Log Your First Meeting
                </button>
            )}
        </div>
    );
}

// Empty state when no sales are found
export function NoSalesEmpty({ onAddSale }) {
    return (
        <div className="text-center py-16 px-6">
            <div className="mb-6">
                <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-2">No Sales Recorded</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Track your first sale to start monitoring your revenue and performance metrics.
            </p>
            {onAddSale && (
                <button onClick={onAddSale} className="btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Track Your First Sale
                </button>
            )}
        </div>
    );
}

// Empty state when no samples are found
export function NoSamplesEmpty({ onAddSample }) {
    return (
        <div className="text-center py-16 px-6">
            <div className="mb-6">
                <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-2">No Samples Distributed</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start distributing samples to potential customers and track their interest.
            </p>
            {onAddSample && (
                <button onClick={onAddSample} className="btn-primary bg-orange-600 hover:bg-orange-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Log Sample Distribution
                </button>
            )}
        </div>
    );
}

// Empty state for filtered results
export function NoResultsEmpty({ onClearFilters }) {
    return (
        <div className="text-center py-16 px-6">
            <div className="mb-6">
                <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any matches for your search or filter criteria. Try adjusting your filters or search term.
            </p>
            {onClearFilters && (
                <button onClick={onClearFilters} className="btn-outline">
                    Clear All Filters
                </button>
            )}
        </div>
    );
}

// Empty state for no users (admin)
export function NoUsersEmpty() {
    return (
        <div className="text-center py-16 px-6">
            <div className="mb-6">
                <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-2">No Distributors Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
                No distributor accounts have been created yet or none match your search criteria.
            </p>
        </div>
    );
}

// Generic empty state
export function EmptyState({ icon, title, description, action }) {
    return (
        <div className="text-center py-16 px-6">
            {icon && <div className="mb-6">{icon}</div>}
            <h3 className="text-2xl font-bold text-dark mb-2">{title}</h3>
            {description && (
                <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
            )}
            {action}
        </div>
    );
}

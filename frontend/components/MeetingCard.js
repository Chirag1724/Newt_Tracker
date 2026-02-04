'use client';

export default function MeetingCard({ meeting, onClick }) {
    const isOneOnOne = meeting.meeting_type === 'one-on-one';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Farmer': 'bg-green-100 text-green-700',
            'Seller': 'bg-blue-100 text-blue-700',
            'Influencer': 'bg-purple-100 text-purple-700'
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div
            onClick={onClick}
            className="card-premium cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary/30"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isOneOnOne ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                            }`}>
                            {isOneOnOne ? 'One-on-One' : 'Group Meeting'}
                        </span>
                        {isOneOnOne && meeting.category && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(meeting.category)}`}>
                                {meeting.category}
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-dark">
                        {isOneOnOne ? meeting.person_name : meeting.village_name}
                    </h3>
                </div>
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>

            {/* Details */}
            <div className="space-y-3">
                {isOneOnOne ? (
                    <>
                        {meeting.contact_number && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm">{meeting.contact_number}</span>
                            </div>
                        )}
                        {meeting.business_potential && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-semibold text-primary">
                                    Potential: ₹{parseFloat(meeting.business_potential || 0).toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {meeting.attendee_count && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-sm">{meeting.attendee_count} Attendees</span>
                            </div>
                        )}
                        {meeting.meeting_topic && (
                            <div className="flex items-start space-x-2 text-gray-600">
                                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className="text-sm">{meeting.meeting_topic}</span>
                            </div>
                        )}
                    </>
                )}

                {/* Location */}
                {meeting.location_address && (
                    <div className="flex items-start space-x-2 text-gray-600">
                        <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{meeting.location_address}</span>
                    </div>
                )}

                {/* Photos */}
                {meeting.photos && meeting.photos.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                            {meeting.photos.slice(0, 3).map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo}
                                    alt={`Photo ${index + 1}`}
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        {meeting.photos.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{meeting.photos.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        {formatDate(meeting.created_at)}
                    </span>
                    {meeting.user_name && (
                        <span className="text-xs font-bold text-primary">
                            By: {meeting.user_name}
                        </span>
                    )}
                </div>

                {/* Hackathon Verification Indicators */}
                <div className="flex gap-2">
                    <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-black uppercase italic tracking-tighter">GPS Verified</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c.076 0 .151.004.225.013a13.383 13.383 0 01-1.418 2.928 15.655 15.655 0 01-.649-1.383A14.28 14.28 0 018.158 5.54 13.161 13.161 0 0110 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-black uppercase italic tracking-tighter">Sync Verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

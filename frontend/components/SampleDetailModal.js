'use client';

export default function SampleDetailModal({ sample, onClose }) {
    if (!sample) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-smooth z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8 pr-12">
                        <div className="flex items-center space-x-3 mb-3">
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                                Sample Distribution
                            </span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-dark leading-tight">
                            {sample.recipient_name}
                        </h2>
                        <p className="text-gray-500 font-medium mt-2 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(sample.created_at)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Distribution Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                                        <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                        <p className="text-3xl font-black text-orange-700">{sample.quantity} Units</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-500 mb-1">State</p>
                                        <p className="text-xl font-black text-dark">{sample.state}</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recipient Intent</h3>
                                <div className="p-6 bg-gray-50 rounded-2xl">
                                    <p className="text-sm text-dark font-medium leading-relaxed italic">
                                        "{sample.purpose || 'No purpose recorded for this distribution.'}"
                                    </p>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Distribution Location</h3>
                                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                                    <div className="flex items-start mb-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm mr-4 text-orange-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-dark mb-1">{sample.location_address}</p>
                                            <div className="flex space-x-4 text-xs text-gray-400 font-mono">
                                                <span>Lat: {parseFloat(sample.latitude).toFixed(6)}</span>
                                                <span>Lng: {parseFloat(sample.longitude).toFixed(6)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps?q=${sample.latitude},${sample.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full btn-soft py-3 rounded-xl flex items-center justify-center font-bold"
                                    >
                                        View on Map
                                    </a>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Logged By</h3>
                                <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-4 shadow-lg">
                                        {sample.user_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark">{sample.user_name}</p>
                                        <p className="text-xs text-gray-500">Distributor ID: {sample.user_id}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn-primary px-12 py-3 rounded-2xl font-bold bg-orange-600 hover:bg-orange-700"
                    >
                        Close Distribution Record
                    </button>
                </div>
            </div>
        </div>
    );
}

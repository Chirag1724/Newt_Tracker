'use client';

export default function SaleDetailModal({ sale, onClose }) {
    if (!sale) return null;

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
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${sale.sale_type === 'B2C' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                }`}>
                                {sale.sale_type} Sale
                            </span>
                            {sale.is_repeat_order && (
                                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Repeat Order
                                </span>
                            )}
                        </div>
                        <h2 className="text-4xl font-extrabold text-dark leading-tight">
                            {sale.customer_name}
                        </h2>
                        <p className="text-gray-500 font-medium mt-2 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(sale.created_at)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Transaction Details */}
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Transaction Summary</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                        <p className="text-3xl font-black text-primary">₹{parseFloat(sale.amount).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                        <p className="text-3xl font-black text-dark">{sale.quantity} Units</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Product Information</h3>
                                <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                                    <div className="flex justify-between items-center group">
                                        <span className="text-gray-500">Product SKU</span>
                                        <span className="font-bold text-dark group-hover:text-primary transition-smooth">{sale.product_sku}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Pack Size</span>
                                        <span className="font-bold text-dark">{sale.pack_size || 'Standard'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Unit Price</span>
                                        <span className="font-bold text-dark">₹{(parseFloat(sale.amount) / sale.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Logged By</h3>
                                <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 shadow-lg">
                                        {sale.user_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark">{sale.user_name}</p>
                                        <p className="text-xs text-gray-500">Distributor ID: {sale.user_id}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Location & Notes */}
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Sale Location</h3>
                                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                                    <div className="flex items-start mb-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm mr-4 text-primary">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-dark mb-1">{sale.location_address}</p>
                                            <div className="flex space-x-4 text-xs text-gray-400 font-mono">
                                                <span>Lat: {parseFloat(sale.latitude).toFixed(6)}</span>
                                                <span>Lng: {parseFloat(sale.longitude).toFixed(6)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps?q=${sale.latitude},${sale.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full btn-soft py-3 rounded-xl flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 7m0 10V7" />
                                        </svg>
                                        Open in Maps
                                    </a>
                                </div>
                            </section>

                            {sale.notes && (
                                <section>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Additional Notes</h3>
                                    <div className="p-6 bg-yellow-50/50 rounded-2xl italic text-gray-700 leading-relaxed border-l-4 border-yellow-200">
                                        "{sale.notes}"
                                    </div>
                                </section>
                            )}

                            {/* Verification Badge */}
                            <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-dark mb-1">Verified Transaction</h4>
                                <p className="text-xs text-gray-500">This sale was recorded with GPS verification and is locked for auditing.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn-primary px-12 py-3 rounded-2xl font-bold"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

export default function UserDetailModal({ user, onClose }) {
    if (!user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
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
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative animate-scale-up overflow-hidden">
                {/* Header Decoration */}
                <div className="h-32 bg-gradient-to-r from-primary to-primary/60 w-full"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-smooth z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Profile Image / Avatar */}
                <div className="absolute top-16 left-8">
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-primary text-4xl font-bold shadow-xl border-4 border-white">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="p-8 pt-12 mt-4">
                    {/* Basic Info */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-dark">{user.name}</h2>
                        <div className="flex items-center space-x-3 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary/10 text-primary'
                                }`}>
                                {user.role}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">
                                Member since {formatDate(user.created_at).split(' at')[0]}
                            </span>
                        </div>
                    </div>

                    {/* Detailed Stats / Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-dark font-medium">
                                        <div className="p-2 bg-gray-50 rounded-lg text-primary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-dark font-medium">
                                        <div className="p-2 bg-gray-50 rounded-lg text-primary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <span>{user.phone || 'No phone added'}</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Service Location</h3>
                                <div className="flex items-start space-x-3 text-dark font-medium">
                                    <div className="p-2 bg-gray-50 rounded-lg text-primary">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p>{user.district || 'Anywhere'}, {user.state}</p>
                                        <p className="text-xs text-gray-400 font-normal">Registered State Territory</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Account Security</h3>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">Last Login</span>
                                        <span className="text-sm font-bold text-dark">Recent</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className="flex items-center text-xs font-bold text-green-600">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                            ACTIVE
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">System ID</h3>
                                <code className="block p-3 bg-dark text-white rounded-xl text-xs font-mono break-all">
                                    UID-{user.id}-{user.role?.toUpperCase()}
                                </code>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100 transition-smooth"
                    >
                        Close
                    </button>
                    {user.role !== 'admin' && (
                        <button className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-smooth shadow-lg shadow-primary/20">
                            Reset Password
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logout, getCurrentUser } from '@/lib/auth';

export default function DashboardSidebar({ role, isOpen, setIsOpen }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setUser(getCurrentUser());
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const distributorLinks = [
        { href: '/distributor/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { href: '/distributor/log-meeting', label: 'Log Meeting', icon: 'M12 4v16m8-8H4' },
        { href: '/distributor/track-sales', label: 'Track Sales', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { href: '/distributor/distribute-sample', label: 'Distribute Sample', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { href: '/distributor/meetings', label: 'My Meetings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { href: '/distributor/sales', label: 'My Sales', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { href: '/distributor/samples', label: 'My Samples', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { href: '/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ];

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { href: '/admin/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { href: '/admin/reports', label: 'Reports', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { href: '/admin/meetings', label: 'All Meetings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { href: '/admin/sales', label: 'All Sales', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { href: '/admin/samples', label: 'All Samples', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { href: '/admin/users', label: 'Manage Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { href: '/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ];

    const links = role === 'admin' ? adminLinks : distributorLinks;

    return (
        <>
            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-0 h-screen bg-background border-r border-orange-100/50 z-[60] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)]
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-[85vw] md:w-72 shadow-[30px_0_100px_rgba(0,0,0,0.06)] overflow-hidden
            `}>
                {/* Decorative Pattern for Pro App Feel */}
                <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-br from-primary/10 via-transparent to-transparent -z-10 opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/5 rounded-full blur-[80px] -z-10"></div>

                <div className="flex flex-col h-full relative z-10">
                    {/* mobile Close Button - Floating Design */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="md:hidden absolute top-6 right-6 w-10 h-10 rounded-full bg-white shadow-lg border border-orange-100 flex items-center justify-center text-dark active:scale-95 transition-transform"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Logo Section - Premium Centering for Mobile */}
                    <div className="p-8 pb-10">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative w-12 h-12 bg-primary rounded-[1.2rem] flex items-center justify-center p-2 shadow-xl shadow-primary/20 rotate-[-3deg] group-hover:rotate-0 transition-all duration-500">
                                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 13.5C3 13.5 5.5 16.5 8.5 16.5C11.5 16.5 13 13.5 13 13.5C13 13.5 15.5 10.5 18.5 10.5C21.5 10.5 24 13.5 24 13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="6" cy="13.5" r="2.5" fill="currentColor" opacity="0.4" />
                                        <circle cx="18" cy="13.5" r="2.5" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>
                            <span className="font-heading text-2xl font-black tracking-tight text-dark">Newt<span className="text-primary italic">.</span></span>
                        </Link>
                    </div>

                    {/* Pro Profile Header - High-end Integrated Card */}
                    <div className="px-6 mb-8">
                        <div className="p-6 rounded-[2rem] bg-white border border-orange-100 shadow-[0_15px_40px_rgba(45,80,22,0.05)] relative overflow-hidden group">
                             {/* Small decorative dot */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/10 blur-md rounded-2xl"></div>
                                    <div className="relative w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/20 transform group-hover:scale-105 transition-transform duration-500">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-black text-dark text-lg leading-tight truncate max-w-[150px]">{user?.name}</h4>
                                    <div className="flex items-center mt-1">
                                        <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">{user?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation - Better Spacing and Indicators */}
                    <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                        <div className="text-[10px] font-black text-primary/30 uppercase tracking-[0.25em] mb-6 ml-6">Control Center</div>
                        <ul className="space-y-2">
                            {links.map(link => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative ${isActive
                                                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                                : 'text-gray-500 hover:bg-white hover:shadow-md hover:text-primary active:scale-95'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {/* Active Marker Line */}
                                            {isActive && (
                                                <div className="absolute left-2 w-1.5 h-6 bg-white/30 rounded-full"></div>
                                            )}
                                            
                                            <div className={`p-2 rounded-xl transition-colors duration-500 ${isActive ? 'bg-white/10' : 'bg-primary/5 group-hover:bg-primary/10'}`}>
                                                <svg className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={link.icon} />
                                                </svg>
                                            </div>
                                            
                                            <span className="font-bold text-sm tracking-tight">{link.label}</span>
                                            
                                            {/* Minimal Arrow for non-active items */}
                                            {!isActive && (
                                                <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout Section - Minimalist & Secure Look */}
                    <div className="p-6 mb-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-6 py-5 rounded-[2rem] bg-white border border-orange-100/50 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all duration-500 group shadow-sm active:scale-95"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <span className="font-black text-[10px] uppercase tracking-[0.2em] opacity-60">Terminate Session</span>
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}

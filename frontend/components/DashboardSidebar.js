'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logout, getCurrentUser } from '@/lib/auth';

export default function DashboardSidebar({ role, isOpen, setIsOpen }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user] = useState(getCurrentUser());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
                fixed left-0 top-0 h-screen bg-white border-r border-slate-100 z-[60] transition-all duration-500
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-72 shadow-[20px_0_50px_rgba(0,0,0,0.02)]
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-8">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative w-10 h-10 group-hover:scale-110 transition-all duration-500 bg-slate-900 rounded-2xl flex items-center justify-center p-2 shadow-2xl">
                                    <img src="/icon.png" alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
                                </div>
                            </div>
                            <span className="font-heading text-2xl font-black tracking-tighter text-slate-900 group-hover:tracking-normal transition-all duration-500">Newt</span>
                        </Link>
                    </div>

                    {/* User Profile Section */}
                    <div className="mx-4 mb-6 p-4 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl group-hover:rotate-3 transition-transform duration-500">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900 text-sm truncate">{user?.name}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</div>
                        <ul className="space-y-1.5">
                            {links.map(link => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative ${isActive
                                                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {isActive && (
                                                <div className="absolute left-1 w-1 h-6 bg-primary rounded-full"></div>
                                            )}
                                            <svg className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={link.icon} />
                                            </svg>
                                            <span className="font-bold text-sm tracking-tight">{link.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-4 mt-auto space-y-3">
                        {/* Language Selector In-line */}
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Language</span>
                            <div className="flex gap-1 p-0.5 bg-slate-200/50 rounded-xl">
                                <button className="px-2.5 py-1 bg-white text-slate-900 rounded-lg text-[8px] font-black shadow-sm">EN</button>
                                <button className="px-2.5 py-1 text-slate-400 hover:text-slate-600 rounded-lg text-[8px] font-black transition-colors" onClick={() => alert('Hindi coming soon!')}>HI</button>
                            </div>
                        </div>

                        {/* Logout Button - Minimal */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white border border-slate-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all duration-500 group"
                        >
                            <span className="font-black text-[10px] uppercase tracking-[0.15em] transition-transform duration-500 group-hover:translate-x-1">Logout System</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
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

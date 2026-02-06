'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav({ role, onMenuClick }) {
    const pathname = usePathname();

    const distributorLinks = [
        { href: '/distributor/dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { href: '/distributor/log-meeting', label: 'Log', icon: 'M12 4v16m8-8H4' },
        { href: '/distributor/track-sales', label: 'Sale', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { href: '/distributor/meetings', label: 'Data', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
    ];

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { href: '/admin/analytics', label: 'Stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { href: '/admin/reports', label: 'Docs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { href: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
    ];

    const links = role === 'admin' ? adminLinks : distributorLinks;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
            <div className="glass-premium rounded-[2.5rem] p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative flex flex-col items-center justify-center py-2 px-3 transition-all duration-500 rounded-3xl ${isActive
                                ? 'text-primary scale-110'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {/* Active Indicator Glow */}
                            {isActive && (
                                <div className="absolute inset-0 bg-primary/5 rounded-3xl animate-pulse"></div>
                            )}

                            <div className={`relative z-10 transition-transform duration-500 ${isActive ? 'translate-y-[-2px]' : ''}`}>
                                <svg className={`w-6 h-6 transition-all duration-500 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                                </svg>
                            </div>

                            <span className={`text-[9px] font-black mt-1 uppercase tracking-widest transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>
                                {link.label}
                            </span>

                            {/* Active Dot indicator */}
                            {isActive && (
                                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#2D5016]"></div>
                            )}
                        </Link>
                    );
                })}

                {/* More Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="relative flex flex-col items-center justify-center py-2 px-3 text-slate-400 hover:text-slate-600 transition-all duration-500 rounded-3xl"
                >
                    <div className="relative z-10">
                        <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <span className="text-[9px] font-black mt-1 uppercase tracking-widest">More</span>
                </button>
            </div>
        </nav>
    );
}

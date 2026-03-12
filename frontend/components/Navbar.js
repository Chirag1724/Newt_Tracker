'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '@/lib/auth';
import PWAInstallButton from './PWAInstallButton';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const currentUser = getCurrentUser();
        setUser(currentUser);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/distributor') || pathname.startsWith('/profile');

    // Prevent hydration mismatch by only rendering after mount
    if (!mounted) return null;

    // Hide navbar on dashboard and auth pages for a cleaner UI
    if (isDashboard || isAuthPage) return null;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-primary/20">
                            {/* Professional SVG Logo Icon */}
                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 13.5C3 13.5 5.5 16.5 8.5 16.5C11.5 16.5 13 13.5 13 13.5C13 13.5 15.5 10.5 18.5 10.5C21.5 10.5 24 13.5 24 13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="6" cy="13.5" r="2.5" fill="currentColor" opacity="0.4" />
                                <circle cx="18" cy="13.5" r="2.5" fill="currentColor" />
                                <path d="M12 2L12 22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                            </svg>
                        </div>
                        <span className="font-bold text-dark font-heading text-2xl tracking-tighter group-hover:text-primary transition-colors duration-300">Newt Tracker</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {!user ? (
                            <>
                                <Link href="/#features" className="text-gray-600 hover:text-primary transition-smooth font-medium">
                                    Features
                                </Link>
                                <Link href="/#how-it-works" className="text-gray-600 hover:text-primary transition-smooth font-medium">
                                    How it Works
                                </Link>
                                <Link href="/#stats" className="text-gray-600 hover:text-primary transition-smooth font-medium">
                                    Impact
                                </Link>
                                <Link href="/login" className="text-dark hover:text-primary transition-smooth font-semibold">
                                    Login
                                </Link>
                                <Link href="/register" className="btn-primary py-2.5 px-6 text-sm">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/distributor/dashboard'} className="btn-primary py-2.5 px-6 text-sm">
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-3 bg-white/50 border border-gray-100 px-4 py-2 rounded-2xl">
                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-sm text-dark">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-600 font-semibold transition-smooth"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-xl bg-primary/5 text-primary"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && mounted && (
                    <div className="md:hidden mt-4 glass p-6 rounded-3xl space-y-4 animate-fadeIn">
                        {/* PWA Install Button for Mobile */}
                        <div className="pb-2 border-b border-gray-100">
                            <PWAInstallButton />
                        </div>

                        {!user ? (
                            <>
                                <Link href="/#features" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-primary py-2 font-medium">
                                    Features
                                </Link>
                                <Link href="/#how-it-works" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-primary py-2 font-medium">
                                    How it Works
                                </Link>
                                <Link href="/#stats" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-primary py-2 font-medium">
                                    Impact
                                </Link>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-primary py-2 font-medium">
                                    Login
                                </Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full block text-center">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={user.role === 'admin' ? '/admin/dashboard' : '/distributor/dashboard'}
                                    className="block p-4 bg-primary text-white text-center rounded-2xl font-bold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Go to Dashboard
                                </Link>
                                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-2xl">
                                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark">{user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left py-3 text-red-500 font-semibold"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}


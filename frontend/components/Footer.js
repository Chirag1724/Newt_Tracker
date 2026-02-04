'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const pathname = usePathname();
    const isAuthPage = pathname?.toLowerCase().includes('/login') || pathname?.toLowerCase().includes('/register');
    const isDashboard = pathname?.toLowerCase().startsWith('/admin') || pathname?.toLowerCase().startsWith('/distributor') || pathname?.toLowerCase().startsWith('/profile');

    if (!mounted || isAuthPage || isDashboard) return null;

    return (
        <footer className="bg-dark text-white py-12 relative overflow-hidden">
            {/* Subtle decorative flare */}
            <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[80px] -z-0"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Logo & Copyright */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center p-1 group-hover:bg-primary/30 transition-smooth">
                                <img src="/icon.png" alt="Newt Tracker" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-heading text-xl font-bold tracking-tight text-white">Newt Tracker</span>
                        </Link>
                        <p className="text-gray-500 text-sm font-medium">
                            © {new Date().getFullYear()} Newt Tracker. Engineering for a greener planet.
                        </p>
                    </div>

                    {/* Simple Links */}
                    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-semibold text-gray-400">
                        <Link href="#features" className="hover:text-primary transition-smooth">Features</Link>
                        <Link href="#how-it-works" className="hover:text-primary transition-smooth">Process</Link>
                        <Link href="/login" className="hover:text-primary transition-smooth">Login</Link>
                        <Link href="/register" className="hover:text-primary transition-smooth">Register</Link>
                        <Link href="/privacy" className="hover:text-primary transition-smooth">Privacy</Link>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center space-x-5">
                        <a href="https://github.com/Chirag1724" className="text-gray-500 hover:text-white transition-smooth">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/chiragdwivedi/" className="text-gray-500 hover:text-white transition-smooth">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

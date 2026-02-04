'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/distributor') || pathname.startsWith('/profile');

    if (isDashboard) return null;

    return (
        <footer className="bg-dark text-white py-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                    <div className="flex items-center space-x-3 mb-6 group">
                        <div className="bg-primary text-white p-2 rounded-xl group-hover:scale-110 transition-smooth shadow-lg shadow-primary/20">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </div>
                        <span className="font-heading text-2xl font-bold tracking-tight text-white">Newt Tracker</span>
                    </div>
                    <p className="text-gray-400 max-w-sm">
                        Empowering field operations with intelligent tracking, real-time analytics, and seamless team management solutions. Built for the future of field work.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Product</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="#features" className="hover:text-primary transition-smooth">Features</Link></li>
                        <li><Link href="#how-it-works" className="hover:text-primary transition-smooth">How it Works</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary transition-smooth">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Legal</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="/privacy" className="hover:text-primary transition-smooth">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-primary transition-smooth">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Newt Tracker. All rights reserved.
                </p>
                <div className="flex space-x-6">
                    <a href="#" className="text-gray-500 hover:text-white transition-smooth">
                        <span className="sr-only">Twitter</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-white transition-smooth">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}

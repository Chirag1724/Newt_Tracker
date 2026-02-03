'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';

// Simple SVG Icons
const Icons = {
    Analytics: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Team: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    Location: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Check: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    ArrowRight: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    ),
};

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            const user = getCurrentUser();
            if (user) {
                const dashboard = user.role === 'admin' ? '/admin/dashboard' : '/distributor/dashboard';
                router.push(dashboard);
            }
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-background selection:bg-secondary/30">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fadeIn">
                            <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-primary font-semibold text-sm">New Version 2.0 is Live</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-dark mb-8 tracking-tight">
                                Tracking Made <span className="gradient-text">Beautifully Simple.</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                                Newt Tracker empowers your field teams with real-time tracking, intelligent management, and clear analytics. Everything you need, none of the complexity.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="btn-primary group">
                                    Start Free Trial
                                    <Icons.ArrowRight />
                                </Link>
                                <Link href="/login" className="btn-outline">
                                    Sign In to Dashboard
                                </Link>
                            </div>
                            <div className="mt-10 flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                    <Icons.Check />
                                    <span>No credit card needed</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Icons.Check />
                                    <span>Setup in 5 minutes</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative animate-slideInRight lg:block hidden">
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

                            {/* CSS Mockup of Dashboard */}
                            <div className="relative glass p-4 rounded-[2.5rem] shadow-2xl border border-white/50 animate-float translate-x-4">
                                <div className="bg-white rounded-2xl p-6 shadow-sm overflow-hidden">
                                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                                        <div className="flex space-x-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Icons.Analytics />
                                            </div>
                                            <div>
                                                <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                                                <div className="h-3 w-16 bg-gray-50 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="w-4 h-4 rounded-full bg-red-400"></div>
                                            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                                            <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="h-32 bg-gray-50 rounded-2xl p-4">
                                            <div className="h-3 w-16 bg-primary/20 rounded mb-4"></div>
                                            <div className="h-8 w-24 bg-primary/10 rounded"></div>
                                        </div>
                                        <div className="h-32 bg-gray-50 rounded-2xl p-4">
                                            <div className="h-3 w-16 bg-secondary/20 rounded mb-4"></div>
                                            <div className="h-8 w-24 bg-secondary/10 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-48 bg-primary/5 rounded-2xl flex items-end p-4 space-x-2">
                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Steps Section */}
            <section className="section-padding bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 animate-fadeIn">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your field operations?</h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join hundreds of teams using Newt Tracker to optimize their daily operations and drive more sales.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {[
                            { step: '01', title: 'Create Account', desc: 'Sign up in seconds and set up your organization profile.' },
                            { step: '02', title: 'Add Team', desc: 'Invite your distributors and field officers to the platform.' },
                            { step: '03', title: 'Track Live', desc: 'Monitor locations, meetings, and sales in real-time.' },
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 rounded-3xl border border-gray-100 hover:border-primary/20 transition-smooth group bg-background">
                                <div className="text-6xl font-bold text-primary/5 absolute top-4 left-4 group-hover:text-primary/10 transition-smooth">{item.step}</div>
                                <div className="relative z-10 pt-8">
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Modern Field Teams</h2>
                            <p className="text-xl text-gray-600">Powerful features that help you grow faster and manage easier.</p>
                        </div>
                        <Link href="/register" className="text-primary font-bold flex items-center gap-2 group hover:gap-3 transition-all">
                            Explore all features <Icons.ArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Icons.Analytics />}
                            title="Real-time Analytics"
                            desc="Track performance with live dashboards and comprehensive automated reports."
                        />
                        <FeatureCard
                            icon={<Icons.Team />}
                            title="Team Management"
                            desc="Manage distributors and field officers from a unified centralized platform."
                        />
                        <FeatureCard
                            icon={<Icons.Location />}
                            title="GPS Tracking"
                            desc="Monitor visits and meetings by location for precise territory management."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="gradient-bg rounded-[3rem] p-12 md:p-24 text-center text-white shadow-2xl">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
                            Ready to Transform Your Field Operations?
                        </h2>
                        <p className="text-xl text-primary/20 mb-12 max-w-2xl mx-auto opacity-90">
                            Join hundreds of teams using Newt Tracker to streamline operations and boost sales productivity.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link href="/register" className="btn-secondary text-lg px-12 py-5">
                                Get Started Now
                            </Link>
                            <Link href="/contact" className="btn-outline border-white/20 text-white hover:bg-white/10 px-12 py-5">
                                Talk to Sales
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-48"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-48"></div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="card-premium">
            <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-smooth">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{desc}</p>
            <div className="w-8 h-1 bg-primary/20 rounded-full group-hover:w-16 transition-all duration-500"></div>
        </div>
    );
}


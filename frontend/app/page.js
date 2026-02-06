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
            <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="animate-fadeIn">
                            <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-primary font-semibold text-sm">Precision Tracking For Newts</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold text-dark mb-8 tracking-tight leading-[1.1]">
                                Field Intelligence <span className="gradient-text">Beautifully Simple.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-xl">
                                Newt Tracker empowers ecological survey teams with real-time tracking, intelligent habitat management, and automated reporting.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link href="/register" className="btn-primary group h-16 text-lg">
                                    Start Free Trial
                                    <Icons.ArrowRight />
                                </Link>
                                <Link href="/login" className="btn-outline h-16 text-lg">
                                    Sign In to Dashboard
                                </Link>
                            </div>
                            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-500 font-medium">
                                <div className="flex items-center space-x-2">
                                    <Icons.Check />
                                    <span>No credit card needed</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Icons.Check />
                                    <span>Setup in 5 minutes</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Icons.Check />
                                    <span>PWA Enabled</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative animate-slideInRight lg:block hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>

                            {/* Premium Mockup */}
                            <div className="relative glass p-6 rounded-[3rem] shadow-2xl border border-white animate-float">
                                <div className="bg-white rounded-3xl p-8 shadow-sm overflow-hidden">
                                    <div className="flex justify-between items-center mb-10 border-b pb-6">
                                        <div className="flex space-x-5">
                                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                <Icons.Analytics />
                                            </div>
                                            <div>
                                                <div className="h-5 w-32 bg-gray-100 rounded-lg mb-2"></div>
                                                <div className="h-4 w-20 bg-gray-50 rounded-md"></div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3">
                                            <div className="w-4 h-4 rounded-full bg-red-400"></div>
                                            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                                            <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="h-36 bg-primary/5 rounded-3xl p-6 border border-primary/5">
                                            <div className="h-4 w-20 bg-primary/20 rounded-md mb-4"></div>
                                            <div className="h-10 w-28 bg-primary/10 rounded-lg"></div>
                                        </div>
                                        <div className="h-36 bg-secondary/5 rounded-3xl p-6 border border-secondary/5">
                                            <div className="h-4 w-20 bg-secondary/20 rounded-md mb-4"></div>
                                            <div className="h-10 w-28 bg-secondary/10 rounded-lg"></div>
                                        </div>
                                    </div>

                                    <div className="h-56 bg-gray-50/50 rounded-3xl flex items-end p-6 gap-3 border border-gray-100">
                                        {[40, 70, 45, 90, 65, 80, 50, 85, 60].map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-gradient-to-t from-primary/30 to-primary/10 rounded-xl transition-all duration-700 hover:to-primary/40"
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-12 border-y border-gray-100 bg-white/50">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-gray-400 font-semibold uppercase tracking-widest text-xs mb-8">Trusted by rural distributors across the country</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-smooth">
                        <span className="text-2xl font-bold font-heading">AGROHUB</span>
                        <span className="text-2xl font-bold font-heading">RURALFLOW</span>
                        <span className="text-2xl font-bold font-heading">FIELDCORE</span>
                        <span className="text-2xl font-bold font-heading">TERRAFORCE</span>
                        <span className="text-2xl font-bold font-heading">VILLAGEWAY</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section-padding bg-background relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Features</span>
                            <h2 className="text-5xl md:text-6xl font-bold mb-8">Built for Modern Field Teams</h2>
                            <p className="text-xl text-gray-600 leading-relaxed">Powerful features that help you grow faster, manage easier, and track smarter without the technical overhead.</p>
                        </div>
                        <Link href="/register" className="text-primary font-bold flex items-center gap-3 group px-6 py-3 bg-primary/5 rounded-2xl hover:bg-primary/10 transition-all">
                            Explore all features <Icons.ArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Icons.Analytics />}
                            title="Real-time Analytics"
                            desc="Track performance with live dashboards and comprehensive automated reports that give you a bird's eye view."
                        />
                        <FeatureCard
                            icon={<Icons.Team />}
                            title="Team Management"
                            desc="Manage distributors, field officers, and team leads from a unified centralized platform with custom permissions."
                        />
                        <FeatureCard
                            icon={<Icons.Location />}
                            title="GPS Tracking"
                            desc="Monitor visits and meetings by location for precise territory management and verified field activity."
                        />
                    </div>
                </div>

                {/* Decorative blob */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Our Process</span>
                        <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">Getting started is as simple as 1, 2, 3</h2>
                        <p className="text-xl text-gray-600">We've designed Newt Tracker to be intuitive and fast, so you can spend less time onboarding and more time growing.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[100px] left-[15%] right-[15%] h-[2px] bg-gray-100 -z-0"></div>

                        {[
                            { step: '01', title: 'Create Account', desc: 'Sign up in seconds and set up your organization profile with basic details.' },
                            { step: '02', title: 'Add Team', desc: 'Invite your distributors and field officers to the platform via simple invite links.' },
                            { step: '03', title: 'Track Live', desc: 'Monitor locations, meetings, and sales performance in real-time from your dashboard.' },
                        ].map((item, i) => (
                            <div key={i} className="relative group flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-background border-4 border-white shadow-xl rounded-[2rem] flex items-center justify-center text-3xl font-bold text-primary mb-10 z-10 group-hover:scale-110 transition-smooth group-hover:bg-primary group-hover:text-white">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold mb-6 font-heading tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-lg px-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding relative overflow-hidden bg-background">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="gradient-bg rounded-[4rem] p-12 md:p-32 text-center text-white shadow-3xl border border-white/10 relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-7xl font-bold mb-10 max-w-4xl mx-auto leading-[1.1]">
                                Ready to Transform Your <br className="hidden md:block" /> Field Operations?
                            </h2>
                            <p className="text-xl md:text-2xl text-white/70 mb-14 max-w-2xl mx-auto font-medium">
                                Join hundreds of teams using Newt Tracker to streamline operations and boost sales productivity.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Link href="/register" className="btn-secondary text-xl px-16 py-6 h-auto">
                                    Get Started Now Free
                                </Link>
                                <Link href="/login" className="btn-outline border-white/20 text-white hover:bg-white/10 px-16 py-6 h-auto">
                                    Talk to Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
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


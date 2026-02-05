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
            <section className="relative overflow-hidden pt-20 pb-8 md:pt-40 md:pb-16 min-h-[80vh] flex items-center">
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[80px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[80px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Text Content - Always first or ordered for flow */}
                        <div className="animate-fadeIn text-center lg:text-left order-1">
                            <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full mb-6 mx-auto lg:mx-0">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-wider">Used by 500+ Licensed Ecologists</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-5xl xl:text-7xl font-heading font-black text-dark mb-6 tracking-tight leading-[1.1] animate-fadeIn">
                                Precision Tracking <br className="hidden sm:block" /> For <span className="text-primary">Newts.</span>
                            </h1>

                            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fadeIn opacity-90">
                                Modern software built specifically for environmental consultants and field surveyors to track populations, manage surveys, and generate ecological reports instantly.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeIn">
                                <Link href="/register" className="btn-primary group h-12 md:h-14 px-8 text-base flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                                    Get Started Free
                                    <Icons.ArrowRight />
                                </Link>
                                <Link href="/login" className="px-8 h-12 md:h-14 flex items-center justify-center text-base font-bold text-dark border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all bg-white/50">
                                    Member Login
                                </Link>
                            </div>

                            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest animate-fadeIn">
                                <div className="flex items-center space-x-2">
                                    <Icons.Check />
                                    <span>PWA Ready</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Icons.Check />
                                    <span>Real-time Sync</span>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Image - Appears below text on mobile */}
                        <div className="relative animate-slideInRight order-2 max-w-[500px] lg:max-w-none mx-auto lg:mx-0">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>

                                <div className="relative bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden transform lg:rotate-1 group-hover:rotate-0 transition-transform duration-700">
                                    <div className="bg-gray-100/50 border-b border-gray-100 px-4 py-3 flex items-center">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <img
                                            src="/Admin_dashboard.png"
                                            alt="Newt Tracker Admin Dashboard"
                                            className="w-full h-auto object-contain block"
                                        />
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-xl border border-gray-50 animate-float hidden md:flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">99%</div>
                                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter leading-tight">Uptime <br /> Guaranteed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof with Infinite Scroll */}
            <section className="py-16 border-y border-gray-100 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto mb-10 text-center px-6">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                        Working with Conservation Agencies & Ecological Consultancies
                    </p>
                </div>

                <div className="relative flex overflow-x-hidden">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-32 px-4 opacity-40 grayscale hover:grayscale-0 transition-smooth will-change-transform">
                        {[
                            'NATURA_UK', 'GREEN_SCAPE', 'BIO_AUDIT', 'ECO_LOGIC', 'TERRA_VAL', 'WILD_TRACK', 'HABITAT_FIX'
                        ].map((brand, i) => (
                            <span key={`brand-1-${i}`} className="text-3xl md:text-4xl font-black font-heading tracking-tighter">
                                {brand}
                            </span>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {[
                            'NATURA_UK', 'GREEN_SCAPE', 'BIO_AUDIT', 'ECO_LOGIC', 'TERRA_VAL', 'WILD_TRACK', 'HABITAT_FIX'
                        ].map((brand, i) => (
                            <span key={`brand-2-${i}`} className="text-3xl md:text-4xl font-black font-heading tracking-tighter">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-32 bg-background relative overflow-hidden px-6">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-24 gap-8">
                        <div className="max-w-3xl">
                            <span className="text-secondary font-black tracking-[0.2em] uppercase text-xs md:text-sm mb-4 block">Designed for Conservation</span>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black mb-6 leading-tight">
                                Built for Ecological <br className="hidden md:block" /> Field Teams
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                                Powerful tools to log species data, manage pond surveys, and monitor biodiversity net gain effortlessly without the technical overhead.
                            </p>
                        </div>
                        <Link href="/register" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 group w-full lg:w-auto">
                            Explore all features
                            <Icons.ArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        <FeatureCard
                            icon={<Icons.Location />}
                            title="Ecological Surveys"
                            desc="Log pond visits, eDNA samples, and population counts with high-precision GPS coordinate recording."
                        />
                        <FeatureCard
                            icon={<Icons.Analytics />}
                            title="Automated Reporting"
                            desc="Generate BNG (Biodiversity Net Gain) and species-specific reports ready for planning applications in one click."
                        />
                        <FeatureCard
                            icon={<Icons.Team />}
                            title="Field Team Sync"
                            desc="Real-time collaboration between senior ecologists and field officers, even in remote locations with zero signal."
                        />
                    </div>
                </div>

                {/* Decorative blob */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-20 md:py-32 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 md:mb-24 max-w-3xl mx-auto">
                        <span className="text-secondary font-black tracking-[0.2em] uppercase text-xs md:text-sm mb-4 block">Our Process</span>
                        <h2 className="text-4xl md:text-6xl font-heading font-black mb-8 leading-tight tracking-tight text-dark">Getting started is as simple as 1, 2, 3</h2>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">We've designed Newt Tracker to be intuitive and fast, so you can spend less time onboarding and more time growing.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[100px] left-[15%] right-[15%] h-[2px] bg-gray-100 -z-0"></div>

                        {[
                            { step: '01', title: 'Plan Survey', desc: 'Create survey areas, set visit schedules, and assign ecologists to specific territories.' },
                            { step: '02', title: 'Field Data', desc: 'Officers log habitat data and population sightings directly through the mobile app offline.' },
                            { step: '03', title: 'Export Results', desc: 'Review findings on your dashboard and export high-fidelity data for client deliverables.' },
                        ].map((item, i) => (
                            <div key={i} className="relative group flex flex-col items-center text-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-background border-4 border-white shadow-xl rounded-2xl md:rounded-[2rem] flex items-center justify-center text-2xl md:text-3xl font-bold text-primary mb-8 md:mb-10 z-10 group-hover:scale-110 transition-smooth group-hover:bg-primary group-hover:text-white">
                                    {item.step}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-heading tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-base md:text-lg px-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 relative overflow-hidden bg-background">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-primary rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center text-white shadow-3xl relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black mb-8 max-w-4xl mx-auto leading-[1.1] tracking-tight">
                                Ready to Transform Your Ecological Surveys?
                            </h2>
                            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                                Join hundreds of specialists using Newt Tracker to protect habitats and streamline environmental impact assessments.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
                                <Link href="/register" className="w-full sm:w-auto bg-secondary text-primary font-black text-xl px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-black/10">
                                    Get Started Free
                                </Link>
                                <Link href="/login" className="w-full sm:w-auto border-2 border-white/20 text-white font-bold px-12 py-5 rounded-2xl hover:bg-white/10 transition-all">
                                    Member Login
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


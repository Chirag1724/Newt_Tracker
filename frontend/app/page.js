'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ─── Icon Components ──────────────────────────────────────────────────────────
const IconMap = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
);
const IconChart = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const IconUsers = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconCamera = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconDocument = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const IconPin = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconCheck = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);
const IconArrow = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);
const IconMenu = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const IconX = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, color = 'primary' }) {
    return (
        <div className="text-center">
            <p className={`text-4xl font-bold ${color === 'secondary' ? 'text-secondary' : 'text-primary'} mb-1`}>{value}</p>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
        </div>
    );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, accent = false }) {
    return (
        <div className={`card-premium group hover:-translate-y-2 ${accent ? 'border-l-4 border-l-primary' : ''} p-6`}>
            <div className="w-12 h-12 bg-primary/8 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ number, title, desc }) {
    return (
        <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                {number}
            </div>
            <h3 className="text-lg font-bold text-dark mb-1">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">{desc}</p>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* ── Hero ── */}
            <section className="pt-24 pb-16 md:pt-36 md:pb-28 px-6 relative overflow-hidden">
                {/* Dynamic Background Effects - Optimized for performance */}
                <div className="absolute inset-0 pointer-events-none -z-10" 
                    style={{
                        background: `
                            radial-gradient(circle at 100% 0%, rgba(45, 80, 22, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 0% 100%, rgba(255, 140, 66, 0.05) 0%, transparent 40%)
                        `
                    }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] -z-20" />

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Left — Content */}
                        <div className="animate-fadeIn text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 px-4 py-2 rounded-full mb-6 hover:bg-primary/12 transition-colors cursor-default">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-primary font-bold text-xs uppercase tracking-widest">Field Ops v2.0</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-dark mb-6 leading-[1.1] tracking-tight">
                                Track Every <br className="hidden md:block" />
                                <span className="gradient-text">Field Visit & Sale</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Newt Tracker provides rural distribution teams with the tools to log meetings, track sales velocity, and access real-time analytics — offline or online.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                                <Link href="/register" className="btn-primary h-14 px-8 text-lg w-full sm:w-auto shadow-2xl shadow-primary/20">
                                    Get Started Free <IconArrow />
                                </Link>
                                <Link href="/#how-it-works" className="btn-outline h-14 px-8 text-lg w-full sm:w-auto bg-white hover:bg-gray-50 uppercase text-xs tracking-widest font-black">
                                    How it works
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500 font-bold">
                                {['No credit card', 'Works offline', 'GPS-verified'].map(t => (
                                    <div key={t} className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                            <IconCheck />
                                        </div>
                                        <span>{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Dashboard Image Frame */}
                        <div className="animate-slideInRight lg:block relative">
                            {/* Decorative elements behind image */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />
                            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1s' }} />

                            <div className="relative glass p-2 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 backdrop-blur-2xl">
                                <div className="bg-slate-900/5 rounded-[2rem] overflow-hidden aspect-[4/3] relative group">
                                    {/* Browser-like header */}
                                    <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                        </div>
                                        <div className="bg-gray-100 px-4 py-1 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            app.newttracker.com
                                        </div>
                                        <div className="w-3 h-3" /> {/* Spacer */}
                                    </div>

                                    {/* Main Image Placeholder */}
                                    <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                                            alt="Newt Dashboard Mockup"
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 800px"
                                            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                                        />

                                        {/* Overlay text for user guidance */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                            <span className="text-white font-bold px-6 py-3 border-2 border-white rounded-full uppercase tracking-tighter">
                                                Dashboard Preview
                                            </span>
                                        </div>

                                        {/* Floating UI Elements for depth */}
                                        <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl animate-float pointer-events-none">
                                            <div className="w-32 h-2 bg-gray-100 rounded mb-2" />
                                            <div className="w-24 h-2 bg-gray-100 rounded" />
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="w-4 h-4 bg-primary/20 rounded-full" />
                                                <div className="w-12 h-1 bg-primary/20 rounded" />
                                            </div>
                                        </div>

                                        <div className="absolute bottom-10 left-10 bg-primary p-4 rounded-2xl shadow-xl animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl" />
                                                <div className="space-y-1.5">
                                                    <div className="w-16 h-1.5 bg-white/40 rounded" />
                                                    <div className="w-10 h-1.5 bg-white/40 rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section id="stats" className="py-16 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        <StatCard value="500+" label="Active Distributors" />
                        <StatCard value="12k+" label="Meetings Logged" color="secondary" />
                        <StatCard value="₹2.8Cr+" label="Revenue Tracked" />
                        <StatCard value="18" label="States Covered" color="secondary" />
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="section-padding bg-background relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(46,125,50,0.04),transparent_60%)]" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Platform Features</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">Everything Your Team Needs</h2>
                        <p className="text-gray-500 text-lg">From field visit logging to admin analytics — built for rural distribution teams.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<IconPin />}
                            title="GPS-Verified Meetings"
                            desc="Log one-on-one and group meetings with auto-captured GPS coordinates and reverse geocoded address."
                            accent
                        />
                        <FeatureCard
                            icon={<IconChart />}
                            title="Real-time Analytics"
                            desc="Admin dashboards with live sales trends, product performance charts, and monthly comparisons."
                        />
                        <FeatureCard
                            icon={<IconUsers />}
                            title="Distributor Management"
                            desc="Add and manage field distributors, view their activity, and track performance by state and district."
                        />
                        <FeatureCard
                            icon={<IconCamera />}
                            title="Photo Proof Upload"
                            desc="Attach photo evidence to meetings. Auto-compressed for rural networks to save data."
                        />
                        <FeatureCard
                            icon={<IconDocument />}
                            title="Document Attachments"
                            desc="Upload PDF, DOCX, Excel documents to meeting records — price lists, agreements, product sheets."
                        />
                        <FeatureCard
                            icon={<IconMap />}
                            title="Sample Tracking"
                            desc="Record sample distributions with recipient details, quantity, and location for complete audit trails."
                        />
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 max-w-xl mx-auto">
                        <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">Simple Process</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">Up and Running in Minutes</h2>
                        <p className="text-gray-500">No complex setup. No training needed. Just sign up and start tracking.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-8 left-[22%] right-[22%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

                        <StepCard number="01" title="Admin Creates Account" desc="Set up your organization profile and configure your team structure in under 5 minutes." />
                        <StepCard number="02" title="Add Distributor Team" desc="Create distributor accounts. Each gets a mobile-friendly dashboard to log field activity." />
                        <StepCard number="03" title="Track Live & Export" desc="View real-time maps, analytics and reports. Export data to CSV anytime." />
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="gradient-bg rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(45,80,22,0.3)]">
                        {/* Abstract background shapes */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -ml-20 -mb-20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <span className="text-white/60 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Ready to grow?</span>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tighter">
                                Modernize Your <br /> Field Operations Today
                            </h2>
                            <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed font-medium">
                                Join the network of teams using Newt Tracker to scale their rural distribution and visibility.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                                <Link href="/register" className="bg-white text-primary font-black px-12 py-5 rounded-full hover:bg-gray-50 transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2 min-w-[240px] text-lg uppercase tracking-tight">
                                    Create Free Account <IconArrow />
                                </Link>
                                <Link href="/login" className="border-2 border-white/30 text-white font-bold px-12 py-5 rounded-full hover:bg-white/10 transition-all flex items-center justify-center min-w-[240px] text-lg uppercase tracking-tight">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

'use client';

import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FFF8F0] selection:bg-primary/10">
            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <div className="animate-fadeIn">
                    <span className="text-primary font-black tracking-[0.2em] uppercase text-xs mb-4 block">Legal & Privacy</span>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-dark mb-8 leading-tight">Privacy Policy</h1>
                    <p className="text-gray-500 font-medium mb-12">Last Updated: February 2026</p>

                    <div className="space-y-12 text-gray-600 leading-relaxed text-lg">
                        <section>
                            <h2 className="text-2xl font-heading font-bold text-dark mb-4">1. Introduction</h2>
                            <p>
                                At Newt Tracker, we are committed to protecting the integrity of ecological data and the privacy of our licensed surveyors and ecologists. This policy outlines our standards for data collection, usage, and protection within our field tracking ecosystem.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-dark mb-4">2. Data We Collect</h2>
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4 font-medium">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                                    <p><span className="text-dark font-bold">Ecological Data:</span> High-precision GPS coordinates, species counts, pond health markers, and eDNA sample IDs.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                                    <p><span className="text-dark font-bold">User Identity:</span> Legal names, surveyor license numbers, contact details, and organization affiliation.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                                    <p><span className="text-dark font-bold">Device Metrics:</span> Real-time PWA sync data, browser versions, and device types to ensure offline capability stability.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-dark mb-4">3. How Your Data is Used</h2>
                            <p>
                                Collected data serves two primary purposes: facilitating professional ecological surveys and generating regulatory-compliant environmental reports.
                            </p>
                            <ul className="list-disc ml-6 mt-4 space-y-2">
                                <li>Generating Biodiversity Net Gain (BNG) results for planners.</li>
                                <li>Real-time team coordination and territory management.</li>
                                <li>Verification of site visits via GPS timestamping.</li>
                                <li>Compliance with local wildlife protection laws and licensing agencies.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-dark mb-4">4. Data Security</h2>
                            <p>
                                We employ industry-standard encryption for all data in transit and at rest. Access to the environment is secured via JSON Web Tokens (JWT), and dashboard data is role-restricted. Only authorized senior ecologists can access the full breadth of territorial data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-dark mb-4">5. Sharing of Information</h2>
                            <p>
                                We do not sell your data. Survey results may be shared with relevant government conservation agencies or environmental clients only upon explicit export by an admin-level user within your organization.
                            </p>
                        </section>
                    </div>

                    <div className="mt-20 pt-12 border-t border-gray-100 text-center">
                        <Link href="/register" className="btn-primary inline-flex">
                            I Agree & Create Account
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

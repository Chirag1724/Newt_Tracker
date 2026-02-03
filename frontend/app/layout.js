import './globals.css'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
    title: 'Newt Tracker - Field Operations Tracking Made Simple',
    description: 'Professional field operations tracking system for efficient team management and sales monitoring',
    keywords: 'field operations, sales tracking, distributor management, newt tracker',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="font-body">
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <footer className="bg-dark text-white py-16">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="md:col-span-2">
                            <h3 className="font-heading text-2xl font-bold mb-4">Newt Tracker</h3>
                            <p className="text-gray-400 max-w-sm">
                                Empowering field operations with intelligent tracking and seamless management solutions.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#features" className="hover:text-white transition-smooth">Features</Link></li>
                                <li><Link href="#how-it-works" className="hover:text-white transition-smooth">How it Works</Link></li>
                                <li><Link href="/pricing" className="hover:text-white transition-smooth">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/privacy" className="hover:text-white transition-smooth">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-smooth">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} Newt Tracker. All rights reserved.
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    )
}
